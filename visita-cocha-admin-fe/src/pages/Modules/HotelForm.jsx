import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

const HotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverUrl: '',
    available: true,
    isFeatured: false,
    stars: 3,
    rating: 0,
    categories: [],
    mainCategories: [],
    amenities: [],
    roomTypes: [],
    priceRangeMin: 0,
    priceRangeMax: 0,
    currency: 'BOB',
    checkInTime: '',
    checkOutTime: '',
    location: { address: '', coords: { lat: '', lng: '' } },
    contact: { phone: '', mail: '', link: '' },
    galleryUrls: [],
    faq: [],
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState({ amenity: '', roomType: '', gallery: '', faq: '', category: '', mainCategory: '' });

  const categoryOptions = ['hotel', 'hostal', 'boutique', 'económico', 'lujo', 'familiar'];
  const mainCategoryOptions = ['alojamiento'];

  useEffect(() => { if (isEdit) loadHotel(); }, [id]);

  const loadHotel = async () => {
    try {
      setLoading(true);
      const h = await api.getContentById('hotels', id);
      setFormData(h);
    } catch (err) {
      setError('Error al cargar el hotel');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [p, c, g] = name.split('.');
      if (g) setFormData(prev => ({ ...prev, [p]: { ...prev[p], [c]: { ...prev[p][c], [g]: value } } }));
      else setFormData(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
    }
  };

  const tempChange = (e) => setTemp(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const pushTo = (field, key) => {
    const val = (temp[key] || '').trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], val] }));
    setTemp(prev => ({ ...prev, [key]: '' }));
  };
  const removeFrom = (field, index) => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  const toggleCategory = (value, field) => {
    setFormData(prev => {
      const list = prev[field] || [];
      return { ...prev, [field]: list.includes(value) ? list.filter(v => v !== value) : [...list, value] };
    });
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Nombre requerido';
    if (!formData.description.trim()) return 'Descripción requerida';
    if (!formData.coverUrl.trim()) return 'URL de portada requerida';
    if (formData.stars < 1 || formData.stars > 5) return 'Estrellas debe estar entre 1 y 5';
    if (formData.rating < 0 || formData.rating > 5) return 'Rating debe estar entre 0 y 5';
    if (formData.priceRangeMin < 0 || formData.priceRangeMax < 0) return 'Precios no pueden ser negativos';
    if (formData.priceRangeMax && formData.priceRangeMax < formData.priceRangeMin) return 'Precio máximo no puede ser menor al mínimo';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    try {
      setLoading(true);
      if (isEdit) await api.updateContent('hotels', id, formData);
      else await api.createContent('hotels', formData);
      navigate('/modules/hotels');
    } catch (err) {
      setError('Error al guardar el hotel');
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/hotels');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/hotels')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isEdit ? 'Editar Hotel' : 'Nuevo Hotel'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="hotel-form">
        {/* Información básica */}
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen portada *</label>
            <input type="url" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} required className="form-control" placeholder="https://..." />
            {formData.coverUrl && <div className="image-preview"><img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: 10 }} /></div>}
          </div>
          <div className="form-row">
            <div className="form-group"><label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} /> Disponible</label></div>
            <div className="form-group"><label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Destacado</label></div>
          </div>
        </div>

        {/* Clasificación y reviews */}
        <div className="form-section">
          <h3>Clasificación</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stars">Estrellas</label>
              <input type="number" id="stars" name="stars" value={formData.stars} onChange={handleChange} min={1} max={5} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="rating">Calificación (0-5)</label>
              <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} min={0} max={5} step={0.1} className="form-control" />
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="form-section">
          <h3>Categorías</h3>
          <div className="form-group">
            <label>Categorías</label>
            <div className="checkbox-group">
              {categoryOptions.map(c => (
                <label key={c} className="checkbox-label">
                  <input type="checkbox" checked={formData.categories.includes(c)} onChange={() => toggleCategory(c, 'categories')} /> {c}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Categorías principales</label>
            <div className="checkbox-group">
              {mainCategoryOptions.map(c => (
                <label key={c} className="checkbox-label">
                  <input type="checkbox" checked={formData.mainCategories.includes(c)} onChange={() => toggleCategory(c, 'mainCategories')} /> {c}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Servicios y habitaciones */}
        <div className="form-section">
          <h3>Servicios y Habitaciones</h3>
          <div className="form-group">
            <label>Servicios (amenities)</label>
            <div className="array-input-row">
              <input type="text" name="amenity" value={temp.amenity} onChange={tempChange} className="form-control" placeholder="Piscina, WiFi, Desayuno" />
              <button type="button" className="btn btn-small" onClick={() => pushTo('amenities', 'amenity')}>Añadir</button>
            </div>
            {formData.amenities.length > 0 && (
              <ul className="array-list">
                {formData.amenities.map((a, i) => (
                  <li key={i}><span>{a}</span><button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFrom('amenities', i)}>x</button></li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Tipos de habitación</label>
            <div className="array-input-row">
              <input type="text" name="roomType" value={temp.roomType} onChange={tempChange} className="form-control" placeholder="Single, Doble, Suite" />
              <button type="button" className="btn btn-small" onClick={() => pushTo('roomTypes', 'roomType')}>Añadir</button>
            </div>
            {formData.roomTypes.length > 0 && (
              <ul className="array-list">
                {formData.roomTypes.map((r, i) => (
                  <li key={i}><span>{r}</span><button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFrom('roomTypes', i)}>x</button></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Precios y horarios */}
        <div className="form-section">
          <h3>Precios y Horarios</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priceRangeMin">Precio mínimo</label>
              <input type="number" id="priceRangeMin" name="priceRangeMin" value={formData.priceRangeMin} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="priceRangeMax">Precio máximo</label>
              <input type="number" id="priceRangeMax" name="priceRangeMax" value={formData.priceRangeMax} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="currency">Moneda</label>
              <input type="text" id="currency" name="currency" value={formData.currency} onChange={handleChange} className="form-control" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkInTime">Check-in</label>
              <input type="time" id="checkInTime" name="checkInTime" value={formData.checkInTime} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="checkOutTime">Check-out</label>
              <input type="time" id="checkOutTime" name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} className="form-control" />
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
              <input type="text" id="location.coords.lat" name="location.coords.lat" value={formData.location.coords.lat} onChange={handleChange} className="form-control" placeholder="-17.39" />
            </div>
            <div className="form-group">
              <label htmlFor="location.coords.lng">Longitud</label>
              <input type="text" id="location.coords.lng" name="location.coords.lng" value={formData.location.coords.lng} onChange={handleChange} className="form-control" placeholder="-66.16" />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="form-section">
          <h3>Contacto</h3>
          <div className="form-group">
            <label htmlFor="contact.phone">Teléfono</label>
            <input type="tel" id="contact.phone" name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="contact.mail">Correo</label>
            <input type="email" id="contact.mail" name="contact.mail" value={formData.contact.mail} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="contact.link">Sitio web</label>
            <input type="url" id="contact.link" name="contact.link" value={formData.contact.link} onChange={handleChange} className="form-control" placeholder="https://..." />
          </div>
        </div>

        {/* Multimedia y FAQ */}
        <div className="form-section">
          <h3>Multimedia y FAQ</h3>
          <div className="form-group">
            <label>Galería de imágenes</label>
            <div className="array-input-row">
              <input type="url" name="gallery" value={temp.gallery} onChange={tempChange} className="form-control" placeholder="https://..." />
              <button type="button" className="btn btn-small" onClick={() => pushTo('galleryUrls', 'gallery')}>Añadir</button>
            </div>
            {formData.galleryUrls.length > 0 && (
              <ul className="array-list">
                {formData.galleryUrls.map((u, i) => (
                  <li key={i}><span>{u}</span><button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFrom('galleryUrls', i)}>x</button></li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Preguntas frecuentes (FAQ)</label>
            <div className="array-input-row">
              <input type="text" name="faq" value={temp.faq} onChange={tempChange} className="form-control" placeholder="Pregunta o respuesta" />
              <button type="button" className="btn btn-small" onClick={() => pushTo('faq', 'faq')}>Añadir</button>
            </div>
            {formData.faq.length > 0 && (
              <ul className="array-list">
                {formData.faq.map((f, i) => (
                  <li key={i}><span>{f}</span><button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFrom('faq', i)}>x</button></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Orden */}
        <div className="form-section">
          <h3>Orden</h3>
          <div className="form-group">
            <label htmlFor="order">Orden de visualización</label>
            <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} className="form-control" />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}</button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
