import { useState } from 'react'

export default function Auth({ onAuthenticated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  const [isSignup, setIsSignup] = useState(false)
  const [role, setRole] = useState('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) {
        const res = await fetch(`${baseUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, full_name: name, email, password })
        })
        if (!res.ok) throw new Error('Signup failed')
      }
      const body = new URLSearchParams()
      body.append('username', email)
      body.append('password', password)
      const res2 = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      })
      if (!res2.ok) throw new Error('Login failed')
      const data = await res2.json()
      onAuthenticated(data.access_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Access your account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignup && (
          <div>
            <label className="block text-sm text-slate-300 mb-1">Full name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required />
          </div>
        )}
        <div>
          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white" required />
        </div>
        {isSignup && (
          <div>
            <label className="block text-sm text-slate-300 mb-1">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="lab">Laboratory</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2">{loading? 'Please wait...' : isSignup? 'Create account' : 'Sign in'}</button>
      </form>
      <button onClick={()=>setIsSignup(!isSignup)} className="mt-3 text-sm text-slate-300 hover:text-white">
        {isSignup? 'Have an account? Sign in' : 'New here? Create an account'}
      </button>
    </div>
  )
}
