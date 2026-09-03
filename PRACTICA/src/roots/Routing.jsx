import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../components/Login'
import LoginEmpresa from '../components/LoginEmpresa'
import Compania from '../pages/Compania'
import Admin from '../pages/Admin'
import Empresa from '../pages/Empresa'

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login-empresa" element={<LoginEmpresa />} />
        <Route path="/compania" element={<Compania />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/empresa" element={<Empresa />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
