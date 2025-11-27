/**
 * 📚 EJEMPLOS DE USO - visitaCochaApi.js
 * 
 * Este archivo contiene ejemplos de cómo usar la API de Visita Cocha
 * en tus componentes de CRUD del panel de administración.
 */

import { useState, useEffect } from 'react';
import { 
  atractivosApi, 
  restaurantesApi, 
  eventosApi,
  getApiByModuleType,
  handleApiCall 
} from '../api/visitaCochaApi';

// ============================================
// EJEMPLO 1: Listar Atractivos
// ============================================
export function EjemploListaAtractivos() {
  const [atractivos, setAtractivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAtractivos();
  }, []);

  const loadAtractivos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await atractivosApi.getAll();
      setAtractivos(response.data); // response.data contiene el array
    } catch (err) {
      setError('Error al cargar atractivos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por categoría
  const filtrarPorCategoria = async (categoria) => {
    try {
      setLoading(true);
      const response = await atractivosApi.getByCategoria(categoria);
      setAtractivos(response.data);
    } catch (err) {
      setError('Error al filtrar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando atractivos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="atractivos-list">
      <h1>Atractivos Turísticos</h1>
      
      <div className="filters">
        <button onClick={() => loadAtractivos()}>Todos</button>
        <button onClick={() => filtrarPorCategoria('Monumentos')}>Monumentos</button>
        <button onClick={() => filtrarPorCategoria('Museos')}>Museos</button>
      </div>

      <div className="grid">
        {atractivos.map(atractivo => (
          <div key={atractivo.id} className="card">
            <img src={atractivo.imagen} alt={atractivo.nombre} />
            <h3>{atractivo.nombre}</h3>
            <p>{atractivo.descripcion}</p>
            <span className="categoria">{atractivo.categoria}</span>
            <div className="actions">
              <button>Ver</button>
              <button>Editar</button>
              <button>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 2: Formulario Crear/Editar
// ============================================
export function EjemploFormularioAtractivo({ atractivoId = null, onSaved }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    imagen: '',
    categoria: '',
    horario: '',
    precio: '',
    telefono: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si hay ID, cargar datos existentes
  useEffect(() => {
    if (atractivoId) {
      loadAtractivo(atractivoId);
    }
  }, [atractivoId]);

  const loadAtractivo = async (id) => {
    try {
      setLoading(true);
      const response = await atractivosApi.getById(id);
      setFormData(response.data);
    } catch (err) {
      setError('Error al cargar atractivo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (atractivoId) {
        // Actualizar existente
        response = await atractivosApi.update(atractivoId, formData);
        alert('✅ Atractivo actualizado exitosamente');
      } else {
        // Crear nuevo
        response = await atractivosApi.create(formData);
        alert('✅ Atractivo creado exitosamente');
      }
      
      if (onSaved) onSaved(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="atractivo-form">
      <h2>{atractivoId ? 'Editar' : 'Crear'} Atractivo</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Nombre *</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Descripción *</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Ubicación *</label>
        <input
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Imagen (URL) *</label>
        <input
          name="imagen"
          type="url"
          value={formData.imagen}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Categoría *</label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">Seleccionar...</option>
          <option value="Monumentos">Monumentos</option>
          <option value="Museos">Museos</option>
          <option value="Parques">Parques</option>
          <option value="Miradores">Miradores</option>
        </select>
      </div>

      <div className="form-group">
        <label>Horario</label>
        <input
          name="horario"
          value={formData.horario}
          onChange={handleChange}
          placeholder="Ej: Lunes a Viernes 9am-6pm"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Precio</label>
        <input
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          placeholder="Ej: Gratis, $5, etc."
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            disabled={loading}
          />
          Activo
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={() => window.history.back()}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ============================================
// EJEMPLO 3: Eliminar con Confirmación
// ============================================
export function EjemploEliminarAtractivo({ atractivoId, onDeleted }) {
  const handleDelete = async () => {
    const confirmado = window.confirm(
      '⚠️ ¿Estás seguro de eliminar este atractivo?\nEsta acción no se puede deshacer.'
    );
    
    if (!confirmado) return;

    try {
      await atractivosApi.delete(atractivoId);
      alert('✅ Atractivo eliminado exitosamente');
      if (onDeleted) onDeleted();
    } catch (error) {
      alert('❌ Error al eliminar: ' + (error.response?.data?.message || error.message));
      console.error('Error:', error);
    }
  };

  return (
    <button className="btn-delete" onClick={handleDelete}>
      🗑️ Eliminar
    </button>
  );
}

// ============================================
// EJEMPLO 4: Usando el Helper handleApiCall
// ============================================
export function EjemploConHandleApiCall() {
  const [data, setData] = useState([]);

  const cargarDatos = async () => {
    const result = await handleApiCall(
      () => atractivosApi.getAll(),
      'Error al cargar atractivos'
    );

    if (result.success) {
      setData(result.data);
      console.log('✅ Datos cargados:', result.data);
    } else {
      console.error('❌ Error:', result.error);
      alert(result.error);
    }
  };

  return (
    <div>
      <button onClick={cargarDatos}>Cargar Datos</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// ============================================
// EJEMPLO 5: API Dinámica por Tipo de Módulo
// ============================================
export function EjemploAPIDinamica({ moduleType }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      const api = getApiByModuleType(moduleType);
      
      if (!api) {
        console.error('No hay API para el módulo:', moduleType);
        return;
      }

      try {
        const response = await api.getAll();
        setItems(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    loadItems();
  }, [moduleType]);

  return (
    <div>
      <h2>Módulo: {moduleType}</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.nombre || item.title}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// EJEMPLO 6: CRUD Completo de Restaurantes
// ============================================
export function EjemploRestaurantesCRUD() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Cargar lista
  const cargar = async () => {
    setLoading(true);
    try {
      const res = await restaurantesApi.getAll();
      setRestaurantes(res.data);
    } catch {
      alert('Error al cargar restaurantes');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar
  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar restaurante?')) return;
    
    try {
      await restaurantesApi.delete(id);
      alert('Restaurante eliminado');
      cargar(); // Recargar lista
    } catch {
      alert('Error al eliminar');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div>
      <h1>Gestión de Restaurantes</h1>
      <button onClick={() => setEditingId('nuevo')}>+ Nuevo Restaurante</button>
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {restaurantes.map(r => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{r.categoria}</td>
                <td>
                  <button onClick={() => setEditingId(r.id)}>Editar</button>
                  <button onClick={() => eliminar(r.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Mostrar formulario si hay algo en edición */}
      {editingId && (
        <div className="modal">
          <h2>{editingId === 'nuevo' ? 'Crear' : 'Editar'} Restaurante</h2>
          {/* Aquí iría tu formulario */}
          <button onClick={() => setEditingId(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

// ============================================
// EJEMPLO 7: Eventos Próximos
// ============================================
export function EjemploEventosProximos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    cargarEventosProximos();
  }, []);

  const cargarEventosProximos = async () => {
    try {
      const response = await eventosApi.getProximos();
      setEventos(response.data);
    } catch (error) {
      console.error('Error al cargar eventos próximos:', error);
    }
  };

  return (
    <div>
      <h2>📅 Próximos Eventos</h2>
      <ul>
        {eventos.map(evento => (
          <li key={evento.id}>
            <strong>{evento.nombre}</strong> - {evento.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// NOTAS DE USO
// ============================================

/*
🚀 INTEGRACIÓN EN TU PROYECTO:

1. Importar en tus componentes:
   import { atractivosApi, restaurantesApi, eventosApi } from '@/api/visitaCochaApi';

2. Usar en tus CRUDs existentes:
   - Reemplaza las llamadas a mockApi o localStoreApi
   - Mantén la misma estructura de componentes
   - Solo cambia la fuente de datos

3. Manejo de errores:
   - Todos los métodos retornan una Promise
   - Usa try/catch para manejar errores
   - Revisa error.response.data para mensajes del backend

4. Configuración del backend:
   - Asegúrate de que VITE_API_BASE_URL apunte a tu backend
   - O usa http://localhost:3000 por defecto

5. Token de autorización:
   - Se incluye automáticamente desde localStorage
   - Almacena el token con la key 'access_token'

📚 ENDPOINTS DISPONIBLES:
- /atractivos
- /restaurantes
- /eventos
- /hoteles
- /comidas
- /itinerarios
- /puntos
- /anuncios

Todos soportan: getAll, getById, create, update, delete
*/
