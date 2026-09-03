import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import db from '../../data/db.json'

// Keys para almacenamiento local sincronizado
const DB_KEYS = {
  PRODUCTS: 'controlinv_cr_products',
  MOVEMENTS: 'controlinv_cr_movements',
  SUPPLIERS: 'controlinv_cr_suppliers',
  ORDERS: 'controlinv_cr_orders',
  USERS: 'controlinv_cr_users',
  SOLICITUDES: 'controlinv_cr_solicitudes'
}

const today = new Date().toLocaleDateString('es-CR')

const CURRENT_USER = db.seedData.users.find(u => u.role === 'Administrador')?.name || 'Administrador'

const SEED_DATA = {
  products: db.seedData.products,
  suppliers: db.seedData.suppliers,
  users: db.seedData.users,
  movements: db.seedData.movements.map(m => ({
    ...m,
    date: m.id === 'm1' ? today + ' 10:30' : today + ' 11:15'
  })),
  orders: db.seedData.orders
}

function Admin() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Estados principales de datos
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [movements, setMovements] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [solicitudes, setSolicitudes] = useState([])

  // Filtros
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogCategory, setCatalogCategory] = useState('')
  const [movSearch, setMovSearch] = useState('')

  // Formulario Producto (crear / editar)
  const [prodForm, setProdForm] = useState({
    id: '',
    name: '',
    category: '',
    supplier: 'General',
    cost: '',
    price: '',
    stock: '',
    minStock: '10'
  })
  const [showProdForm, setShowProdForm] = useState(true)

  // Formulario Movimiento
  const [movForm, setMovForm] = useState({
    productId: '',
    type: 'ENTRADA',
    quantity: 1,
    reason: ''
  })

  // Formulario Proveedor
  const [supForm, setSupForm] = useState({
    name: '',
    phone: '',
    email: '',
    category: ''
  })

  // Formulario Orden
  const [orderForm, setOrderForm] = useState({
    supplier: '',
    productId: '',
    quantity: 20,
    cost: ''
  })

  // Formulario Usuario
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Administrador'
  })

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = (key, fallback) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : fallback
      } catch {
        return fallback
      }
    }

    const prods = loadData(DB_KEYS.PRODUCTS, SEED_DATA.products)
    const sups = loadData(DB_KEYS.SUPPLIERS, SEED_DATA.suppliers)
    const movs = loadData(DB_KEYS.MOVEMENTS, SEED_DATA.movements)
    const ords = loadData(DB_KEYS.ORDERS, SEED_DATA.orders)
    const usrs = loadData(DB_KEYS.USERS, SEED_DATA.users)
    const sols = loadData(DB_KEYS.SOLICITUDES, [])

    setProducts(prods)
    setSuppliers(sups)
    setMovements(movs)
    setOrders(ords)
    setUsers(usrs)
    setSolicitudes(sols)

    if (prods.length > 0) {
      setMovForm(prev => ({ ...prev, productId: prods[0].id }))
      setOrderForm(prev => ({ ...prev, productId: prods[0].id, cost: prods[0].cost }))
    }
    if (sups.length > 0) {
      setOrderForm(prev => ({ ...prev, supplier: sups[0].name }))
    }
  }, [])

  // Sincronizar en localStorage
  const saveProducts = (newProds) => {
    setProducts(newProds)
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(newProds))
  }
  const saveMovements = (newMovs) => {
    setMovements(newMovs)
    localStorage.setItem(DB_KEYS.MOVEMENTS, JSON.stringify(newMovs))
  }
  const saveSuppliers = (newSups) => {
    setSuppliers(newSups)
    localStorage.setItem(DB_KEYS.SUPPLIERS, JSON.stringify(newSups))
  }
  const saveOrders = (newOrds) => {
    setOrders(newOrds)
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(newOrds))
  }
  const saveUsers = (newUsrs) => {
    setUsers(newUsrs)
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(newUsrs))
  }
  const saveSolicitudes = (newSols) => {
    setSolicitudes(newSols)
    localStorage.setItem(DB_KEYS.SOLICITUDES, JSON.stringify(newSols))
  }

  const showNotification = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const formatCRC = (amount) => {
    return 'â‚¡' + Number(amount || 0).toLocaleString('es-CR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }

  // KPIs
  const totalProds = products.length
  const totalCost = products.reduce((acc, p) => acc + (p.cost * p.stock), 0)
  const totalSale = products.reduce((acc, p) => acc + (p.price * p.stock), 0)
  const lowStock = products.filter(p => p.stock <= p.minStock)

  // CategorÃ­as Ãºnicas
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean)

  // Acciones CatÃ¡logo
  const handleSaveProduct = (e) => {
    e.preventDefault()
    if (!prodForm.name || !prodForm.cost || !prodForm.price) {
      showNotification('error', 'Completa los campos obligatorios.')
      return
    }

    const costNum = parseFloat(prodForm.cost)
    const priceNum = parseFloat(prodForm.price)
    const stockNum = parseInt(prodForm.stock || 0, 10)
    const minNum = parseInt(prodForm.minStock || 5, 10)

    if (prodForm.id) {
      // Editar
      const updated = products.map(p => p.id === prodForm.id ? {
        ...p,
        name: prodForm.name,
        category: prodForm.category,
        supplier: prodForm.supplier,
        cost: costNum,
        price: priceNum,
        stock: stockNum,
        minStock: minNum
      } : p)
      saveProducts(updated)
      showNotification('success', `"${prodForm.name}" actualizado.`)
    } else {
      // Crear
      const newP = {
        id: 'p_' + Date.now().toString(36),
        name: prodForm.name,
        category: prodForm.category,
        supplier: prodForm.supplier,
        cost: costNum,
        price: priceNum,
        stock: stockNum,
        minStock: minNum
      }
      saveProducts([...products, newP])

      const newMov = {
        id: 'm_' + Date.now(),
        date: new Date().toLocaleDateString('es-CR') + ' ' + new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
        type: 'ENTRADA',
        productId: newP.id,
        productName: newP.name,
        quantity: newP.stock,
        endStock: newP.stock,
        reason: 'Ingreso inicial a catÃ¡logo',
        user: CURRENT_USER
      }
      saveMovements([...movements, newMov])
      showNotification('success', `Producto "${newP.name}" registrado en inventario.`)
    }

    setProdForm({ id: '', name: '', category: '', supplier: 'General', cost: '', price: '', stock: '', minStock: '10' })
  }

  const handleEditProduct = (p) => {
    setProdForm({
      id: p.id,
      name: p.name,
      category: p.category,
      supplier: p.supplier || 'General',
      cost: p.cost,
      price: p.price,
      stock: p.stock,
      minStock: p.minStock
    })
    setShowProdForm(true)
    showNotification('info', `Editando "${p.name}"`)
  }

  const handleDeleteProduct = (p) => {
    if (window.confirm(`Â¿Eliminar permanentemente "${p.name}"?`)) {
      saveProducts(products.filter(item => item.id !== p.id))
      showNotification('error', `"${p.name}" eliminado del catÃ¡logo.`)
    }
  }

  const handleQuickStock = (p, delta) => {
    if (delta < 0 && p.stock <= 0) {
      showNotification('error', 'Existencia actual en 0.')
      return
    }
    const newStock = p.stock + delta
    const updated = products.map(item => item.id === p.id ? { ...item, stock: newStock } : item)
    saveProducts(updated)

    const newMov = {
      id: 'm_' + Date.now(),
      date: new Date().toLocaleDateString('es-CR') + ' ' + new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      type: delta > 0 ? 'ENTRADA' : 'SALIDA',
      productId: p.id,
      productName: p.name,
      quantity: Math.abs(delta),
      endStock: newStock,
      reason: `Ajuste rÃ¡pido (${delta > 0 ? '+1' : '-1'})`,
      user: 'VÃ­ctor Admin'
    }
    saveMovements([...movements, newMov])
    showNotification(delta > 0 ? 'success' : 'info', `${delta > 0 ? '+1' : '-1'} unidad a ${p.name}`)
  }

  // Acciones Movimiento
  const handleSaveMovement = (e) => {
    e.preventDefault()
    const p = products.find(item => item.id === movForm.productId)
    if (!p) return

    const qty = parseInt(movForm.quantity, 10)
    if (movForm.type === 'SALIDA' && p.stock < qty) {
      showNotification('error', `Existencias insuficientes. Disponibles: ${p.stock}`)
      return
    }

    const newStock = movForm.type === 'ENTRADA' ? p.stock + qty : p.stock - qty
    saveProducts(products.map(item => item.id === p.id ? { ...item, stock: newStock } : item))

    const newMov = {
      id: 'm_' + Date.now(),
      date: new Date().toLocaleDateString('es-CR') + ' ' + new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      type: movForm.type,
      productId: p.id,
      productName: p.name,
      quantity: qty,
      endStock: newStock,
      reason: movForm.reason || 'Movimiento manual',
      user: 'VÃ­ctor Admin'
    }
    saveMovements([...movements, newMov])
    setMovForm(prev => ({ ...prev, quantity: 1, reason: '' }))
    showNotification('success', `OperaciÃ³n de ${movForm.type} registrada.`)
  }

  // Acciones Proveedor
  const handleSaveSupplier = (e) => {
    e.preventDefault()
    if (!supForm.name) return
    const newS = { id: 's_' + Date.now().toString(36), ...supForm }
    saveSuppliers([...suppliers, newS])
    setSupForm({ name: '', phone: '', email: '', category: '' })
    showNotification('success', `Proveedor "${newS.name}" registrado.`)
  }

  // Acciones Orden
  const handleSaveOrder = (e) => {
    e.preventDefault()
    const p = products.find(item => item.id === orderForm.productId)
    if (!p) return

    const qty = parseInt(orderForm.quantity, 10)
    const unitCost = parseFloat(orderForm.cost) || p.cost
    const newOrd = {
      id: 'OC-CR-' + (100 + orders.length + 1),
      supplier: orderForm.supplier || p.supplier || 'General',
      productId: p.id,
      productName: p.name,
      quantity: qty,
      unitCost,
      total: qty * unitCost,
      status: 'Pendiente'
    }
    saveOrders([...orders, newOrd])
    showNotification('success', `Orden de compra ${newOrd.id} emitida.`)
  }

  const handleReceiveOrder = (o) => {
    if (window.confirm(`Â¿Confirmar recepciÃ³n de ${o.quantity} unidades de "${o.productName}"?`)) {
      saveOrders(orders.map(item => item.id === o.id ? { ...item, status: 'Recibida' } : item))

      const p = products.find(item => item.id === o.productId)
      if (p) {
        const nextStock = p.stock + o.quantity
        saveProducts(products.map(item => item.id === p.id ? { ...item, stock: nextStock } : item))

        const newMov = {
          id: 'm_' + Date.now(),
          date: new Date().toLocaleDateString('es-CR') + ' ' + new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
          type: 'ENTRADA',
          productId: p.id,
          productName: p.name,
          quantity: o.quantity,
          endStock: nextStock,
          reason: `RecepciÃ³n Orden ${o.id} (${o.supplier})`,
          user: CURRENT_USER
        }
        saveMovements([...movements, newMov])
      }
      showNotification('success', `MercancÃ­a ingresada: +${o.quantity} unidades.`)
    }
  }

  // Acciones Usuario
  const handleSaveUser = (e) => {
    e.preventDefault()
    if (!userForm.name || !userForm.email) return
    const newU = { id: 'u_' + Date.now().toString(36), ...userForm, status: 'Activo' }
    saveUsers([...users, newU])
    setUserForm({ name: '', email: '', role: 'Administrador' })
    showNotification('success', `Usuario "${newU.name}" creado.`)
  }

  // Acciones Solicitudes
  const handleAprobarSolicitud = (sol) => {
    const msg = `InvControl CR â€” Acceso Empresarial\n\n` +
      `Estimado/a ${sol.nombreContacto},\n\n` +
      `Su solicitud para la empresa *${sol.nombreEmpresa}* ha sido *APROBADA*.\n\n` +
      `Puede acceder al sistema con las siguientes credenciales:\n\n` +
      `ðŸ”— URL: ${window.location.origin}/login\n` +
      `ðŸ“§ Correo: ${sol.emailContacto}\n` +
      `ðŸ”‘ ContraseÃ±a temporal: ${db.auth.tempPassword}\n\n` +
      `Le recomendamos cambiar su contraseÃ±a tras el primer inicio de sesiÃ³n.\n\n` +
      `â€” Equipo InvControl CR`

    const whatsappUrl = `https://wa.me/${sol.telefonoContacto.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`

    window.open(whatsappUrl, '_blank')

    saveSolicitudes(solicitudes.map(s => s.id === sol.id ? { ...s, estado: 'Aprobada' } : s))
    showNotification('success', `Solicitud de "${sol.nombreEmpresa}" aprobada. Mensaje enviado.`)
  }

  const handleRechazarSolicitud = (sol) => {
    if (window.confirm(`Â¿Rechazar la solicitud de "${sol.nombreEmpresa}"?`)) {
      saveSolicitudes(solicitudes.map(s => s.id === sol.id ? { ...s, estado: 'Rechazada' } : s))
      showNotification('error', `Solicitud de "${sol.nombreEmpresa}" rechazada.`)
    }
  }

  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente')

  return (
    <div className="cr-dashboard-app">
      {/* Toast Notifier */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast--${toast.type}`}>
            <span className="material-symbols-outlined">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="navbar">
        <div className="navbar__brand">
          <button className="navbar__mobile-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="navbar__logo">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">InvControl CR</span>
            <span className="navbar__brand-badge">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
              EdiciÃ³n Corporativa
            </span>
          </div>
        </div>

        <div className="navbar__center">
          <div className="cr-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>payments</span>
            <span>Moneda: Colones (CRC â‚¡)</span>
          </div>
        </div>

        <div className="navbar__actions">
          <button className="btn btn--secondary btn--sm" onClick={() => setActiveSection('movimientos')}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>swap_horiz</span>
            <span>Movimiento</span>
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => { setActiveSection('catalogo'); setShowProdForm(true) }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            <span>Nuevo Producto</span>
          </button>
          <div className="user-pill">
            <div className="user-pill__avatar">VG</div>
            <div className="user-pill__details">
              <span className="user-pill__name">{CURRENT_USER}</span>
              <span className="user-pill__role">En LÃ­nea</span>
            </div>
            <Link to="/login" className="btn-logout-link" title="Cerrar sesiÃ³n">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f87171' }}>logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* BODY CON SIDEBAR Y CONTENIDO */}
      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar__nav">
            <span className="nav-category">AnalÃ­tica & Control</span>
            <div className={`sidebar__item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveSection('dashboard'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard & KPIs</span>
            </div>
            <div className={`sidebar__item ${activeSection === 'catalogo' ? 'active' : ''}`} onClick={() => { setActiveSection('catalogo'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">shelves</span>
              <span>CatÃ¡logo y Existencias</span>
            </div>
            <div className={`sidebar__item ${activeSection === 'movimientos' ? 'active' : ''}`} onClick={() => { setActiveSection('movimientos'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">sync_alt</span>
              <span>Movimientos (Kardex)</span>
            </div>

            <span className="nav-category">Abastecimiento</span>
            <div className={`sidebar__item ${activeSection === 'proveedores' ? 'active' : ''}`} onClick={() => { setActiveSection('proveedores'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">factory</span>
              <span>Proveedores</span>
            </div>
            <div className={`sidebar__item ${activeSection === 'ordenes' ? 'active' : ''}`} onClick={() => { setActiveSection('ordenes'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">receipt_long</span>
              <span>Ã“rdenes de Compra</span>
            </div>

            <span className="nav-category">AdministraciÃ³n</span>
            <div className={`sidebar__item ${activeSection === 'solicitudes' ? 'active' : ''}`} onClick={() => { setActiveSection('solicitudes'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">mail</span>
              <span>Solicitudes</span>
              {pendientes.length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>
                  {pendientes.length}
                </span>
              )}
            </div>
            <div className={`sidebar__item ${activeSection === 'usuarios' ? 'active' : ''}`} onClick={() => { setActiveSection('usuarios'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">manage_accounts</span>
              <span>Usuarios y Ajustes</span>
            </div>
          </nav>
        </aside>

        <main className="main-scroll">
          <div className="content-area">

            {/* SECCIÃ“N 1: DASHBOARD */}
            {activeSection === 'dashboard' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Panel de Control Gerencial</h1>
                    <p className="section-header__desc">Resumen analÃ­tico valorizado en Colones Costarricenses (â‚¡).</p>
                  </div>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card kpi-card--primary">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Total ArtÃ­culos</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">category</span></div>
                    </div>
                    <div className="kpi-card__value">{totalProds}</div>
                    <div className="kpi-card__sub">En catÃ¡logo activo</div>
                  </div>

                  <div className="kpi-card kpi-card--success">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">ValuaciÃ³n Costo (â‚¡)</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">account_balance_wallet</span></div>
                    </div>
                    <div className="kpi-card__value">{formatCRC(totalCost)}</div>
                    <div className="kpi-card__sub">InversiÃ³n actual en bodega</div>
                  </div>

                  <div className="kpi-card kpi-card--info">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Valor Proyectado Venta</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">trending_up</span></div>
                    </div>
                    <div className="kpi-card__value">{formatCRC(totalSale)}</div>
                    <div className="kpi-card__sub">Margen comercial bruto</div>
                  </div>

                  <div className="kpi-card kpi-card--danger">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Bajo Stock CrÃ­tico</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">warning</span></div>
                    </div>
                    <div className="kpi-card__value">{lowStock.length}</div>
                    <div className="kpi-card__sub">Productos que requieren reposiciÃ³n</div>
                  </div>
                </div>

                <div className="dash-tables-grid">
                  <div className="card-panel">
                    <div className="card-panel__header">
                      <h3 className="card-panel__title">
                        <span className="material-symbols-outlined" style={{ color: 'var(--danger)' }}>notification_important</span>
                        Alertas de Reabastecimiento
                      </h3>
                    </div>
                    <div className="table-responsive table-responsive--compact">
                      <table>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Existencia</th>
                            <th>MÃ­nimo</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStock.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>âœ… Existencias en rangos Ã³ptimos</td></tr>
                          ) : (
                            lowStock.slice(0, 5).map(p => (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.name}</td>
                                <td style={{ color: 'var(--danger)', fontWeight: 700 }}>{p.stock}</td>
                                <td>{p.minStock}</td>
                                <td><span className="status-pill status-pill--danger"><span className="status-pill__dot"></span>Reordenar</span></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card-panel">
                    <div className="card-panel__header">
                      <h3 className="card-panel__title">
                        <span className="material-symbols-outlined" style={{ color: 'var(--accent)' }}>history</span>
                        Ãšltimos Movimientos en Kardex
                      </h3>
                    </div>
                    <div className="table-responsive table-responsive--compact">
                      <table>
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movements.slice(-5).reverse().map(m => (
                            <tr key={m.id}>
                              <td>
                                <span className={`status-pill ${m.type === 'ENTRADA' ? 'status-pill--ok' : 'status-pill--warning'}`}>
                                  {m.type}
                                </span>
                              </td>
                              <td style={{ fontWeight: 600 }}>{m.productName}</td>
                              <td>{m.type === 'ENTRADA' ? '+' : '-'}{m.quantity}</td>
                              <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.date.split(' ')[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÃ“N 2: CATÃLOGO */}
            {activeSection === 'catalogo' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">CatÃ¡logo y Control de Existencias</h1>
                    <p className="section-header__desc">GestiÃ³n integral de productos, costos, precios de venta y control de stock.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>add_circle</span>
                      {prodForm.id ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                    </h3>
                    <button className="btn btn--secondary btn--sm" onClick={() => setShowProdForm(!showProdForm)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{showProdForm ? 'unfold_less' : 'unfold_more'}</span>
                      {showProdForm ? 'Ocultar' : 'Expandir'}
                    </button>
                  </div>

                  {showProdForm && (
                    <form onSubmit={handleSaveProduct}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Nombre del Producto</label>
                          <input type="text" className="form-control" placeholder="Ej. CafÃ© TarrazÃº 500g" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>CategorÃ­a</label>
                          <input type="text" className="form-control" placeholder="Ej. CafÃ©, Granos, Bebidas" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Proveedor Asignado</label>
                          <select className="form-control" value={prodForm.supplier} onChange={e => setProdForm({ ...prodForm, supplier: e.target.value })}>
                            <option value="General">Proveedor General</option>
                            {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Precio Costo (â‚¡ CRC)</label>
                          <input type="number" className="form-control" placeholder="â‚¡0" value={prodForm.cost} onChange={e => setProdForm({ ...prodForm, cost: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Precio Venta (â‚¡ CRC)</label>
                          <input type="number" className="form-control" placeholder="â‚¡0" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Stock Inicial</label>
                          <input type="number" className="form-control" placeholder="0" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Stock MÃ­nimo (Alerta)</label>
                          <input type="number" className="form-control" placeholder="10" value={prodForm.minStock} onChange={e => setProdForm({ ...prodForm, minStock: e.target.value })} required />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <button type="button" className="btn btn--secondary" onClick={() => setProdForm({ id: '', name: '', category: '', supplier: 'General', cost: '', price: '', stock: '', minStock: '10' })}>
                          Limpiar
                        </button>
                        <button type="submit" className="btn btn--primary">
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                          Guardar Producto
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      Inventario en AlmacÃ©n
                      <span className="card-panel__badge">{products.length} artÃ­culos</span>
                    </h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <input type="text" className="form-control" placeholder="Buscar producto o categorÃ­a..." style={{ width: 220 }} value={catalogSearch} onChange={e => setCatalogSearch(e.target.value)} />
                      <select className="form-control" value={catalogCategory} onChange={e => setCatalogCategory(e.target.value)}>
                        <option value="">Todas las categorÃ­as</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>CategorÃ­a</th>
                          <th>Proveedor</th>
                          <th>P. Costo (â‚¡)</th>
                          <th>P. Venta (â‚¡)</th>
                          <th>Stock</th>
                          <th>MÃ­nimo</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products
                          .filter(p => (
                            p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                            p.category.toLowerCase().includes(catalogSearch.toLowerCase())
                          ) && (catalogCategory ? p.category === catalogCategory : true))
                          .map(p => {
                            let statusBadge = <span className="status-pill status-pill--ok"><span className="status-pill__dot"></span>Ã“ptimo</span>
                            if (p.stock <= p.minStock) {
                              statusBadge = <span className="status-pill status-pill--danger"><span className="status-pill__dot"></span>Bajo Stock</span>
                            } else if (p.stock <= p.minStock * 1.5) {
                              statusBadge = <span className="status-pill status-pill--warning"><span className="status-pill__dot"></span>Preventivo</span>
                            }

                            return (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.name}</td>
                                <td>{p.category}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.supplier || 'General'}</td>
                                <td>{formatCRC(p.cost)}</td>
                                <td style={{ fontWeight: 600, color: '#fff' }}>{formatCRC(p.price)}</td>
                                <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.stock}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{p.minStock}</td>
                                <td>{statusBadge}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn btn--sm btn--success btn--icon" title="Sumar Stock" onClick={() => handleQuickStock(p, 1)}>
                                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
                                    </button>
                                    <button className="btn btn--sm btn--secondary btn--icon" title="Restar Stock" onClick={() => handleQuickStock(p, -1)}>
                                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>remove</span>
                                    </button>
                                    <button className="btn btn--sm btn--secondary btn--icon" title="Editar" onClick={() => handleEditProduct(p)}>
                                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                                    </button>
                                    <button className="btn btn--sm btn--danger btn--icon" title="Eliminar" onClick={() => handleDeleteProduct(p)}>
                                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÃ“N 3: MOVIMIENTOS */}
            {activeSection === 'movimientos' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Kardex de Movimientos</h1>
                    <p className="section-header__desc">BitÃ¡cora oficial de entradas, salidas, mermas y ajustes de inventario.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>input</span>
                      Registrar OperaciÃ³n Manual
                    </h3>
                  </div>
                  <form onSubmit={handleSaveMovement}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>ArtÃ­culo</label>
                        <select className="form-control" value={movForm.productId} onChange={e => setMovForm({ ...movForm, productId: e.target.value })}>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Naturaleza del Movimiento</label>
                        <select className="form-control" value={movForm.type} onChange={e => setMovForm({ ...movForm, type: e.target.value })}>
                          <option value="ENTRADA">ðŸŸ¢ Entrada (Compra / ReposiciÃ³n)</option>
                          <option value="SALIDA">ðŸ”´ Salida (Venta / Merma)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Cantidad de Unidades</label>
                        <input type="number" className="form-control" min="1" value={movForm.quantity} onChange={e => setMovForm({ ...movForm, quantity: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Detalle / Documento Soporte</label>
                        <input type="text" className="form-control" placeholder="Ej. Factura #402, Venta en mostrador" value={movForm.reason} onChange={e => setMovForm({ ...movForm, reason: e.target.value })} required />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn--primary">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>post_add</span>
                        Asentar en Kardex
                      </button>
                    </div>
                  </form>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">Historial de Transacciones</h3>
                    <input type="text" className="form-control" placeholder="Filtrar movimientos..." style={{ width: 220 }} value={movSearch} onChange={e => setMovSearch(e.target.value)} />
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha & Hora</th>
                          <th>OperaciÃ³n</th>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Stock Resultante</th>
                          <th>Motivo / Factura</th>
                          <th>Responsable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movements
                          .filter(m => m.productName.toLowerCase().includes(movSearch.toLowerCase()) || m.reason.toLowerCase().includes(movSearch.toLowerCase()))
                          .slice().reverse().map(m => (
                            <tr key={m.id}>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.date}</td>
                              <td><span className={`status-pill ${m.type === 'ENTRADA' ? 'status-pill--ok' : 'status-pill--danger'}`}>{m.type}</span></td>
                              <td style={{ fontWeight: 600 }}>{m.productName}</td>
                              <td style={{ fontWeight: 700 }}>{m.type === 'ENTRADA' ? '+' : '-'}{m.quantity}</td>
                              <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{m.endStock}</td>
                              <td>{m.reason}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.user}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÃ“N 4: PROVEEDORES */}
            {activeSection === 'proveedores' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Directorio de Proveedores</h1>
                    <p className="section-header__desc">Empresas suplidoras y aliados comerciales locales.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">Registrar Proveedor</h3>
                  </div>
                  <form onSubmit={handleSaveSupplier}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>RazÃ³n Social</label>
                        <input type="text" className="form-control" placeholder="Ej. Distribuidora El Valle S.A." value={supForm.name} onChange={e => setSupForm({ ...supForm, name: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>TelÃ©fono</label>
                        <input type="text" className="form-control" placeholder="Ej. +(506) 2234-5678" value={supForm.phone} onChange={e => setSupForm({ ...supForm, phone: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Correo ElectrÃ³nico</label>
                        <input type="email" className="form-control" placeholder="ventas@proveedorcr.com" value={supForm.email} onChange={e => setSupForm({ ...supForm, email: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>LÃ­nea / Rubro</label>
                        <input type="text" className="form-control" placeholder="Ej. Abarrotes, CafÃ©, Empaques" value={supForm.category} onChange={e => setSupForm({ ...supForm, category: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn--primary">Guardar Proveedor</button>
                    </div>
                  </form>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">Proveedores Vinculados</h3>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Proveedor</th>
                          <th>Contacto</th>
                          <th>Correo</th>
                          <th>LÃ­nea</th>
                          <th>AcciÃ³n</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map(s => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td style={{ color: 'var(--accent)' }}>{s.phone}</td>
                            <td>{s.email}</td>
                            <td><span className="status-pill status-pill--info">{s.category}</span></td>
                            <td>
                              <button className="btn btn--sm btn--danger btn--icon" onClick={() => saveSuppliers(suppliers.filter(x => x.id !== s.id))}>
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÃ“N 5: Ã“RDENES DE COMPRA */}
            {activeSection === 'ordenes' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">GestiÃ³n de Ã“rdenes de Compra</h1>
                    <p className="section-header__desc">EmisiÃ³n de pedidos y recepciÃ³n con incremento automÃ¡tico de existencias.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">Emitir Orden de Compra</h3>
                  </div>
                  <form onSubmit={handleSaveOrder}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Proveedor</label>
                        <select className="form-control" value={orderForm.supplier} onChange={e => setOrderForm({ ...orderForm, supplier: e.target.value })}>
                          {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Producto a Requerir</label>
                        <select className="form-control" value={orderForm.productId} onChange={e => {
                          const p = products.find(x => x.id === e.target.value)
                          setOrderForm({ ...orderForm, productId: e.target.value, cost: p ? p.cost : '' })
                        }}>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Cantidad</label>
                        <input type="number" className="form-control" min="1" value={orderForm.quantity} onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Costo Pactado Unitario (â‚¡)</label>
                        <input type="number" className="form-control" value={orderForm.cost} onChange={e => setOrderForm({ ...orderForm, cost: e.target.value })} required />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn--primary">Generar Orden</button>
                    </div>
                  </form>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">Seguimiento de Pedidos</h3>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Folio</th>
                          <th>Proveedor</th>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Total (â‚¡)</th>
                          <th>Estado</th>
                          <th>RecepciÃ³n</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id}>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.id}</td>
                            <td>{o.supplier}</td>
                            <td style={{ fontWeight: 600 }}>{o.productName}</td>
                            <td>{o.quantity} unids</td>
                            <td style={{ fontWeight: 700, color: '#fff' }}>{formatCRC(o.total)}</td>
                            <td>
                              <span className={`status-pill ${o.status === 'Pendiente' ? 'status-pill--warning' : 'status-pill--ok'}`}>
                                <span className="status-pill__dot"></span>{o.status}
                              </span>
                            </td>
                            <td>
                              {o.status === 'Pendiente' ? (
                                <button className="btn btn--sm btn--success" onClick={() => handleReceiveOrder(o)}>
                                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>inventory</span>
                                  Ingresar a Bodega
                                </button>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Completada</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SECCIÃ“N 6: SOLICITUDES DE ACCESO */}
            {activeSection === 'solicitudes' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Solicitudes de Acceso Empresarial</h1>
                    <p className="section-header__desc">Solicitudes enviadas desde la pÃ¡gina de inicio. Aprueba para enviar credenciales por WhatsApp.</p>
                  </div>
                </div>

                <div className="kpi-grid" style={{ marginBottom: 24 }}>
                  <div className="kpi-card kpi-card--primary">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Total Solicitudes</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">mail</span></div>
                    </div>
                    <div className="kpi-card__value">{solicitudes.length}</div>
                    <div className="kpi-card__sub">Recibidas</div>
                  </div>
                  <div className="kpi-card kpi-card--info">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Pendientes</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">pending</span></div>
                    </div>
                    <div className="kpi-card__value">{pendientes.length}</div>
                    <div className="kpi-card__sub">Requieren revisiÃ³n</div>
                  </div>
                  <div className="kpi-card kpi-card--success">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Aprobadas</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">check_circle</span></div>
                    </div>
                    <div className="kpi-card__value">{solicitudes.filter(s => s.estado === 'Aprobada').length}</div>
                    <div className="kpi-card__sub">Accesos otorgados</div>
                  </div>
                  <div className="kpi-card kpi-card--danger">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Rechazadas</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">cancel</span></div>
                    </div>
                    <div className="kpi-card__value">{solicitudes.filter(s => s.estado === 'Rechazada').length}</div>
                    <div className="kpi-card__sub">Denegadas</div>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>inbox</span>
                      Solicitudes Recibidas
                      {pendientes.length > 0 && <span className="card-panel__badge" style={{ background: 'var(--danger-subtle)', color: '#f87171', border: 'none' }}>{pendientes.length} pendientes</span>}
                    </h3>
                  </div>

                  {solicitudes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12, opacity: 0.4 }}>inbox</span>
                      No hay solicitudes todavÃ­a. Las solicitudes aparecerÃ¡n aquÃ­ cuando una empresa llene el formulario de la pÃ¡gina de inicio.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Empresa</th>
                            <th>Contacto</th>
                            <th>Correo</th>
                            <th>TelÃ©fono</th>
                            <th>Giro</th>
                            <th>TamaÃ±o</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solicitudes.slice().reverse().map(sol => (
                            <tr key={sol.id}>
                              <td style={{ fontWeight: 700, color: '#fff' }}>{sol.nombreEmpresa}</td>
                              <td style={{ fontWeight: 600 }}>{sol.nombreContacto}</td>
                              <td style={{ color: 'var(--accent)', fontSize: '0.82rem' }}>{sol.emailContacto}</td>
                              <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{sol.telefonoContacto}</td>
                              <td><span className="status-pill status-pill--info">{sol.giroEmpresa || 'â€”'}</span></td>
                              <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{sol.tamanoEmpresa || 'â€”'}</td>
                              <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sol.fecha}</td>
                              <td>
                                <span className={`status-pill ${sol.estado === 'Pendiente' ? 'status-pill--warning' : sol.estado === 'Aprobada' ? 'status-pill--ok' : 'status-pill--danger'}`}>
                                  <span className="status-pill__dot"></span>{sol.estado}
                                </span>
                              </td>
                              <td>
                                {sol.estado === 'Pendiente' ? (
                                  <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn btn--sm btn--success" title="Aprobar y enviar WhatsApp" onClick={() => handleAprobarSolicitud(sol)}>
                                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check</span>
                                      Aprobar
                                    </button>
                                    <button className="btn btn--sm btn--danger btn--icon" title="Rechazar" onClick={() => handleRechazarSolicitud(sol)}>
                                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
                                    </button>
                                  </div>
                                ) : sol.estado === 'Aprobada' ? (
                                  <button className="btn btn--sm btn--secondary" title="Reenviar WhatsApp" onClick={() => handleAprobarSolicitud(sol)}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>chat</span>
                                    Reenviar
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>â€”</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {solicitudes.some(sol => sol.mensaje) && (
                  <div className="card-panel">
                    <div className="card-panel__header">
                      <h3 className="card-panel__title">
                        <span className="material-symbols-outlined" style={{ color: 'var(--warning)' }}>comment</span>
                        Mensajes Adicionales
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {solicitudes.filter(sol => sol.mensaje).reverse().map(sol => (
                        <div key={sol.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '14px 18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{sol.nombreEmpresa}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sol.fecha}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>"{sol.mensaje}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* SECCIÃ“N 7: USUARIOS Y AJUSTES */}
            {activeSection === 'usuarios' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">ConfiguraciÃ³n y Usuarios</h1>
                    <p className="section-header__desc">Control de acceso del personal y resguardo de la informaciÃ³n.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">Dar de Alta Colaborador</h3>
                  </div>
                  <form onSubmit={handleSaveUser}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" className="form-control" placeholder="Ej. VÃ­ctor GonzÃ¡lez" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Correo ElectrÃ³nico</label>
                        <input type="email" className="form-control" placeholder="contacto.victorgonzalez0@gmail.com" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Rol</label>
                        <select className="form-control" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                          <option value="Administrador">Administrador del Sistema</option>
                          <option value="Jefe de Bodega">Jefe de Bodega / AlmacÃ©n</option>
                          <option value="Ventas">Cajero / Mostrador</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn--primary">Crear Usuario</button>
                    </div>
                  </form>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">Colaboradores con Acceso</h3>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Correo</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>AcciÃ³n</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                            <td>{u.email}</td>
                            <td><span className="status-pill status-pill--info">{u.role}</span></td>
                            <td><span className="status-pill status-pill--ok"><span className="status-pill__dot"></span>{u.status}</span></td>
                            <td>
                              <button className="btn btn--sm btn--danger btn--icon" onClick={() => saveUsers(users.filter(x => x.id !== u.id))}>
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

          </div>

          <footer className="footer">
            <div className="footer__left">
              <span className="footer__brand">InvControl CR Â© 2026</span>
              <span>â€¢</span>
              <span>Control de Inventario Empresarial</span>
            </div>
            <div className="footer__links">
              <span>ðŸ”’ Almacenamiento Local Cifrado</span>
              <span>â€¢</span>
              <span>San JosÃ©, Costa Rica</span>
            </div>
            <div className="footer__right">
              <span>VersiÃ³n 2.4.0-PRO</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Admin
