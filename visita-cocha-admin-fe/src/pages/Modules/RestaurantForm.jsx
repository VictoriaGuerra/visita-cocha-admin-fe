import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';
import '../../styles/categories.css';

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isView = location.pathname.includes('/view/');
  const isEdit = Boolean(id) && !isView;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    coverUrl: '',
    available: true,
    active: true,
    isFeatured: false,
    categoria: '',
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
  const [categoryOptions, setCategoryOptions] = useState([
    'Comida Italiana', 'Comida China', 'Comida Mexicana', 
    'Comida Vegetariana', 'Buffet', 'Fast Food', 'Cafetería'
  ]);

  useEffect(() => {
    if ((isEdit || isView) && id) {
      loadRestaurant();
    }
  }, [id, isEdit, isView]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const response = await api.getContentById('restaurants', id);
      const data = response.data || response;
      
      const mappedData = {
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        coverUrl: data.coverUrl || '',
        available: data.available !== undefined ? data.available : true,
        active: data.active !== undefined ? data.active : true,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
        categoria: Array.isArray(data.categories) && data.categories.length > 0 
          ? data.categories[0] : '',
        location: {
          address: data.location?.address || '',
          coords: {
            lat: data.location?.coords?.lat || '',
            lng: data.location?.coords?.lng || ''
          }
        },
        contact: {
          phone: data.contact?.phone || '',
          mail: data.contact?.mail || '',
          link: data.contact?.link || ''
        },
        accessibility: data.accessibility || '',
        rating: data.rating !== undefined ? Number(data.rating) : 0,
        order: data.order !== undefined ? Number(data.order) : 0
      };
      
      setFormData(mappedData);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Error al cargar el restaurante');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slug
      }));
      return;
    }
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      
      if (grandchild) {
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

      if (!formData.categoria) {
        setError('Debes seleccionar una categoría');
        setLoading(false);
        return;
      }

      if (!formData.name) {
        setError('El nombre es requerido');
        setLoading(false);
        return;
      }

      console.log('📋 FormData antes de crear payload:', formData);

      // Payload según el DTO del backend (en español)
      const payload = {
        nombre: formData.name,
        descripcion: formData.description || '',
        ubicacion: formData.location.address || 'Sin dirección',
        latitud: formData.location.coords.lat || '',
        longitud: formData.location.coords.lng || '',
        imagen: formData.coverUrl,
        categoria: formData.categoria,
        horario: formData.accessibility || '',
        telefono: formData.contact.phone || '',
        correo: formData.contact.mail || '',
        sitioWeb: formData.contact.link || '',
        calificacion: formData.rating || 0,
        orden: formData.order || 0,
        activo: formData.active
      };

      console.log('📤 Payload que se enviará:', payload);

      if (isEdit) {
        await api.updateContent('restaurants', id, payload);
      } else {
        await api.createContent('restaurants', payload);
      }

      navigate('/modules/restaurants');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <button 
          type="button" 
          onClick={() => navigate('/modules/restaurants')} 
          className="btn-back"
        >
          ← Volver
        </button>
        <h2>{isView ? 'Ver Restaurante' : isEdit ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isView} style={{ border: 'none', padding: 0, margin: 0 }}>
        <div className="form-section">
          <h3>Información Básica</h3>
          
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>URL de imagen *</label>
            <input
              type="url"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleChange}
              required
              className="form-control"
            />
            {formData.coverUrl && (
              <img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
            )}
          </div>

          <div className="form-row">
            <label>
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              {' '}Disponible
            </label>

            <label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              {' '}Activo
            </label>

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

        <div className="form-section">
          <h3>Categoría *</h3>
          <div className="pill-group">
            {categoryOptions.map(cat => (
              <button
                type="button"
                key={cat}
                className={`pill ${formData.categoria === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Ubicación</h3>
          
          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitud</label>
              <input
                type="text"
                name="location.coords.lat"
                value={formData.location.coords.lat}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Longitud</label>
              <input
                type="text"
                name="location.coords.lng"
                value={formData.location.coords.lng}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Contacto</h3>
          
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="contact.mail"
              value={formData.contact.mail}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Sitio web</label>
            <input
              type="url"
              name="contact.link"
              value={formData.contact.link}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Información Adicional</h3>
          
          <div className="form-group">
            <label>Horario</label>
            <textarea
              name="accessibility"
              value={formData.accessibility}
              onChange={handleChange}
              rows="3"
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Calificación (0-5)</label>
              <input
                type="number"
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
              <label>Orden</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/modules/restaurants')} 
            className="btn btn-secondary"
          >
            {isView ? 'Volver' : 'Cancelar'}
          </button>
          {!isView && (
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          )}
        </div>
        </fieldset>
      </form>
    </div>
  );
};

export default RestaurantForm;
