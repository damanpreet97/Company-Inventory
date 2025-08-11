
import React, { useEffect, useState } from 'react';

export default function Companies(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', address:'', phone:'' });

  async function load() {
    const res = await window.api.listCompanies();
    setList(res || []);
  }
  useEffect(()=>{ load() }, []);

  async function create() {
    if(!form.name) return alert('name required');
    await window.api.createCompany(form);
    setForm({ name:'', address:'', phone:'' });
    load();
  }

  return (
    <div>
      <h2>Companies</h2>
      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h4>Create</h4>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /><br/>
          <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} /><br/>
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} /><br/>
          <button onClick={create}>Create Company</button>
        </div>
        <div style={{flex:2}}>
          <h4>List</h4>
          <table style={{width:'100%', borderCollapse:'collapse'}}><thead><tr><th>Name</th><th>Address</th><th>Phone</th></tr></thead>
            <tbody>
              {list.map(c=>(
                <tr key={c.id}><td>{c.name}</td><td>{c.address}</td><td>{c.phone}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
