import { useState } from 'react'
import LoginPage from '../features/login/Login'
import Layout from './Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (isAuthenticated) {
    return <Layout />
  }

  return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
}

export default App
