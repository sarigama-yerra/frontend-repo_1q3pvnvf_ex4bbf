import { useEffect, useMemo, useState } from 'react'

function useApi(token){
  const base = import.meta.env.VITE_BACKEND_URL
  const auth = useMemo(()=> ({
    get: (p) => fetch(`${base}${p}`, { headers: { Authorization: `Bearer ${token}` }}).then(r=>r.json()),
    post: (p, data, json=true) => fetch(`${base}${p}`, { method:'POST', headers: json? { 'Content-Type':'application/json', Authorization: `Bearer ${token}` } : { Authorization: `Bearer ${token}` }, body: json? JSON.stringify(data): data }).then(r=>r.json())
  }), [base, token])
  return auth
}

export function Dashboard({ token }){
  const api = useApi(token)
  const [data,setData] = useState(null)
  useEffect(()=>{ api.get('/dashboard').then(setData) },[])
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {['appointments_today','patients_total','lab_pending'].map((k,idx)=> (
        <div key={k} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-slate-400 text-sm">{k.replace('_',' ')}</div>
          <div className="text-3xl font-semibold mt-2">{data? data[k]: '—'}</div>
        </div>
      ))}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:col-span-2">
        <div className="text-slate-200 font-medium mb-2">Alerts</div>
        <ul className="text-sm text-slate-400 list-disc ml-5 space-y-1">
          {data?.alerts?.length? data.alerts.map((a,i)=>(<li key={i}>{a}</li>)) : <li>No alerts</li>}
        </ul>
      </div>
    </div>
  )
}

