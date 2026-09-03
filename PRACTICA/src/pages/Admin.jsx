import { Link } from 'react-router-dom'

function Admin() {
  return (
    <div className="page-container">
      <div className="page-card admin">
        <h1>Panel de Administrador</h1>
        <p>Bienvenido al sistema de administración.</p>
        <Link to="/" className="btn-back">Cerrar sesión</Link>
      </div>
    </div>
  )
}

export default Admin
