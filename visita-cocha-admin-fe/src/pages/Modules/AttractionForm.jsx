import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localStoreApi } from '../../api/localStoreApi';
import '../../styles/common.css';
import '../../styles/forms.css';
import '../../styles/categories.css';

const AttractionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverUrl: '',
    available: true,
    isFeatured: false,
    categories: [],
    mainCategories: [],
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
    order: 0,
    faq: [],
    foods: [],
    historyId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Categorías (cargadas dinámicamente)
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);

  useEffect(() => {
    if (isEdit) {
      loadAttraction();
    }
  }, [id]);

  useEffect(() => {
    // Cargar categorías desde categoriesApi
    import('../../api/categoriesApi').then(({ categoriesApi }) => {
      categoriesApi.getAll('attractions').then(cats => {
        if (!cats || cats.length === 0) {
          import('../../data/sampleData').then(({ initializeAttractionCategories }) => {
            const seeded = initializeAttractionCategories();
            setCategoryOptions(seeded);
          });
        } else { setCategoryOptions(cats); }
      });
      categoriesApi.getAll('main').then(cats => {
        if (!cats || cats.length === 0) {
          import('../../data/sampleData').then(({ initializeMainCategoriesSeed }) => {
            const seeded = initializeMainCategoriesSeed();
            setMainCategoryOptions(seeded);
          });
        } else { setMainCategoryOptions(cats); }
      });
    });
  }, []);

  const loadAttraction = async () => {
    try {
      setLoading(true);
      const attractions = await localStoreApi.getAll('attractions');
      const attraction = attractions.find(a => a.id === id);
      
      if (attraction) {
        setFormData(attraction);
      } else {
        setError('Atracción no encontrada');
      }
    } catch (err) {
      console.error('Error loading attraction:', err);
      setError('Error al cargar la atracción');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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

  const handleCategoryChange = (category, field) => {
    setFormData(prev => {
      const currentCategories = prev[field] || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category)
        : [...currentCategories, category];
      
      return {
        ...prev,
        [field]: newCategories
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      if (isEdit) {
        await localStoreApi.update('attractions', id, formData);
      } else {
        await localStoreApi.create('attractions', formData);
      }

      navigate('/modules/attractions');
    } catch (err) {
      console.error('Error saving attraction:', err);
      setError('Error al guardar la atracción');
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
          <h2>{isEdit ? 'Editar Atracción Turística' : 'Nueva Atracción Turística'}</h2>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="attraction-form">
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
          <h3>Categorías</h3>
          
          <div className="form-group">
            <label>Categorías</label>
            <div className="pill-group">
              {categoryOptions.length === 0 && <div className="alert alert-info">No hay categorías. Administra en <a href="/modules/categories">Categorías</a></div>}
              {categoryOptions.map(cat => {
                const active = formData.categories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    className={`pill ${active ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.id, 'categories')}
                    title={cat.id}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Categorías Principales</label>
            <div className="pill-group">
              {mainCategoryOptions.map(cat => {
                const active = formData.mainCategories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    className={`pill ${active ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.id, 'mainCategories')}
                    title={cat.name}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
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
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttractionForm;