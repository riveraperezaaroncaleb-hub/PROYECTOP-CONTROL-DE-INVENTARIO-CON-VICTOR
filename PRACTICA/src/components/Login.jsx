import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../sevices/dbService'

function Login() {
  const [email, setEmail] = useState('admin@correo.com')
  const [password, setPassword] = useState('Adm1n@2025!')
  const [error, setError] = useState('')

  // Estado para flujo de actualización obligatoria en primer ingreso
  const [firstLoginUser, setFirstLoginUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updateError, setUpdateError] = useState('')

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    const result = authService.login(email, password)

    if (!result.success) {
      setError(result.error || 'Credenciales incorrectas.')
      return
    }

    // Si requiere cambiar la contraseña genérica por primera vez
    if (result.mustChangePassword) {
      setFirstLoginUser(result.user)
      setNewPassword('')
      setConfirmPassword('')
      setUpdateError('')
      return
    }

    // Redirección según rol
    if (result.user.role === 'Admin') {
      navigate('/admin')
    } else if (result.user.role === 'Empresas') {
      navigate('/empresa')
    } else {
      navigate('/admin')
    }
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    setUpdateError('')

    if (!newPassword || newPassword.length < 6) {
      setUpdateError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (newPassword === password) {
      setUpdateError('La nueva contraseña no puede ser igual a la genérica temporal.')
      return
    }

    if (newPassword !== confirmPassword) {
      setUpdateError('Las contraseñas no coinciden. Por favor verifíquelas.')
      return
    }

    const updateRes = authService.changePasswordAndLogin(firstLoginUser.id, newPassword)
    if (!updateRes.success) {
      setUpdateError(updateRes.error || 'Ocurrió un error al actualizar la contraseña.')
      return
    }

    // Redirigir según el rol del usuario
    if (updateRes.user.role === 'Admin') {
      navigate('/admin')
    } else {
      navigate('/empresa')
    }
  }

  return (
    <div className="login-container">
      <div className="floating-shapes">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>

      <div className="login-card">
        {/* VISTA 1: PRIMER INGRESO - CAMBIO OBLIGATORIO DE CONTRASEÑA */}
        {firstLoginUser ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#f59e0b' }}>
                lock_reset
              </span>
              <h2 style={{ marginTop: 8, marginBottom: 6 }}>Primer Inicio de Sesión</h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Hola <strong style={{ color: '#fff' }}>{firstLoginUser.name}</strong>. Por política de seguridad, debe actualizar su contraseña genérica temporal antes de continuar.
              </p>
              <div style={{ marginTop: 10 }}>
                <span className="status-pill status-pill--warning" style={{ fontSize: '0.75rem' }}>
                  Rol: {firstLoginUser.role}
                </span>
              </div>
            </div>

            {updateError && (
              <div className="login-error" style={{ marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-login" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 6 }}>check_circle</span>
                Actualizar y Entrar al Sistema
              </button>

              <button
                type="button"
                className="btn btn--secondary"
                style={{ width: '100%', marginTop: 10 }}
                onClick={() => setFirstLoginUser(null)}
              >
                Cancelar y Regresar
              </button>
            </form>
          </div>
        ) : (
          /* VISTA 2: FORMULARIO NORMAL DE LOGIN */
          <div>
            <h2>Iniciar Sesión</h2>

            {error && (
              <div className="login-error" style={{ marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
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
        )}
      </div>
    </div>
  )
}

export default Login
