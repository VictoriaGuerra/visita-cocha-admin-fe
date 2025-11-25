# 🆕 Ejemplos de Uso - Nuevos Módulos

## Guía de uso para módulos de categorías, reviews y usuarios

---

## 🏷️ Categorías de Atractivos

### Listar Todas las Categorías

```javascript
import { attractionCategoriesApi } from '@/api/visitaCochaApi';
import { useState, useEffect } from 'react';

function AttractionCategoriesList() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await attractionCategoriesApi.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    
    try {
      await attractionCategoriesApi.delete(id);
      alert('✅ Categoría eliminada');
      cargarCategorias();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  return (
    <div>
      <h1>Categorías de Atractivos (7)</h1>
      <button onClick={() => navigate('/categorias/nueva')}>
        + Nueva Categoría
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name || cat.nombre}</td>
                <td>
                  <button onClick={() => navigate(`/categorias/${cat.id}`)}>
                    Editar
                  </button>
                  <button onClick={() => eliminarCategoria(cat.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

### Crear/Editar Categoría

```javascript
import { attractionCategoriesApi } from '@/api/visitaCochaApi';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AttractionCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    order: 0
  });

  useEffect(() => {
    if (id) cargarCategoria();
  }, [id]);

  const cargarCategoria = async () => {
    try {
      const response = await attractionCategoriesApi.getById(id);
      setFormData(response.data);
    } catch (error) {
      alert('Error al cargar categoría');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (id) {
        await attractionCategoriesApi.update(id, formData);
        alert('✅ Categoría actualizada');
      } else {
        await attractionCategoriesApi.create(formData);
        alert('✅ Categoría creada');
      }
      navigate('/categorias-atractivos');
    } catch (error) {
      alert('❌ Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Editar' : 'Nueva'} Categoría de Atractivo</h2>
      
      <input
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />

      <textarea
        placeholder="Descripción"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />

      <input
        placeholder="Ícono (emoji o clase CSS)"
        value={formData.icon}
        onChange={(e) => setFormData({...formData, icon: e.target.value})}
      />

      <input
        type="number"
        placeholder="Orden"
        value={formData.order}
        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
      />

      <button type="submit">Guardar</button>
      <button type="button" onClick={() => navigate('/categorias-atractivos')}>
        Cancelar
      </button>
    </form>
  );
}
```

---

## ⭐ Reviews/Reseñas

### Listar Reviews de un Recurso

```javascript
import { reviewsApi } from '@/api/visitaCochaApi';
import { useState, useEffect } from 'react';

function ReviewsList({ resourceType, resourceId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReviews();
  }, [resourceType, resourceId]);

  const cargarReviews = async () => {
    try {
      setLoading(true);
      
      // Obtener reviews específicas de un recurso
      const response = await reviewsApi.getByResource(resourceType, resourceId);
      setReviews(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarReview = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return;
    
    try {
      await reviewsApi.delete(id);
      alert('✅ Reseña eliminada');
      cargarReviews();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  if (loading) return <p>Cargando reseñas...</p>;

  return (
    <div>
      <h3>Reseñas ({reviews.length})</h3>
      
      {reviews.length === 0 ? (
        <p>No hay reseñas todavía</p>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="author">{review.userName || 'Anónimo'}</span>
                <span className="rating">⭐ {review.rating}/5</span>
              </div>
              <p className="review-text">{review.comment}</p>
              <div className="review-footer">
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                <button onClick={() => eliminarReview(review.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Uso en un componente de atractivo
function AtractivoDetalle({ atractivoId }) {
  return (
    <div>
      {/* ... info del atractivo ... */}
      
      <ReviewsList 
        resourceType="attraction" 
        resourceId={atractivoId} 
      />
    </div>
  );
}
```

### Crear Nueva Review

```javascript
import { reviewsApi } from '@/api/visitaCochaApi';
import { useState } from 'react';

function CreateReviewForm({ resourceType, resourceId, onSaved }) {
  const [formData, setFormData] = useState({
    resourceType,
    resourceId,
    userName: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reviewsApi.create(formData);
      alert('✅ Reseña publicada');
      
      // Limpiar formulario
      setFormData({
        ...formData,
        userName: '',
        rating: 5,
        comment: ''
      });
      
      if (onSaved) onSaved();
    } catch (error) {
      alert('❌ Error al publicar reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Agregar Reseña</h3>

      <input
        placeholder="Nombre"
        value={formData.userName}
        onChange={(e) => setFormData({...formData, userName: e.target.value})}
        required
      />

      <div>
        <label>Calificación:</label>
        <select
          value={formData.rating}
          onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
        >
          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
          <option value="4">⭐⭐⭐⭐ (4)</option>
          <option value="3">⭐⭐⭐ (3)</option>
          <option value="2">⭐⭐ (2)</option>
          <option value="1">⭐ (1)</option>
        </select>
      </div>

      <textarea
        placeholder="Escribe tu reseña..."
        value={formData.comment}
        onChange={(e) => setFormData({...formData, comment: e.target.value})}
        rows={4}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
}
```

---

## 👤 Usuarios

### Listar Usuarios

```javascript
import { usersApi } from '@/api/visitaCochaApi';
import { useState, useEffect } from 'react';

function UsersList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await usersApi.getAll();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      await usersApi.update(id, { activo: !estadoActual });
      alert('✅ Estado actualizado');
      cargarUsuarios();
    } catch (error) {
      alert('❌ Error al actualizar');
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    
    try {
      await usersApi.delete(id);
      alert('✅ Usuario eliminado');
      cargarUsuarios();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  return (
    <div>
      <h1>Usuarios (3)</h1>
      <button onClick={() => navigate('/usuarios/nuevo')}>
        + Nuevo Usuario
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.name || user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.role || user.rol}</td>
                <td>
                  <span className={user.activo ? 'badge-active' : 'badge-inactive'}>
                    {user.activo ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </td>
                <td>
                  <button onClick={() => navigate(`/usuarios/${user.id}`)}>
                    Editar
                  </button>
                  <button onClick={() => toggleEstado(user.id, user.activo)}>
                    {user.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => eliminarUsuario(user.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## 🗺️ Rutas/Itinerarios

### Gestión de Rutas

```javascript
import { rutasApi } from '@/api/visitaCochaApi';
import { useState, useEffect } from 'react';

function RutasList() {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarRutas();
  }, []);

  const cargarRutas = async () => {
    try {
      const response = await rutasApi.getAll();
      setRutas(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const crearRutaEjemplo = async () => {
    try {
      await rutasApi.create({
        name: 'Tour Centro Histórico',
        description: 'Recorrido por los principales atractivos del centro',
        duration: '3 horas',
        distance: '5 km',
        difficulty: 'Fácil',
        stops: [
          { order: 1, placeId: 'atractivo-1', duration: '30 min' },
          { order: 2, placeId: 'atractivo-2', duration: '45 min' },
          { order: 3, placeId: 'atractivo-3', duration: '30 min' },
        ],
        active: true
      });
      
      alert('✅ Ruta creada');
      cargarRutas();
    } catch (error) {
      alert('❌ Error al crear ruta');
    }
  };

  return (
    <div>
      <h1>Rutas e Itinerarios</h1>
      
      {rutas.length === 0 ? (
        <div className="empty-state">
          <p>⚠️ Colección vacía - No hay rutas todavía</p>
          <button onClick={crearRutaEjemplo}>
            + Crear Ruta de Ejemplo
          </button>
        </div>
      ) : (
        <div className="rutas-grid">
          {rutas.map(ruta => (
            <div key={ruta.id} className="ruta-card">
              <h3>{ruta.name}</h3>
              <p>{ruta.description}</p>
              <div className="ruta-info">
                <span>⏱️ {ruta.duration}</span>
                <span>📏 {ruta.distance}</span>
                <span>💪 {ruta.difficulty}</span>
              </div>
              <button onClick={() => navigate(`/rutas/${ruta.id}`)}>
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Uso Combinado - Dashboard con Todos los Módulos

```javascript
import { 
  atractivosApi,
  restaurantesApi,
  eventosApi,
  comidasApi,
  anunciosApi,
  hotelesApi,
  puntosApi,
  rutasApi,
  attractionCategoriesApi,
  restaurantCategoriesApi,
  mainCategoriesApi,
  reviewsApi,
  usersApi
} from '@/api/visitaCochaApi';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    atractivos: 0,
    restaurantes: 0,
    eventos: 0,
    comidas: 0,
    anuncios: 0,
    hoteles: 0,
    pois: 0,
    rutas: 0,
    categorias: 0,
    reviews: 0,
    usuarios: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      
      // Cargar todas las colecciones en paralelo
      const [
        atractivos,
        restaurantes,
        eventos,
        comidas,
        anuncios,
        hoteles,
        pois,
        rutas,
        attractionCats,
        restaurantCats,
        mainCats,
        reviews,
        usuarios
      ] = await Promise.all([
        atractivosApi.getAll(),
        restaurantesApi.getAll(),
        eventosApi.getAll(),
        comidasApi.getAll(),
        anunciosApi.getAll(),
        hotelesApi.getAll(),
        puntosApi.getAll(),
        rutasApi.getAll(),
        attractionCategoriesApi.getAll(),
        restaurantCategoriesApi.getAll(),
        mainCategoriesApi.getAll(),
        reviewsApi.getAll(),
        usersApi.getAll()
      ]);

      setStats({
        atractivos: atractivos.data.length,
        restaurantes: restaurantes.data.length,
        eventos: eventos.data.length,
        comidas: comidas.data.length,
        anuncios: anuncios.data.length,
        hoteles: hoteles.data.length,
        pois: pois.data.length,
        rutas: rutas.data.length,
        categorias: attractionCats.data.length + restaurantCats.data.length + mainCats.data.length,
        reviews: reviews.data.length,
        usuarios: usuarios.data.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando estadísticas...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard - Visita Cocha</h1>
      
      <div className="stats-grid">
        <StatCard icon="🏛️" title="Atractivos" value={stats.atractivos} />
        <StatCard icon="🍽️" title="Restaurantes" value={stats.restaurantes} />
        <StatCard icon="🎉" title="Eventos" value={stats.eventos} />
        <StatCard icon="🍴" title="Comidas" value={stats.comidas} />
        <StatCard icon="📢" title="Anuncios" value={stats.anuncios} />
        <StatCard icon="🏨" title="Hoteles" value={stats.hoteles} />
        <StatCard icon="📍" title="POIs" value={stats.pois} />
        <StatCard icon="🗺️" title="Rutas" value={stats.rutas} />
        <StatCard icon="🏷️" title="Categorías" value={stats.categorias} />
        <StatCard icon="⭐" title="Reviews" value={stats.reviews} />
        <StatCard icon="👤" title="Usuarios" value={stats.usuarios} />
      </div>
      
      <button onClick={cargarEstadisticas}>
        🔄 Refrescar Estadísticas
      </button>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );
}
```

---

## ✅ Resumen de Nuevos Módulos

### Categorías (3 tipos)
- `attractionCategoriesApi` - 7 categorías
- `restaurantCategoriesApi` - 8 categorías
- `mainCategoriesApi` - 9 categorías

### Reviews
- `reviewsApi` - 4 reseñas
- Método especial: `getByResource(type, id)`

### Usuarios
- `usersApi` - 3 usuarios

### Rutas
- `rutasApi` - Colección vacía (lista para usar)

---

¡Todos los módulos tienen ejemplos completos y están listos para usar! 🚀
