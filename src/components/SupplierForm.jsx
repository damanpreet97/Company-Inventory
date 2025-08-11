
import React, { useEffect, useState } from 'react';

export default function Suppliers(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', phone:'', address:'' });

  useEffect(()=>{ window.api.listSuppliers().then(setList) }, []);

  async function create() {
    if(!form.name) return alert('name required');
    await window.api.createSupplier(form);
    setForm({ name:'', phone:'', address:'' });
    setList(await window.api.listSuppliers());
  }

  return (
    <div>
      <h2>Suppliers</h2>
      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h4>Create</h4>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /><br/>
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} /><br/>
          <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} /><br/>
          <button onClick={create}>Create Supplier</button>
        </div>
        <div style={{flex:2}}>
          <h4>List</h4>
          <table style={{width:'100%'}}><thead><tr><th>Name</th><th>Phone</th><th>Address</th></tr></thead>
            <tbody>{list.map(s => (<tr key={s.id}><td>{s.name}</td><td>{s.phone}</td><td>{s.address}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
