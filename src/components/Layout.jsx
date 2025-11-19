import { useEffect, useState } from 'react'
import { Menu, Stethoscope, Pill, FlaskConical, Ambulance, Hospital, Users, CreditCard, Settings, LogOut } from 'lucide-react'

export default function Layout({ user, onLogout, active, setActive, children }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: Hospital },
    { key: 'patients', label: 'Patients', icon: Users },
    { key: 'doctors', label: 'Doctors', icon: Stethoscope },
    { key: 'laboratory', label: 'Laboratory', icon: FlaskConical },
    { key: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { key: 'admissions', label: 'Admissions', icon: Hospital },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'ambulance', label: 'Ambulance', icon: Ambulance },
    { key: 'settings', label: 'Settings', icon: Settings },
  ]

  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-950/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg bg-slate-800/60" onClick={() => setOpen(!open)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-semibold text-lg">Aayaan Hospital</div>
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-slate-300">{user?.full_name} • {user?.role}</div>
            <button onClick={onLogout} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
        <nav className="hidden md:block border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-1 overflow-x-auto">
            {items.map(it => {
              const Icon = it.icon
              const activeCls = active === it.key ? 'bg-slate-800 text-white border-slate-700' : 'bg-transparent text-slate-300 border-transparent hover:bg-slate-800/50'
              return (
                <button key={it.key} onClick={() => setActive(it.key)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition ${activeCls}`}>
                  <Icon className="w-4 h-4" /> {it.label}
                </button>
              )
            })}
          </div>
        </nav>
        {open && (
          <div className="md:hidden border-t border-slate-800 px-2 pb-2">
            {items.map(it => {
              const Icon = it.icon
              return (
                <button key={it.key} onClick={() => { setActive(it.key); setOpen(false) }} className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border my-1 ${active===it.key?'bg-slate-800 border-slate-700':'bg-transparent border-transparent hover:bg-slate-800/50'}`}>
                  <Icon className="w-4 h-4" /> {it.label}
                </button>
              )
            })}
          </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
