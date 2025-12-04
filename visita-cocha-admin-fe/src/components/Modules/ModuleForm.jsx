import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MultiSelect from '../UI/MultiSelect';
import LocationField from '../UI/LocationField';
import ScheduleField from '../UI/ScheduleField';
import ImageUpload from '../UI/ImageUpload';
import { getApiByModuleType } from '../../api/visitaCochaApi';
import './ModuleForm.css';

const moduleConfigs = {
  attractions: {
    name: 'Atractivos Turísticos',
    icon: 'fa-landmark',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'slug', label: 'Slug (URL)', type: 'text', required: true, help: 'Ejemplo: parque-tunari' },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
      { name: 'location', label: 'Ubicación', type: 'location', required: true },
      { name: 'coverUrl', label: 'URL de imagen', type: 'url', placeholder: 'https://ejemplo.com/imagen.jpg' },
      { name: 'categories', label: 'Categorías', type: 'multiselect', options: ['popular', 'historico', 'entretenimiento', 'plazas', 'parques', 'iglesias', 'museos', 'tiendas'] },
      { name: 'mainCategories', label: 'Categorías Principales', type: 'multiselect', options: ['populares', 'patrimonio', 'naturaleza', 'entretenimiento', 'religioso', 'museos', 'historia'] },
      { name: 'accessibility', label: 'Accesibilidad', type: 'textarea' },
      { name: 'rating', label: 'Calificación', type: 'number', min: 1, max: 5 },
      { name: 'order', label: 'Orden', type: 'number', min: 0 },
      { name: 'contactPhone', label: 'Teléfono', type: 'tel' },
      { name: 'contactMail', label: 'Email', type: 'email' },
      { name: 'contactLink', label: 'Sitio Web', type: 'url' },
      { name: 'isFeatured', label: 'Destacado', type: 'checkbox' },
      { name: 'available', label: 'Disponible', type: 'checkbox', defaultValue: true },
      { name: 'active', label: 'Activo', type: 'checkbox', defaultValue: true },
    ]
  },
  restaurants: {
    name: 'Restaurantes',
    icon: 'fa-utensils',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
      { name: 'location', label: 'Ubicación', type: 'location', required: true },
      { name: 'cuisine', label: 'Tipo de Cocina', type: 'select', options: ['Tradicional', 'Internacional', 'Fusión', 'Rápida'] },
      { name: 'schedule', label: 'Horario', type: 'schedule' },
      { name: 'images', label: 'Imágenes', type: 'images', multiple: true },
      { name: 'priceRange', label: 'Rango de Precios', type: 'select', options: ['$', '$$', '$$$'] }
    ]
  },
  hotels: {
    name: 'Hoteles',
    icon: 'fa-hotel',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
      { name: 'location', label: 'Ubicación', type: 'location', required: true },
      { name: 'category', label: 'Categoría', type: 'select', options: ['1 Estrella', '2 Estrellas', '3 Estrellas', '4 Estrellas', '5 Estrellas'] },
      { name: 'amenities', label: 'Comodidades', type: 'multiselect', options: ['WiFi', 'Piscina', 'Estacionamiento', 'Restaurante', 'Spa'] },
      { name: 'images', label: 'Imágenes', type: 'images', multiple: true },
      { name: 'priceRange', label: 'Rango de Precios', type: 'select', options: ['Económico', 'Moderado', 'Premium'] }
    ]
  },
  events: {
    name: 'Eventos',
    icon: 'fa-calendar',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
      { name: 'location', label: 'Ubicación', type: 'location', required: true },
      { name: 'date', label: 'Fecha', type: 'date', required: true },
      { name: 'schedule', label: 'Horario', type: 'schedule' },
      { name: 'images', label: 'Imágenes', type: 'images', multiple: true },
      { name: 'price', label: 'Precio', type: 'number', min: 0 },
      { name: 'categories', label: 'Categorías', type: 'multiselect', options: ['Cultural', 'Deportivo', 'Musical', 'Gastronómico'] }
    ]
  }
};

const ModuleForm = ({ moduleType: propModuleType = null, config: propConfig = null }) => {
  const navigate = useNavigate();
  const { moduleType: routeModuleType, id } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    available: true,
    active: true,
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const effectiveType = propModuleType || routeModuleType;
  const moduleConfig = propConfig || moduleConfigs[effectiveType];

  useEffect(() => {
    if (isEditing && id) {
      loadData();
    }
  }, [isEditing, id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const apiModule = getApiByModuleType(effectiveType);
      const response = await apiModule.getById(id);
      const data = response.data;
      
      // Mapear los datos del backend al formato del formulario
      setFormData({
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        location: data.location || { coords: { lat: '', lng: '' }, address: '' },
        coverUrl: data.coverUrl || '',
        categories: data.categories || [],
        mainCategories: data.mainCategories || [],
        accessibility: data.accessibility || '',
        rating: data.rating || 5,
        order: data.order || 0,
        contactPhone: data.contact?.phone || '',
        contactMail: data.contact?.mail || '',
        contactLink: data.contact?.link || '',
        isFeatured: data.isFeatured || false,
        available: data.available !== undefined ? data.available : true,
        active: data.active !== undefined ? data.active : true,
      });
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos');
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
    setError(null);
    setLoading(true);

    try {
      const apiModule = getApiByModuleType(effectiveType);
      
      // Mapear los datos del formulario al formato que espera el backend
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        location: {
          coords: {
            lat: formData.location?.coords?.lat || '',
            lng: formData.location?.coords?.lng || ''
          },
          address: formData.location?.address || ''
        },
        coverUrl: formData.coverUrl || '',
        categories: Array.isArray(formData.categories) ? formData.categories : [],
        mainCategories: Array.isArray(formData.mainCategories) ? formData.mainCategories : [],
        accessibility: formData.accessibility || '',
        rating: Number(formData.rating) || 5,
        order: Number(formData.order) || 0,
        contact: {
          phone: formData.contactPhone || '',
          mail: formData.contactMail || '',
          link: formData.contactLink || ''
        },
        isFeatured: formData.isFeatured || false,
        available: formData.available !== undefined ? formData.available : true,
        active: formData.active !== undefined ? formData.active : true,
        metadata: {
          likes: 0,
          views: 0
        },
        faq: [],
        foods: []
      };

      console.log('📤 Enviando datos al backend:', payload);

      if (isEditing) {
        await apiModule.update(id, payload);
        console.log('✅ Actualizado exitosamente');
      } else {
        const response = await apiModule.create(payload);
        console.log('✅ Creado exitosamente:', response.data);
      }

      navigate(`/modules/${effectiveType}`);
    } catch (err) {
      console.error('❌ Error al enviar el formulario:', err);
      setError(err.response?.data?.message || err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (!moduleConfig) {
    return (
      <div className="module-form">
        <div className="module-form-header">
          <h2>Tipo de módulo no válido</h2>
          <p>El tipo de módulo <strong>{effectiveType || 'no especificado'}</strong> no existe.</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/modules')}>Volver a módulos</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && isEditing) {
    return (
      <div className="module-form">
        <div className="module-form-header">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="module-form">
      <div className="module-form-header">
        <div className="module-form-title">
          <i className={`fas ${moduleConfig.icon}`}></i>
          <h2>{isEditing ? `Editar ${moduleConfig.name}` : `Nuevo ${moduleConfig.name}`}</h2>
        </div>
      </div>

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          color: '#dc2626', 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          {moduleConfig.fields.map(field => (
            <div key={field.name} className="form-field">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span style={{ color: '#dc2626' }}> *</span>}
              </label>
              {field.help && <small style={{ color: '#6b7280', display: 'block', marginBottom: '4px' }}>{field.help}</small>}
              {(() => {
                switch (field.type) {
                  case 'textarea':
                    return (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    );
                  case 'select':
                    return (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                      >
                        <option value="">Seleccionar...</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    );
                  case 'multiselect':
                    return (
                      <MultiSelect
                        options={field.options}
                        value={formData[field.name] || []}
                        onChange={(value) => handleChange({
                          target: { name: field.name, value }
                        })}
                      />
                    );
                  case 'location':
                    return (
                      <LocationField
                        value={formData[field.name] || { coords: { lat: '', lng: '' }, address: '' }}
                        onChange={(value) => handleChange({
                          target: { name: field.name, value }
                        })}
                      />
                    );
                  case 'schedule':
                    return (
                      <ScheduleField
                        value={formData[field.name] || []}
                        onChange={(value) => handleChange({
                          target: { name: field.name, value }
                        })}
                      />
                    );
                  case 'images':
                    return (
                      <ImageUpload
                        value={formData[field.name] || []}
                        onChange={(value) => handleChange({
                          target: { name: field.name, value }
                        })}
                        multiple={field.multiple}
                      />
                    );
                  case 'checkbox':
                    return (
                      <div style={{ marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            id={field.name}
                            name={field.name}
                            checked={formData[field.name] || false}
                            onChange={handleChange}
                          />
                          <span>{field.label}</span>
                        </label>
                      </div>
                    );
                  case 'url':
                  case 'email':
                  case 'tel':
                    return (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                    );
                  default:
                    return (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                      />
                    );
                }
              })()}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(`/modules/${effectiveType}`)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModuleForm;