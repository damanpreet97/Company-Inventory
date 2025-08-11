
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  createCompany: (c) => ipcRenderer.invoke('company:create', c),
  listCompanies: () => ipcRenderer.invoke('company:list'),
  createSite: (s) => ipcRenderer.invoke('site:create', s),
  listSitesByCompany: (cid) => ipcRenderer.invoke('site:listByCompany', cid),
  createSupplier: (s) => ipcRenderer.invoke('supplier:create', s),
  listSuppliers: () => ipcRenderer.invoke('supplier:list'),
  createItem: (it) => ipcRenderer.invoke('item:create', it),
  listItems: () => ipcRenderer.invoke('item:list'),
  createPurchase: (p, items) => ipcRenderer.invoke('purchase:create', p, items),
  listPurchases: () => ipcRenderer.invoke('purchase:list')
});
