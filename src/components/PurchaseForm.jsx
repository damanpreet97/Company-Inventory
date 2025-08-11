
import React, { useEffect, useState } from 'react';

export default function Purchases(){
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  const [form, setForm] = useState({ invoice_no:'', date_of_purchase: new Date().toISOString().slice(0,10), company_id:'', site_id:'', supplier_id:'' });

  useEffect(()=>{
    window.api.listCompanies().then(setCompanies);
    window.api.listSuppliers().then(setSuppliers);
    window.api.listItems().then(setItems);
  }, []);

  useEffect(()=>{
    if(form.company_id) window.api.listSitesByCompany(form.company_id).then(setSites);
  }, [form.company_id]);

  function addLine(){
    setLines([...lines, { item_id:'', quantity:1, price_per_unit:0 }]);
  }
  function updateLine(idx, key, val){
    const copy = [...lines]; copy[idx][key] = key === 'quantity' || key === 'price_per_unit' ? Number(val) : val; setLines(copy);
  }
  async function submit(){
    if(!form.company_id || !form.supplier_id) return alert('company and supplier required');
    const prepared = lines.map(l=>({ ...l, total: l.quantity * l.price_per_unit }));
    await window.api.createPurchase(form, prepared);
    alert('purchase created');
    setForm({ invoice_no:'', date_of_purchase: new Date().toISOString().slice(0,10), company_id:'', site_id:'', supplier_id:'' });
    setLines([]);
  }

  return (
    <div>
      <h2>Purchases</h2>
      <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap:20 }}>
        <div>
          <input placeholder="Invoice No" value={form.invoice_no} onChange={e=>setForm({...form, invoice_no:e.target.value})} /><br/>
          <input type="date" value={form.date_of_purchase} onChange={e=>setForm({...form, date_of_purchase:e.target.value})} /><br/>
          <select value={form.company_id} onChange={e=>setForm({...form, company_id: e.target.value})}>
            <option value="">--Company--</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select><br/>
          <select value={form.site_id} onChange={e=>setForm({...form, site_id: e.target.value})}>
            <option value="">--Site--</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select><br/>
          <select value={form.supplier_id} onChange={e=>setForm({...form, supplier_id: e.target.value})}>
            <option value="">--Supplier--</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <h4>Lines</h4>
          <button onClick={addLine}>Add Line</button>
          {lines.map((l, idx)=> (
            <div key={idx} style={{ border: '1px solid #eee', padding:8, marginTop:8 }}>
              <select value={l.item_id} onChange={e=>updateLine(idx,'item_id', e.target.value)}>
                <option value="">--Item--</option>
                {items.map(it=> <option key={it.id} value={it.id}>{it.name}</option>)}
              </select>
              <br/>
              <input type="number" value={l.quantity} onChange={e=>updateLine(idx,'quantity', e.target.value)} />
              <input type="number" value={l.price_per_unit} onChange={e=>updateLine(idx,'price_per_unit', e.target.value)} />
              <div>Total: { (l.quantity * l.price_per_unit).toFixed(2) }</div>
            </div>
          ))}
          <br/>
          <button onClick={submit}>Create Purchase</button>
        </div>
      </div>
    </div>
  );
}
