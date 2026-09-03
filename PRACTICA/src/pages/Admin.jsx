import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Keys para almacenamiento local sincronizado
const DB_KEYS = {
  PRODUCTS: 'controlinv_cr_products',
  MOVEMENTS: 'controlinv_cr_movements',
  SUPPLIERS: 'controlinv_cr_suppliers',
  ORDERS: 'controlinv_cr_orders',
  USERS: 'controlinv_cr_users'
}

const SEED_DATA = {
  products: [
    { id: 'p1', name: 'Café Grano Tarrazú 500g', category: 'Café y Té', supplier: 'Cooperativa CoopeTarrazú RL', cost: 3500, price: 5200, stock: 45, minStock: 15 },
    { id: 'p2', name: 'Salsa Lizano Original 700ml', category: 'Condimentos', supplier: 'Distribuidora Monteverde', cost: 1850, price: 2600, stock: 8, minStock: 12 },
    { id: 'p3', name: 'Arroz Tío Pelón 99% Grano Entero 1.8kg', category: 'Granos Básicos', supplier: 'Distribuidora Monteverde', cost: 2100, price: 2950, stock: 4, minStock: 10 },
    { id: 'p4', name: 'Queso Turrialba Artesanal 1kg', category: 'Lácteos', supplier: 'Lácteos del Volcán', cost: 4200, price: 5800, stock: 18, minStock: 6 }
  ],
  suppliers: [
    { id: 's1', name: 'Cooperativa CoopeTarrazú RL', phone: '+(506) 2544-0000', email: 'ventas@coopetarrazu.cr', category: 'Café y Granos' },
    { id: 's2', name: 'Distribuidora Monteverde', phone: '+(506) 2221-8899', email: 'pedidos@monteverde.cr', category: 'Abarrotes y Condimentos' },
    { id: 's3', name: 'Lácteos del Volcán', phone: '+(506) 2553-4411', email: 'contacto@lacteosvolcan.cr', category: 'Lácteos' }
  ],
  users: [
    { id: 'u1', name: 'Víctor Admin', email: 'contacto.victorgonzalez0@gmail.com', role: 'Administrador', status: 'Activo' },
    { id: 'u2', name: 'Aaron Caleb Rivera', email: 'aaron@empresa.cr', role: 'Jefe de Bodega', status: 'Activo' }
  ],
  movements: [
    { id: 'm1', date: new Date().toLocaleDateString('es-CR') + ' 10:30', type: 'ENTRADA', productId: 'p1', productName: 'Café Grano Tarrazú 500g', quantity: 30, endStock: 45, reason: 'Ingreso inicial a bodega', user: 'Víctor Admin' },
    { id: 'm2', date: new Date().toLocaleDateString('es-CR') + ' 11:15', type: 'SALIDA', productId: 'p3', productName: 'Arroz Tío Pelón 99% 1.8kg', quantity: 6, endStock: 4, reason: 'Despacho Factura #00124', user: 'Aaron Caleb Rivera' }
  ],
  orders: [
    { id: 'OC-CR-101', supplier: 'Distribuidora Monteverde', productId: 'p2', productName: 'Salsa Lizano Original 700ml', quantity: 24, unitCost: 1850, total: 44400, status: 'Pendiente' }
  ]
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

    setProducts(prods)
    setSuppliers(sups)
    setMovements(movs)
    setOrders(ords)
    setUsers(usrs)

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

  const showNotification = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const formatCRC = (amount) => {
    return '₡' + Number(amount || 0).toLocaleString('es-CR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }

  // KPIs
  const totalProds = products.length
  const totalCost = products.reduce((acc, p) => acc + (p.cost * p.stock), 0)
  const totalSale = products.reduce((acc, p) => acc + (p.price * p.stock), 0)
  const lowStock = products.filter(p => p.stock <= p.minStock)

  // Categorías únicas
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean)

  // Acciones Catálogo
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
        reason: 'Ingreso inicial a catálogo',
        user: 'Víctor Admin'
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
    if (window.confirm(`¿Eliminar permanentemente "${p.name}"?`)) {
      saveProducts(products.filter(item => item.id !== p.id))
      showNotification('error', `"${p.name}" eliminado del catálogo.`)
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
      reason: `Ajuste rápido (${delta > 0 ? '+1' : '-1'})`,
      user: 'Víctor Admin'
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
      user: 'Víctor Admin'
    }
    saveMovements([...movements, newMov])
    setMovForm(prev => ({ ...prev, quantity: 1, reason: '' }))
    showNotification('success', `Operación de ${movForm.type} registrada.`)
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
    if (window.confirm(`¿Confirmar recepción de ${o.quantity} unidades de "${o.productName}"?`)) {
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
          reason: `Recepción Orden ${o.id} (${o.supplier})`,
          user: 'Víctor Admin'
        }
        saveMovements([...movements, newMov])
      }
      showNotification('success', `Mercancía ingresada: +${o.quantity} unidades.`)
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
              Edición Corporativa
            </span>
          </div>
        </div>

        <div className="navbar__center">
          <div className="cr-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>payments</span>
            <span>Moneda: Colones (CRC ₡)</span>
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
              <span className="user-pill__name">Víctor Admin</span>
              <span className="user-pill__role">En Línea</span>
            </div>
            <Link to="/" className="btn-logout-link" title="Cerrar sesión">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#f87171' }}>logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* BODY CON SIDEBAR Y CONTENIDO */}
      <div className="app-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar__nav">
            <span className="nav-category">Analítica & Control</span>
            <div className={`sidebar__item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveSection('dashboard'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard & KPIs</span>
            </div>
            <div className={`sidebar__item ${activeSection === 'catalogo' ? 'active' : ''}`} onClick={() => { setActiveSection('catalogo'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">shelves</span>
              <span>Catálogo y Existencias</span>
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
              <span>Órdenes de Compra</span>
            </div>

            <span className="nav-category">Administración</span>
            <div className={`sidebar__item ${activeSection === 'usuarios' ? 'active' : ''}`} onClick={() => { setActiveSection('usuarios'); setSidebarOpen(false) }}>
              <span className="material-symbols-outlined">manage_accounts</span>
              <span>Usuarios y Ajustes</span>
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
                    <h1 className="section-header__title">Panel de Control Gerencial</h1>
                    <p className="section-header__desc">Resumen analítico valorizado en Colones Costarricenses (₡).</p>
                  </div>
                </div>

                <div className="kpi-grid">
                  <div className="kpi-card kpi-card--primary">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Total Artículos</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">category</span></div>
                    </div>
                    <div className="kpi-card__value">{totalProds}</div>
                    <div className="kpi-card__sub">En catálogo activo</div>
                  </div>

                  <div className="kpi-card kpi-card--success">
                    <div className="kpi-card__top">
                      <span className="kpi-card__label">Valuación Costo (₡)</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">account_balance_wallet</span></div>
                    </div>
                    <div className="kpi-card__value">{formatCRC(totalCost)}</div>
                    <div className="kpi-card__sub">Inversión actual en bodega</div>
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
                      <span className="kpi-card__label">Bajo Stock Crítico</span>
                      <div className="kpi-card__icon-box"><span className="material-symbols-outlined">warning</span></div>
                    </div>
                    <div className="kpi-card__value">{lowStock.length}</div>
                    <div className="kpi-card__sub">Productos que requieren reposición</div>
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
                            <th>Mínimo</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStock.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>✅ Existencias en rangos óptimos</td></tr>
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
                        Últimos Movimientos en Kardex
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

            {/* SECCIÓN 2: CATÁLOGO */}
            {activeSection === 'catalogo' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Catálogo y Control de Existencias</h1>
                    <p className="section-header__desc">Gestión integral de productos, costos, precios de venta y control de stock.</p>
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
                          <input type="text" className="form-control" placeholder="Ej. Café Tarrazú 500g" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Categoría</label>
                          <input type="text" className="form-control" placeholder="Ej. Café, Granos, Bebidas" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Proveedor Asignado</label>
                          <select className="form-control" value={prodForm.supplier} onChange={e => setProdForm({ ...prodForm, supplier: e.target.value })}>
                            <option value="General">Proveedor General</option>
                            {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Precio Costo (₡ CRC)</label>
                          <input type="number" className="form-control" placeholder="₡0" value={prodForm.cost} onChange={e => setProdForm({ ...prodForm, cost: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Precio Venta (₡ CRC)</label>
                          <input type="number" className="form-control" placeholder="₡0" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Stock Inicial</label>
                          <input type="number" className="form-control" placeholder="0" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label>Stock Mínimo (Alerta)</label>
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
                      Inventario en Almacén
                      <span className="card-panel__badge">{products.length} artículos</span>
                    </h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <input type="text" className="form-control" placeholder="Buscar producto o categoría..." style={{ width: 220 }} value={catalogSearch} onChange={e => setCatalogSearch(e.target.value)} />
                      <select className="form-control" value={catalogCategory} onChange={e => setCatalogCategory(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>Proveedor</th>
                          <th>P. Costo (₡)</th>
                          <th>P. Venta (₡)</th>
                          <th>Stock</th>
                          <th>Mínimo</th>
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

            {/* SECCIÓN 3: MOVIMIENTOS */}
            {activeSection === 'movimientos' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Kardex de Movimientos</h1>
                    <p className="section-header__desc">Bitácora oficial de entradas, salidas, mermas y ajustes de inventario.</p>
                  </div>
                </div>

                <div className="card-panel">
                  <div className="card-panel__header">
                    <h3 className="card-panel__title">
                      <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>input</span>
                      Registrar Operación Manual
                    </h3>
                  </div>
                  <form onSubmit={handleSaveMovement}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Artículo</label>
                        <select className="form-control" value={movForm.productId} onChange={e => setMovForm({ ...movForm, productId: e.target.value })}>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Naturaleza del Movimiento</label>
                        <select className="form-control" value={movForm.type} onChange={e => setMovForm({ ...movForm, type: e.target.value })}>
                          <option value="ENTRADA">🟢 Entrada (Compra / Reposición)</option>
                          <option value="SALIDA">🔴 Salida (Venta / Merma)</option>
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
                          <th>Operación</th>
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

            {/* SECCIÓN 4: PROVEEDORES */}
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
                        <label>Razón Social</label>
                        <input type="text" className="form-control" placeholder="Ej. Distribuidora El Valle S.A." value={supForm.name} onChange={e => setSupForm({ ...supForm, name: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Teléfono</label>
                        <input type="text" className="form-control" placeholder="Ej. +(506) 2234-5678" value={supForm.phone} onChange={e => setSupForm({ ...supForm, phone: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email" className="form-control" placeholder="ventas@proveedorcr.com" value={supForm.email} onChange={e => setSupForm({ ...supForm, email: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Línea / Rubro</label>
                        <input type="text" className="form-control" placeholder="Ej. Abarrotes, Café, Empaques" value={supForm.category} onChange={e => setSupForm({ ...supForm, category: e.target.value })} />
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
                          <th>Línea</th>
                          <th>Acción</th>
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

            {/* SECCIÓN 5: ÓRDENES DE COMPRA */}
            {activeSection === 'ordenes' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Gestión de Órdenes de Compra</h1>
                    <p className="section-header__desc">Emisión de pedidos y recepción con incremento automático de existencias.</p>
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
                        <label>Costo Pactado Unitario (₡)</label>
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
                          <th>Total (₡)</th>
                          <th>Estado</th>
                          <th>Recepción</th>
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

            {/* SECCIÓN 6: USUARIOS Y AJUSTES */}
            {activeSection === 'usuarios' && (
              <section className="view-section active">
                <div className="section-header">
                  <div>
                    <h1 className="section-header__title">Configuración y Usuarios</h1>
                    <p className="section-header__desc">Control de acceso del personal y resguardo de la información.</p>
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
                        <input type="text" className="form-control" placeholder="Ej. Víctor González" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email" className="form-control" placeholder="contacto.victorgonzalez0@gmail.com" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Rol</label>
                        <select className="form-control" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                          <option value="Administrador">Administrador del Sistema</option>
                          <option value="Jefe de Bodega">Jefe de Bodega / Almacén</option>
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
                          <th>Acción</th>
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
              <span className="footer__brand">InvControl CR © 2026</span>
              <span>•</span>
              <span>Control de Inventario Empresarial</span>
            </div>
            <div className="footer__links">
              <span>🔒 Almacenamiento Local Cifrado</span>
              <span>•</span>
              <span>San José, Costa Rica</span>
            </div>
            <div className="footer__right">
              <span>Versión 2.4.0-PRO</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Admin
