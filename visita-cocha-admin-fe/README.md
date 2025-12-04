# Admin Panel - Visita Cochabamba

Panel administrativo para gestionar contenido de Visita Cochabamba.

## Inicio Rápido

### Local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

### Docker

```bash
docker-compose up
```

Abre `http://localhost:5173`

## Variables de Entorno

Crea `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_BACKEND=true
NODE_ENV=development
```

## Tecnologías

- React 18.2.0
- Vite 4.5.14
- React Router DOM 7.9.6
- Axios 1.4.0
- CSS puro

## APIs que Consume

Backend en `http://localhost:3000`:

- `POST /login` - Autenticación
- `GET/POST/PUT/DELETE /attractions` - Atractivos
- `GET/POST/PUT/DELETE /restaurants` - Restaurantes
- `GET/POST/PUT/DELETE /events` - Eventos
- `GET/POST/PUT/DELETE /hotels` - Hoteles
- `GET/POST/PUT/DELETE /foods` - Comidas
- `GET/POST/PUT/DELETE /announcements` - Anuncios
- `GET/POST/PUT/DELETE /pois` - Puntos de Interés
- `GET/POST/PUT/DELETE /user` - Usuarios
- `GET/POST/PUT/DELETE /reviews` - Reseñas
- `GET/POST/PUT/DELETE /attraction-categories` - Categorías
- `GET/POST/PUT/DELETE /restaurant-categories` - Categorías
- `GET/POST/PUT/DELETE /main-categories` - Categorías

## Documentación

Ver `/docs/` para manuales técnico y de usuario.
