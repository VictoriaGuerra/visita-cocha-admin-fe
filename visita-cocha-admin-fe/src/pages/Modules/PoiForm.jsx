import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

const PoiForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isView = location.pathname.includes('/view/');
  const isEdit = Boolean(id) && !isView;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    icono: '',
    categorias: [],
    tags: [],
    direccion: '',
    barrio: '',
    ciudad: '',
    pais: '',
    horario: '',
    costo_entrada: 0,
    moneda: 'BOB',
    gratis: false,
    actividades: [],
    recomendaciones: [],
    destacado: false,
    orden: 0,
    disponible: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState({ 
    categoria: '', 
    tag: '', 
    actividad: '', 
    recomendacion: '' 
  });

  const categoriaOptions = ['monumento', 'vista-panoramica', 'religioso', 'museo', 'parque', 'plaza', 'mercado', 'otro'];

  useEffect(() => { 
    if (isEdit || isView) loadPoi(); 
  }, [id, isEdit, isView]);

  const loadPoi = async () => {
    try {
      setLoading(true);
      const data = await api.getContentById('points', id);
      
      console.log('📥 POI cargado del backend:', data);
      
      setFormData({
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        imagen: data.imagen || '',
        icono: data.icono || '',
        categorias: data.categorias || [],
        tags: data.tags || [],
        direccion: data.ubicacion?.direccion || '',
        barrio: data.ubicacion?.barrio || '',
        destacado: data.destacado || false,
        orden: data.orden || 0,
        ciudad: data.ubicacion?.ciudad || '',
        pais: data.ubicacion?.pais || '',
        horario: data.horario || '',
        costo_entrada: data.costo_entrada || 0,
        moneda: data.moneda || 'BOB',
        gratis: data.gratis || false,
        actividades: data.actividades || [],
        recomendaciones: data.recomendaciones || [],
        disponible: data.disponible ?? true
      });
    } catch (err) {
      console.error('Error cargando POI:', err);
      setError('Error al cargar el punto de interés');
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

  const toggleCategoria = (value) => {
    setFormData(prev => {
      const list = prev.categorias || [];
      return { 
        ...prev, 
        categorias: list.includes(value) ? list.filter(v => v !== value) : [...list, value] 
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

  const pushActividad = () => {
    const val = (temp.actividad || '').trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, actividades: [...prev.actividades, val] }));
    setTemp(prev => ({ ...prev, actividad: '' }));
  };
  
  const removeActividad = (index) => setFormData(prev => ({ 
    ...prev, 
    actividades: prev.actividades.filter((_, i) => i !== index) 
  }));

  const pushRecomendacion = () => {
    const val = (temp.recomendacion || '').trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, recomendaciones: [...prev.recomendaciones, val] }));
    setTemp(prev => ({ ...prev, recomendacion: '' }));
  };
  
  const removeRecomendacion = (index) => setFormData(prev => ({ 
    ...prev, 
    recomendaciones: prev.recomendaciones.filter((_, i) => i !== index) 
  }));

  const validate = () => {
    if (!formData.nombre.trim()) return 'Nombre requerido';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    // El DTO del backend recibe los campos de ubicación planos, no anidados
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || '',
      imagen: formData.imagen || '',
      icono: formData.icono || '',
      categorias: formData.categorias || [],
      tags: formData.tags || [],
      direccion: formData.direccion || '',
      barrio: formData.barrio || '',
      ciudad: formData.ciudad || '',
      pais: formData.pais || '',
      horario: formData.horario || '',
      costo_entrada: Number(formData.costo_entrada) || 0,
      moneda: formData.moneda || 'BOB',
      gratis: Boolean(formData.gratis),
      actividades: formData.actividades || [],
      recomendaciones: formData.recomendaciones || [],
      destacado: Boolean(formData.destacado),
      orden: Number(formData.orden) || 0,
      disponible: formData.disponible !== false
    };

    console.log('📤 Payload que se enviará:', payload);

    try {
      setLoading(true);
      if (isEdit) {
        await api.updateContent('points', id, payload);
      } else {
        await api.createContent('points', payload);
      }
      navigate('/modules/points');
    } catch (err) {
      console.error('Error guardando POI:', err);
      console.error('Detalles del error:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message;
      const errorDetails = err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : '';
      setError(`Error al guardar el punto de interés: ${errorMsg} ${errorDetails}`);
    } finally { 
      setLoading(false); 
    }
  };

  const handleCancel = () => navigate('/modules/points');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/modules/points')} 
            className="btn-back" 
            title="Volver a la lista"
          >
            ← Volver a la lista
          </button>
          <h2>{isView ? 'Ver Punto de Interés' : isEdit ? 'Editar Punto de Interés' : 'Nuevo Punto de Interés'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="poi-form">
        <fieldset disabled={isView} style={{ border: 'none', padding: 0, margin: 0 }}>
        {/* Información básica */}
        <div className="form-section">
          <h3>Información Básica</h3>
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              required 
              className="form-control" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              rows={4} 
              className="form-control" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagen">URL imagen</label>
            <input 
              type="url" 
              id="imagen" 
              name="imagen" 
              value={formData.imagen} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="https://..." 
            />
            {formData.imagen && (
              <div className="image-preview">
                <img 
                  src={formData.imagen} 
                  alt="Preview" 
                  style={{ maxWidth: '300px', marginTop: 10 }} 
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Icono (Bootstrap Icons)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginTop: '8px' }}>
              {[
                { name: 'bi-geo-alt-fill', label: 'Pin' },
                { name: 'bi-building', label: 'Edificio' },
                { name: 'bi-tree', label: 'Naturaleza' },
                { name: 'bi-camera', label: 'Cámara' },
                { name: 'bi-cup-hot', label: 'Café' },
                { name: 'bi-shop', label: 'Tienda' },
                { name: 'bi-bank', label: 'Banco' },
                { name: 'bi-hospital', label: 'Hospital' },
                { name: 'bi-cart', label: 'Mercado' },
                { name: 'bi-star-fill', label: 'Estrella' },
                { name: 'bi-heart-fill', label: 'Corazón' },
                { name: 'bi-flag-fill', label: 'Bandera' }
              ].map(icon => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icono: icon.name }))}
                  style={{
                    padding: '10px',
                    border: formData.icono === icon.name ? '2px solid #3f908e' : '1px solid #ddd',
                    borderRadius: '8px',
                    background: formData.icono === icon.name ? '#e0f7fa' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px'
                  }}
                  title={icon.label}
                >
                  <i className={icon.name} style={{ fontSize: '24px' }}></i>
                  <span>{icon.label}</span>
                </button>
              ))}
            </div>
            {formData.icono && (
              <div style={{ marginTop: '10px', padding: '8px', background: '#f0f0f0', borderRadius: '4px', fontSize: '13px' }}>
                Icono seleccionado: <i className={formData.icono} style={{ fontSize: '18px', marginLeft: '8px' }}></i> <code>{formData.icono}</code>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="horario">Horario</label>
            <input 
              type="text" 
              id="horario" 
              name="horario" 
              value={formData.horario} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="Ej: 09:00 - 18:00"
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="form-section">
          <h3>Categorías</h3>
          <div className="checkbox-grid">
            {categoriaOptions.map(cat => (
              <label key={cat} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.categorias.includes(cat)}
                  onChange={() => toggleCategoria(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="form-section">
          <h3>Tags</h3>
          <div className="form-group">
            <div className="input-with-button">
              <input
                type="text"
                name="tag"
                value={temp.tag}
                onChange={tempChange}
                placeholder="Agregar tag"
                className="form-control"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), pushTag())}
              />
              <button type="button" onClick={pushTag} className="btn btn-secondary">+</button>
            </div>
            <div className="tags-list">
              {formData.tags.map((t, i) => (
                <span key={i} className="tag">
                  {t}
                  <button type="button" onClick={() => removeTag(i)} className="tag-remove">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="form-section">
          <h3>Ubicación</h3>
          
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input 
              type="text" 
              id="direccion" 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="Ej: Cerro de San Pedro"
            />
          </div>

          <div className="form-group">
            <label htmlFor="barrio">Barrio</label>
            <input 
              type="text" 
              id="barrio" 
              name="barrio" 
              value={formData.barrio} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="Ej: San Pedro"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input 
                type="text" 
                id="ciudad" 
                name="ciudad" 
                value={formData.ciudad} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Cochabamba"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pais">País</label>
              <input 
                type="text" 
                id="pais" 
                name="pais" 
                value={formData.pais} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Bolivia"
              />
            </div>
          </div>
        </div>

        {/* Costos */}
        <div className="form-section">
          <h3>Información de Costos</h3>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="gratis" 
                checked={formData.gratis} 
                onChange={handleChange} 
              /> Entrada gratuita
            </label>
          </div>

          {!formData.gratis && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="costo_entrada">Costo de entrada</label>
                <input 
                  type="number" 
                  id="costo_entrada" 
                  name="costo_entrada" 
                  value={formData.costo_entrada} 
                  onChange={handleChange} 
                  className="form-control" 
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="moneda">Moneda</label>
                <select
                  id="moneda"
                  name="moneda"
                  value={formData.moneda}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="BOB">BOB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Actividades */}
        <div className="form-section">
          <h3>Actividades Disponibles</h3>
          <div className="form-group">
            <div className="input-with-button">
              <input
                type="text"
                name="actividad"
                value={temp.actividad}
                onChange={tempChange}
                placeholder="Agregar actividad"
                className="form-control"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), pushActividad())}
              />
              <button type="button" onClick={pushActividad} className="btn btn-secondary">+</button>
            </div>
            <div className="tags-list">
              {formData.actividades.map((a, i) => (
                <span key={i} className="tag">
                  {a}
                  <button type="button" onClick={() => removeActividad(i)} className="tag-remove">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="form-section">
          <h3>Recomendaciones para Visitantes</h3>
          <div className="form-group">
            <div className="input-with-button">
              <input
                type="text"
                name="recomendacion"
                value={temp.recomendacion}
                onChange={tempChange}
                placeholder="Agregar recomendación"
                className="form-control"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), pushRecomendacion())}
              />
              <button type="button" onClick={pushRecomendacion} className="btn btn-secondary">+</button>
            </div>
            <div className="tags-list">
              {formData.recomendaciones.map((r, i) => (
                <span key={i} className="tag">
                  {r}
                  <button type="button" onClick={() => removeRecomendacion(i)} className="tag-remove">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div className="form-section">
          <h3>Configuración</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="orden">Orden de visualización</label>
              <input
                id="orden"
                type="number"
                name="orden"
                value={formData.orden}
                onChange={handleChange}
                className="form-control"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="destacado" 
                checked={formData.destacado} 
                onChange={handleChange} 
              /> Destacado (aparecerá en la página principal)
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="disponible" 
                checked={formData.disponible} 
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
            {isView ? 'Volver' : 'Cancelar'}
          </button>
          {!isView && (
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
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

export default PoiForm;
