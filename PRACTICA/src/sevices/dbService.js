/**
 * dbService.js — Capa de servicio que simula un backend
 * Lee datos iniciales de db.json e interactúa con localStorage como "base de datos"
 */
import seedData from './db.json'

const DB_KEYS = {
  PRODUCTS: 'controlinv_cr_products',
  MOVEMENTS: 'controlinv_cr_movements',
  SUPPLIERS: 'controlinv_cr_suppliers',
  ORDERS: 'controlinv_cr_orders',
  USERS: 'controlinv_cr_users'
}

// ─── Inicializar localStorage desde db.json si no existe data previa ───
function initDB() {
  Object.entries({
    [DB_KEYS.PRODUCTS]: seedData.products,
    [DB_KEYS.MOVEMENTS]: seedData.movements,
    [DB_KEYS.SUPPLIERS]: seedData.suppliers,
    [DB_KEYS.ORDERS]: seedData.orders,
    [DB_KEYS.USERS]: seedData.users
  }).forEach(([key, fallback]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(fallback))
    }
  })
}

// ─── Lectura genérica ───
function getData(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ─── Escritura genérica ───
function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ─── API pública para cada entidad ───
export const productService = {
  getAll: () => getData(DB_KEYS.PRODUCTS),
  save: (products) => setData(DB_KEYS.PRODUCTS, products)
}

export const movementService = {
  getAll: () => getData(DB_KEYS.MOVEMENTS),
  save: (movements) => setData(DB_KEYS.MOVEMENTS, movements)
}

export const supplierService = {
  getAll: () => getData(DB_KEYS.SUPPLIERS),
  save: (suppliers) => setData(DB_KEYS.SUPPLIERS, suppliers)
}

export const orderService = {
  getAll: () => getData(DB_KEYS.ORDERS),
  save: (orders) => setData(DB_KEYS.ORDERS, orders)
}

export const userService = {
  getAll: () => getData(DB_KEYS.USERS),
  save: (users) => setData(DB_KEYS.USERS, users)
}

// ─── Autenticación de empresas (lee desde db.json) ───
export const empresaAuth = {
  login: (email, password) => {
    const empresa = seedData.empresas.find(
      e => e.email === email && e.password === password
    )
    if (empresa) {
      sessionStorage.setItem('empresa_session', JSON.stringify(empresa))
      return empresa
    }
    return null
  },
  getSession: () => {
    try {
      const raw = sessionStorage.getItem('empresa_session')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  logout: () => {
    sessionStorage.removeItem('empresa_session')
  },
  getEmpresas: () => seedData.empresas
}

// ─── Reset a datos de fábrica ───
export function resetDB() {
  localStorage.clear()
  initDB()
}

// Inicializar al importar
initDB()

export { DB_KEYS }
export default { initDB, resetDB, DB_KEYS }
