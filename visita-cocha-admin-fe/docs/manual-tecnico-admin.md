# Manual Técnico - Admin Panel

## Arquitectura

```
src/
├── api/              # Servicios API
│   ├── index.js      # Métodos CRUD
│   ├── api.js        # Cliente Axios
│   └── visitaCochaApi.js # APIs por módulo
├── auth/             # Autenticación
│   ├── AuthContext.jsx
│   ├── roles.js
│   └── permissions.js
├── components/       # Componentes reutilizables
├── pages/           # Páginas (Layout, Dashboard, Modules)
├── config/          # Configuración
└── styles/          # CSS
```

## APIs Disponibles

Todos los endpoints requieren token JWT en header:
```
Authorization: Bearer {token}
```

### Autenticación

```javascript
POST /login
Body: { email, password }
Response: { token, usuario }
```

### Módulos CRUD (patrón igual para todos)

```javascript
GET /attractions              // Listar
GET /attractions/:id          // Obtener uno
POST /attractions             // Crear
PUT /attractions/:id          // Actualizar
DELETE /attractions/:id       // Eliminar
```

Módulos: attractions, restaurants, events, hotels, foods, announcements, pois, reviews, user

### Categorías

```javascript
GET /attraction-categories
GET /restaurant-categories
GET /main-categories
```

## Flujo de Autenticación

1. Usuario ingresa email/password
2. POST `/login` → recibe token
3. Token guardado en `localStorage`
4. Interceptor de Axios incluye token en todas las peticiones
5. Si token expira → redireccionar a login

## Estructura de Datos

### Usuario
```javascript
{
  id: string,
  email: string,
  nombre: string,
  rol: 'SuperAdmin' | 'Admin' | 'Mantenedor',
  moduleAccess: { moduleName: { read, create, update, delete } }
}
```

### Atractivo
```javascript
{
  id: string,
  name: string,
  description: string,
  coverUrl: string,
  location: { address, coords: { lat, lng } },
  contact: { phone, mail, link },
  categories: [string],
  available: boolean,
  rating: number
}
```

## Roles y Permisos

- **SuperAdmin**: Acceso total
- **Admin**: Todos los módulos
- **Mantenedor**: Módulos específicos asignados

## Componentes Principales

### AttractionForm.jsx
Formulario CRUD para atractivos. Consume:
- `api.getContentById('attractions', id)` - cargar
- `api.createContent('attractions', data)` - crear
- `api.updateContent('attractions', id, data)` - actualizar

## Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_BACKEND=true
NODE_ENV=development
```

## Manejo de Errores

Todos los endpoints con `try/catch`:
```javascript
try {
  await api.createContent(...)
} catch (err) {
  setError(err.response?.data?.message || 'Error')
}
```

## Deploy

### Local
```bash
npm run dev
```

### Producción
```bash
npm run build
# dist/ listo para servir
```

### Docker
```bash
docker-compose up
```

Ver Dockerfile para configuración.
