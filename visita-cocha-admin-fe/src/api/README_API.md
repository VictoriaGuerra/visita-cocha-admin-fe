# 📡 API de Visita Cocha - Guía de Uso

## 📁 Archivos Creados

### 1. `visitaCochaApi.js`
Servicio centralizado que conecta con el backend real de Visita Cocha.

### 2. `../examples/UsandoVisitaCochaApi.jsx`
Ejemplos prácticos de cómo usar la API en tus componentes React.

---

## 🚀 Instalación

La dependencia `axios` ya está instalada en tu proyecto:
```json
"axios": "^1.4.0"
```

---

## ⚙️ Configuración

### Variables de Entorno
Crea o edita tu archivo `.env` en la raíz del proyecto:

```env
# Backend real (tu proyecto de mejoras)
VITE_API_BASE_URL=http://localhost:3000

# Habilitar backend real (en lugar de mock)
VITE_USE_BACKEND=true
```

### Si tu backend usa otro puerto
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 📚 APIs Disponibles

### 🏛️ Atractivos Turísticos
```javascript
import { atractivosApi } from '@/api/visitaCochaApi';

// Listar todos
const response = await atractivosApi.getAll();
const atractivos = response.data;

// Obtener por ID
const response = await atractivosApi.getById(1);
const atractivo = response.data;

// Filtrar por categoría
const response = await atractivosApi.getByCategoria('Monumentos');
const monumentos = response.data;

// Crear
const nuevo = await atractivosApi.create({
  nombre: 'Cristo Blanco',
  descripcion: 'Monumento icónico',
  ubicacion: 'Cusco',
  imagen: 'http://...',
  categoria: 'Monumentos',
  horario: '24 horas',
  precio: 'Gratis',
  activo: true
});

// Actualizar
const actualizado = await atractivosApi.update(1, {
  nombre: 'Cristo Blanco Renovado'
});

// Eliminar
await atractivosApi.delete(1);
```

### 🍽️ Restaurantes
```javascript
import { restaurantesApi } from '@/api/visitaCochaApi';

// Mismos métodos que atractivosApi
await restaurantesApi.getAll();
await restaurantesApi.getById(id);
await restaurantesApi.getByCategoria('Típico');
await restaurantesApi.create(data);
await restaurantesApi.update(id, data);
await restaurantesApi.delete(id);
```

### 🎉 Eventos
```javascript
import { eventosApi } from '@/api/visitaCochaApi';

// Métodos básicos
await eventosApi.getAll();
await eventosApi.getById(id);
await eventosApi.create(data);
await eventosApi.update(id, data);
await eventosApi.delete(id);

// Específicos de eventos
await eventosApi.getProximos(); // Solo eventos futuros
await eventosApi.getByCategoria('Festival');
```

### 🏨 Hoteles
```javascript
import { hotelesApi } from '@/api/visitaCochaApi';
// Mismos métodos CRUD
```

### 🍴 Comidas
```javascript
import { comidasApi } from '@/api/visitaCochaApi';
// Mismos métodos CRUD
```

### 🗺️ Itinerarios
```javascript
import { itinerariosApi } from '@/api/visitaCochaApi';
// Mismos métodos CRUD
```

### 📍 Puntos de Interés
```javascript
import { puntosApi } from '@/api/visitaCochaApi';
// Mismos métodos CRUD
```

### 📢 Anuncios
```javascript
import { anunciosApi } from '@/api/visitaCochaApi';
// Mismos métodos CRUD
```

---

## 🛠️ Utilidades

### API Dinámica por Tipo de Módulo
```javascript
import { getApiByModuleType } from '@/api/visitaCochaApi';

const api = getApiByModuleType('attractions'); // atractivosApi
const api = getApiByModuleType('restaurants'); // restaurantesApi
const api = getApiByModuleType('events'); // eventosApi
```

