# 🎉 Integración Backend - Visita Cocha API

> ✅ **Estado**: Integración completada y lista para usar

Esta integración conecta tu panel de administración con el backend real de Visita Cocha, permitiéndote gestionar todos los módulos (atractivos, restaurantes, eventos, hoteles, etc.) directamente desde la interfaz.

---

## 📦 ¿Qué se Instaló?

### ✨ Archivos Principales

1. **`src/api/visitaCochaApi.js`** - Servicio API centralizado
2. **`src/examples/UsandoVisitaCochaApi.jsx`** - 7 ejemplos prácticos
3. **`src/components/Test/TestVisitaCochaApi.jsx`** - Componente de prueba

### 📖 Documentación

1. **`INTEGRACION_COMPLETADA.md`** - ⭐ **EMPIEZA AQUÍ** - Guía de inicio rápido
2. **`GUIA_MIGRACION.md`** - Cómo adaptar componentes existentes
3. **`RESUMEN_VISUAL.md`** - Diagramas y arquitectura
4. **`src/api/README_API.md`** - Referencia completa de la API

---

## 🚀 Inicio Rápido (3 pasos)

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_BACKEND=true
```

### 2. Iniciar tu Backend

```bash
# En tu proyecto de backend
npm run dev  # o el comando que uses
```

Debe estar corriendo en `http://localhost:3000`

### 3. Probar la Conexión

```javascript
// En App.jsx (temporal para probar)
import TestVisitaCochaApi from './components/Test/TestVisitaCochaApi';

function App() {
  return <TestVisitaCochaApi />;
}
```

Haz clic en los botones para verificar que todo funciona.

---

## 💡 Uso Básico

### Importar API

```javascript
import { atractivosApi, restaurantesApi, eventosApi } from '@/api/visitaCochaApi';
```

### Obtener Lista

```javascript
const response = await atractivosApi.getAll();
const atractivos = response.data;
```

### Crear Nuevo

```javascript
await atractivosApi.create({
  nombre: 'Cristo Blanco',
  descripcion: 'Monumento icónico de Cusco',
  ubicacion: 'Cusco, Perú',
  imagen: 'http://...',
  categoria: 'Monumentos'
});
```

### Actualizar

```javascript
await atractivosApi.update(1, { nombre: 'Nuevo nombre' });
```

### Eliminar

```javascript
await atractivosApi.delete(1);
```

---

## 📚 APIs Disponibles

| Módulo | API | Endpoint Backend | Documentos |
|--------|-----|------------------|------------|
| 🏛️ Atractivos | `atractivosApi` | `/atractivos` | 85 |
| 🍽️ Restaurantes | `restaurantesApi` | `/restaurantes` | 49 |
| 🎉 Eventos | `eventosApi` | `/eventos` | 2 |
| 🏨 Hoteles | `hotelesApi` | `/hotels` | 2 |
| 🍴 Comidas | `comidasApi` | `/foods` | 35 |
| 📢 Anuncios | `anunciosApi` | `/announcements` | 97 |
| 📍 Puntos | `puntosApi` | `/pois` | 2 |
| 🗺️ Rutas | `rutasApi` | `/routes` | 0 |
| 🏷️ Cat. Atractivos | `attractionCategoriesApi` | `/attraction-categories` | 7 |
| 🍽️ Cat. Restaurantes | `restaurantCategoriesApi` | `/restaurant-categories` | 8 |
| 📂 Cat. Principales | `mainCategoriesApi` | `/main-categories` | 9 |
| ⭐ Reviews | `reviewsApi` | `/reviews` | 4 |
| 👤 Usuarios | `usersApi` | `/user` | 3 |

**Total: 13 módulos con 313 documentos**

**Todos soportan:** `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

---

## 📖 Documentación Completa

### Para Empezar
👉 **[INTEGRACION_COMPLETADA.md](./INTEGRACION_COMPLETADA.md)** - Lee esto primero

### Para Migrar Componentes
👉 **[GUIA_MIGRACION.md](./GUIA_MIGRACION.md)** - Cómo adaptar tus componentes existentes

### Arquitectura y Diagramas
👉 **[RESUMEN_VISUAL.md](./RESUMEN_VISUAL.md)** - Flujos y estructura visual

### Referencia de API
👉 **[src/api/README_API.md](./src/api/README_API.md)** - Documentación técnica completa

---

## 🧪 Verificar que Funciona

### Opción 1: Componente de Prueba (Recomendado)

```javascript
import TestVisitaCochaApi from './components/Test/TestVisitaCochaApi';

