import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';
import '../../styles/categories.css';

const AttractionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isView = location.pathname.includes('/view/');
  const isEdit = Boolean(id) && !isView;

  console.log('🆔 ID desde URL params:', id);
  console.log('📝 Modo de edición:', isEdit);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    coverUrl: '',
    available: true,
    active: true,
    isFeatured: false,
    categoria: '', // Una sola categoría como string (se mapea a categories[])
    location: {
      address: '',
      coords: {
        lat: '',
        lng: ''
      }
    },
    contact: {
      phone: '',
      mail: '',
      link: ''
    },
    accessibility: '',
    rating: 0,
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Categorías (cargadas dinámicamente)
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);

  useEffect(() => {
    loadCategories();
    if ((isEdit || isView) && id) {
      loadAttraction();
    }
  }, [id, isEdit, isView]);

  const loadAttraction = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando atracción con ID:', id);
      
      const response = await api.getContentById('attractions', id);
      const data = response.data || response;
      
      console.log('📥 RESPUESTA COMPLETA del backend:', JSON.stringify(data, null, 2));
      console.log('🔍 ID del registro recibido:', data._id);
      console.log('🔍 Name del registro recibido:', data.name);
      console.log('🔍 Slug del registro recibido:', data.slug);
      console.log('🔍 Categorías del backend:', data.categories);
      console.log('🔍 Location del backend:', data.location);
      console.log('🔍 Coords del backend:', data.location?.coords);
      console.log('🔍 Rating del backend:', data.rating);
      console.log('🔍 Order del backend:', data.order);
      
      // Mapear TODOS los datos del backend al formato del formulario
      const mappedData = {
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        coverUrl: data.coverUrl || '',
        available: data.available !== undefined ? data.available : true,
        active: data.active !== undefined ? data.active : true,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
        // Categoría: puede ser array o string
        categoria: Array.isArray(data.categories) && data.categories.length > 0 
          ? data.categories[0] 
          : (typeof data.categories === 'string' ? data.categories : ''),
        // Location: asegurar estructura completa
        location: {
          address: data.location?.address || '',
          coords: {
            lat: data.location?.coords?.lat || '',
            lng: data.location?.coords?.lng || ''
          }
        },
        // Contact: estructura completa según MongoDB
        contact: {
          phone: data.contact?.phone || '',
          mail: data.contact?.mail || '',
          link: data.contact?.link || ''
        },
        accessibility: data.accessibility || '',
        rating: data.rating !== undefined ? Number(data.rating) : 0,
        order: data.order !== undefined ? Number(data.order) : 0
      };
      
      console.log('✅ Datos mapeados para el estado:', {
        nombre: mappedData.name,
        descripcion: mappedData.description.substring(0, 20) + '...',
        imagen: mappedData.coverUrl ? 'SÍ' : 'NO',
        categoria: mappedData.categoria,
        direccion: mappedData.location.address,
        accesibilidad: mappedData.accessibility,
        rating: mappedData.rating,
        order: mappedData.order
      });
      
      console.log('🎯 ANTES de setFormData - valor que voy a setear:', {
        name: mappedData.name,
        description: mappedData.description,
        categoria: mappedData.categoria,
        coverUrl: mappedData.coverUrl
      });
      
      setFormData(mappedData);
      
      console.log('✅ setFormData EJECUTADO');
      
    } catch (err) {
      console.error('❌ Error al cargar la atracción:', err);
      setError('Error al cargar la atracción');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // Categorías simples como strings
      const categorias = ['Popular', 'Parques', 'Histórico', 'Museos', 'Tiendas', 'Iglesias', 'Plazas'];
      setCategoryOptions(categorias);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Si cambia el nombre, generar slug automáticamente
    if (name === 'name' && !isEdit) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
        .replace(/^-|-$/g, ''); // Eliminar guiones al inicio y final
      
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slug
      }));
      return;
    }
    
    if (name.includes('.')) {
      // Manejo de campos anidados (location.address, contact.phone, etc.)
      const [parent, child, grandchild] = name.split('.');
      
      if (grandchild) {
        // Para campos como location.coords.lat
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value
            }
          }
        }));
      } else {
        // Para campos como location.address
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categoria: category
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // Validar que tenga categoría
      if (!formData.categoria) {
        setError('Debes seleccionar una categoría');
        setLoading(false);
        return;
      }

      // Enviar SOLO los campos que acepta el DTO del backend (en español)
      const payload = {
        nombre: formData.name,
        descripcion: formData.description,
        ubicacion: formData.location.address || 'Sin dirección especificada',
        imagen: formData.coverUrl,
        categoria: formData.categoria
      };
      
      // Campos opcionales
      if (formData.accessibility) payload.horario = formData.accessibility;
      if (formData.contact.phone) payload.telefono = formData.contact.phone;
      if (formData.active !== undefined) payload.activo = formData.active;

      console.log('📤 Datos que se enviarán al backend:', payload);

      if (isEdit) {
        await api.updateContent('attractions', id, payload);
        console.log('✅ Atracción actualizada exitosamente');
      } else {
        const response = await api.createContent('attractions', payload);
        console.log('✅ Atracción creada exitosamente:', response);
      }

      navigate('/modules/attractions');
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Respuesta del servidor:', err.response?.data);
      setError(err.response?.data?.message || 'Error al guardar la atracción');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/modules/attractions');
  };

  if (loading && isEdit) {
    return <div className="loading">Cargando...</div>;
  }

  console.log('🎨 RENDERIZANDO formulario con formData:', {
    name: formData.name,
    description: formData.description?.substring(0, 30),
    categoria: formData.categoria,
    coverUrl: formData.coverUrl,
    address: formData.location?.address,
    phone: formData.contact?.phone,
    rating: formData.rating,
    order: formData.order
  });

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/modules/attractions')} 
            className="btn-back"
            title="Volver a módulos"
          >
            ← Volver a la lista
          </button>
          <h2>{isView ? 'Ver Atracción Turística' : isEdit ? 'Editar Atracción Turística' : 'Nueva Atracción Turística'}</h2>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="attraction-form">
        <fieldset disabled={isView} style={{ border: 'none', padding: 0, margin: 0 }}>
        {/* Información básica */}
        <div className="form-section">
          <h3>Información Básica</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug (URL amigable) *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="mi-atractivo-turistico"
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Se genera automáticamente del nombre. Debe ser único, sin espacios ni caracteres especiales.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverUrl">URL de la imagen de portada *</label>
            <input
              type="url"
              id="coverUrl"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="https://..."
            />
            {formData.coverUrl && (
              <div className="image-preview">
                <img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
                {' '}Disponible
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                {' '}Activo
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                {' '}Destacado
              </label>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="form-section">
          <h3>Categoría *</h3>
          
          <div className="form-group">
            <label>Selecciona una categoría</label>
            <div className="pill-group">
              {categoryOptions.map(cat => {
                const active = formData.categoria === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    className={`pill ${active ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            {!formData.categoria && (
              <small style={{ color: '#dc2626', fontSize: '12px' }}>
                Debes seleccionar una categoría
              </small>
            )}
          </div>
        </div>

        {/* Ubicación */}
        <div className="form-section">
          <h3>Ubicación</h3>
          
          <div className="form-group">
            <label htmlFor="location.address">Dirección</label>
            <input
              type="text"
              id="location.address"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location.coords.lat">Latitud</label>
              <input
                type="text"
                id="location.coords.lat"
                name="location.coords.lat"
                value={formData.location.coords.lat}
                onChange={handleChange}
                className="form-control"
                placeholder="-17.401160047869425"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.coords.lng">Longitud</label>
              <input
                type="text"
                id="location.coords.lng"
                name="location.coords.lng"
                value={formData.location.coords.lng}
                onChange={handleChange}
                className="form-control"
                placeholder="-66.16145219131906"
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="form-section">
          <h3>Información de Contacto</h3>
          
          <div className="form-group">
            <label htmlFor="contact.phone">Teléfono</label>
            <input
              type="tel"
              id="contact.phone"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="4-4123456"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.mail">Correo electrónico</label>
            <input
              type="email"
              id="contact.mail"
              name="contact.mail"
              value={formData.contact.mail}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.link">Sitio web</label>
            <input
              type="url"
              id="contact.link"
              name="contact.link"
              value={formData.contact.link}
              onChange={handleChange}
              className="form-control"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Otros datos */}
        <div className="form-section">
          <h3>Información Adicional</h3>
          
          <div className="form-group">
            <label htmlFor="accessibility">Accesibilidad</label>
            <textarea
              id="accessibility"
              name="accessibility"
              value={formData.accessibility}
              onChange={handleChange}
              rows="3"
              className="form-control"
              placeholder="Información sobre accesibilidad para personas con discapacidad"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rating">Calificación (1-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="order">Orden de visualización</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="historyId">ID de Historia (opcional)</label>
            <input
              type="text"
              id="historyId"
              name="historyId"
              value={formData.historyId}
              onChange={handleChange}
              className="form-control"
              placeholder="ID único para vincular con contenido histórico"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn btn-secondary">
            {isView ? 'Volver' : 'Cancelar'}
          </button>
          {!isView && (
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
            </button>
          )}
        </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AttractionForm;