### Manejo de Errores con Helper
```javascript
import { handleApiCall, atractivosApi } from '@/api/visitaCochaApi';

const result = await handleApiCall(
  () => atractivosApi.getAll(),
  'Error al cargar atractivos'
);

if (result.success) {
  console.log('Datos:', result.data);
} else {
  console.error('Error:', result.error);
}
```

---

## 🎯 Ejemplo Completo: CRUD de Atractivos

```javascript
import { useState, useEffect } from 'react';
import { atractivosApi } from '@/api/visitaCochaApi';

function AtractivosCRUD() {
  const [atractivos, setAtractivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📖 LEER (READ)
  useEffect(() => {
    cargarAtractivos();
  }, []);

  const cargarAtractivos = async () => {
    try {
      setLoading(true);
      const response = await atractivosApi.getAll();
      setAtractivos(response.data);
    } catch (err) {
      setError('Error al cargar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ CREAR (CREATE)
  const crearAtractivo = async (nuevoAtractivo) => {
    try {
      const response = await atractivosApi.create(nuevoAtractivo);
      setAtractivos([...atractivos, response.data]);
      alert('✅ Creado exitosamente');
    } catch (err) {
      alert('❌ Error al crear');
    }
  };

  // ✏️ ACTUALIZAR (UPDATE)
  const actualizarAtractivo = async (id, cambios) => {
    try {
      const response = await atractivosApi.update(id, cambios);
      setAtractivos(atractivos.map(a => 
        a.id === id ? response.data : a
      ));
      alert('✅ Actualizado exitosamente');
    } catch (err) {
      alert('❌ Error al actualizar');
    }
  };

  // 🗑️ ELIMINAR (DELETE)
  const eliminarAtractivo = async (id) => {
    if (!window.confirm('¿Eliminar este atractivo?')) return;
    
    try {
      await atractivosApi.delete(id);
      setAtractivos(atractivos.filter(a => a.id !== id));
      alert('✅ Eliminado exitosamente');
    } catch (err) {
      alert('❌ Error al eliminar');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Gestión de Atractivos</h1>
      
      <button onClick={() => crearAtractivo({
        nombre: 'Nuevo Atractivo',
        descripcion: 'Descripción',
        ubicacion: 'Cusco',
        imagen: 'http://...',
        categoria: 'Monumentos',
        activo: true
      })}>
        + Crear Nuevo
      </button>

      <div className="lista">
        {atractivos.map(atractivo => (
          <div key={atractivo.id} className="card">
            <h3>{atractivo.nombre}</h3>
            <p>{atractivo.descripcion}</p>
            <button onClick={() => actualizarAtractivo(atractivo.id, {
              nombre: atractivo.nombre + ' (Editado)'
            })}>
              ✏️ Editar
            </button>
            <button onClick={() => eliminarAtractivo(atractivo.id)}>
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AtractivosCRUD;
```

---

## 🔐 Autenticación

El token se incluye automáticamente en todas las peticiones:

```javascript
// El interceptor lo hace automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Guardar Token al Login
```javascript
const handleLogin = async (email, password) => {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Guardar token
  localStorage.setItem('access_token', data.token);
  
  // Ahora todas las llamadas a visitaCochaApi incluirán el token
};
```

---

## 🐛 Manejo de Errores

### Errores Comunes

```javascript
try {
  await atractivosApi.create(data);
} catch (error) {
  // Error de red
  if (error.code === 'ERR_NETWORK') {
    console.error('Backend no disponible');
  }
  
  // Error 401 - No autenticado
  if (error.response?.status === 401) {
    console.error('Token inválido o expirado');
    // Redirigir a login
  }
  
  // Error 404 - No encontrado
  if (error.response?.status === 404) {
    console.error('Recurso no encontrado');
  }
  
  // Mensaje del backend
  const mensaje = error.response?.data?.message;
  if (mensaje) {
    alert(mensaje);
  }
}
```

### Patrón Recomendado

```javascript
const guardarAtractivo = async (data) => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await atractivosApi.create(data);
    
    alert('✅ Guardado exitosamente');
    return response.data;
    
  } catch (error) {
    const mensaje = error.response?.data?.message 
                    || error.message 
                    || 'Error desconocido';
    
    setError(mensaje);
    console.error('Error al guardar:', error);
    
    return null;
  } finally {
    setLoading(false);
  }
};
```

---

## 🔄 Migración desde Mock/LocalStore

### Antes (con mockApi)
```javascript
import { fetchTouristAttractions } from '@/api/mockApi';

