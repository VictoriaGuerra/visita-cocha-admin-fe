import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MultiSelect from '../UI/MultiSelect';
import LocationField from '../UI/LocationField';
import ScheduleField from '../UI/ScheduleField';
import ImageUpload from '../UI/ImageUpload';
import './ModuleForm.css';

const moduleConfigs = {
  attractions: {
    name: 'Atractivos Turísticos',
    icon: 'fa-landmark',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true },
      { name: 'location', label: 'Ubicación', type: 'location', required: true },
      { name: 'categories', label: 'Categorías', type: 'multiselect', options: ['Cultural', 'Natural', 'Histórico', 'Recreativo'] },
      { name: 'schedule', label: 'Horario', type: 'schedule' },
      { name: 'images', label: 'Imágenes', type: 'images', multiple: true },
      { name: 'price', label: 'Precio', type: 'number', min: 0 }
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
  const { moduleType: routeModuleType, id } = useParams(); // route param name used in App routes
  const isEditing = !!id;
  const [formData, setFormData] = useState({});
  // allow caller to pass moduleType/config via props (ModuleFormWrapper) or via route param
  const effectiveType = propModuleType || routeModuleType;
  const moduleConfig = propConfig || moduleConfigs[effectiveType];

  useEffect(() => {
    if (isEditing && id) {
      // TODO: Implementar la carga de datos desde la API
      // Por ahora usando datos de ejemplo
      setFormData({
        name: 'Ejemplo',
        description: 'Descripción de ejemplo',
      });
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implementar el envío del formulario
  console.log('Formulario enviado:', formData);
  navigate(`/modules/${effectiveType}`);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  if (!moduleConfig) {
    // Si no hay configuración para este tipo, mostrar un aviso y un botón para volver
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

  return (
    <div className="module-form">
      <div className="module-form-header">
        <div className="module-form-title">
          <i className={`fas ${moduleConfig.icon}`}></i>
          <h2>{isEditing ? `Editar ${moduleConfig.name}` : `Nuevo ${moduleConfig.name}`}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          {moduleConfig.fields.map(field => (
            <div key={field.name} className="form-field">
              <label htmlFor={field.name}>{field.label}</label>
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
                        value={formData[field.name] || { lat: '', lng: '', address: '' }}
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
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Guardar Cambios' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModuleForm;