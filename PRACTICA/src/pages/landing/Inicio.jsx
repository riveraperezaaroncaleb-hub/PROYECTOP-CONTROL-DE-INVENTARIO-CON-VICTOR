import { Link } from 'react-router-dom'

function Inicio() {
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
            <a href="#funcionalidad">Funcionalidad</a>
            <a href="#como-funciona">Proceso</a>
            <Link to="/formulario">Solicitar Acceso</Link>
            <Link to="/login" className="ln-btn ln-btn--outline">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="ln-hero">
        <div className="ln-hero__bg">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>
        <div className="ln-hero__content">
          <div className="ln-hero__badge">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span>
            Plataforma de Gestión Empresarial v2.4
          </div>
          <h1 className="ln-hero__title">
            Control de Inventario<br />
            <span className="ln-hero__title--accent">Inteligente y Profesional</span>
          </h1>
          <p className="ln-hero__desc">
            Gestiona tu inventario, proveedores, órdenes de compra y movimientos de bodega
            desde una única plataforma. Toma decisiones basadas en datos reales con reportes
            analíticos en tiempo real.
          </p>
          <div className="ln-hero__actions">
            <Link to="/formulario" className="ln-btn ln-btn--primary ln-btn--lg">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rocket_launch</span>
              Solicitar Acceso Empresarial
            </Link>
            <a href="#funcionalidad" className="ln-btn ln-btn--ghost ln-btn--lg">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>info</span>
              Conocer Más
            </a>
          </div>
          <div className="ln-hero__stats">
            <div className="ln-hero__stat">
              <span className="ln-hero__stat-val">100%</span>
              <span className="ln-hero__stat-label">Digital</span>
            </div>
            <div className="ln-hero__stat-divider"></div>
            <div className="ln-hero__stat">
              <span className="ln-hero__stat-val">CRC ₡</span>
              <span className="ln-hero__stat-label">Moneda Local</span>
            </div>
            <div className="ln-hero__stat-divider"></div>
            <div className="ln-hero__stat">
              <span className="ln-hero__stat-val">24/7</span>
              <span className="ln-hero__stat-label">Disponible</span>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidad */}
      <section className="ln-section" id="funcionalidad">
        <div className="ln-section__inner">
          <div className="ln-section__header">
            <span className="ln-section__tag">Plataforma</span>
            <h2 className="ln-section__title">Funcionalidades del Sistema</h2>
            <p className="ln-section__desc">
              Herramientas diseñadas para empresas costarricenses que buscan eficiencia
              y control total sobre sus operaciones de inventario.
            </p>
          </div>

          <div className="ln-features-grid">
            <div className="ln-feature-card">
              <div className="ln-feature-card__icon ln-feature-card__icon--blue">
                <span className="material-symbols-outlined">dashboard</span>
              </div>
              <h3 className="ln-feature-card__title">Panel de Control Gerencial</h3>
              <p className="ln-feature-card__desc">
                Dashboard analítico con KPIs en tiempo real: valorización de inventario en colones,
                productos con bajo stock y proyecciones de ventas.
              </p>
            </div>

            <div className="ln-feature-card">
              <div className="ln-feature-card__icon ln-feature-card__icon--green">
                <span className="material-symbols-outlined">shelves</span>
              </div>
              <h3 className="ln-feature-card__title">Catálogo de Productos</h3>
              <p className="ln-feature-card__desc">
                Registro completo de productos con costos, precios de venta, control de stock
                mínimo y vinculación directa con proveedores.
              </p>
            </div>

            <div className="ln-feature-card">
              <div className="ln-feature-card__icon ln-feature-card__icon--cyan">
                <span className="material-symbols-outlined">sync_alt</span>
              </div>
              <h3 className="ln-feature-card__title">Kardex de Movimientos</h3>
              <p className="ln-feature-card__desc">
                Bitácora oficial de entradas, salidas y ajustes. Cada transacción queda registrada
                con fecha, responsable y documento soporte.
              </p>
            </div>

            <div className="ln-feature-card">
              <div className="ln-feature-card__icon ln-feature-card__icon--amber">
                <span className="material-symbols-outlined">factory</span>
              </div>
              <h3 className="ln-feature-card__title">Gestión de Proveedores</h3>
              <p className="ln-feature-card__desc">
                Directorio completo de proveedores con datos de contacto, categorías y
                seguimiento directo de cada aliado comercial.
              </p>
            </div>

            <div className="ln-feature-card">
              <div className="ln-feature-card__icon ln-feature-card__icon--purple">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <h3 className="ln-feature-card__title">Órdenes de Compra</h3>
              <p className="ln-feature-card__desc">
                Emisión y seguimiento de órdenes de compra con recepción automática que
                incrementa las existencias al confirmar la mercancía.
              </p>
            </div>

            <div className="ln-feature-card">
              <div className="ln-feature-card__icon ln-feature-card__icon--red">
                <span className="material-symbols-outlined">manage_accounts</span>
              </div>
              <h3 className="ln-feature-card__title">Control de Usuarios</h3>
              <p className="ln-feature-card__desc">
                Gestión de colaboradores con roles diferenciados: Administrador, Jefe de Bodega
                y Cajero/Mostrador con permisos específicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="ln-section ln-section--alt" id="como-funciona">
        <div className="ln-section__inner">
          <div className="ln-section__header">
            <span className="ln-section__tag">Proceso</span>
            <h2 className="ln-section__title">¿Cómo Obtener Acceso?</h2>
            <p className="ln-section__desc">
              Un proceso sencillo y profesional para que tu empresa comience a gestionar
              su inventario en minutos.
            </p>
          </div>

          <div className="ln-steps">
            <div className="ln-step">
              <div className="ln-step__number">01</div>
              <div className="ln-step__content">
                <h3 className="ln-step__title">Solicita tu Acceso</h3>
                <p className="ln-step__desc">
                  Completa el formulario con los datos de tu empresa y un representante
                  de tu negocio. Solo necesitas información básica de contacto.
                </p>
              </div>
            </div>

            <div className="ln-step__line"></div>

            <div className="ln-step">
              <div className="ln-step__number">02</div>
              <div className="ln-step__content">
                <h3 className="ln-step__title">Revisión y Aprobación</h3>
                <p className="ln-step__desc">
                  Nuestro equipo revisa la solicitud y aprueba el acceso de tu empresa.
                  Recibirás un mensaje profesional con tus credenciales y datos de acceso.
                </p>
              </div>
            </div>

            <div className="ln-step__line"></div>

            <div className="ln-step">
              <div className="ln-step__number">03</div>
              <div className="ln-step__content">
                <h3 className="ln-step__title">Comienza a Operar</h3>
                <p className="ln-step__desc">
                  Ingresa al panel de administración, registra tus productos, proveedores
                  y comienza a controlar tu inventario de forma profesional.
                </p>
              </div>
            </div>
          </div>
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

export default Inicio
