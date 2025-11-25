# 🔄 Guía de Migración: Integrar visitaCochaApi en tus Componentes

## 📋 Cómo Adaptar tus Formularios y Listas Existentes

### Caso 1: AttractionForm.jsx (Formulario Existente)

#### ANTES (usando localStoreApi)
```javascript
import { localStoreApi } from '../../api/localStoreApi';

// Cargar atractivo
const loadAttraction = async () => {
  const data = await localStoreApi.getById('attractions', id);
  setFormData(data);
};

// Guardar
const handleSubmit = async (e) => {
  if (isEdit) {
    await localStoreApi.update('attractions', id, formData);
  } else {
    await localStoreApi.create('attractions', formData);
  }
};

// Eliminar
const handleDelete = async () => {
  await localStoreApi.delete('attractions', id);
};
```

#### DESPUÉS (usando visitaCochaApi)
```javascript
import { atractivosApi } from '../../api/visitaCochaApi';

// Cargar atractivo
const loadAttraction = async () => {
  try {
    const response = await atractivosApi.getById(id);
    setFormData(response.data);
  } catch (error) {
    console.error('Error al cargar:', error);
    setError('No se pudo cargar el atractivo');
  }
};

// Guardar
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    if (isEdit) {
      await atractivosApi.update(id, formData);
      alert('✅ Atractivo actualizado');
    } else {
      await atractivosApi.create(formData);
      alert('✅ Atractivo creado');
    }
    navigate('/attractions');
  } catch (error) {
    alert('❌ Error: ' + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};

// Eliminar
const handleDelete = async () => {
  if (!window.confirm('¿Eliminar este atractivo?')) return;
  
  try {
    await atractivosApi.delete(id);
    alert('✅ Atractivo eliminado');
    navigate('/attractions');
  } catch (error) {
    alert('❌ Error al eliminar');
  }
};
```

---

### Caso 2: ModuleGenericList.jsx (Lista Existente)

#### ANTES
```javascript
import { getContentList } from '../../api';

const loadItems = async () => {
  const items = await getContentList('attractions');
  setItems(items);
};
```

#### DESPUÉS (Opción A: Directa)
```javascript
import { atractivosApi } from '../../api/visitaCochaApi';

const loadItems = async () => {
  try {
    const response = await atractivosApi.getAll();
    setItems(response.data);
  } catch (error) {
    setError('Error al cargar lista');
  }
};
```

#### DESPUÉS (Opción B: Dinámica por módulo)
```javascript
import { getApiByModuleType } from '../../api/visitaCochaApi';

const loadItems = async () => {
  const api = getApiByModuleType(moduleType); // 'attractions', 'restaurants', etc.
  
  if (!api) {
    console.error('API no encontrada para:', moduleType);
    return;
  }
  
  try {
    const response = await api.getAll();
    setItems(response.data);
  } catch (error) {
    setError('Error al cargar lista');
  }
};
```

---

### Caso 3: Componentes con Filtros

#### Filtrar por Categoría
```javascript
import { atractivosApi } from '../../api/visitaCochaApi';

// Filtro de categoría
const filtrarPorCategoria = async (categoria) => {
  try {
    setLoading(true);
    const response = await atractivosApi.getByCategoria(categoria);
    setItems(response.data);
  } catch (error) {
    setError('Error al filtrar');
  } finally {
    setLoading(false);
  }
};

// En el render
<select onChange={(e) => filtrarPorCategoria(e.target.value)}>
  <option value="">Todas las categorías</option>
  <option value="Monumentos">Monumentos</option>
  <option value="Museos">Museos</option>
  <option value="Parques">Parques</option>
</select>
```

---

### Caso 4: Eventos Próximos

```javascript
import { eventosApi } from '../../api/visitaCochaApi';

const EventosProximos = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    cargarEventosProximos();
  }, []);

  const cargarEventosProximos = async () => {
    try {
      const response = await eventosApi.getProximos();
      setEventos(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Próximos Eventos</h2>
      {eventos.map(evento => (
        <EventCard key={evento.id} evento={evento} />
      ))}
    </div>
  );
};
```

---

## 🗺️ Mapeo de Módulos a APIs

```javascript
const moduleToApi = {
  'attractions': atractivosApi,
  'restaurants': restaurantesApi,
  'events': eventosApi,
  'hotels': hotelesApi,
  'foods': comidasApi,
  'itineraries': itinerariosApi,
  'points': puntosApi,
  'announcements': anunciosApi
};

// Uso
const api = moduleToApi[moduleType];
const response = await api.getAll();
```

---

## 🎯 Adaptación por Tipo de Componente

### 1. Formulario de Creación/Edición

```javascript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atractivosApi } from '@/api/visitaCochaApi';

function AtractivoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ /* campos */ });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si es edición, cargar datos
  useEffect(() => {
    if (id) cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await atractivosApi.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (id) {
        await atractivosApi.update(id, formData);
        alert('Actualizado');
      } else {
        await atractivosApi.create(formData);
        alert('Creado');
      }
      navigate('/atractivos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos del formulario */}
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
```

