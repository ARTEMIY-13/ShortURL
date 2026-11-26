import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Links from './pages/Links.jsx'
import Company from './pages/Company.jsx'
import Domens from './pages/Domens.jsx'
import Settings from './pages/Settings.jsx'
import Register from './pages/Register.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="Register" element={<Register />} />
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/Home" replace />} />
        <Route path="Home" element={<Home />} />
        <Route path="Links" element={<Links />} />
        <Route path="Company" element={<Company />} />
        <Route path="Domens" element={<Domens />} />
        <Route path="Settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/Home" replace />} />
      </Route>
    </Routes>
  )
}
