import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { localStoreApi } from '../../api/localStoreApi';
import '../../styles/common.css';
import '../../styles/forms.css';

// Formulario CRUD para Itinerarios
const ItineraryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

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

  useEffect(() => { if (isEdit) loadItinerary(); }, [id]);

  const loadItinerary = async () => {
    try {
      setLoading(true);
      const list = await localStoreApi.getAll('itineraries');
      const item = list.find(x => x.id === id);
      if (item) setFormData(item); else setError('Itinerario no encontrado');
    } catch (err) {
      console.error('Error cargando itinerario:', err);
      setError('Error al cargar el itinerario');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
      if (isEdit) await localStoreApi.update('itineraries', id, formData);
      else await localStoreApi.create('itineraries', formData);
      navigate('/modules/itineraries');
    } catch (err) {
      console.error('Error guardando itinerario:', err);
      setError('Error al guardar el itinerario');
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/itineraries');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/itineraries')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isEdit ? 'Editar Itinerario' : 'Nuevo Itinerario'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="itinerary-form">
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="form-control" />
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
            <div className="form-group"><label><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Activo</label></div>
            <div className="form-group"><label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} /> Disponible</label></div>
          </div>
        </div>

        <div className="form-section">
          <h3>Estilo / Animación</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cssClass.mainColor">Color principal</label>
              <input type="text" id="cssClass.mainColor" name="cssClass.mainColor" value={formData.cssClass.mainColor} onChange={handleChange} className="form-control" placeholder="#FFAA00" />
            </div>
            <div className="form-group">
              <label htmlFor="cssClass.animation">Animación</label>
              <input type="text" id="cssClass.animation" name="cssClass.animation" value={formData.cssClass.animation} onChange={handleChange} className="form-control" placeholder="confetti" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Vínculos y Duración</h3>
          <div className="form-group">
            <label htmlFor="link">Link</label>
            <input type="url" id="link" name="link" value={formData.link} onChange={handleChange} className="form-control" placeholder="https://..." />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug</label>
            <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className="form-control" placeholder="carnaval-2024" />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duración</label>
            <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} className="form-control" placeholder="Ej: Del 18 Ene - 17 Feb" />
          </div>
        </div>

        <div className="form-section">
          <h3>Eventos asociados</h3>
          <div className="form-group">
            <div className="array-input-row">
              <input type="text" value={tempEvent} onChange={e => setTempEvent(e.target.value)} className="form-control" placeholder="ID/Nombre de evento" />
              <button type="button" className="btn btn-small" onClick={addEventRef}>Añadir</button>
            </div>
            {formData.eventList.length > 0 && (
              <ul className="array-list">
                {formData.eventList.map((ev, i) => (
                  <li key={i}><span>{ev}</span><button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeEventRef(i)}>x</button></li>
                ))}
              </ul>
            )}
          </div>
        </div>

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

export default ItineraryForm;
