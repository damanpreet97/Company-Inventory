
import React, { useEffect, useState } from 'react';

export default function Items(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', category:'', quantity:0, price_per_unit:0 });

  useEffect(()=>{ window.api.listItems().then(setList) }, []);

  async function create() {
    if(!form.name) return alert('name required');
    await window.api.createItem(form);
    setForm({ name:'', category:'', quantity:0, price_per_unit:0 });
    setList(await window.api.listItems());
  }

  return (
    <div>
      <h2>Items</h2>
      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h4>Create</h4>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /><br/>
          <input placeholder="Category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} /><br/>
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} /><br/>
          <input type="number" placeholder="Price per unit" value={form.price_per_unit} onChange={e=>setForm({...form, price_per_unit: Number(e.target.value)})} /><br/>
          <button onClick={create}>Create Item</button>
        </div>
        <div style={{flex:2}}>
          <h4>List</h4>
          <table style={{width:'100%'}}><thead><tr><th>Name</th><th>Category</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>{list.map(i => (<tr key={i.id}><td>{i.name}</td><td>{i.category}</td><td>{i.quantity}</td><td>{i.price_per_unit}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