// Renderizar temporalmente en tu App
<TestVisitaCochaApi />
```

### Opción 2: Consola del Navegador

```javascript
import { atractivosApi } from './api/visitaCochaApi';

atractivosApi.getAll()
  .then(res => console.log('✅ Datos:', res.data))
  .catch(err => console.error('❌ Error:', err));
```

---

## 🛠️ Ejemplos de Código

Encuentra 7 ejemplos completos en:
**`src/examples/UsandoVisitaCochaApi.jsx`**

Incluye:
- ✅ Lista con filtros
- ✅ Formulario crear/editar
- ✅ Eliminar con confirmación
- ✅ CRUD completo
- ✅ API dinámica por módulo
- ✅ Eventos próximos
- ✅ Manejo de errores

---

## 🔐 Autenticación

El token JWT se incluye **automáticamente** en todas las peticiones:

```javascript
// Guardar token al login
localStorage.setItem('access_token', token);

// Ya está configurado, no necesitas hacer nada más
// Todas las llamadas incluirán: Authorization: Bearer <token>
```

---

## 🐛 Solución de Problemas

### Backend no responde
✅ Verifica que está corriendo en el puerto correcto  
✅ Revisa `VITE_API_BASE_URL` en `.env`  
✅ Reinicia el servidor de Vite: `npm run dev`

### Error 401 Unauthorized
✅ Verifica que tienes un token válido  
✅ Haz login primero  
✅ Revisa que el token no haya expirado

### Error 404 Not Found
✅ Verifica que el endpoint existe en tu backend  
✅ Revisa que la ruta es correcta (`/atractivos`, no `/attractions`)

### CORS Error
✅ Habilita CORS en tu backend:
```javascript
const cors = require('cors');
app.use(cors());
```

---

## 📋 Checklist de Integración

- [ ] ✅ Archivos creados (ya hecho)
- [ ] Crear archivo `.env` con configuración
- [ ] Verificar que backend está corriendo
- [ ] Probar con `TestVisitaCochaApi`
- [ ] Ver ejemplos en `UsandoVisitaCochaApi.jsx`
- [ ] Migrar primer componente
- [ ] Probar crear/editar/eliminar
- [ ] Agregar manejo de errores
- [ ] Migrar resto de componentes

---

## 🎯 Próximos Pasos

1. **Configurar `.env`** con la URL de tu backend
2. **Probar conexión** con `TestVisitaCochaApi`
3. **Leer** `INTEGRACION_COMPLETADA.md`
4. **Migrar** un componente simple siguiendo `GUIA_MIGRACION.md`
5. **Revisar ejemplos** en `UsandoVisitaCochaApi.jsx`

---

## 💡 Tips

- 💾 Siempre usa `response.data` para obtener los datos
- 🔄 Recarga la lista después de crear/actualizar/eliminar
- ⚠️ Usa `try/catch` para manejar errores
- 🔐 El token se incluye automáticamente
- 📖 Revisa la documentación para métodos específicos

---

## 🤝 Estructura del Proyecto

```
src/
├── api/
│   ├── visitaCochaApi.js     ← API principal ⭐
│   ├── README_API.md          ← Documentación
│   └── index.js               ← Exporta visitaCochaApi
│
├── examples/
│   └── UsandoVisitaCochaApi.jsx ← Ejemplos de uso
│
└── components/
    └── Test/
        └── TestVisitaCochaApi.jsx ← Componente de prueba
```

---

## 📞 Ayuda

Si tienes problemas:

1. 🔍 Revisa la consola del navegador
2. 📖 Lee `INTEGRACION_COMPLETADA.md`
3. 🧪 Usa el componente de prueba
4. 📝 Revisa los ejemplos en `UsandoVisitaCochaApi.jsx`
5. 📚 Consulta `README_API.md` para detalles técnicos

---

## ✅ Todo Listo

La integración está **completa y lista para usar**. 

Sigue la guía en **`INTEGRACION_COMPLETADA.md`** para comenzar.

---

**¡Buena suerte con tu proyecto Visita Cocha! 🚀**
