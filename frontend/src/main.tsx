import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CustomerDashboard from './features/customer/Customer'
import ShipmentDashboard from './features/shipment/Shipment'
import Dashboard from './features/dashboard/Dashboard'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/shipment" element={<ShipmentDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
