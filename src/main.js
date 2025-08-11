
const { app, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

let db;

function initDB() {
  const dbDir = path.join(app.getPath('userData'), 'db');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const dbPath = path.join(dbDir, 'inventory.db');
  db = new Database(dbPath);
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
}


const isDev = !app.isPackaged;
const PORT = 3000; // or whatever your webpack-dev-server port is

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.loadURL(`http://localhost:${PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}


app.whenReady().then(() => {
  initDB();
  createWindow();
  startBackgroundSyncLoop();
});

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });
app.on('ready', createWindow);

// DB helper
function runAll(sql, params=[]) {
  return db.prepare(sql).all(...params);
}
function runInsert(sql, params=[]) {
  return db.prepare(sql).run(...params);
}

// IPC handlers
ipcMain.handle('company:create', (evt, company) => {
  const info = runInsert('INSERT INTO company (name,address,phone) VALUES (?,?,?)', [company.name, company.address, company.phone]);
  const id = info.lastInsertRowid;
  runInsert('INSERT INTO sync_queue (entity_type, operation, payload) VALUES (?,?,?)', ['company','create',JSON.stringify({ id, ...company })]);
  return { id };
});
ipcMain.handle('company:list', () => runAll('SELECT * FROM company ORDER BY name'));

// site
ipcMain.handle('site:create', (evt, site) => {
  const info = runInsert('INSERT INTO site (company_id,name,city,address) VALUES (?,?,?,?)', [site.company_id, site.name, site.city, site.address]);
  const id = info.lastInsertRowid;
  runInsert('INSERT INTO sync_queue (entity_type, operation, payload) VALUES (?,?,?)', ['site','create',JSON.stringify({ id, ...site })]);
  return { id };
});
ipcMain.handle('site:listByCompany', (evt, companyId) => runAll('SELECT * FROM site WHERE company_id = ? ORDER BY name', [companyId]));

// supplier
ipcMain.handle('supplier:create', (evt, s) => {
  const info = runInsert('INSERT INTO supplier (name,phone,address) VALUES (?,?,?)', [s.name, s.phone, s.address]);
  const id = info.lastInsertRowid;
  runInsert('INSERT INTO sync_queue (entity_type, operation, payload) VALUES (?,?,?)', ['supplier','create',JSON.stringify({ id, ...s })]);
  return { id };
});
ipcMain.handle('supplier:list', () => runAll('SELECT * FROM supplier ORDER BY name'));

// item
ipcMain.handle('item:create', (evt, it) => {
  const info = runInsert('INSERT INTO item (name,category,quantity,price_per_unit) VALUES (?,?,?,?)', [it.name, it.category, it.quantity||0, it.price_per_unit||0]);
  const id = info.lastInsertRowid;
  runInsert('INSERT INTO sync_queue (entity_type, operation, payload) VALUES (?,?,?)', ['item','create',JSON.stringify({ id, ...it })]);
  return { id };
});
ipcMain.handle('item:list', () => runAll('SELECT * FROM item ORDER BY name'));

// purchase
ipcMain.handle('purchase:create', (evt, purchase, items) => {
  const insertPurchase = db.prepare('INSERT INTO purchase (invoice_no,date_of_purchase,company_id,site_id,supplier_id) VALUES (?,?,?,?,?)');
  const insertPurchaseItem = db.prepare('INSERT INTO purchase_item (purchase_id,item_id,quantity,price_per_unit,total_amount) VALUES (?,?,?,?,?)');
  const updateItemQty = db.prepare('UPDATE item SET quantity = quantity + ? WHERE id = ?');

  const tx = db.transaction(() => {
    const info = insertPurchase.run(purchase.invoice_no, purchase.date_of_purchase, purchase.company_id, purchase.site_id, purchase.supplier_id);
    const purchaseId = info.lastInsertRowid;
    for (const it of items) {
      const total = it.quantity * it.price_per_unit;
      insertPurchaseItem.run(purchaseId, it.item_id, it.quantity, it.price_per_unit, total);
      updateItemQty.run(it.quantity, it.item_id);
    }
    runInsert('INSERT INTO sync_queue (entity_type, operation, payload) VALUES (?,?,?)', ['purchase','create',JSON.stringify({ purchase:{ id: purchaseId, ...purchase }, items })]);
    return purchaseId;
  });
  return tx();
});
ipcMain.handle('purchase:list', () => runAll('SELECT p.*, s.name as supplier_name, c.name as company_name FROM purchase p LEFT JOIN supplier s ON p.supplier_id = s.id LEFT JOIN company c ON p.company_id = c.id ORDER BY date_of_purchase DESC'));

// simple online check
function isOnline() {
  return new Promise((resolve) => {
    const r = net.request('https://www.google.com');
    r.on('response', () => resolve(true));
    r.on('error', () => resolve(false));
    r.end();
  });
}

function runUpdate(sql, params=[]) {
  return db.prepare(sql).run(...params);
}

// background sync loop skeleton
async function startBackgroundSyncLoop() {
  setInterval(async () => {
    const online = await isOnline();
    if (!online) return;
    const pending = runAll("SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY created_at ASC");
    for (const q of pending) {
      try {
        // For now, just mark as synced. Replace with real Firestore push using firebase admin or restful API.
        runUpdate('UPDATE sync_queue SET status = ? WHERE id = ?', ['synced', q.id]);
      } catch (e) {
        console.error('sync error', e);
      }
    }
  }, 15_000);
}
