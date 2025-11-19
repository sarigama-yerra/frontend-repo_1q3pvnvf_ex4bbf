import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Layout from './components/Layout'
import { Dashboard, Patients, Doctors, Laboratory, Pharmacy, Admissions, Payments, Ambulance, SettingsModule } from './components/Modules'

function App() {
  const [token,setToken] = useState(localStorage.getItem('token')||'')
  const [active,setActive] = useState('dashboard')
  const [user,setUser] = useState(null)

  useEffect(()=>{ if(token){ localStorage.setItem('token', token); setUser({ full_name: 'User', role: 'member' }) } },[token])
  const logout = ()=>{ setToken(''); localStorage.removeItem('token'); setUser(null) }

  return (
    <div className="min-h-screen bg-slate-950">
      {!token ? (
        <>
          <Hero />
          <div className="max-w-7xl mx-auto px-4">
            <Auth onAuthenticated={setToken} />
          </div>
        </>
      ) : (
        <Layout user={user} onLogout={logout} active={active} setActive={setActive}>
          {active==='dashboard' && <Dashboard token={token} />}
          {active==='patients' && <Patients token={token} />}
          {active==='doctors' && <Doctors token={token} />}
          {active==='laboratory' && <Laboratory token={token} />}
          {active==='pharmacy' && <Pharmacy token={token} />}
          {active==='admissions' && <Admissions token={token} />}
          {active==='payments' && <Payments token={token} />}
          {active==='ambulance' && <Ambulance token={token} />}
          {active==='settings' && <SettingsModule />}
        </Layout>
      )}
      <footer className="text-center text-slate-500 text-xs py-6">© {new Date().getFullYear()} Aayaan Hospital</footer>
    </div>
  )
}

export default App
