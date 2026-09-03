import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import db from '../../data/db.json'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (email === db.auth.admin.email && password === db.auth.admin.password) {
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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', marginBottom: 20, fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Volver al inicio
        </Link>
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
      </div>
    </div>
  )
}

export default Login
