import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('admin@correo.com')
  const [password, setPassword] = useState('Adm1n@2025!')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (email === 'admin@correo.com' && password === 'Adm1n@2025!') {
      navigate('/admin')
    } else {
      alert('Credenciales incorrectas')
    }
  }

  return (
    <div className="login-container">
      <div className="floating-shapes">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">Entrar</button>
        </form>

        <div className="login-card__divider">
          <span>o</span>
        </div>

        <Link to="/login-empresa" className="btn-empresa-access">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>storefront</span>
          Acceso Empresas
        </Link>
      </div>
    </div>
  )
}

export default Login
