import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { empresaAuth } from '../sevices/dbService'

function LoginEmpresa() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const empresa = empresaAuth.login(email, password)
    if (empresa) {
      navigate('/empresa')
    } else {
      setError('Credenciales incorrectas. Verifique su correo y contraseña.')
    }
  }

  return (
    <div className="login-container login-container--empresa">
      <div className="floating-shapes floating-shapes--green">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>
      <div className="login-card login-card--empresa">
        <div className="login-card__icon">
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#10b981' }}>storefront</span>
        </div>
        <h2>Portal de Empresas</h2>
        <p className="login-card__subtitle">Acceso exclusivo para empresas autorizadas. Vista de monitoreo y control de productos.</p>

        {error && (
          <div className="login-error">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="empEmail">Correo de la empresa</label>
            <input
              id="empEmail"
              type="email"
              placeholder="empresa@correo.cr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="empPassword">Contraseña</label>
            <input
              id="empPassword"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login btn-login--empresa">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
            Ingresar al Portal
          </button>
        </form>

        <div className="login-card__footer">
          <Link to="/" className="login-card__link">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Volver al Login Principal
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginEmpresa
