import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';
import '../../styles/categories.css';

const PointsForm = () => {
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
    location: { address: '', coords: { lat: '', lng: '' } },
    contact: { phone: '', mail: '', link: '' },
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);

  useEffect(() => { if (isEdit) loadItem(); }, [id]);

  useEffect(() => {
    // Reutilizamos categorías de atracciones y principales
    import('../../api/categoriesApi').then(({ categoriesApi }) => {
      categoriesApi.getAll('attractions').then(cats => {
        if (!cats || cats.length === 0) {
          import('../../data/sampleData').then(({ initializeAttractionCategories }) => setCategoryOptions(initializeAttractionCategories()));
        } else setCategoryOptions(cats);
      });
      categoriesApi.getAll('main').then(cats => {
        if (!cats || cats.length === 0) {
          import('../../data/sampleData').then(({ initializeMainCategoriesSeed }) => setMainCategoryOptions(initializeMainCategoriesSeed()));
        } else setMainCategoryOptions(cats);
      });
    });
  }, []);

  const loadItem = async () => {
    try {
      setLoading(true);
      const item = await api.getContentById('pois', id);
      
      // Mapear del backend (español) al frontend (inglés)
      setFormData({
        name: item.nombre || '',
        description: item.descripcion || '',
        coverUrl: item.imagen || '',
        available: item.disponible ?? true,
        isFeatured: false,
        categories: item.categorias || [],
        mainCategories: item.tags || [],
        location: { 
          address: item.ubicacion?.direccion || '', 
          coords: { 
            lat: item.ubicacion?.coords?.lat || '', 
            lng: item.ubicacion?.coords?.lng || '' 
          } 
        },
        contact: { phone: '', mail: '', link: '' },
        order: 0
      });
    } catch (err) {
      setError('Error al cargar el punto');
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
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    
    // Convertir al formato que espera el backend (español)
    const payload = {
      nombre: formData.name,
      descripcion: formData.description || '',
      imagen: formData.coverUrl || '',
      categorias: formData.categories || [],
      tags: formData.mainCategories || [],
      direccion: formData.location?.address || '',
      barrio: '',
      ciudad: '',
      pais: '',
      horario: '',
      costo_entrada: 0,
      moneda: 'BOB',
      gratis: true,
      actividades: [],
      recomendaciones: [],
      disponible: formData.available !== false
    };
    
    try {
      setLoading(true);
      if (isEdit) await api.updateContent('pois', id, payload);
      else await api.createContent('pois', payload);
      navigate('/modules/points');
    } catch (err) {
      console.error('Error guardando POI:', err);
      setError('Error al guardar el punto: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/points');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/points')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isEdit ? 'Editar Punto de Interés' : 'Nuevo Punto de Interés'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="points-form">
        <div className="form-section">
          <h3>Información</h3>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen *</label>
            <input type="url" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} required className="form-control" placeholder="https://..." />
            {formData.coverUrl && <div className="image-preview"><img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: 10 }} /></div>}
          </div>
          <div className="form-row">
            <div className="form-group"><label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} /> Disponible</label></div>
            <div className="form-group"><label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Destacado</label></div>
          </div>
        </div>

        <div className="form-section">
          <h3>Categorías</h3>
          <div className="form-group">
            <label>Categorías</label>
            <div className="pill-group">
              {categoryOptions.map(cat => {
                const active = (formData.categories || []).includes(cat.id);
                return (
                  <button type="button" key={cat.id} className={`pill ${active ? 'active' : ''}`} onClick={() => toggleCategory(cat.id, 'categories')} title={cat.id}>
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
                const active = (formData.mainCategories || []).includes(cat.id);
                return (
                  <button type="button" key={cat.id} className={`pill ${active ? 'active' : ''}`} onClick={() => toggleCategory(cat.id, 'mainCategories')} title={cat.name}>
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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

        <div className="form-section">
          <h3>Contacto</h3>
          <div className="form-group"><label htmlFor="contact.phone">Teléfono</label><input type="tel" id="contact.phone" name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="form-control" /></div>
          <div className="form-group"><label htmlFor="contact.mail">Correo</label><input type="email" id="contact.mail" name="contact.mail" value={formData.contact.mail} onChange={handleChange} className="form-control" /></div>
          <div className="form-group"><label htmlFor="contact.link">Sitio web</label><input type="url" id="contact.link" name="contact.link" value={formData.contact.link} onChange={handleChange} className="form-control" placeholder="https://..." /></div>
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

export default PointsForm;
