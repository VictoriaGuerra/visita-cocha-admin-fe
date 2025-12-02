import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

// Formulario CRUD para Itinerarios
const ItineraryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id) && location.pathname.includes('/edit/');
  const isView = Boolean(id) && location.pathname.includes('/view/');
  const isReadOnly = isView;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverUrl: '',
    active: true,
    available: true,
    cssClass: { mainColor: '', animation: '' },
    link: '',
    slug: '',
    duration: '',
    eventList: [],
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tempEvent, setTempEvent] = useState('');

  useEffect(() => { 
    // Solo cargar si id existe y no es undefined/null/empty
    if (id && id !== 'undefined' && id !== 'null' && id.trim() !== '') {
      loadItinerary(); 
    }
  }, [id]);

  const loadItinerary = async () => {
    if (!id) {
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔄 Cargando itinerario con ID:', id);
      console.log('🔍 Tipo de ID:', typeof id, 'Longitud:', id.length);
      
      const response = await api.getContentById('itineraries', id);
      const data = response.data || response;
      
      console.log('📥 Datos recibidos del backend:', data);
      
      // Mapear datos del backend al formato del formulario
      const mappedData = {
        title: data.title || '',
        description: data.description || '',
        coverUrl: data.coverUrl || '',
        active: data.active !== undefined ? data.active : true,
        available: data.available !== undefined ? data.available : true,
        cssClass: {
          mainColor: data.cssClass?.mainColor || '',
          animation: data.cssClass?.animation || ''
        },
        link: data.link || '',
        slug: data.slug || '',
        duration: data.duration || '',
        eventList: Array.isArray(data.eventList) ? data.eventList : [],
        order: data.order !== undefined ? Number(data.order) : 0
      };
      
      setFormData(mappedData);
    } catch (err) {
      console.error('❌ Error cargando itinerario:', err);
      setError('Error al cargar el itinerario');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Si cambia el título, generar slug automáticamente (solo al crear)
    if (name === 'title' && !isEdit) {
      const autoSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, title: value, slug: autoSlug }));
      return;
    }
    
    if (name.startsWith('cssClass.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, cssClass: { ...prev.cssClass, [field]: value } }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addEventRef = () => {
    const v = tempEvent.trim();
    if (!v) return;
    setFormData(prev => ({ ...prev, eventList: [...prev.eventList, v] }));
    setTempEvent('');
  };
  const removeEventRef = (index) => setFormData(prev => ({ ...prev, eventList: prev.eventList.filter((_, i) => i !== index) }));

  const validate = () => {
    if (!formData.title.trim()) return 'Título requerido';
    if (!formData.description.trim()) return 'Descripción requerida';
    if (!formData.coverUrl.trim()) return 'URL de portada requerida';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    
    try {
      setLoading(true);
      
      // Preparar payload para el backend
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        coverUrl: formData.coverUrl.trim(),
        active: formData.active,
        available: formData.available,
        cssClass: formData.cssClass,
        link: formData.link.trim(),
        slug: formData.slug.trim(),
        duration: formData.duration.trim(),
        eventList: formData.eventList,
        order: Number(formData.order) || 0
      };
      
      console.log('📤 Enviando payload:', payload);
      
      if (isEdit) {
        await api.updateContent('itineraries', id, payload);
      } else {
        await api.createContent('itineraries', payload);
      }
      
      navigate('/modules/itineraries');
    } catch (err) {
      console.error('❌ Error guardando itinerario:', err);
      const errorMsg = err?.response?.data?.message || 'Error al guardar el itinerario';
      setError(errorMsg);
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/itineraries');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/itineraries')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isView ? 'Ver Itinerario' : (isEdit ? 'Editar Itinerario' : 'Nuevo Itinerario')}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="itinerary-form">
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="form-control" disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="form-control" disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen portada *</label>
            <input type="url" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} required className="form-control" placeholder="https://..." disabled={isReadOnly} />
            {formData.coverUrl && <div className="image-preview"><img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: 10 }} /></div>}
          </div>
          <div className="form-row">
            <div className="form-group"><label><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} disabled={isReadOnly} /> Activo</label></div>
            <div className="form-group"><label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} disabled={isReadOnly} /> Disponible</label></div>
          </div>
        </div>

        <div className="form-section">
          <h3>Estilo / Animación</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cssClass.mainColor">Color principal</label>
              <input type="text" id="cssClass.mainColor" name="cssClass.mainColor" value={formData.cssClass.mainColor} onChange={handleChange} className="form-control" placeholder="#FFAA00" disabled={isReadOnly} />
            </div>
            <div className="form-group">
              <label htmlFor="cssClass.animation">Animación</label>
              <input type="text" id="cssClass.animation" name="cssClass.animation" value={formData.cssClass.animation} onChange={handleChange} className="form-control" placeholder="confetti" disabled={isReadOnly} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Vínculos y Duración</h3>
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input type="url" id="link" name="link" value={formData.link} onChange={handleChange} className="form-control" placeholder="https://..." disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className="form-control" placeholder="carnaval-2024" disabled={isReadOnly} />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duración</label>
            <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} className="form-control" placeholder="Ej: Del 18 Ene - 17 Feb" disabled={isReadOnly} />
          </div>
        </div>

        <div className="form-section">
          <h3>Eventos asociados</h3>
          <div className="form-group">
            <div className="array-input-row">
              <input type="text" value={tempEvent} onChange={e => setTempEvent(e.target.value)} className="form-control" placeholder="ID/Nombre de evento" disabled={isReadOnly} />
              {!isReadOnly && <button type="button" className="btn btn-small" onClick={addEventRef}>Añadir</button>}
            </div>
            {formData.eventList.length > 0 && (
              <ul className="array-list">
                {formData.eventList.map((ev, i) => (
                  <li key={i}><span>{ev}</span>{!isReadOnly && <button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeEventRef(i)}>x</button>}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Orden</h3>
          <div className="form-group">
            <label htmlFor="order">Orden de visualización</label>
            <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} className="form-control" disabled={isReadOnly} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn btn-secondary">{isReadOnly ? 'Volver' : 'Cancelar'}</button>
          {!isReadOnly && <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}</button>}
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;
