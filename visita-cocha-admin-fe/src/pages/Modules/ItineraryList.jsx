import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseList from '../../components/UI/BaseList';
import { AuthContext } from '../../auth/AuthContext';
import { USE_BACKEND, getContentList, deleteContent } from '../../api';
import { isSuperAdmin, isAdmin } from '../../utils/roleUtils';
import '../../styles/common.css';

const ItineraryList = () => {
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
      
      const data = await getContentList('itineraries');
      
      // Mapear _id a id para compatibilidad frontend
      const mappedData = (data || []).map(item => ({
        ...item,
        id: item._id || item.id || item.slug
      }));
      
      setItems(mappedData);
    } catch (err) {
      console.error('Error cargando itinerarios:', err);
      setError(err?.message || 'Error al cargar itinerarios');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/modules/itineraries/view/${id}`);
  };

  const handleEdit = (id) => {
    if (!id) {
      navigate('/modules/itineraries/new');
    } else {
      navigate(`/modules/itineraries/edit/${id}`);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      alert('No tienes permisos para eliminar');
      return;
    }
    
    if (!window.confirm('¿Está seguro de eliminar este itinerario?')) {
      return;
    }

    try {
      await deleteContent('itineraries', id);
      await loadData();
    } catch (err) {
      console.error('Error eliminando itinerario:', err);
      alert(err?.response?.data?.message || 'Error al eliminar el itinerario');
    }
  };

  const getColumns = () => [
    {
      key: 'title',
      label: 'Título',
      render: (val, item) => (
        <div>
          <strong>{val || 'Sin título'}</strong>
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
      key: 'description',
      label: 'Descripción',
      render: (val) => val ? (val.length > 100 ? val.substring(0, 100) + '...' : val) : '-'
    },
    {
      key: 'duration',
      label: 'Duración',
      render: (val) => val || '-'
    },
    {
      key: 'active',
      label: 'Activo',
      render: (val) => (val ? '✓' : '✗')
    },
    {
      key: 'available',
      label: 'Disponible',
      render: (val) => (val ? '✓' : '✗')
    },
    {
      key: 'order',
      label: 'Orden',
      render: (val) => val ?? 0
    }
  ];

  if (loading) {
    return (
      <div className="module-container">
        <div className="loading">Cargando itinerarios...</div>
      </div>
    );
  }

  return (
    <div className="module-container">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <BaseList
        title="Itinerarios"
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

export default ItineraryList;
