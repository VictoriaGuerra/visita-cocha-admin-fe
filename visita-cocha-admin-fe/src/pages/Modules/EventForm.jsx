import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isView = location.pathname.includes('/view/');
  const isEdit = Boolean(id) && !isView;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverUrl: '',
    categories: [],
    tags: [],
    date: '',
    schedule: '',
    venue: '',
    organizer: '',
    phone: '',
    email: '',
    price: 0,
    currency: 'BOB',
    isFree: false,
    capacity: 0,
    ticketUrl: '',
    available: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState({ tag: '' });

  const categoryOptions = ['cultura', 'musica', 'deportes', 'familia', 'gastronomia', 'festival', 'arte', 'teatro'];

  useEffect(() => { if (isEdit || isView) loadEvent(); }, [id, isEdit, isView]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const ev = await api.getContentById('events', id);
      
      console.log('📥 Evento cargado del backend:', ev);
      
      // Mapear TODOS los campos que pueden venir del backend
      setFormData({
        name: ev.nombre || '',
        description: ev.descripcion || '',
        coverUrl: ev.imagen || '',
        categories: ev.categorias || [],
        tags: ev.tags || [],
        date: ev.fecha || '',
        schedule: ev.horario || '',
        venue: ev.lugar || '',
        organizer: ev.organizador || '',
        phone: ev.telefono || '',
        email: ev.email || '',
        price: ev.precio || 0,
        currency: ev.moneda || 'BOB',
        isFree: ev.gratis || false,
        capacity: ev.capacidad || 0,
        ticketUrl: ev.url_tickets || '',
        available: ev.disponible ?? true
      });
    } catch (err) {
      console.error('Error cargando evento:', err);
      setError('Error al cargar el evento');
    } finally { 
      setLoading(false); 
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value 
    }));
  };

  const toggleCategory = (value) => {
    setFormData(prev => {
      const list = prev.categories || [];
      return { 
        ...prev, 
        categories: list.includes(value) ? list.filter(v => v !== value) : [...list, value] 
      };
    });
  };

  const tempChange = (e) => setTemp(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const pushTag = () => {
    const val = (temp.tag || '').trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
    setTemp(prev => ({ ...prev, tag: '' }));
  };
  
  const removeTag = (index) => setFormData(prev => ({ 
    ...prev, 
    tags: prev.tags.filter((_, i) => i !== index) 
  }));

  const validate = () => {
    if (!formData.name.trim()) return 'Nombre requerido';
    if (!formData.description.trim()) return 'Descripción requerida';
    if (!formData.isFree && formData.price < 0) return 'Precio no puede ser negativo';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    // Enviar TODOS los campos como aparecen en los datos de seed
    const payload = {
      nombre: formData.name,
      descripcion: formData.description || '',
      imagen: formData.coverUrl || '',
      categorias: formData.categories || [],
      tags: formData.tags || [],
      fecha: formData.date || '',
      horario: formData.schedule || '',
      lugar: formData.venue || '',
      organizador: formData.organizer || '',
      telefono: formData.phone || '',
      email: formData.email || '',
      precio: formData.price || 0,
      moneda: formData.currency || 'BOB',
      gratis: formData.isFree || false,
      capacidad: formData.capacity || 0,
      url_tickets: formData.ticketUrl || '',
      disponible: formData.available ?? true
    };
    
    // Al CREAR, agregar id
    if (!isEdit) {
      payload.id = Math.floor(Date.now() / 1000);
    }

    console.log('📤 Payload que se enviará:', payload);

    try {
      setLoading(true);
      if (isEdit) {
        await api.updateContent('events', id, payload);
      } else {
        await api.createContent('events', payload);
      }
      navigate('/modules/events');
    } catch (err) {
      console.error('Error guardando evento:', err);
      console.error('Detalles del error:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message;
      const errorDetails = err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : '';
      setError(`Error al guardar el evento: ${errorMsg} ${errorDetails}`);
    } finally { 
      setLoading(false); 
    }
  };

  const handleCancel = () => navigate('/modules/events');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/modules/events')} 
            className="btn-back" 
            title="Volver a la lista"
          >
            ← Volver a la lista
          </button>
          <h2>{isView ? 'Ver Evento' : isEdit ? 'Editar Evento' : 'Nuevo Evento'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="event-form">
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
            <label htmlFor="description">Descripción *</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              rows={4} 
              className="form-control" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen portada</label>
            <input 
              type="url" 
              id="coverUrl" 
              name="coverUrl" 
              value={formData.coverUrl} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="https://..." 
            />
            {formData.coverUrl && (
              <div className="image-preview">
                <img 
                  src={formData.coverUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '300px', marginTop: 10 }} 
                />
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
                /> Disponible
              </label>
            </div>
          </div>
        </div>

        {/* Fechas y horarios */}
        <div className="form-section">
          <h3>Fechas y Horarios</h3>
          
          <div className="form-group">
            <label htmlFor="date">Fecha *</label>
            <input 
              type="text" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required
              className="form-control" 
              placeholder="Ej: 12-14 de febrero 2026"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="schedule">Horario</label>
            <input 
              type="text" 
              id="schedule" 
              name="schedule" 
              value={formData.schedule} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="Ej: 16:00 - 23:59"
            />
          </div>
        </div>

        {/* Lugar */}
        <div className="form-section">
          <h3>Lugar</h3>
          
          <div className="form-group">
            <label htmlFor="venue">Lugar/Recinto</label>
            <input 
              type="text" 
              id="venue" 
              name="venue" 
              value={formData.venue} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="Ej: Parque de la Familia (Av. Circunvalación)"
            />
          </div>
        </div>

        {/* Organización y contacto */}
        <div className="form-section">
          <h3>Organización y Contacto</h3>
          
          <div className="form-group">
            <label htmlFor="organizer">Organizador</label>
            <input 
              type="text" 
              id="organizer" 
              name="organizer" 
              value={formData.organizer} 
              onChange={handleChange} 
              className="form-control" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="+591 4 4400000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="form-control" 
            />
          </div>
        </div>

        {/* Entradas */}
        <div className="form-section">
          <h3>Entradas y Precios</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>
                <input 
                  type="checkbox" 
                  id="isFree" 
                  name="isFree" 
                  checked={formData.isFree} 
                  onChange={handleChange} 
                /> Evento gratuito
              </label>
            </div>
          </div>
          
          {!formData.isFree && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input 
                  type="number" 
                  id="price" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  className="form-control" 
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currency">Moneda</label>
                <select 
                  id="currency" 
                  name="currency" 
                  value={formData.currency} 
                  onChange={handleChange} 
                  className="form-control"
                >
                  <option value="BOB">BOB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="capacity">Capacidad</label>
            <input 
              type="number" 
              id="capacity" 
              name="capacity" 
              value={formData.capacity} 
              onChange={handleChange} 
              className="form-control" 
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ticketUrl">URL de tickets</label>
            <input 
              type="url" 
              id="ticketUrl" 
              name="ticketUrl" 
              value={formData.ticketUrl} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="https://tickets.cocha.bo/..."
            />
          </div>
        </div>

        {/* Categorías y etiquetas */}
        <div className="form-section">
          <h3>Categorías y Etiquetas</h3>
          
          <div className="form-group">
            <label>Categorías</label>
            <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {categoryOptions.map(c => (
                <label key={c} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.categories.includes(c)} 
                    onChange={() => toggleCategory(c)} 
                  /> {c}
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Etiquetas</label>
            <div className="array-input-row">
              <input 
                type="text" 
                name="tag" 
                value={temp.tag} 
                onChange={tempChange} 
                className="form-control" 
                placeholder="Etiqueta"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), pushTag())}
              />
              <button 
                type="button" 
                className="btn btn-small" 
                onClick={pushTag}
              >
                Añadir
              </button>
            </div>
            {formData.tags.length > 0 && (
              <ul className="array-list">
                {formData.tags.map((t, i) => (
                  <li key={i}>
                    <span>{t}</span>
                    <button 
                      type="button" 
                      className="btn btn-danger btn-xsmall" 
                      onClick={() => removeTag(i)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="btn btn-secondary"
          >
            {isView ? 'Volver' : 'Cancelar'}
          </button>
          {!isView && (
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary"
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
          </button>
          )}
        </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EventForm;
