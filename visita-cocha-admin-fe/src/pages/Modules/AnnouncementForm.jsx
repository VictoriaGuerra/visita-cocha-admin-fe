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
    coverUrl: '',
    startDate: '',
    endDate: '',
    active: true,
    isFeatured: false,
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (isEdit) loadAnnouncement(); }, [id]);

  const loadAnnouncement = async () => {
    try {
      setLoading(true);
      const item = await api.getContentById('announcements', id);
      setFormData(item);
    } catch (err) {
      setError('Error al cargar el anuncio');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
  };

  const validate = () => {
    if (!formData.title.trim()) return 'Título requerido';
    if (!formData.description.trim()) return 'Descripción requerida';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    try {
      setLoading(true);
      if (isEdit) await api.updateContent('announcements', id, formData);
      else await api.createContent('announcements', formData);
      navigate('/modules/announcements');
    } catch (err) {
      setError('Error al guardar el anuncio');
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/announcements');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/announcements')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isEdit ? 'Editar Anuncio' : 'Nuevo Anuncio'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="announcement-form">
        <div className="form-section">
          <h3>Información</h3>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen (opcional)</label>
            <input type="url" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} className="form-control" placeholder="https://..." />
            {formData.coverUrl && <div className="image-preview"><img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: 10 }} /></div>}
          </div>
        </div>

        <div className="form-section">
          <h3>Vigencia</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Inicio</label>
              <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Fin</label>
              <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Activo</label></div>
            <div className="form-group"><label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Destacado</label></div>
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

export default AnnouncementForm;
