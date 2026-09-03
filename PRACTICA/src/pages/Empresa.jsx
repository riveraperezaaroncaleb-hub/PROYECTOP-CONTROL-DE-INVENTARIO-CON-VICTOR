import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { empresaAuth, productService, movementService } from '../sevices/dbService'

function Empresa() {
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Datos filtrados
  const [myProducts, setMyProducts] = useState([])
  const [myMovements, setMyMovements] = useState([])

  // Verificar sesión y cargar datos
  useEffect(() => {
    const session = empresaAuth.getSession()
    if (!session) {
      navigate('/login-empresa')
      return
    }
    setEmpresa(session)
    loadData(session)

    // Refrescar datos cada 3 segundos (simula sincronización con backend)
    const interval = setInterval(() => loadData(session), 3000)
    return () => clearInterval(interval)
  }, [navigate])

  const loadData = (emp) => {
    const allProducts = productService.getAll()
    const allMovements = movementService.getAll()

    // Filtrar productos por proveedor de esta empresa
    const filtered = allProducts.filter(p =>
      p.supplier && p.supplier.toLowerCase().includes(emp.supplierMatch.toLowerCase())
    )
    setMyProducts(filtered)

    // Filtrar movimientos solo de los productos de esta empresa
    const prodIds = new Set(filtered.map(p => p.id))
    setMyMovements(allMovements.filter(m => prodIds.has(m.productId)))
  }

  const handleLogout = () => {
    empresaAuth.logout()
    navigate('/login-empresa')
  }

  const formatCRC = (amount) => {
    return '₡' + Number(amount || 0).toLocaleString('es-CR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }

  if (!empresa) return null

  // KPIs
  const totalProds = myProducts.length
  const totalStock = myProducts.reduce((acc, p) => acc + p.stock, 0)
  const totalValue = myProducts.reduce((acc, p) => acc + (p.price * p.stock), 0)
  const lowStock = myProducts.filter(p => p.stock <= p.minStock)

  // Entradas y salidas totales
  const totalEntradas = myMovements.filter(m => m.type === 'ENTRADA').reduce((acc, m) => acc + m.quantity, 0)
  const totalSalidas = myMovements.filter(m => m.type === 'SALIDA').reduce((acc, m) => acc + m.quantity, 0)

  // Productos que necesitan reposición (stock <= minStock * 1.5)
  const needReorder = myProducts.filter(p => p.stock <= Math.ceil(p.minStock * 1.5))

  return (
    <div className="cr-dashboard-app empresa-portal">
      {/* TOP NAVBAR */}
      <header className="navbar navbar--empresa">
        <div className="navbar__brand">
          <button className="navbar__mobile-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="navbar__logo navbar__logo--empresa">
            <span className="material-symbols-outlined">storefront</span>
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">Portal Empresa</span>
            <span className="navbar__brand-badge navbar__brand-badge--empresa">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>visibility</span>
              Solo Lectura
            </span>
          </div>
        </div>

        <div className="navbar__center">
          <div className="cr-badge cr-badge--empresa">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>business</span>
            <span>{empresa.name}</span>
          </div>
        </div>

        <div className="navbar__actions">
          <div className="empresa-readonly-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
            Monitoreo
          </div>
          <div className="user-pill user-pill--empresa">
            <div className="user-pill__avatar user-pill__avatar--empresa">
              {empresa.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="user-pill__details">
              <span className="user-pill__name">{empresa.name}</span>
              <span className="user-pill__role" style={{ color: '#10b981' }}>Empresa</span>
            </div>
            <button onClick={handleLogout} className="btn-logout-link" title="Cerrar sesión">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f87171' }}>logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY CON SIDEBAR Y CONTENIDO */}
      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar__nav">
            <span className="nav-category">Monitoreo</span>
            <div className={`sidebar__item sidebar__item--empresa ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveSection('dashboard'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </div>
            <div className={`sidebar__item sidebar__item--empresa ${activeSection === 'productos' ? 'active' : ''}`} onClick={() => { setActiveSection('productos'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Mis Productos</span>
            </div>

            <span className="nav-category">Control</span>
            <div className={`sidebar__item sidebar__item--empresa ${activeSection === 'movimientos' ? 'active' : ''}`} onClick={() => { setActiveSection('movimientos'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">swap_horiz</span>
              <span>Ingresos y Egresos</span>
            </div>
            <div className={`sidebar__item sidebar__item--empresa ${activeSection === 'recomendacion' ? 'active' : ''}`} onClick={() => { setActiveSection('recomendacion'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Recomendación de Pedido</span>
            </div>
          </nav>
        </aside>

        <main className="main-scroll">
          <div className="content-area">

            {/* SECCIÓN 1: DASHBOARD */}
            {activeSection === 'dashboard' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Panel de Monitoreo — {empresa.name}</h1>
                    <p className="section-header__desc">Vista en tiempo real de sus productos en nuestro sistema de inventario.</p>
                  </div>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card kpi-card--emp-primary">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Mis Productos</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">category</span></div>
                    </div>
                    <div className="kpi-card__value">{totalProds}</div>
                    <div className="kpi-card__sub">Artículos registrados a su nombre</div>
                  </div>

                  <div className="kpi-card kpi-card--emp-success">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Stock Total</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">inventory</span></div>
                    </div>
                    <div className="kpi-card__value">{totalStock}</div>
                    <div className="kpi-card__sub">Unidades totales disponibles</div>
                  </div>

                  <div className="kpi-card kpi-card--emp-info">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Valor en Inventario</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">payments</span></div>
                    </div>
                    <div className="kpi-card__value">{formatCRC(totalValue)}</div>
                    <div className="kpi-card__sub">Valorización a precio de venta</div>
                  </div>

                  <div className="kpi-card kpi-card--emp-danger">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Alertas de Stock</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">warning</span></div>
                    </div>
                    <div className="kpi-card__value">{lowStock.length}</div>
                    <div className="kpi-card__sub">Productos bajo mínimo</div>
                  </div>
                </div>

                <div className="dash-tables-grid">
                  <div className="card-panel">
                    <div className="card-panel__header">
                      <h3 className="card-panel__title">
                        <span className="material-symbols-outlined" style={{ color: '#10b981' }}>trending_up</span>
                        Resumen de Actividad
                      </h3>
                    </div>
                    <div className="kpi-grid" style={{ marginBottom: 0 }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#10b981', marginBottom: 6 }}>Total Entradas</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>+{totalEntradas}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>unidades recibidas</div>
                      </div>
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#ef4444', marginBottom: 6 }}>Total Salidas</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>-{totalSalidas}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>unidades despachadas</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-panel">
                    <div className="card-panel__header">
                      <h3 className="card-panel__title">
                        <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>notification_important</span>
                        Productos con Stock Bajo
                      </h3>
                    </div>
                    <div className="table-responsive table-responsive--compact">
                      <table>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Mínimo</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStock.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>✅ Todos los productos están en rango óptimo</td></tr>
                          ) : (
                            lowStock.map(p => (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.name}</td>
                                <td style={{ color: 'var(--danger)', fontWeight: 700 }}>{p.stock}</td>
                                <td>{p.minStock}</td>
                                <td><span className="status-pill status-pill--danger"><span className="status-pill__dot"></span>Bajo</span></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÓN 2: MIS PRODUCTOS */}
            {activeSection === 'productos' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Mis Productos en Inventario</h1>
                    <p className="section-header__desc">Control de stock de los productos asignados a {empresa.name}. Vista de solo lectura.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      <span className="material-symbols-outlined" style={{ color: '#10b981' }}>inventory_2</span>
                      Productos Asignados
                      <span className="card-panel__badge">{myProducts.length} artículos</span>
                    </h3>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>P. Costo (₡)</th>
                          <th>P. Venta (₡)</th>
                          <th>Stock Actual</th>
                          <th>Stock Mínimo</th>
                          <th>Valor en Stock</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myProducts.map(p => {
                          let statusBadge = <span className="status-pill status-pill--ok"><span className="status-pill__dot"></span>Óptimo</span>
                          if (p.stock <= p.minStock) {
                            statusBadge = <span className="status-pill status-pill--danger"><span className="status-pill__dot"></span>Bajo Stock</span>
                          } else if (p.stock <= p.minStock * 1.5) {
                            statusBadge = <span className="status-pill status-pill--warning"><span className="status-pill__dot"></span>Preventivo</span>
                          }

                          return (
                            <tr key={p.id}>
                              <td style={{ fontWeight: 600 }}>{p.name}</td>
                              <td>{p.category}</td>
                              <td>{formatCRC(p.cost)}</td>
                              <td style={{ fontWeight: 600, color: '#fff' }}>{formatCRC(p.price)}</td>
                              <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.stock}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{p.minStock}</td>
                              <td style={{ fontWeight: 600, color: '#10b981' }}>{formatCRC(p.price * p.stock)}</td>
                              <td>{statusBadge}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÓN 3: INGRESOS Y EGRESOS */}
            {activeSection === 'movimientos' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Ingresos y Egresos</h1>
                    <p className="section-header__desc">Historial completo de movimientos de sus productos en el sistema principal.</p>
                  </div>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card kpi-card--emp-success">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Total Ingresos</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">arrow_downward</span></div>
                    </div>
                    <div className="kpi-card__value">+{totalEntradas}</div>
                    <div className="kpi-card__sub">Unidades ingresadas a bodega</div>
                  </div>
                  <div className="kpi-card kpi-card--emp-danger">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Total Egresos</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">arrow_upward</span></div>
                    </div>
                    <div className="kpi-card__value">-{totalSalidas}</div>
                    <div className="kpi-card__sub">Unidades despachadas</div>
                  </div>
                  <div className="kpi-card kpi-card--emp-info">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Movimientos Totales</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">receipt_long</span></div>
                    </div>
                    <div className="kpi-card__value">{myMovements.length}</div>
                    <div className="kpi-card__sub">Transacciones registradas</div>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      <span className="material-symbols-outlined" style={{ color: '#10b981' }}>history</span>
                      Historial de Movimientos
                    </h3>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha y Hora</th>
                          <th>Operación</th>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Stock Resultante</th>
                          <th>Motivo / Documento</th>
                          <th>Responsable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myMovements.length === 0 ? (
                          <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Sin movimientos registrados aún.</td></tr>
                        ) : (
                          myMovements.slice().reverse().map(m => (
                            <tr key={m.id}>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.date}</td>
                              <td><span className={`status-pill ${m.type === 'ENTRADA' ? 'status-pill--ok' : 'status-pill--danger'}`}>{m.type === 'ENTRADA' ? '📥 INGRESO' : '📤 EGRESO'}</span></td>
                              <td style={{ fontWeight: 600 }}>{m.productName}</td>
                              <td style={{ fontWeight: 700 }}>{m.type === 'ENTRADA' ? '+' : '-'}{m.quantity}</td>
                              <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{m.endStock}</td>
                              <td>{m.reason}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.user}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÓN 4: RECOMENDACIÓN DE PEDIDO */}
            {activeSection === 'recomendacion' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Recomendación de Pedido de Envío</h1>
                    <p className="section-header__desc">Productos que necesitan reposición. Sugerencia automática basada en stock mínimo.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>local_shipping</span>
                      Productos a Reabastecer
                      <span className="card-panel__badge">{needReorder.length} productos</span>
                    </h3>
                  </div>

                  {needReorder.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: '#10b981' }}>check_circle</span>
                      <p style={{ fontSize: '1rem', fontWeight: 600, color: '#34d399' }}>¡Todos sus productos tienen stock suficiente!</p>
                      <p style={{ fontSize: '0.84rem', marginTop: 6 }}>No se requiere envío de reposición por ahora.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Stock Actual</th>
                            <th>Stock Mínimo</th>
                            <th>Estado</th>
                            <th>Cant. Sugerida a Enviar</th>
                            <th>Costo Estimado (₡)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {needReorder.map(p => {
                            const suggestedQty = Math.max((p.minStock * 2) - p.stock, p.minStock)
                            const estimatedCost = suggestedQty * p.cost

                            let urgency = <span className="status-pill status-pill--warning"><span className="status-pill__dot"></span>Preventivo</span>
                            if (p.stock <= p.minStock) {
                              urgency = <span className="status-pill status-pill--danger"><span className="status-pill__dot"></span>Urgente</span>
                            }

                            return (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.name}</td>
                                <td>{p.category}</td>
                                <td style={{ fontWeight: 700, color: p.stock <= p.minStock ? '#f87171' : '#fbbf24' }}>{p.stock}</td>
                                <td>{p.minStock}</td>
                                <td>{urgency}</td>
                                <td style={{ fontWeight: 700, color: '#10b981', fontSize: '1rem' }}>+{suggestedQty} unids.</td>
                                <td style={{ fontWeight: 600 }}>{formatCRC(estimatedCost)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: 10, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6, color: '#38bdf8' }}>info</span>
                    <strong>Nota:</strong> Las cantidades sugeridas se calculan como <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>(stockMínimo × 2) - stockActual</code>. Contacte al administrador para coordinar el envío.
                  </div>
                </div>
              </section>
            )}

          </div>

          <footer className="footer">
            <div className="footer__left">
              <span className="footer__brand">InvControl CR © 2026</span>
              <span>•</span>
              <span>Portal de Empresas — Solo Lectura</span>
            </div>
            <div className="footer__right">
              <span style={{ color: '#10b981' }}>🔒 Conexión Segura</span>
              <span>•</span>
              <span>v2.4.0</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Empresa
