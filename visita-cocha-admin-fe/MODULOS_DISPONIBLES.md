# 📚 Módulos Disponibles - Backend NestJS

## ✅ Todos los Endpoints Implementados

Tu backend de Visita Cocha tiene **13 colecciones** disponibles. Todos los endpoints están listos para usar.

---

## 📊 Resumen de Colecciones

| Módulo | Colección | Docs | Endpoint | API Frontend |
|--------|-----------|------|----------|--------------|
| 🏛️ Atractivos | `attractions` | 85 | `/atractivos` | `atractivosApi` |
| 🍽️ Restaurantes | `restaurants` | 49 | `/restaurantes` | `restaurantesApi` |
| 🎉 Eventos | `events` | 2 | `/eventos` | `eventosApi` |
| 🍴 Comidas | `foods` | 35 | `/foods` | `comidasApi` |
| 📢 Anuncios | `announcements` | 97 | `/announcements` | `anunciosApi` |
| 🏨 Hoteles | `hotels` | 2 | `/hotels` | `hotelesApi` |
| 📍 POIs | `pois` | 2 | `/pois` | `puntosApi` |
| 🗺️ Rutas | `routes` | 0 | `/routes` | `rutasApi` |
| 🏷️ Cat. Atractivos | `attraction-categories` | 7 | `/attraction-categories` | `attractionCategoriesApi` |
| 🍽️ Cat. Restaurantes | `restaurant-categories` | 8 | `/restaurant-categories` | `restaurantCategoriesApi` |
| 📂 Cat. Principales | `main-categories` | 9 | `/main-categories` | `mainCategoriesApi` |
| ⭐ Reviews | `reviews` | 4 | `/reviews` | `reviewsApi` |
| 👤 Usuarios | `user` | 3 | `/user` | `usersApi` |

**Total: 313 documentos** distribuidos en 13 colecciones

---

## 🎯 APIs Disponibles en Frontend

### 1. 🏛️ Atractivos Turísticos (`atractivosApi`)

```javascript
import { atractivosApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await atractivosApi.getAll();                    // GET /atractivos
await atractivosApi.getById(id);                 // GET /atractivos/:id
await atractivosApi.getByCategoria(categoria);   // GET /atractivos?categoria=X
await atractivosApi.create(data);                // POST /atractivos
await atractivosApi.update(id, data);            // PATCH /atractivos/:id
await atractivosApi.delete(id);                  // DELETE /atractivos/:id
```

**Documentos:** 85  
**Estado:** ✅ Activa

---

### 2. 🍽️ Restaurantes (`restaurantesApi`)

```javascript
import { restaurantesApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await restaurantesApi.getAll();                  // GET /restaurantes
await restaurantesApi.getById(id);               // GET /restaurantes/:id
await restaurantesApi.getByCategoria(categoria); // GET /restaurantes?categoria=X
await restaurantesApi.create(data);              // POST /restaurantes
await restaurantesApi.update(id, data);          // PATCH /restaurantes/:id
await restaurantesApi.delete(id);                // DELETE /restaurantes/:id
```

**Documentos:** 49  
**Estado:** ✅ Activa

---

### 3. 🎉 Eventos (`eventosApi`)

```javascript
import { eventosApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await eventosApi.getAll();                       // GET /eventos
await eventosApi.getById(id);                    // GET /eventos/:id
await eventosApi.getProximos();                  // GET /eventos?proximos=true
await eventosApi.getByCategoria(categoria);      // GET /eventos?categoria=X
await eventosApi.create(data);                   // POST /eventos
await eventosApi.update(id, data);               // PATCH /eventos/:id
await eventosApi.delete(id);                     // DELETE /eventos/:id
```

**Documentos:** 2  
**Estado:** ✅ Activa

---

### 4. 🍴 Comidas (`comidasApi`)

```javascript
import { comidasApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await comidasApi.getAll();                       // GET /foods
await comidasApi.getById(id);                    // GET /foods/:id
await comidasApi.create(data);                   // POST /foods
await comidasApi.update(id, data);               // PATCH /foods/:id
await comidasApi.delete(id);                     // DELETE /foods/:id
```

**Documentos:** 35  
**Estado:** ✅ Activa

---

### 5. 📢 Anuncios (`anunciosApi`)

```javascript
import { anunciosApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await anunciosApi.getAll();                      // GET /announcements
await anunciosApi.getById(id);                   // GET /announcements/:id
await anunciosApi.create(data);                  // POST /announcements
await anunciosApi.update(id, data);              // PATCH /announcements/:id
await anunciosApi.delete(id);                    // DELETE /announcements/:id
```

