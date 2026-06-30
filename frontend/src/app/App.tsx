import { useState } from 'react'
import Dashboard from '../features/dashboard/Dashboard'
import LoginPage from '../features/login/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (isAuthenticated) {
    return <Dashboard />
  }

  return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
}

export default App
