import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BaseList from '../../components/UI/BaseList';
import { AuthContext } from '../../auth/AuthContext';
import { USE_BACKEND, getContentList, deleteContent } from '../../api';
import { BACKEND_CAPABILITIES } from '../../config/backendEndpoints';
import { isSuperAdmin, isAdmin, isMantenedor } from '../../utils/roleUtils';

const ModuleGenericList = () => {
  const { moduleType } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Función auxiliar para mapear datos del backend
  const mapBackendData = (data) => {
    return data.map(item => {
      const mapped = {
        ...item,
        id: item._id || item.id // Usar _id como id si existe
      };
      
      // Mapeo específico para eventos (backend en español → frontend en inglés)
      if (moduleType === 'events') {
        mapped.name = item.nombre || item.name || '';
        mapped.startDate = item.fecha || item.startDate || '';
        mapped.endDate = item.fecha || item.endDate || '';
        mapped.venueName = item.lugar || item.venueName || '';
        mapped.active = item.disponible ?? item.active ?? true;
        mapped.isFeatured = item.destacado ?? item.isFeatured ?? false;
      }
      
      // Mapeo específico para hotels (backend en español → frontend en inglés)
      if (moduleType === 'hotels') {
        mapped.name = item.nombre || item.name || '';
        mapped.stars = item.estrellas ?? item.stars ?? 0;
        mapped.rating = item.rating ?? 0;
        mapped.active = item.disponible ?? item.active ?? true;
      }
      
      // Mapeo específico para points/pois (backend en español → frontend en inglés)
      if (moduleType === 'points' || moduleType === 'pois') {
        mapped.name = item.nombre || item.name || '';
        mapped.categories = item.categorias || item.categories || [];
        mapped.available = item.disponible ?? item.available ?? true;
        mapped.isFeatured = item.destacado ?? item.isFeatured ?? false;
        mapped.order = item.orden ?? item.order ?? 0;
      }
      
      return mapped;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!moduleType) {
        navigate('/modules');
        return;
      }

      try {
        let data = [];
        if (!USE_BACKEND) {
          setErr('🔥 Backend requerido. Configura VITE_USE_BACKEND=true en .env');
          setLoading(false);
          return;
        }
        
        try {
          data = await getContentList(moduleType);
          console.log('[ModuleGenericList] Datos obtenidos:', moduleType, data);
          
          // ⚠️ IMPORTANTE: El backend devuelve _id pero el frontend usa id
          // Mapear _id a id para que funcione correctamente
          data = mapBackendData(data);
          
          if (data && data.length > 0) {
            window.lastItem = data[0]; // Para debugging
            console.log('[ModuleGenericList] Primer item:', data[0]);
            console.log('[ModuleGenericList] Claves del primer item:', Object.keys(data[0]));
            console.log('[ModuleGenericList] _id del primer item:', data[0]._id);
            console.log('[ModuleGenericList] id mapeado del primer item:', data[0].id);
            console.log('[ModuleGenericList] Slug:', data[0].slug);
          }
        } catch (e) {
          console.error('Error obteniendo datos del backend:', e?.message || e);
          setErr(e?.message || 'Error obteniendo datos del backend. Verifica que el backend esté corriendo en localhost:3000');
          data = [];
        }
        
        // Filtrado por rol y acceso granular
        let visible = data || [];
        if (user) {
          const isMantenedorRole = isMantenedor(user);
          const isAdminRole = isAdmin(user);
          const isSuperAdminRole = isSuperAdmin(user);
          
          // Mantenedor: puede ver todos los datos, pero solo editar elementos autorizados
          // La restricción de edición/eliminación se maneja en los permisos más abajo
          if (isMantenedorRole) {
            const access = user.moduleAccess?.[moduleType];
            if (access?.elements?.length) {
              // Si tiene elementos específicos asignados, solo mostrar esos
              visible = visible.filter(it => access.elements.includes(it.id));
            }
            // Si no tiene elementos asignados, ve todos (pero sin poder editar/eliminar)
          }
          
          // Admin: si tiene lista de elementos específicos, también filtrar (por si se asignó granularmente)
          if (isAdminRole && user.moduleAccess?.[moduleType]?.elements?.length) {
            visible = visible.filter(it => user.moduleAccess[moduleType].elements.includes(it.id));
          }
          // SuperAdmin ve todo
        }
        setItems(visible);
      } catch (error) {
        console.error('Error loading data:', error);
        setErr(error?.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [moduleType, navigate]);

  // onEdit se usa tanto para crear (sin id) como para editar (con id)
  const handleEdit = (id) => {
    if (!id) {
      navigate(`/modules/${moduleType}/new`);
    } else {
      navigate(`/modules/${moduleType}/edit/${id}`);
    }
  };

  const handleView = (id) => {
    // Ver = abrir en modo solo lectura
    const targetUrl = `/modules/${moduleType}/view/${id}`;
    console.log('[ModuleGenericList] Navegando a vista:', targetUrl, 'desde moduleType:', moduleType);
    navigate(targetUrl);
  };

  const handleDelete = async (id) => {
    if (!canDelete) { alert('No tienes permisos para eliminar'); return; }
    if (window.confirm('¿Está seguro de eliminar este elemento?')) {
      try {
        if (USE_BACKEND) {
          await deleteContent(moduleType, id)
        } else {
          await localStoreApi.delete(moduleType, id);
        }
        const updatedData = await getContentList(moduleType);
        
        // Aplicar el mismo mapeo que en useEffect
        let visible = mapBackendData(updatedData || []);
        
        // mantener el mismo filtrado post-eliminación
        if (user) {
          const isMantenedorRole = isMantenedor(user);
          const isAdminRole = isAdmin(user);
          if (isMantenedorRole) {
            const access = user.moduleAccess?.[moduleType];
            if (access?.elements?.length) {
              visible = visible.filter(it => access.elements.includes(it.id));
            }
            // Si no tiene elementos asignados, ve todos
          }
          if (isAdminRole && user.moduleAccess?.[moduleType]?.elements?.length) {
            visible = visible.filter(it => user.moduleAccess[moduleType].elements.includes(it.id));
          }
        }
        setItems(visible);
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error al eliminar el elemento');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  const moduleTitle = {
    attractions: 'Atracciones Turísticas',
    restaurants: 'Restaurantes',
    foods: 'Comidas',
    itineraries: 'Itinerarios',
    mainCategories: 'Categorías Principales',
    announcements: 'Anuncios',
    points: 'Puntos de Interés'
  }[moduleType] || moduleType;

  // Columnas específicas para cada módulo
  const getColumns = () => {
    switch (moduleType) {
      case 'attractions':
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'categories', label: 'Categorías', render: (value) => Array.isArray(value) ? value.join(', ') : '-' },
          { key: 'rating', label: 'Calificación' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' },
          { key: 'order', label: 'Orden' }
        ];
      
      case 'restaurants':
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'mainCategories', label: 'Categorías', render: (value) => Array.isArray(value) ? value.join(', ') : '-' },
          { key: 'rating', label: 'Calificación' },
          { key: 'isFeatured', label: 'Destacado', render: (value) => value ? '★' : '' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' }
        ];
      
      case 'foods':
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'description', label: 'Descripción' },
          { key: 'ingredients', label: 'Ingredientes', render: (value) => Array.isArray(value) ? value.length : 0 },
          { key: 'rating', label: 'Calificación' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' },
          { key: 'order', label: 'Orden' }
        ];
      
      case 'itineraries':
        return [
          { key: 'title', label: 'Título' },
          { key: 'duration', label: 'Duración' },
          { key: 'active', label: 'Activo', render: (value) => value ? '✓' : '✗' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' },
          { key: 'order', label: 'Orden' }
        ];
      
      case 'mainCategories':
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'icon', label: 'Icono' },
          { key: 'isFeatured', label: 'Destacado', render: (value) => value ? '★' : '' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' },
          { key: 'order', label: 'Orden' }
        ];
      case 'events':
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'startDate', label: 'Inicio' },
          { key: 'endDate', label: 'Fin' },
          { key: 'venueName', label: 'Lugar' },
          { key: 'active', label: 'Activo', render: (value) => value ? '✓' : '✗' },
          { key: 'isFeatured', label: 'Destacado', render: (value) => value ? '★' : '' }
        ];
      case 'hotels':
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'stars', label: 'Estrellas' },
          { key: 'rating', label: 'Calificación' },
          { key: 'isFeatured', label: 'Destacado', render: (value) => value ? '★' : '' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' }
        ];
      case 'announcements':
        return [
          { key: 'title', label: 'Título' },
          { key: 'startDate', label: 'Inicio' },
          { key: 'endDate', label: 'Fin' },
          { key: 'active', label: 'Activo', render: (value) => value ? '✓' : '✗' },
          { key: 'isFeatured', label: 'Destacado', render: (value) => value ? '★' : '' },
          { key: 'order', label: 'Orden' }
        ];
      case 'points':
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'categories', label: 'Categorías', render: (value) => {
            if (!Array.isArray(value) || value.length === 0) return '-';
            return (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {value.map((cat, idx) => (
                  <span key={idx} style={{ 
                    padding: '2px 8px', 
                    background: '#e3f2fd', 
                    borderRadius: '12px', 
                    fontSize: '0.85em',
                    whiteSpace: 'nowrap'
                  }}>
                    {cat}
                  </span>
                ))}
              </div>
            );
          }},
          { key: 'isFeatured', label: 'Destacado', render: (value) => value ? '✓' : '' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' },
          { key: 'order', label: 'Orden' }
        ];
      
      default:
        return [
          { key: 'name', label: 'Nombre' },
          { key: 'description', label: 'Descripción' },
          { key: 'available', label: 'Disponible', render: (value) => value ? '✓' : '✗' }
        ];
    }
  };

  // Permisos acción
  const isSuperAdminRole = isSuperAdmin(user);
  const isAdminRole = isAdmin(user);
  const isMantenedorRole = isMantenedor(user);

  const caps = BACKEND_CAPABILITIES[moduleType] || { create:false, update:false, delete:false }
  const backendReadOnly = USE_BACKEND && !(caps.create || caps.update || caps.delete)
  const canDelete = USE_BACKEND ? (caps.delete && (isSuperAdminRole || isAdminRole)) : (isSuperAdminRole || isAdminRole)
  const canAdd = USE_BACKEND ? (caps.create && (isSuperAdminRole || isAdminRole)) : (isSuperAdminRole || isAdminRole)
  // Para editar: Super/Admin pueden editar cualquier del listado; Mantenedor solo si el elemento está dentro de su lista
  const canEditRow = (id) => {
    if (isSuperAdminRole || isAdminRole) return true;
    if (isMantenedorRole) {
      const allowed = user?.moduleAccess?.[moduleType]?.elements || [];
      return allowed.includes(id);
    }
    return false;
  };

  const handleSafeEdit = (id) => {
    if (!id && !canAdd) return; // crear no permitido
    if (id && !canEditRow(id)) return;
    handleEdit(id);
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>{moduleTitle}</h2>
      </div>
      {USE_BACKEND && err && (
        <div className="error-message" style={{ marginBottom: 12 }}>{err}</div>
      )}

      <BaseList
        title={moduleTitle}
        items={items}
        columns={getColumns()}
        onView={handleView}
        onEdit={handleSafeEdit}
        onDelete={canDelete ? handleDelete : () => {}}
        canEdit={canAdd}
        canDelete={canDelete}
        canAdd={canAdd}
        readOnlyReason={backendReadOnly ? 'Backend activo sin soporte de edición para este módulo.' : undefined}
      />
    </div>
  );
};

export default ModuleGenericList;