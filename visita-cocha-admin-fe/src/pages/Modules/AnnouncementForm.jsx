import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

const AnnouncementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    coverUrl: '',
    color: 'red',
    date: '',
    location: {
      address: '',
      place: '',
      coords: {
        lat: '',
        lng: ''
      }
    },
    link: '',
    order: 50,
    available: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colorOptions = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal'];
  const typeOptions = ['Feria', 'Festival', 'Concierto', 'Exposición', 'Conferencia', 'Taller', 'Evento Deportivo', 'Otro'];

  useEffect(() => { 
    if (isEdit) loadAnnouncement(); 
  }, [id]);

  const loadAnnouncement = async () => {
    try {
      setLoading(true);
      const data = await api.getContentById('announcements', id);
      
      console.log('📥 Anuncio cargado del backend:', data);
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        type: data.type || '',
        coverUrl: data.coverUrl || '',
        color: data.color || 'red',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        location: {
          address: data.location?.address || '',
          place: data.location?.place || '',
          coords: {
            lat: data.location?.coords?.lat || '',
            lng: data.location?.coords?.lng || ''
          }
        },
        link: data.link || '',
        order: data.order ?? 50,
        available: data.available ?? true
      });
    } catch (err) {
      console.error('Error cargando anuncio:', err);
      setError('Error al cargar el anuncio');
    } finally { 
      setLoading(false); 
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      if (field === 'lat' || field === 'lng') {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coords: {
              ...prev.location.coords,
              [field]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            [field]: value
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

  const validate = () => {
    if (!formData.title.trim()) return 'Título requerido';
    if (!formData.type.trim()) return 'Tipo requerido';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    // El backend acepta estos campos en español con location anidado
    const payload = {
      titulo: formData.title,
      descripcion: formData.description || '',
      tipo: formData.type,
      imagen: formData.coverUrl || '',
      color: formData.color || 'red',
      fecha: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      location: {
        address: formData.location.address || '',
        place: formData.location.place || '',
        coords: {
          lat: formData.location.coords.lat || '',
          lng: formData.location.coords.lng || ''
        }
      },
      enlace: formData.link || '',
      orden: formData.order ?? 50,
      disponible: formData.available ?? true
    };

    console.log('📤 Payload que se enviará:', payload);

    try {
      setLoading(true);
      if (isEdit) {
        await api.updateContent('announcements', id, payload);
      } else {
        await api.createContent('announcements', payload);
      }
      navigate('/modules/announcements');
    } catch (err) {
      console.error('Error guardando anuncio:', err);
      console.error('Detalles del error:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message;
      const errorDetails = err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : '';
      setError(`Error al guardar el anuncio: ${errorMsg} ${errorDetails}`);
    } finally { 
      setLoading(false); 
    }
  };

  const handleCancel = () => navigate('/modules/announcements');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/modules/announcements')} 
            className="btn-back" 
            title="Volver a la lista"
          >
            ← Volver a la lista
          </button>
          <h2>{isEdit ? 'Editar Anuncio' : 'Nuevo Anuncio'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="announcement-form">
        {/* Información básica */}
        <div className="form-section">
          <h3>Información Básica</h3>
          
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="form-control" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              className="form-control" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Tipo *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Seleccionar tipo</option>
                {typeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="form-control"
              >
                {colorOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              className="form-control" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen</label>
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

          <div className="form-group">
            <label htmlFor="link">Enlace</label>
            <input 
              type="url" 
              id="link" 
              name="link" 
              value={formData.link} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="https://..." 
            />
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
              placeholder="Ej: Av. Kilman"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location.place">Lugar</label>
            <input 
              type="text" 
              id="location.place" 
              name="location.place" 
              value={formData.location.place} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="Ej: Parque Killman"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location.lat">Latitud</label>
              <input 
                type="text" 
                id="location.lat" 
                name="location.lat" 
                value={formData.location.coords.lat} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="-17.3935"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location.lng">Longitud</label>
              <input 
                type="text" 
                id="location.lng" 
                name="location.lng" 
                value={formData.location.coords.lng} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="-66.1570"
              />
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div className="form-section">
          <h3>Configuración</h3>
          
          <div className="form-group">
            <label htmlFor="order">Orden</label>
            <input 
              type="number" 
              id="order" 
              name="order" 
              value={formData.order} 
              onChange={handleChange} 
              className="form-control" 
              min="0"
            />
          </div>

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

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
