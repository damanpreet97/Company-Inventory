
import React, { useState } from 'react';
import Companies from './components/CompanyForm';
import Sites from './components/SiteForm';
import Suppliers from './components/SupplierForm';
import Items from './components/ItemForm';
import Purchases from './components/PurchaseForm';

export default function App() {
  const [route, setRoute] = useState('companies');
  return (
    <div style={{ display:'flex', height:'100vh' }}>
      <nav style={{ width:220, borderRight:'1px solid #ddd', padding:10 }}>
        <h3>Inventory</h3>
        <button onClick={()=>setRoute('companies')} style={{width:'100%', marginBottom:6}}>Companies</button>
        <button onClick={()=>setRoute('sites')} style={{width:'100%', marginBottom:6}}>Sites</button>
        <button onClick={()=>setRoute('suppliers')} style={{width:'100%', marginBottom:6}}>Suppliers</button>
        <button onClick={()=>setRoute('items')} style={{width:'100%', marginBottom:6}}>Items</button>
        <button onClick={()=>setRoute('purchases')} style={{width:'100%', marginBottom:6}}>Purchases</button>
      </nav>
      <main style={{ flex:1, padding:20, overflow:'auto' }}>
        {route === 'companies' && <Companies />}
        {route === 'sites' && <Sites />}
        {route === 'suppliers' && <Suppliers />}
        {route === 'items' && <Items />}
        {route === 'purchases' && <Purchases />}
      </main>
    </div>
  );
}
