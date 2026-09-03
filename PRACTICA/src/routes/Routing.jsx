import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from '../pages/landing/Inicio'
import Formulario from '../pages/landing/Formulario'
import Login from '../pages/auth/Login'
import Compania from '../pages/Compania'
import Admin from '../pages/admin/Admin'

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/compania" element={<Compania />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
