import { useState } from 'react'
import { Link } from 'react-router-dom'
import db from '../../data/db.json'

function Formulario() {
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    nombreContacto: '',
    emailContacto: '',
    telefonoContacto: '',
    giroEmpresa: '',
    tamanoEmpresa: '',
    mensaje: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nombreEmpresa || !formData.nombreContacto || !formData.emailContacto || !formData.telefonoContacto) {
      return
    }

    const solicitud = {
      id: 'sol_' + Date.now().toString(36),
      fecha: new Date().toLocaleDateString('es-CR') + ' ' + new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      estado: 'Pendiente',
      ...formData
    }

    const existentes = JSON.parse(localStorage.getItem('controlinv_cr_solicitudes') || '[]')
    localStorage.setItem('controlinv_cr_solicitudes', JSON.stringify([...existentes, solicitud]))

    setSubmitted(true)
  }

  return (
    <div className="landing-app">
      {/* Navbar */}
      <nav className="ln-nav">
        <div className="ln-nav__inner">
          <div className="ln-nav__brand">
            <div className="ln-nav__logo">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div className="ln-nav__brand-text">
              <span className="ln-nav__brand-name">InvControl CR</span>
              <span className="ln-nav__brand-sub">Sistema Empresarial</span>
            </div>
          </div>
          <div className="ln-nav__links">
            <Link to="/">Inicio</Link>
            <Link to="/login" className="ln-btn ln-btn--outline">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Formulario de Solicitud */}
      <section className="ln-section" id="solicitar" style={{ paddingTop: 120 }}>
        <div className="ln-section__inner">
          <div className="ln-section__header">
            <span className="ln-section__tag">Acceso</span>
            <h2 className="ln-section__title">Solicitar Acceso Empresarial</h2>
            <p className="ln-section__desc">
              Completa el formulario y nos pondremos en contacto contigo para activar
              tu cuenta empresarial.
            </p>
          </div>

          {submitted ? (
            <div className="ln-thanks-card">
              <div className="ln-thanks-card__icon">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <h3 className="ln-thanks-card__title">Solicitud Enviada</h3>
              <p className="ln-thanks-card__desc">
                Tu solicitud ha sido registrada correctamente. Nuestro equipo la revisará
                y te contactará pronto a través de <strong>{formData.emailContacto}</strong> o
                al número <strong>{formData.telefonoContacto}</strong> con los datos de acceso
                a la plataforma.
              </p>
              <div className="ln-thanks-card__details">
                <div className="ln-thanks-card__detail">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>business</span>
                  <span>{formData.nombreEmpresa}</span>
                </div>
                <div className="ln-thanks-card__detail">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
                  <span>{formData.nombreContacto}</span>
                </div>
                <div className="ln-thanks-card__detail">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
                  <span>{formData.emailContacto}</span>
                </div>
                <div className="ln-thanks-card__detail">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>phone</span>
                  <span>{formData.telefonoContacto}</span>
                </div>
              </div>
              <div className="ln-thanks-card__msg-preview">
                <div className="ln-thanks-card__msg-label">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
                  Mensaje que recibirás al aprobarse:
                </div>
                <div className="ln-thanks-card__msg-box">
                  <p><strong>InvControl CR — Acceso Empresarial</strong></p>
                  <p>Estimado/a {formData.nombreContacto},</p>
                  <p>Su solicitud para la empresa <strong>{formData.nombreEmpresa}</strong> ha sido <strong style={{ color: '#34d399' }}>aprobada</strong>.</p>
                  <p>Puede acceder al sistema con las siguientes credenciales:</p>
                  <p>Correo: <strong>{formData.emailContacto}</strong></p>
                  <p>Contraseña temporal: <strong>{db.auth.tempPassword}</strong></p>
                  <p style={{ marginTop: 8, color: '#94a3b8', fontSize: '0.78rem' }}>Le recomendamos cambiar su contraseña tras el primer inicio de sesión.</p>
                  <p style={{ marginTop: 6, color: '#94a3b8', fontSize: '0.78rem' }}>— Equipo InvControl CR</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
                <button className="ln-btn ln-btn--primary ln-btn--lg" onClick={() => setSubmitted(false)}>
                  Enviar otra solicitud
                </button>
                <Link to="/" className="ln-btn ln-btn--ghost ln-btn--lg">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home</span>
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : (
            <div className="ln-form-wrapper">
              <form className="ln-request-form" onSubmit={handleSubmit}>
                <div className="ln-form-row">
                  <div className="ln-form-group ln-form-group--wide">
                    <label>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>business</span>
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      name="nombreEmpresa"
                      placeholder="Ej. Distribuidora La Montaña S.A."
                      value={formData.nombreEmpresa}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="ln-form-group">
                    <label>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>category</span>
                      Giro / Rubro
                    </label>
                    <input
                      type="text"
                      name="giroEmpresa"
                      placeholder="Ej. Abarrotes, Café, Alimentos"
                      value={formData.giroEmpresa}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ln-form-row">
                  <div className="ln-form-group">
                    <label>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                      Nombre del Contacto *
                    </label>
                    <input
                      type="text"
                      name="nombreContacto"
                      placeholder="Ej. María López"
                      value={formData.nombreContacto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="ln-form-group">
                    <label>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>mail</span>
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="emailContacto"
                      placeholder="contacto@empresa.com"
                      value={formData.emailContacto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="ln-form-row">
                  <div className="ln-form-group">
                    <label>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>phone</span>
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="telefonoContacto"
                      placeholder="Ej. +(506) 8888-7777"
                      value={formData.telefonoContacto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="ln-form-group">
                    <label>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span>
                      Tamaño de la Empresa
                    </label>
                    <select name="tamanoEmpresa" value={formData.tamanoEmpresa} onChange={handleChange}>
                      <option value="">Seleccionar...</option>
                      <option value="Pequeña (1-10)">Pequeña (1-10 empleados)</option>
                      <option value="Mediana (11-50)">Mediana (11-50 empleados)</option>
                      <option value="Grande (51-200)">Grande (51-200 empleados)</option>
                      <option value="Corporativa (200+)">Corporativa (200+ empleados)</option>
                    </select>
                  </div>
                </div>

                <div className="ln-form-group ln-form-group--wide">
                  <label>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_note</span>
                    Mensaje adicional (opcional)
                  </label>
                  <textarea
                    name="mensaje"
                    rows="3"
                    placeholder="Cuéntanos sobre tus necesidades de inventario o cualquier información relevante..."
                    value={formData.mensaje}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="ln-form-submit">
                  <button type="submit" className="ln-btn ln-btn--primary ln-btn--lg">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
                    Enviar Solicitud de Acceso
                  </button>
                  <p className="ln-form-submit__note">
                    Tu solicitud será revisada por nuestro equipo. Recibirás una respuesta por correo o WhatsApp.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="ln-footer">
        <div className="ln-footer__inner">
          <div className="ln-footer__brand">
            <div className="ln-nav__logo">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <span className="ln-footer__brand-name">InvControl CR</span>
          </div>
          <p className="ln-footer__copy">
            &copy; 2026 InvControl CR — Sistema de Control de Inventario Empresarial. San José, Costa Rica.
          </p>
          <div className="ln-footer__links">
            <Link to="/login">Acceso Administrativo</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Formulario
