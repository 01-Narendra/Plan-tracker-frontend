import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { setToastFunction } from '../api/api.js'

export default function Login() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { addToast } = useToast()  


  useEffect(() => {
    setToastFunction(addToast)              
  }, [addToast])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isSignup) {
        await signup(name, email, password, passwordConfirm)
        addToast('Account created! Logging in...', 'success')
      } else {
        await login(email, password)
        addToast('Welcome back!', 'success')
      }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong')
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  function toggleMode() {
    setIsSignup(!isSignup)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ledger-ink text-ledger-bg font-display text-xl mb-4 shadow-stamp rotate-[-3deg]">
            L
          </div>
          <h1 className="font-display text-3xl font-semibold text-ledger-ink tracking-tight">
            Ledger
          </h1>
          <p className="font-mono text-xs text-ledger-inkSoft mt-2 uppercase tracking-widest">
            Show up. Check it off. Repeat.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ledger-panel border border-ledger-rule rounded-2xl p-8 shadow-stamp"
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-xl font-semibold text-ledger-ink">
              {isSignup ? 'Create account' : 'Sign in'}
            </h2>
          </div>

          {isSignup && (
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required={isSignup}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg border border-ledger-rule bg-white/60 text-ledger-ink placeholder:text-ledger-inkSoft/50 focus:outline-none focus:ring-2 focus:ring-ledger-accent/40 focus:border-ledger-accent transition"
              />
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-ledger-rule bg-white/60 text-ledger-ink placeholder:text-ledger-inkSoft/50 focus:outline-none focus:ring-2 focus:ring-ledger-accent/40 focus:border-ledger-accent transition"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-ledger-rule bg-white/60 text-ledger-ink placeholder:text-ledger-inkSoft/50 focus:outline-none focus:ring-2 focus:ring-ledger-accent/40 focus:border-ledger-accent transition"
            />
          </div>

          {isSignup && (
            <div className="mb-5">
              <label
                htmlFor="passwordConfirm"
                className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkSoft mb-2"
              >
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                type="password"
                required={isSignup}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-ledger-rule bg-white/60 text-ledger-ink placeholder:text-ledger-inkSoft/50 focus:outline-none focus:ring-2 focus:ring-ledger-accent/40 focus:border-ledger-accent transition"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-ledger-accent font-medium mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-ledger-ink text-ledger-bg font-semibold tracking-tight hover:bg-ledger-ink/90 active:scale-[0.99] transition disabled:opacity-60"
          >
            {submitting ? (isSignup ? 'Creating…' : 'Signing in…') : isSignup ? 'Create account' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-center text-xs text-ledger-inkSoft hover:text-ledger-accent mt-4 transition"
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </form>
      </div>
    </div>
  )
}
