import { useState } from 'react'
import LoginPage from '../features/login/Login'
import Dashboard from '../features/dashboard/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (isAuthenticated) {
    return <Dashboard />
  }

  return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
}

export default App
