import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../sevices/dbService'

function LoginEmpresa() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Estado para flujo de actualización en primer ingreso
  const [firstLoginUser, setFirstLoginUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updateError, setUpdateError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const result = authService.login(email, password)

    if (!result.success) {
      setError(result.error || 'Credenciales incorrectas. Verifique su correo y contraseña.')
      return
    }

    if (result.user.role !== 'Empresas') {
      setError('Esta cuenta no corresponde al rol de Empresa. Use el acceso para Administradores.')
      return
    }

    // Si tiene contraseña genérica y debe cambiarla por primera vez
    if (result.mustChangePassword) {
      setFirstLoginUser(result.user)
      setNewPassword('')
      setConfirmPassword('')
      setUpdateError('')
      return
    }

    navigate('/empresa')
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    setUpdateError('')

    if (!newPassword || newPassword.length < 6) {
      setUpdateError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (newPassword === password) {
      setUpdateError('La nueva contraseña no puede ser idéntica a la genérica.')
      return
    }

    if (newPassword !== confirmPassword) {
      setUpdateError('Las contraseñas no coinciden.')
      return
    }

    const updateRes = authService.changePasswordAndLogin(firstLoginUser.id, newPassword)
    if (!updateRes.success) {
      setUpdateError(updateRes.error || 'Error al actualizar contraseña.')
      return
    }

    navigate('/empresa')
  }

  return (
    <div className="login-container login-container--empresa">
      <div className="floating-shapes floating-shapes--green">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>

      <div className="login-card login-card--empresa">
        {/* VISTA 1: CAMBIO OBLIGATORIO DE CONTRASEÑA GENÉRICA */}
        {firstLoginUser ? (
          <div>
            <div className="login-card__icon" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#f59e0b' }}>key</span>
            </div>
            <h2>Actualización de Contraseña</h2>
            <p className="login-card__subtitle">
              Bienvenido, <strong>{firstLoginUser.name}</strong>. Como es su primer acceso con la clave genérica asignada por el Administrador, debe crear una contraseña nueva y segura.
            </p>

            {updateError && (
              <div className="login-error" style={{ marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label htmlFor="empNewPassword">Nueva Contraseña</label>
                <input
                  id="empNewPassword"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="empConfirmPassword">Confirmar Nueva Contraseña</label>
                <input
                  id="empConfirmPassword"
                  type="password"
                  placeholder="Repita su nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-login btn-login--empresa">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                Guardar Contraseña e Ingresar
              </button>

              <button
                type="button"
                className="btn btn--secondary"
                style={{ width: '100%', marginTop: 10 }}
                onClick={() => setFirstLoginUser(null)}
              >
                Volver
              </button>
            </form>
          </div>
        ) : (
          /* VISTA 2: FORMULARIO LOGIN EMPRESA */
          <div>
            <div className="login-card__icon">
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#10b981' }}>storefront</span>
            </div>
            <h2>Portal de Empresas</h2>
            <p className="login-card__subtitle">Acceso exclusivo para empresas y proveedores autorizados con rol Empresas.</p>

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
        )}
      </div>
    </div>
  )
}

export default LoginEmpresa