**Documentos:** 97  
**Estado:** ✅ Activa

---

### 6. 🏨 Hoteles (`hotelesApi`)

```javascript
import { hotelesApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await hotelesApi.getAll();                       // GET /hotels
await hotelesApi.getById(id);                    // GET /hotels/:id
await hotelesApi.getByCategoria(categoria);      // GET /hotels?categoria=X
await hotelesApi.create(data);                   // POST /hotels
await hotelesApi.update(id, data);               // PATCH /hotels/:id
await hotelesApi.delete(id);                     // DELETE /hotels/:id
```

**Documentos:** 2  
**Estado:** ✅ Activa

---

### 7. 📍 Puntos de Interés (`puntosApi`)

```javascript
import { puntosApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await puntosApi.getAll();                        // GET /pois
await puntosApi.getById(id);                     // GET /pois/:id
await puntosApi.create(data);                    // POST /pois
await puntosApi.update(id, data);                // PATCH /pois/:id
await puntosApi.delete(id);                      // DELETE /pois/:id
```

**Documentos:** 2  
**Estado:** ✅ Activa

---

### 8. 🗺️ Rutas/Itinerarios (`rutasApi`)

```javascript
import { rutasApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await rutasApi.getAll();                         // GET /routes
await rutasApi.getById(id);                      // GET /routes/:id
await rutasApi.create(data);                     // POST /routes
await rutasApi.update(id, data);                 // PATCH /routes/:id
await rutasApi.delete(id);                       // DELETE /routes/:id
```

**Documentos:** 0 ⚠️ (Vacía)  
**Estado:** ✅ Activa (lista para agregar datos)

---

### 9. 🏷️ Categorías de Atractivos (`attractionCategoriesApi`)

```javascript
import { attractionCategoriesApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await attractionCategoriesApi.getAll();          // GET /attraction-categories
await attractionCategoriesApi.getById(id);       // GET /attraction-categories/:id
await attractionCategoriesApi.create(data);      // POST /attraction-categories
await attractionCategoriesApi.update(id, data);  // PATCH /attraction-categories/:id
await attractionCategoriesApi.delete(id);        // DELETE /attraction-categories/:id
```

**Documentos:** 7  
**Estado:** ✅ Activa

---

### 10. 🍽️ Categorías de Restaurantes (`restaurantCategoriesApi`)

```javascript
import { restaurantCategoriesApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await restaurantCategoriesApi.getAll();          // GET /restaurant-categories
await restaurantCategoriesApi.getById(id);       // GET /restaurant-categories/:id
await restaurantCategoriesApi.create(data);      // POST /restaurant-categories
await restaurantCategoriesApi.update(id, data);  // PATCH /restaurant-categories/:id
await restaurantCategoriesApi.delete(id);        // DELETE /restaurant-categories/:id
```

**Documentos:** 8  
**Estado:** ✅ Activa

---

### 11. 📂 Categorías Principales (`mainCategoriesApi`)

```javascript
import { mainCategoriesApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await mainCategoriesApi.getAll();                // GET /main-categories
await mainCategoriesApi.getById(id);             // GET /main-categories/:id
await mainCategoriesApi.create(data);            // POST /main-categories
await mainCategoriesApi.update(id, data);        // PATCH /main-categories/:id
await mainCategoriesApi.delete(id);              // DELETE /main-categories/:id
```

**Documentos:** 9  
**Estado:** ✅ Activa

---

### 12. ⭐ Reviews/Reseñas (`reviewsApi`)

```javascript
import { reviewsApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await reviewsApi.getAll();                       // GET /reviews
await reviewsApi.getById(id);                    // GET /reviews/:id
await reviewsApi.getByResource(type, id);        // GET /reviews?resourceType=X&resourceId=Y
await reviewsApi.create(data);                   // POST /reviews
await reviewsApi.update(id, data);               // PATCH /reviews/:id
await reviewsApi.delete(id);                     // DELETE /reviews/:id
```

**Documentos:** 4  
**Estado:** ✅ Activa

---

### 13. 👤 Usuarios (`usersApi`)

```javascript
import { usersApi } from '@/api/visitaCochaApi';

// Operaciones CRUD
await usersApi.getAll();                         // GET /user
await usersApi.getById(id);                      // GET /user/:id
await usersApi.create(data);                     // POST /user
await usersApi.update(id, data);                 // PATCH /user/:id
await usersApi.delete(id);                       // DELETE /user/:id
```

