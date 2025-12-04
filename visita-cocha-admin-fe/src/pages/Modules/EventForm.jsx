import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverUrl: '',
    available: true,
    active: true,
    isFeatured: false,
    categories: [],
    mainCategories: [],
    tags: [],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venueName: '',
    location: { address: '', coords: { lat: '', lng: '' } },
    organizer: '',
    contact: { phone: '', mail: '', link: '' },
    ticketUrl: '',
    isFree: false,
    price: 0,
    currency: 'BOB',
    capacity: 0,
    galleryUrls: [],
    faq: [],
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState({ tag: '', gallery: '', faq: '' });

  const categoryOptions = ['cultura', 'música', 'deportes', 'familia', 'gastronomia', 'festival'];
  const mainCategoryOptions = ['eventos', 'cultura', 'deportes'];

  useEffect(() => { if (isEdit) loadEvent(); }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const ev = await api.getContentById('events', id);
      setFormData(ev);
    } catch (err) {
      setError('Error al cargar el evento');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [p, c, g] = name.split('.');
      if (g) {
        setFormData(prev => ({ ...prev, [p]: { ...prev[p], [c]: { ...prev[p][c], [g]: value } } }));
      } else {
        setFormData(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
    }
  };

  const toggleCategory = (value, field) => {
    setFormData(prev => {
      const list = prev[field] || [];
      return { ...prev, [field]: list.includes(value) ? list.filter(v => v !== value) : [...list, value] };
    });
  };

  const tempChange = (e) => setTemp(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const pushTo = (field, key) => {
    const val = (temp[key] || '').trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], val] }));
    setTemp(prev => ({ ...prev, [key]: '' }));
  };
  const removeFrom = (field, index) => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));

  const validate = () => {
    if (!formData.name.trim()) return 'Nombre requerido';
    if (!formData.description.trim()) return 'Descripción requerida';
    if (!formData.coverUrl.trim()) return 'URL de portada requerida';
    if (!formData.startDate) return 'Fecha inicio requerida';
    if (!formData.isFree && formData.price < 0) return 'Precio no puede ser negativo';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    try {
      setLoading(true);
      if (isEdit) await api.updateContent('events', id, formData);
      else await api.createContent('events', formData);
      navigate('/modules/events');
    } catch (err) {
      setError('Error al guardar el evento');
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/events');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/events')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isEdit ? 'Editar Evento' : 'Nuevo Evento'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="event-form">
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
            <div className="form-group"><label><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Activo</label></div>
            <div className="form-group"><label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Destacado</label></div>
          </div>
        </div>

        {/* Fechas y horarios */}
        <div className="form-section">
          <h3>Fechas y Horarios</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Fecha inicio *</label>
              <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Fecha fin</label>
              <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Hora inicio</label>
              <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">Hora fin</label>
              <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="form-control" />
            </div>
          </div>
        </div>

        {/* Lugar */}
        <div className="form-section">
          <h3>Lugar</h3>
          <div className="form-group">
            <label htmlFor="venueName">Lugar/Recinto</label>
            <input type="text" id="venueName" name="venueName" value={formData.venueName} onChange={handleChange} className="form-control" />
          </div>
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

        {/* Organización y contacto */}
        <div className="form-section">
          <h3>Organización y Contacto</h3>
          <div className="form-group">
            <label htmlFor="organizer">Organizador</label>
            <input type="text" id="organizer" name="organizer" value={formData.organizer} onChange={handleChange} className="form-control" />
          </div>
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

        {/* Entradas */}
        <div className="form-section">
          <h3>Entradas</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isFree">Evento gratuito</label>
              <input type="checkbox" id="isFree" name="isFree" checked={formData.isFree} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="price">Precio</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="form-control" disabled={formData.isFree} />
            </div>
            <div className="form-group">
              <label htmlFor="currency">Moneda</label>
              <input type="text" id="currency" name="currency" value={formData.currency} onChange={handleChange} className="form-control" disabled={formData.isFree} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacidad</label>
            <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="ticketUrl">URL de tickets</label>
            <input type="url" id="ticketUrl" name="ticketUrl" value={formData.ticketUrl} onChange={handleChange} className="form-control" placeholder="https://..." />
          </div>
        </div>

        {/* Categorías y etiquetas */}
        <div className="form-section">
          <h3>Categorías y Etiquetas</h3>
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
          <div className="form-group">
            <label>Etiquetas</label>
            <div className="array-input-row">
              <input type="text" name="tag" value={temp.tag} onChange={tempChange} className="form-control" placeholder="Etiqueta" />
              <button type="button" className="btn btn-small" onClick={() => pushTo('tags', 'tag')}>Añadir</button>
            </div>
            {formData.tags.length > 0 && (
              <ul className="array-list">
                {formData.tags.map((t, i) => (
                  <li key={i}><span>{t}</span><button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeFrom('tags', i)}>x</button></li>
                ))}
              </ul>
            )}
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

        {/* Acciones */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
