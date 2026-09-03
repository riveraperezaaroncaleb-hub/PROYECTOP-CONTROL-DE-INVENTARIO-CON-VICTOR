# Arquitectura Modular del Sistema de Control de Inventario (SPA)

Diseño de una aplicación modular en un solo archivo con barra lateral interactiva (Sidebar responsive), persistencia en `localStorage`, y secciones dinámicas.

## Módulos y Secciones Planificadas

1. **Dashboard (Resumen General y Métricas)**
   - KPIs de negocio: Total referencias, valuación a costo y venta, margen estimado, alertas críticas de stock y movimientos del día.
   - Gráficos/widgets visuales de nivel de stock por categoría y alertas de reposición inmediata.
   - Acceso rápido a registrar entrada/salida o nuevo producto.

2. **Catálogo y Existencias**
   - Tabla interactiva con búsqueda en tiempo real, filtros por categoría y estado de semáforo.
   - Modal/Formulario de alta y edición completa de productos (código/SKU, nombre, categoría, proveedor, costo, venta, stock, stock mínimo).
   - Acciones directas de ajuste rápido (+ / -) y borrado.

3. **Movimientos (Kardex / Historial)**
   - Registro de Entradas y Salidas con motivo (compra a proveedor, venta, ajuste por merma, devolución).
   - Tabla histórica con fecha/hora, producto, tipo, cantidad, stock anterior y resultante, y usuario responsable.

4. **Proveedores y Órdenes de Compra**
   - Directorio de proveedores (Nombre/Razón social, teléfono, email, contacto).
   - Módulo de Órdenes de Compra (Borrador, Solicitada, Recibida). Al marcar como "Recibida", incrementa automáticamente las existencias en inventario y genera el movimiento.

5. **Administración y Usuarios Activos**
   - Gestión de usuarios y roles (Admin, Encargado de Almacén, Cajero/Vendedor).
   - Configuración del negocio (Moneda, nombre del negocio, impuestos/IVA).
   - Opciones de respaldo/restauración de datos JSON en `localStorage`.

---
*Fase actual: Implementación de la base de navegación con Sidebar + Dashboard + Catálogo + Movimientos + Proveedores + Órdenes + Usuarios.*
