import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseList from '../UI/BaseList';
import { AuthContext } from '../../auth/AuthContext';
import { fetchTouristAttractions, deleteTouristAttraction } from '../../api/api';

const TouristAttractionsList = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const canEdit = ['superadmin', 'admin'].includes(user?.role);
  const canDelete = user?.role === 'superadmin';

  // Cargar los atractivos al montar el componente
  useEffect(() => {
    loadAttractions();
  }, []);

  // Función para cargar atractivos
  const loadAttractions = async () => {
    setLoading(true);
    try {
      const data = await fetchTouristAttractions();
      console.log('Datos recibidos:', data); // para depurar
      setAttractions(data);
    } catch (err) {
      setError('Error al cargar los atractivos turísticos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de acción
  const handleEdit = (id) => {
    navigate(id ? `/attractions/${id}/edit` : '/attractions/new');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este atractivo turístico?')) {
      try {
        await deleteTouristAttraction(id);
        await loadAttractions();
      } catch (err) {
        setError('Error al eliminar el atractivo turístico');
        console.error(err);
      }
    }
  };

  const handleView = (id) => {
    navigate(`/attractions/${id}`);
  };

  // Columnas para BaseList
  const columns = [
    { key: '_id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'city', label: 'Ciudad' },
    { key: 'category', label: 'Categoría' },
    { key: 'status', 
      label: 'Estado',
      render: (value) => (
        <span className={`badge badge-${value ? 'success' : 'warning'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    { key: 'createdAt', 
      label: 'Fecha creación',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <BaseList
      title="Atractivos Turísticos"
      items={attractions}
      columns={columns}
      onEdit={(item) => handleEdit(item._id)}
      onDelete={(item) => handleDelete(item._id)}
      onView={(item) => handleView(item._id)}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
};

export default TouristAttractionsList;
