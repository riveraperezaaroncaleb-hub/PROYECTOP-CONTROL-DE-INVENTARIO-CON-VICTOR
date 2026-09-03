# Design System — Inventory Management

## 1. Visión del producto

Sistema de control de inventario B2B diseñado para empresas que distribuyen múltiples **marcas, categorías y productos**, con herramientas para:

- Control de inventario.
- Gestión de productos y marcas.
- Entradas y salidas de mercancía.
- Compras y proveedores.
- Control de costos y precios.
- Gestión de ventas.
- Seguimiento de movimientos.
- Análisis de rentabilidad.
- Analítica administrativa.
- Control multiempresa y multiusuario.

El diseño debe transmitir:

> **Control, precisión, confianza y eficiencia operativa.**

La interfaz debe evitar una apariencia excesivamente "retail" o de e-commerce. El producto está pensado para usuarios que trabajan diariamente con grandes cantidades de información y necesitan encontrar datos rápidamente.

---

# 2. Principios de diseño

### Claridad sobre decoración

La información es prioritaria.

Evitar:

- Gradientes excesivos.
- Sombras fuertes.
- Tarjetas innecesarias.
- Colores saturados.
- Animaciones decorativas.

Priorizar:

- Jerarquía visual.
- Espaciado consistente.
- Tablas legibles.
- Estados claramente identificables.
- Información contextual.

### Densidad controlada

El sistema debe permitir visualizar mucha información sin sentirse saturado.

Usar:

- Tablas compactas.
- Filas de 48–56 px.
- Headers claramente diferenciados.
- Filtros agrupados.
- Paneles secundarios para información detallada.

### Diseño orientado a decisiones

Las pantallas administrativas deben responder rápidamente:

- ¿Qué está pasando?
- ¿Dónde está el problema?
- ¿Cuánto dinero representa?
- ¿Qué producto necesita atención?
- ¿Qué marca genera mayor margen?
- ¿Qué inventario está inmovilizado?

---

# 3. Arquitectura visual

La aplicación utiliza una estructura de dashboard empresarial:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo       Buscar...                  Notificaciones  Usuario│
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│ Dashboard    │  Breadcrumb                                   │
│              │                                               │
│ Inventario   │  Título de página                 Acciones    │
│              │                                               │
│ Productos    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│              │  │ KPI    │ │ KPI    │ │ KPI    │ │ KPI    │ │
│ Marcas       │  └────────┘ └────────┘ └────────┘ └────────┘ │
│              │                                               │
│ Compras      │  ┌──────────────────────┐ ┌────────────────┐ │
│              │  │                      │ │                │ │
│ Ventas       │  │       Analytics      │ │  Información   │ │
│              │  │                      │ │                │ │
│ Proveedores  │  └──────────────────────┘ └────────────────┘ │
│              │                                               │
│ Analítica    │  ┌─────────────────────────────────────────┐ │
│              │  │              Data table                 │ │
│ Administración│ └─────────────────────────────────────────┘ │
│              │                                               │
└──────────────┴───────────────────────────────────────────────┘
```
