import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localStoreApi } from '../../api/localStoreApi';
import '../../styles/common.css';
import '../../styles/forms.css';
import '../../styles/categories.css';

// Formulario CRUD para Restaurantes basado en AttractionForm
const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverUrl: '',
    available: true,
    accessibility: '',
    categories: [],
    mainCategories: [],
    contact: { phone: '', mail: '', link: '' },
    customDeliveryUrl: '',
    deliveryUrls: [],
    faq: [],
    foods: [],
    isFeatured: false,
    location: { address: '', coords: { lat: '', lng: '' } },
    order: 0,
    rating: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Categorías dinámicas
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);

  useEffect(() => { if (isEdit) loadRestaurant(); }, [id]);

  useEffect(() => {
    import('../../api/categoriesApi').then(({ categoriesApi }) => {
      categoriesApi.getAll('restaurants').then(cats => {
        if (!cats || cats.length === 0) {
          import('../../data/sampleData').then(({ initializeRestaurantCategories }) => {
            const seeded = initializeRestaurantCategories();
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

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const restaurants = await localStoreApi.getAll('restaurants');
      const restaurant = restaurants.find(r => r.id === id);
      if (restaurant) setFormData(restaurant); else setError('Restaurante no encontrado');
    } catch (err) {
      console.error('Error cargando restaurante:', err);
      setError('Error al cargar el restaurante');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      if (grandchild) {
        setFormData(prev => ({
          ...prev,
          [parent]: { ...prev[parent], [child]: { ...prev[parent][child], [grandchild]: value } }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
            [parent]: { ...prev[parent], [child]: value }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }
  };

  const toggleCategory = (category, field) => {
    setFormData(prev => {
      const list = prev[field] || [];
      return { ...prev, [field]: list.includes(category) ? list.filter(c => c !== category) : [...list, category] };
    });
  };

  // Manejo de arrays simples (deliveryUrls, faq, foods)
  const [tempValues, setTempValues] = useState({ deliveryUrl: '', faq: '', food: '' });

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempValues(prev => ({ ...prev, [name]: value }));
  };

  const pushToArray = (field, tempKey) => {
    const val = tempValues[tempKey].trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], val] }));
    setTempValues(prev => ({ ...prev, [tempKey]: '' }));
  };

  const removeFromArray = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Nombre requerido';
    if (!formData.description.trim()) return 'Descripción requerida';
    if (!formData.coverUrl.trim()) return 'URL de portada requerida';
    if (formData.rating < 0 || formData.rating > 5) return 'Rating debe estar entre 0 y 5';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    try {
      setLoading(true);
      if (isEdit) await localStoreApi.update('restaurants', id, formData);
      else await localStoreApi.create('restaurants', formData);
      navigate('/modules/restaurants');
    } catch (err) {
      console.error('Error guardando restaurante:', err);
      setError('Error al guardar el restaurante');
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/restaurants');

  if (loading && isEdit) return <div className="loading">Cargando...</div>;

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/restaurants')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isEdit ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="restaurant-form">
        {/* Información básica */}
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="4" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen portada *</label>
            <input type="url" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} required className="form-control" placeholder="https://..." />
            {formData.coverUrl && <div className="image-preview"><img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} /></div>}
          </div>
          <div className="form-row">
            <div className="form-group"><label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} /> Disponible</label></div>
            <div className="form-group"><label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Destacado</label></div>
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
                    onClick={() => toggleCategory(cat.id, 'categories')}
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
                    onClick={() => toggleCategory(cat.id, 'mainCategories')}
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
            <input type="text" id="location.address" name="location.address" value={formData.location.address} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location.coords.lat">Latitud</label>
              <input type="text" id="location.coords.lat" name="location.coords.lat" value={formData.location.coords.lat} onChange={handleChange} className="form-control" placeholder="-17.4" />
            </div>
            <div className="form-group">
              <label htmlFor="location.coords.lng">Longitud</label>
              <input type="text" id="location.coords.lng" name="location.coords.lng" value={formData.location.coords.lng} onChange={handleChange} className="form-control" placeholder="-66.16" />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="form-section">
          <h3>Información de Contacto</h3>
          <div className="form-group">
            <label htmlFor="contact.phone">Teléfono</label>
            <input type="tel" id="contact.phone" name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="contact.mail">Correo electrónico</label>
            <input type="email" id="contact.mail" name="contact.mail" value={formData.contact.mail} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="contact.link">Sitio web</label>
            <input type="url" id="contact.link" name="contact.link" value={formData.contact.link} onChange={handleChange} className="form-control" placeholder="https://..." />
          </div>
        </div>

        {/* Delivery */}
        <div className="form-section">
          <h3>Delivery</h3>
          <div className="form-group">
            <label htmlFor="customDeliveryUrl">URL personalizada de delivery</label>
            <input type="url" id="customDeliveryUrl" name="customDeliveryUrl" value={formData.customDeliveryUrl} onChange={handleChange} className="form-control" placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>URLs de delivery</label>
            <div className="array-input-row">
              <input type="url" name="deliveryUrl" value={tempValues.deliveryUrl} onChange={handleTempChange} className="form-control" placeholder="https://..." />
              <button type="button" className="btn btn-small" onClick={() => pushToArray('deliveryUrls', 'deliveryUrl')}>Añadir</button>
            </div>
            {formData.deliveryUrls.length > 0 && (
              <ul className="array-list">
                {formData.deliveryUrls.map((u, i) => (
                  <li key={i}>
                    <span>{u}</span>
                    <button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFromArray('deliveryUrls', i)}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="form-section">
          <h3>Preguntas Frecuentes (FAQ)</h3>
          <div className="form-group">
            <div className="array-input-row">
              <input type="text" name="faq" value={tempValues.faq} onChange={handleTempChange} className="form-control" placeholder="Pregunta o respuesta" />
              <button type="button" className="btn btn-small" onClick={() => pushToArray('faq', 'faq')}>Añadir</button>
            </div>
            {formData.faq.length > 0 && (
              <ul className="array-list">
                {formData.faq.map((f, i) => (
                  <li key={i}>
                    <span>{f}</span>
                    <button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFromArray('faq', i)}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Comidas asociadas */}
        <div className="form-section">
          <h3>Comidas asociadas</h3>
          <div className="form-group">
            <div className="array-input-row">
              <input type="text" name="food" value={tempValues.food} onChange={handleTempChange} className="form-control" placeholder="Comida" />
              <button type="button" className="btn btn-small" onClick={() => pushToArray('foods', 'food')}>Añadir</button>
            </div>
            {formData.foods.length > 0 && (
              <ul className="array-list">
                {formData.foods.map((fd, i) => (
                  <li key={i}>
                    <span>{fd}</span>
                    <button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFromArray('foods', i)}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Otros datos */}
        <div className="form-section">
          <h3>Información Adicional</h3>
          <div className="form-group">
            <label htmlFor="accessibility">Accesibilidad</label>
            <textarea id="accessibility" name="accessibility" value={formData.accessibility} onChange={handleChange} rows="3" className="form-control" placeholder="Información sobre accesibilidad" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rating">Calificación (0-5)</label>
              <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="order">Orden de visualización</label>
              <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} className="form-control" />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}</button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm;
