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

// ─── Normalizar y migrar usuarios para garantizar sólo roles Admin y Empresas ───
function normalizeUsers(users) {
  if (!Array.isArray(users)) return seedData.users

  return users.map(u => {
    let role = u.role
    if (role !== 'Admin' && role !== 'Empresas') {
      // Mapear roles antiguos
      if (role === 'Administrador' || role === 'Jefe de Bodega' || role === 'Ventas') {
        role = 'Admin'
      } else if (role === 'Empresa') {
        role = 'Empresas'
      } else {
        role = 'Admin'
      }
    }

    const email = (u.email || '').trim()
    const isAdminDefault = email.toLowerCase() === 'admin@correo.com' || email.toLowerCase() === 'contacto.victorgonzalez0@gmail.com'

    return {
      ...u,
      role,
      password: u.password || (isAdminDefault ? 'Adm1n@2025!' : 'Temporal2025!'),
      mustChangePassword: isAdminDefault ? false : (u.mustChangePassword !== undefined ? u.mustChangePassword : true),
      status: u.status || 'Activo'
    }
  })
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

  // Siempre normalizar usuarios existentes en localStorage
  try {
    const currentUsers = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]')
    const normalized = normalizeUsers(currentUsers.length > 0 ? currentUsers : seedData.users)
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(normalized))
  } catch {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(seedData.users))
  }
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
  save: (users) => setData(DB_KEYS.USERS, normalizeUsers(users))
}

// ─── Servicio de Autenticación Unificado (Admin y Empresas) ───
export const authService = {
  login: (email, password) => {
    const users = userService.getAll()
    const cleanEmail = (email || '').trim().toLowerCase()
    const user = users.find(u => (u.email || '').trim().toLowerCase() === cleanEmail)

    if (!user) {
      return { success: false, error: 'Usuario no encontrado. Verifique su correo electrónico.' }
    }

    if (user.password !== password) {
      return { success: false, error: 'Contraseña incorrecta. Verifique sus credenciales.' }
    }

    if (user.status !== 'Activo') {
      return { success: false, error: 'Esta cuenta se encuentra inactiva. Contacte a un administrador.' }
    }

    // Si tiene la contraseña genérica y debe cambiarla por primera vez
    if (user.mustChangePassword) {
      return {
        success: true,
        mustChangePassword: true,
        user
      }
    }

    // Login exitoso normal
    sessionStorage.setItem('auth_user', JSON.stringify(user))
    if (user.role === 'Empresas') {
      sessionStorage.setItem('empresa_session', JSON.stringify({
        ...user,
        supplierMatch: user.supplierMatch || user.name
      }))
    }

    return {
      success: true,
      mustChangePassword: false,
      user
    }
  },

  changePasswordAndLogin: (userId, newPassword) => {
    const users = userService.getAll()
    const index = users.findIndex(u => u.id === userId)
    if (index === -1) {
      return { success: false, error: 'Usuario no encontrado para actualizar contraseña.' }
    }

    // Actualizar contraseña y marcar que ya no necesita cambio
    users[index].password = newPassword
    users[index].mustChangePassword = false
    userService.save(users)

    const updatedUser = users[index]
    sessionStorage.setItem('auth_user', JSON.stringify(updatedUser))

    if (updatedUser.role === 'Empresas') {
      sessionStorage.setItem('empresa_session', JSON.stringify({
        ...updatedUser,
        supplierMatch: updatedUser.supplierMatch || updatedUser.name
      }))
    }

    return {
      success: true,
      user: updatedUser
    }
  },

  getCurrentUser: () => {
    try {
      const raw = sessionStorage.getItem('auth_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  logout: () => {
    sessionStorage.removeItem('auth_user')
    sessionStorage.removeItem('empresa_session')
  }
}

// ─── Compatibilidad hacia atrás para portal de empresas ───
export const empresaAuth = {
  login: (email, password) => {
    const res = authService.login(email, password)
    if (res.success && !res.mustChangePassword && res.user.role === 'Empresas') {
      return res.user
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
  logout: () => authService.logout(),
  getEmpresas: () => userService.getAll().filter(u => u.role === 'Empresas')
}

// ─── Reset a datos de fábrica ───
export function resetDB() {
  localStorage.clear()
  initDB()
}

// Inicializar al importar
initDB()

export { DB_KEYS }
export default { initDB, resetDB, DB_KEYS, authService, userService }