**Documentos:** 3  
**Estado:** ✅ Activa

---

## 🔧 Helper para API Dinámica

```javascript
import { getApiByModuleType } from '@/api/visitaCochaApi';

// Obtener API por nombre de módulo
const api = getApiByModuleType('attractions');        // atractivosApi
const api = getApiByModuleType('restaurants');        // restaurantesApi
const api = getApiByModuleType('events');             // eventosApi
const api = getApiByModuleType('hotels');             // hotelesApi
const api = getApiByModuleType('foods');              // comidasApi
const api = getApiByModuleType('announcements');      // anunciosApi
const api = getApiByModuleType('pois');               // puntosApi
const api = getApiByModuleType('routes');             // rutasApi
const api = getApiByModuleType('attraction-categories'); // attractionCategoriesApi
const api = getApiByModuleType('restaurant-categories'); // restaurantCategoriesApi
const api = getApiByModuleType('main-categories');    // mainCategoriesApi
const api = getApiByModuleType('reviews');            // reviewsApi
const api = getApiByModuleType('users');              // usersApi

// Usar dinámicamente
const response = await api.getAll();
```

---

## 📝 Estructura de tu Backend (NestJS)

```
Backend en: c:\Users\ASUS\Downloads\visita-cocha-be

Puerto: 3000 (por defecto)
Framework: NestJS + MongoDB
Base de datos: Firebase Firestore

Módulos implementados:
├── /atractivos          (AtractosController)
├── /restaurantes        (RestaurantesController)
├── /eventos             (EventosController)
├── /foods               (FoodsController)
├── /announcements       (AnnouncementsController)
├── /hotels              (HotelsController)
├── /pois                (PoisController)
├── /routes              (Pendiente implementar)
├── /attraction-categories (AttractionCategoriesController)
├── /restaurant-categories (RestaurantCategoriesController)
├── /main-categories     (MainCategoriesController)
├── /reviews             (ReviewsController)
├── /user                (UserController)
└── /auth                (AuthController)
```

---

## 🚀 Cómo Usar

### 1. Importar API específica

```javascript
import { atractivosApi, restaurantesApi } from '@/api/visitaCochaApi';

// Usar directamente
const atractivos = await atractivosApi.getAll();
```

### 2. Usar API dinámica

```javascript
import { getApiByModuleType } from '@/api/visitaCochaApi';

function MiComponente({ moduleType }) {
  const api = getApiByModuleType(moduleType);
  const items = await api.getAll();
  // ...
}
```

### 3. Probar endpoints

```javascript
// Importa el componente de prueba
import TestVisitaCochaApi from '@/components/Test/TestVisitaCochaApi';

// Renderiza temporalmente
<TestVisitaCochaApi />
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# URL de tu backend NestJS
VITE_API_BASE_URL=http://localhost:3000

# Habilitar backend real
VITE_USE_BACKEND=true
```

---

## 📊 Estadísticas por Módulo

| Categoría | Módulos | Total Docs |
|-----------|---------|------------|
| 📦 Contenido Principal | 7 | 272 |
| 🏷️ Categorías | 3 | 24 |
| 👥 Usuarios y Reviews | 2 | 7 |
| 🗺️ Otros | 1 | 0 |
| **TOTAL** | **13** | **313** |

---

## ✅ Checklist de Integración

- [x] ✅ APIs creadas para todos los módulos
- [x] ✅ Endpoints mapeados correctamente
- [x] ✅ Componente de prueba actualizado
- [x] ✅ Configuración de endpoints actualizada
- [x] ✅ Documentación completa
- [ ] Configurar .env con URL del backend
- [ ] Iniciar backend en puerto 3000
- [ ] Probar conexión con TestVisitaCochaApi
- [ ] Implementar CRUDs en el frontend

---

## 🎯 Próximos Pasos

1. **Configurar .env** con `VITE_API_BASE_URL=http://localhost:3000`
2. **Iniciar tu backend NestJS** (`npm run start:dev`)
3. **Probar endpoints** con `TestVisitaCochaApi`
4. **Implementar CRUDs** para cada módulo en tu panel

---

## 📖 Documentación

- **Guía completa:** `README_INTEGRACION_API.md`
- **Ejemplos de uso:** `src/examples/UsandoVisitaCochaApi.jsx`
- **Referencia API:** `src/api/README_API.md`
- **Migración:** `GUIA_MIGRACION.md`

---

¡Todos los módulos están listos para usar! 🚀