### 2. Lista con Operaciones CRUD

```javascript
import { useState, useEffect } from 'react';
import { atractivosApi } from '@/api/visitaCochaApi';

function AtractivosList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const response = await atractivosApi.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar?')) return;
    
    try {
      await atractivosApi.delete(id);
      alert('Eliminado');
      cargar(); // Recargar lista
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Atractivos</h1>
      <button onClick={() => navigate('/atractivos/nuevo')}>
        + Nuevo
      </button>
      
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.categoria}</td>
              <td>
                <button onClick={() => navigate(`/atractivos/${item.id}`)}>
                  Editar
                </button>
                <button onClick={() => eliminar(item.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3. Dashboard con Estadísticas

```javascript
import { useState, useEffect } from 'react';
import { atractivosApi, restaurantesApi, eventosApi } from '@/api/visitaCochaApi';

function Dashboard() {
  const [stats, setStats] = useState({
    atractivos: 0,
    restaurantes: 0,
    eventos: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [atractivos, restaurantes, eventos] = await Promise.all([
        atractivosApi.getAll(),
        restaurantesApi.getAll(),
        eventosApi.getAll()
      ]);

      setStats({
        atractivos: atractivos.data.length,
        restaurantes: restaurantes.data.length,
        eventos: eventos.data.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <StatCard title="Atractivos" value={stats.atractivos} />
        <StatCard title="Restaurantes" value={stats.restaurantes} />
        <StatCard title="Eventos" value={stats.eventos} />
      </div>
    </div>
  );
}
```

---

## 🛠️ Herramientas de Desarrollo

### Hook Personalizado para CRUD

```javascript
// hooks/useCrud.js
import { useState, useEffect } from 'react';

export function useCrud(api) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAll();
      setItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data) => {
    try {
      const response = await api.create(data);
      setItems([...items, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const actualizar = async (id, data) => {
    try {
      const response = await api.update(id, data);
      setItems(items.map(item => item.id === id ? response.data : item));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const eliminar = async (id) => {
    try {
      await api.delete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return {
    items,
    loading,
    error,
    cargar,
    crear,
    actualizar,
    eliminar
  };
}

// Uso
import { useCrud } from './hooks/useCrud';
import { atractivosApi } from './api/visitaCochaApi';

function MiComponente() {
  const { items, loading, crear, actualizar, eliminar } = useCrud(atractivosApi);
  
  // Ya tienes todo listo
  return <div>{/* usar items */}</div>;
}
```

---

## ✅ Checklist de Migración por Componente

Para cada componente que uses localStoreApi o mockApi:

- [ ] Importar la API correcta (atractivosApi, restaurantesApi, etc.)
- [ ] Cambiar llamadas a `.getAll()` - agregar `.data` a la respuesta
- [ ] Cambiar llamadas a `.getById(id)` - agregar `.data` a la respuesta
- [ ] Cambiar llamadas a `.create(data)` - agregar `.data` a la respuesta
- [ ] Cambiar llamadas a `.update(id, data)` - agregar `.data` a la respuesta
- [ ] Cambiar llamadas a `.delete(id)`
- [ ] Agregar try/catch para manejo de errores
- [ ] Agregar loading state
- [ ] Mostrar mensajes de error al usuario
- [ ] Probar crear, editar, eliminar
- [ ] Verificar que lista se recarga después de cambios

---

## 🎨 Ejemplo de Migración Completo

### ANTES: RestaurantForm.jsx
```javascript
import { localStoreApi } from '../../api/localStoreApi';

const loadRestaurant = async () => {
  const data = await localStoreApi.getById('restaurants', id);
  setFormData(data);
};

const handleSave = async () => {
  if (isEdit) {
    await localStoreApi.update('restaurants', id, formData);
  } else {
    await localStoreApi.create('restaurants', formData);
  }
  navigate('/restaurants');
};
```

### DESPUÉS: RestaurantForm.jsx
```javascript
import { restaurantesApi } from '../../api/visitaCochaApi';

const loadRestaurant = async () => {
  try {
    setLoading(true);
    const response = await restaurantesApi.getById(id);
    setFormData(response.data);
  } catch (error) {
    setError('Error al cargar restaurante');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleSave = async () => {
  try {
    setLoading(true);
    
    if (isEdit) {
      await restaurantesApi.update(id, formData);
      alert('✅ Restaurante actualizado');
    } else {
      await restaurantesApi.create(formData);
      alert('✅ Restaurante creado');
    }
    
    navigate('/restaurants');
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al guardar';
    setError(mensaje);
    alert('❌ ' + mensaje);
  } finally {
    setLoading(false);
  }
};
```

---

## 🚀 Pasos para Empezar

1. **Prueba primero con UN componente simple** (por ejemplo, una lista)
2. **Verifica que funciona** con el componente de prueba
3. **Migra componentes de lectura** (listas, dashboards)
4. **Migra componentes de escritura** (formularios)
5. **Agrega manejo de errores robusto**
6. **Prueba el flujo completo** (crear, editar, eliminar)

---

¡Listo para migrar tus componentes! 🎉