const atractivos = await fetchTouristAttractions();
```

### Después (con backend real)
```javascript
import { atractivosApi } from '@/api/visitaCochaApi';

const response = await atractivosApi.getAll();
const atractivos = response.data;
```

---

## 📊 Estructura de Respuesta

### Éxito
```javascript
{
  data: [...], // Array de items o un objeto
  status: 200,
  statusText: 'OK',
  headers: {...},
  config: {...}
}
```

### Error
```javascript
{
  response: {
    data: {
      message: 'Error específico del backend',
      errors: [...]
    },
    status: 400,
    statusText: 'Bad Request'
  },
  message: 'Request failed with status code 400'
}
```

---

## 🧪 Testing de la API

### Verificar Conexión
```javascript
// En la consola del navegador
import { atractivosApi } from './api/visitaCochaApi';

// Probar GET
atractivosApi.getAll()
  .then(res => console.log('✅ Atractivos:', res.data))
  .catch(err => console.error('❌ Error:', err));
```

### Verificar Configuración
```javascript
import api from './api/visitaCochaApi';

console.log('Base URL:', api.defaults.baseURL);
console.log('Headers:', api.defaults.headers);
console.log('Token:', localStorage.getItem('access_token'));
```

---

## 📝 Tipos de Datos Esperados

### Atractivo
```typescript
{
  id: number | string,
  nombre: string,
  descripcion: string,
  ubicacion: string,
  imagen: string,
  categoria: string,
  horario?: string,
  precio?: string,
  telefono?: string,
  activo: boolean
}
```

### Restaurante
```typescript
{
  id: number | string,
  nombre: string,
  descripcion: string,
  ubicacion: string,
  imagen: string,
  categoria: string,
  horario?: string,
  telefono?: string,
  activo: boolean
}
```

### Evento
```typescript
{
  id: number | string,
  nombre: string,
  descripcion: string,
  fecha: string,
  ubicacion: string,
  imagen: string,
  categoria: string,
  activo: boolean
}
```

---

## ❓ FAQ

### ¿Cómo cambio el puerto del backend?
Edita tu `.env`:
```env
VITE_API_BASE_URL=http://localhost:4000
```

### ¿Puedo usar fetch en lugar de axios?
Sí, pero tendrías que modificar `visitaCochaApi.js` para usar fetch nativo.

### ¿Funciona con CORS?
El backend debe tener CORS habilitado. En Express:
```javascript
const cors = require('cors');
app.use(cors());
```

### ¿Puedo usar PATCH en lugar de POST/PUT?
Sí, ya está implementado en los métodos `update()`.

---

## 🎓 Recursos Adicionales

- [Documentación de Axios](https://axios-http.com/docs/intro)
- [React Query](https://tanstack.com/query/latest) - Para caché y estado de servidor
- [SWR](https://swr.vercel.app/) - Alternativa para fetching de datos

---

## 🤝 Soporte

Si tienes dudas sobre el uso de la API:
1. Revisa los ejemplos en `examples/UsandoVisitaCochaApi.jsx`
2. Verifica la configuración en `.env`
3. Revisa la consola del navegador para errores
4. Verifica que el backend esté corriendo

---

## ✅ Checklist de Integración

- [ ] Verificar que axios está instalado
- [ ] Crear archivo `.env` con VITE_API_BASE_URL
- [ ] Verificar que el backend está corriendo
- [ ] Probar una llamada GET en la consola
- [ ] Implementar autenticación y guardar token
- [ ] Migrar componentes de mock a API real
- [ ] Agregar manejo de errores
- [ ] Probar CRUD completo

---

¡Listo para usar! 🚀
