import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CustomerDashboard from './features/customer/Customer'
import ShipmentDashboard from './features/shipment/Shipment'
import Layout from './app/Layout'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/customer" replace />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/shipment" element={<ShipmentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
