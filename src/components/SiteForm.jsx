
import React, { useEffect, useState } from 'react';

export default function Sites(){
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({ company_id:'', name:'', city:'', address:'' });

  useEffect(()=>{ window.api.listCompanies().then(setCompanies) }, []);

  async function loadSites() {
    if(!form.company_id) return setSites([]);
    const res = await window.api.listSitesByCompany(form.company_id);
    setSites(res || []);
  }

  async function create() {
    if(!form.company_id || !form.name) return alert('company and name required');
    await window.api.createSite(form);
    setForm({ company_id:'', name:'', city:'', address:'' });
    setSites([]);
  }

  return (
    <div>
      <h2>Sites</h2>
      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h4>Create</h4>
          <select value={form.company_id} onChange={e=>setForm({...form, company_id:e.target.value})}>
            <option value="">--select company--</option>
            {companies.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
          </select><br/>
          <input placeholder="Site name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /><br/>
          <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} /><br/>
          <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} /><br/>
          <button onClick={create}>Create Site</button><br/>
          <button onClick={loadSites}>Load Sites for selected Company</button>
        </div>
        <div style={{flex:2}}>
          <h4>Sites list</h4>
          <table style={{width:'100%'}}><thead><tr><th>Name</th><th>City</th><th>Address</th></tr></thead>
            <tbody>{sites.map(s => (<tr key={s.id}><td>{s.name}</td><td>{s.city}</td><td>{s.address}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