export function Patients({ token }){
  const api = useApi(token)
  const [list,setList] = useState([])
  const [form,setForm] = useState({ user_id:'', medical_record_number: `MRN-${Math.random().toString(36).slice(2,8).toUpperCase()}` })
  useEffect(()=>{ api.get('/patients').then(setList) },[])
  const submit = async (e)=>{ e.preventDefault(); const res = await api.post('/patients', form); setList([{...form, _id: res.id}, ...list]) }
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Register Patient</div>
        <form onSubmit={submit} className="space-y-2">
          <input placeholder="User ID (created at signup)" value={form.user_id} onChange={e=>setForm({...form, user_id:e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" required />
          <input placeholder="MRN" value={form.medical_record_number} onChange={e=>setForm({...form, medical_record_number:e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" required />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Save</button>
        </form>
      </div>
      <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Patients</div>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="text-slate-400"><tr><th className="text-left py-2">MRN</th><th className="text-left">User</th></tr></thead>
            <tbody>
              {list.map((p,i)=>(<tr key={i} className="border-t border-slate-800"><td className="py-2">{p.medical_record_number}</td><td>{p.user_id}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function Doctors({ token }){
  const api = useApi(token)
  const [list,setList] = useState([])
  useEffect(()=>{ api.get('/doctors').then(setList) },[])
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="font-medium mb-3">Doctors Directory</div>
      <ul className="space-y-2">
        {list.map((d,i)=>(<li key={i} className="p-3 rounded-lg bg-slate-800/50">{d.specialization || 'General'} • {d.user_id}</li>))}
      </ul>
    </div>
  )
}

export function Laboratory({ token }){
  const api = useApi(token)
  const [patient,setPatient] = useState('')
  const [type,setType] = useState('CBC')
  const [tests,setTests] = useState([])
  const order = async ()=>{ await api.post('/lab/tests', { patient_id: patient, ordered_by: 'doctor', test_type: type }); const t=await api.get(`/lab/tests/${patient}`); setTests(t) }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Order Test</div>
        <input placeholder="Patient ID" value={patient} onChange={e=>setPatient(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white mb-2" />
        <input placeholder="Test Type" value={type} onChange={e=>setType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white mb-2" />
        <button onClick={order} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Order</button>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Patient Tests</div>
        <ul className="space-y-2 max-h-80 overflow-auto">
          {tests.map((t,i)=>(<li key={i} className="p-3 rounded-lg bg-slate-800/50">{t.test_type} • {t.status}</li>))}
        </ul>
      </div>
    </div>
  )
}

export function Pharmacy({ token }){
  const api = useApi(token)
  const [name,setName] = useState('Paracetamol 500mg')
  const [stock,setStock] = useState(100)
  const [price,setPrice] = useState(2)
  const [list,setList] = useState([])
  const add = async ()=>{ await api.post('/pharmacy/medicines', { name, stock:Number(stock), price:Number(price) }); setList(await api.get('/pharmacy/medicines')) }
  useEffect(()=>{ (async ()=>setList(await api.get('/pharmacy/medicines')))() },[])
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Add Medicine</div>
        <div className="space-y-2">
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
          <input type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)} step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
          <button onClick={add} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Save</button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Stock</div>
        <ul className="space-y-2 max-h-80 overflow-auto">
          {list.map((m,i)=>(<li key={i} className="p-3 rounded-lg bg-slate-800/50 flex justify-between"><span>{m.name}</span><span>{m.stock} • ${m.price}</span></li>))}
        </ul>
      </div>
    </div>
  )
}

export function Admissions({ token }){
  const api = useApi(token)
  const [room,setRoom] = useState('101A')
  const [patient,setPatient] = useState('')
  const [list,setList] = useState([])
  const admit = async ()=>{ await api.post('/admissions', { patient_id: patient, room_number: room, admitted_at: new Date().toISOString(), status: 'admitted' }); setList(await api.get('/admissions')) }
  useEffect(()=>{ (async ()=>setList(await api.get('/admissions')))() },[])
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Admit Patient</div>
        <input placeholder="Patient ID" value={patient} onChange={e=>setPatient(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white mb-2" />
        <input placeholder="Room" value={room} onChange={e=>setRoom(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white mb-2" />
        <button onClick={admit} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Admit</button>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="font-medium mb-3">Current Admissions</div>
        <ul className="space-y-2 max-h-80 overflow-auto">
          {list.map((a,i)=>(<li key={i} className="p-3 rounded-lg bg-slate-800/50">Room {a.room_number} • {a.status}</li>))}
        </ul>
      </div>
    </div>
  )
}

export function Payments({ token }){
  const api = useApi(token)
  const [patient,setPatient] = useState('')
  const [amount,setAmount] = useState(50)
  const [method,setMethod] = useState('cash')
  const [status,setStatus] = useState('pending')
  const pay = async ()=>{ await api.post('/payments', { patient_id: patient, amount: Number(amount), method, invoice_number: `INV-${Math.random().toString(36).slice(2,7).toUpperCase()}`, status }) }
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 max-w-lg">
      <div className="font-medium mb-3">New Payment</div>
      <div className="space-y-2">
        <input placeholder="Patient ID" value={patient} onChange={e=>setPatient(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
        <select value={method} onChange={e=>setMethod(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white">
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="insurance">Insurance</option>
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white">
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
        <button onClick={pay} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Record Payment</button>
      </div>
    </div>
  )
}

export function Ambulance({ token }){
  const base = import.meta.env.VITE_BACKEND_URL
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
  const [location,setLocation] = useState('')
  const [eta,setEta] = useState('')
  const [message,setMessage] = useState('')
  const request = async ()=>{
    const res = await fetch(`${base}/ambulance/request`, { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ patient_name: name, phone, location, eta_minutes: eta? Number(eta): undefined }) })
    const d = await res.json(); setMessage(`Request ID: ${d.id}`)
  }
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 max-w-lg">
      <div className="font-medium mb-3">Request Ambulance</div>
      <div className="space-y-2">
        <input placeholder="Patient name" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
        <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
        <input placeholder="ETA (minutes)" type="number" value={eta} onChange={e=>setEta(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white" />
        <button onClick={request} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Send Request</button>
        {message && <p className="text-green-400 text-sm">{message}</p>}
      </div>
    </div>
  )
}

export function SettingsModule(){
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 max-w-lg">
      <div className="font-medium mb-2">Profile & Security</div>
      <p className="text-slate-400 text-sm">Coming soon: edit name, email and password.</p>
    </div>
  )
}
