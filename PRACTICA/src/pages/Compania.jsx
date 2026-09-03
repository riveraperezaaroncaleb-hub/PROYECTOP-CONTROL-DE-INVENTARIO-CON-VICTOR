import { Link } from 'react-router-dom'

function Compania() {
  return (
    <div className="page-container">
      <div className="page-card">
        <h1>Panel de Compañía</h1>
        <p>Bienvenido al sistema de gestión de tu compañía.</p>
        <Link to="/" className="btn-back">Cerrar sesión</Link>
      </div>
    </div>
  )
}

export default Compania
