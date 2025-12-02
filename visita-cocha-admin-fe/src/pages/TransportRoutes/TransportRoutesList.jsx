import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseList from '../../components/UI/BaseList';
import { AuthContext } from '../../auth/AuthContext';
import { USE_BACKEND, getContentList, deleteContent } from '../../api';
import { isSuperAdmin, isAdmin } from '../../utils/roleUtils';
import '../../styles/common.css';

const TransportRoutesList = () => {
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
      
      const data = await getContentList('transport-routes');
      setItems(data || []);
    } catch (err) {
      console.error('Error cargando rutas de transporte:', err);
      setError(err?.message || 'Error al cargar rutas de transporte');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/transport-routes/view/${id}`);
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      alert('No tienes permisos para eliminar');
      return;
    }
    
    if (!window.confirm('¿Está seguro de eliminar esta ruta de transporte? El archivo también será eliminado.')) {
      return;
    }

    try {
      await deleteContent('transport-routes', id);
      await loadData();
    } catch (err) {
      console.error('Error eliminando ruta:', err);
      alert(err?.response?.data?.message || 'Error al eliminar la ruta de transporte');
    }
  };

  const getColumns = () => [
    {
      key: 'name',
      label: 'Nombre',
      render: (val, item) => (
        <div>
          <strong>{val || item.id || 'Sin nombre'}</strong>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            ID: {item.id}
          </div>
        </div>
      )
    },
    {
      key: 'routeType',
      label: 'Tipo',
      render: (val) => {
        const types = {
          bus: '🚌 Bus',
          micro: '🚍 Micro',
          trolebus: '🚎 Trolebús',
          taxi: '🚕 Taxi',
          otro: '🚗 Otro'
        };
        return types[val] || val || '-';
      }
    },
    {
      key: 'fileName',
      label: 'Archivo',
      render: (val, item) => (
        <div>
          <div>{val || '-'}</div>
          {item.fileType && (
            <span style={{
              background: item.fileType === 'kml' ? '#dbeafe' : '#dcfce7',
              color: item.fileType === 'kml' ? '#1e40af' : '#166534',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              marginTop: 4,
              display: 'inline-block'
            }}>
              {item.fileType.toUpperCase()}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'color',
      label: 'Color',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24,
            height: 24,
            background: val || '#3f908e',
            borderRadius: '4px',
            border: '1px solid #d1d5db'
          }}></div>
          <span style={{ fontSize: 12, color: '#6b7280' }}>{val || '#3f908e'}</span>
        </div>
      )
    },
    {
      key: 'active',
      label: 'Activo',
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
        <div className="loading">Cargando rutas de transporte...</div>
      </div>
    );
  }

  return (
    <div className="module-container">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <BaseList
        title="Rutas de Transporte"
        items={items}
        columns={getColumns()}
        onView={handleView}
        onDelete={canDelete ? handleDelete : null}
        canEdit={false}
        canDelete={canDelete}
        canAdd={true}
        onAdd={() => navigate('/transport-routes/new')}
        idField="id"
      />
    </div>
  );
};

export default TransportRoutesList;
