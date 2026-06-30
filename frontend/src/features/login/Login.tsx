import type { FormEvent } from 'react'
import { useState } from 'react'
import './Login.css'

const DEMO_CREDENTIALS = {
  name: 'admin',
  password: 'password123',
}

type LoginPageProps = {
  onLoginSuccess: () => void
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (name === DEMO_CREDENTIALS.name && password === DEMO_CREDENTIALS.password) {
      setMessage('Login successful with demo credentials.')
      onLoginSuccess()
      return
    }

    setMessage('Invalid credentials. Use admin / password123.')
  }

  return (
    <main className="login-page">
      <section className="login-shell" aria-label="Login page">
        <div className="login-hero">
          <p className="login-kicker">Assignment Portal</p>
          <h1 className="login-title">Welcome back.</h1>
          <p className="login-copy">
            Sign in to manage customers and shipments from one clean dashboard.
          </p>

          <div className="demo-card">
            <span className="demo-label">Demo credentials</span>
            <div className="demo-list">
              <div>Name: <strong>admin</strong></div>
              <div>Password: <strong>password123</strong></div>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <h2 className="login-form-title">Login</h2>
          <p className="login-form-subtitle">
            Enter the demo name and password below to continue.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span className="field-label">Name</span>
              <input
                className="field-input"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </label>

            <label>
              <span className="field-label">Password</span>
              <input
                className="field-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password123"
                autoComplete="current-password"
              />
            </label>

            <div className="login-actions">
              <p className="login-hint">Hint: admin / password123</p>
              <button className="login-button" type="submit">
                Sign in
              </button>
            </div>

            <p className="login-feedback" aria-live="polite">
              {message}
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage