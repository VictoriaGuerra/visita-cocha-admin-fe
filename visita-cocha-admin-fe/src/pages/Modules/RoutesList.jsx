import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseList from '../../components/UI/BaseList';
import { AuthContext } from '../../auth/AuthContext';
import { USE_BACKEND, getContentList, deleteContent } from '../../api';
import { isSuperAdmin, isAdmin } from '../../utils/roleUtils';
import '../../styles/common.css';

const RoutesList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canDelete = isSuperAdmin(user) || isAdmin(user);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!USE_BACKEND) {
        setError('Backend requerido. Configura VITE_USE_BACKEND=true en .env');
        return;
      }
      
      const data = await getContentList('routes');
      
      // Mapear _id a id para compatibilidad frontend
      const mappedData = (data || []).map(item => ({
        ...item,
        id: item._id || item.id
      }));
      
      setItems(mappedData);
    } catch (err) {
      console.error('Error cargando rutas:', err);
      setError(err?.message || 'Error al cargar rutas');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/modules/routes/view/${id}`);
  };

  const handleEdit = (id) => {
    if (!id) {
      navigate('/modules/routes/new');
    } else {
      navigate(`/modules/routes/edit/${id}`);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      alert('No tienes permisos para eliminar');
      return;
    }
    
    if (!window.confirm('¿Está seguro de eliminar esta ruta?')) {
      return;
    }

    try {
      await deleteContent('routes', id);
      await loadData();
    } catch (err) {
      console.error('Error eliminando ruta:', err);
      alert(err?.response?.data?.message || 'Error al eliminar la ruta');
    }
  };

  const getColumns = () => [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (val, item) => (
        <div>
          <strong>{val || 'Sin nombre'}</strong>
          {item.coverUrl && (
            <div style={{ marginTop: 5 }}>
              <img 
                src={item.coverUrl} 
                alt={val} 
                style={{ maxWidth: 100, maxHeight: 60, objectFit: 'cover', borderRadius: 4 }}
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (val) => val ? (val.length > 100 ? val.substring(0, 100) + '...' : val) : '-'
    },
    {
      key: 'puntos',
      label: 'Puntos',
      render: (_, item) => {
        const total = (item.hoteles?.length || 0) + (item.restaurantes?.length || 0) + (item.pois?.length || 0);
        return (
          <div style={{ fontSize: 12 }}>
            {item.hoteles?.length > 0 && <div>🏨 {item.hoteles.length} hoteles</div>}
            {item.restaurantes?.length > 0 && <div>🍽️ {item.restaurantes.length} restaurantes</div>}
            {item.pois?.length > 0 && <div>📍 {item.pois.length} POIs</div>}
            {total === 0 && <span style={{ color: '#999' }}>Sin puntos</span>}
          </div>
        );
      }
    },
    {
      key: 'duracionEstimada',
      label: 'Duración',
      render: (val) => val || '-'
    },
    {
      key: 'distanciaKm',
      label: 'Distancia',
      render: (val) => val ? `${val} km` : '-'
    },
    {
      key: 'disponible',
      label: 'Disponible',
      render: (val) => (val ? '✓' : '✗')
    }
  ];

  if (loading) {
    return (
      <div className="module-container">
        <div className="loading">Cargando rutas turísticas...</div>
      </div>
    );
  }

  return (
    <div className="module-container">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <BaseList
        title="Rutas Turísticas"
        items={items}
        columns={getColumns()}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={canDelete ? handleDelete : null}
        canEdit={true}
        canDelete={canDelete}
        canAdd={true}
      />
    </div>
  );
};

export default RoutesList;
