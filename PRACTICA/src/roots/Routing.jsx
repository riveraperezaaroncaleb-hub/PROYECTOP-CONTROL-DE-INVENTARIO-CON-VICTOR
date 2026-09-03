import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../components/Login'
import Compania from '../pages/Compania'
import Admin from '../pages/Admin'

function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/compania" element={<Compania />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
