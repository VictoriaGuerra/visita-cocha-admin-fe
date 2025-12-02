import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

const RouteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id) && location.pathname.includes('/edit/');
  const isView = Boolean(id) && location.pathname.includes('/view/');
  const isReadOnly = isView;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    coverUrl: '',
    disponible: true,
    hoteles: [],
    restaurantes: [],
    pois: [],
    geometria: {
      type: 'LineString',
      coordinates: []
    },
    duracionEstimada: '',
    distanciaKm: 0,
    dificultad: '',
    etiquetas: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para los selectores
  const [hotelesDisponibles, setHotelesDisponibles] = useState([]);
  const [restaurantesDisponibles, setRestaurantesDisponibles] = useState([]);
  const [poisDisponibles, setPoisDisponibles] = useState([]);
  
  // Estados temporales para agregar items
  const [tempEtiqueta, setTempEtiqueta] = useState('');

  useEffect(() => {
    loadOptions();
    if (id) {
      loadRoute();
    }
  }, [id]);

  const loadOptions = async () => {
    try {
      // Cargar hoteles, restaurantes y POIs disponibles
      const [hoteles, restaurantes, pois] = await Promise.all([
        api.getContentList('hotels').catch(() => []),
        api.getContentList('restaurants').catch(() => []),
        api.getContentList('points').catch(() => [])
      ]);
      
      setHotelesDisponibles(hoteles.map(h => ({ id: h._id || h.id, nombre: h.nombre || h.name })));
      setRestaurantesDisponibles(restaurantes.map(r => ({ id: r._id || r.id, nombre: r.nombre || r.name })));
      setPoisDisponibles(pois.map(p => ({ id: p._id || p.id, nombre: p.nombre || p.name })));
    } catch (err) {
      console.error('Error cargando opciones:', err);
    }
  };

  const loadRoute = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      console.log('🔄 Cargando ruta con ID:', id);
      
      const response = await api.getContentById('routes', id);
      const data = response.data || response;
      
      console.log('📥 Datos recibidos:', data);
      
      // Mapear datos del backend al formato del formulario
      const mappedData = {
        nombre: data.nombre || '',
        descripcion: data.descripcion || '',
        coverUrl: data.coverUrl || '',
        disponible: data.disponible !== undefined ? data.disponible : true,
        hoteles: Array.isArray(data.hoteles) ? data.hoteles.map(h => typeof h === 'string' ? h : h._id) : [],
        restaurantes: Array.isArray(data.restaurantes) ? data.restaurantes.map(r => typeof r === 'string' ? r : r._id) : [],
        pois: Array.isArray(data.pois) ? data.pois.map(p => typeof p === 'string' ? p : p._id) : [],
        geometria: data.geometria || { type: 'LineString', coordinates: [] },
        duracionEstimada: data.duracionEstimada || '',
        distanciaKm: data.distanciaKm !== undefined ? Number(data.distanciaKm) : 0,
        dificultad: data.dificultad || '',
        etiquetas: Array.isArray(data.etiquetas) ? data.etiquetas : []
      };
      
      setFormData(mappedData);
    } catch (err) {
      console.error('❌ Error cargando ruta:', err);
      setError('Error al cargar la ruta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'nombre' && !isEdit) {
      setFormData(prev => ({ ...prev, nombre: value }));
      return;
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) 
    }));
  };

  const handleMultiSelect = (name, selectedId) => {
    if (!selectedId) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(selectedId) ? prev[name] : [...prev[name], selectedId]
    }));
  };

  const removeFromList = (listName, itemId) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(id => id !== itemId)
    }));
  };

  const addEtiqueta = () => {
    const etiq = tempEtiqueta.trim();
    if (!etiq || formData.etiquetas.includes(etiq)) return;
    setFormData(prev => ({ ...prev, etiquetas: [...prev.etiquetas, etiq] }));
    setTempEtiqueta('');
  };

  const removeEtiqueta = (etiq) => {
    setFormData(prev => ({ ...prev, etiquetas: prev.etiquetas.filter(e => e !== etiq) }));
  };

  const validate = () => {
    if (!formData.nombre.trim()) return 'Nombre requerido';
    if (!formData.descripcion.trim()) return 'Descripción requerida';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    
    try {
      setLoading(true);
      
      const payload = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        coverUrl: formData.coverUrl.trim(),
        disponible: formData.disponible,
        hoteles: formData.hoteles,
        restaurantes: formData.restaurantes,
        pois: formData.pois,
        geometria: (formData.geometria?.coordinates && formData.geometria.coordinates.length > 0) ? formData.geometria : undefined,
        duracionEstimada: formData.duracionEstimada.trim(),
        distanciaKm: Number(formData.distanciaKm) || undefined,
        dificultad: formData.dificultad.trim(),
        etiquetas: formData.etiquetas
      };
      
      console.log('📤 Enviando payload:', payload);
      
      if (isEdit) {
        await api.updateContent('routes', id, payload);
      } else {
        await api.createContent('routes', payload);
      }
      
      navigate('/modules/routes');
    } catch (err) {
      console.error('❌ Error guardando ruta:', err);
      const errorMsg = err?.response?.data?.message || 'Error al guardar la ruta';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/modules/routes');

  const getNombreById = (lista, id) => {
    const item = lista.find(i => i.id === id);
    return item?.nombre || id;
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={handleCancel} className="btn-back" title="Volver a la lista">
            ← Volver a la lista
          </button>
          <h2>{isView ? 'Ver Ruta Turística' : (isEdit ? 'Editar Ruta Turística' : 'Nueva Ruta Turística')}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="route-form">
        {/* Información Básica */}
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
              disabled={isReadOnly}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              required 
              rows={4} 
              className="form-control" 
              disabled={isReadOnly}
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
              disabled={isReadOnly}
            />
            {formData.coverUrl && (
              <div className="image-preview">
                <img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: 10 }} />
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label><input type="checkbox" name="disponible" checked={formData.disponible} onChange={handleChange} disabled={isReadOnly} /> Disponible</label>
            </div>
          </div>
        </div>

        {/* Puntos de la Ruta */}
        <div className="form-section">
          <h3>Puntos de la Ruta</h3>
          
          {/* Hoteles */}
          <div className="form-group">
            <label>Hoteles</label>
            <select 
              className="form-control" 
              onChange={(e) => handleMultiSelect('hoteles', e.target.value)}
              value=""
              disabled={isReadOnly}
            >
              <option value="">Seleccionar hotel...</option>
              {hotelesDisponibles.map(h => (
                <option key={h.id} value={h.id}>{h.nombre}</option>
              ))}
            </select>
            {formData.hoteles.length > 0 && (
              <ul className="array-list">
                {formData.hoteles.map(hId => (
                  <li key={hId}>
                    🏭 {getNombreById(hotelesDisponibles, hId)}
                    {!isReadOnly && <button type="button" onClick={() => removeFromList('hoteles', hId)}>×</button>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Restaurantes */}
          <div className="form-group">
            <label>Restaurantes</label>
            <select 
              className="form-control" 
              onChange={(e) => handleMultiSelect('restaurantes', e.target.value)}
              value=""
              disabled={isReadOnly}
            >
              <option value="">Seleccionar restaurante...</option>
              {restaurantesDisponibles.map(r => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
            {formData.restaurantes.length > 0 && (
              <ul className="array-list">
                {formData.restaurantes.map(rId => (
                  <li key={rId}>
                    🍽️ {getNombreById(restaurantesDisponibles, rId)}
                    {!isReadOnly && <button type="button" onClick={() => removeFromList('restaurantes', rId)}>×</button>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* POIs */}
          <div className="form-group">
            <label>Puntos de Interés (POI)</label>
            <select 
              className="form-control" 
              onChange={(e) => handleMultiSelect('pois', e.target.value)}
              value=""
              disabled={isReadOnly}
            >
              <option value="">Seleccionar POI...</option>
              {poisDisponibles.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {formData.pois.length > 0 && (
              <ul className="array-list">
                {formData.pois.map(pId => (
                  <li key={pId}>
                    📍 {getNombreById(poisDisponibles, pId)}
                    {!isReadOnly && <button type="button" onClick={() => removeFromList('pois', pId)}>×</button>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Detalles de la Ruta */}
        <div className="form-section">
          <h3>Detalles</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duracionEstimada">Duración estimada</label>
              <input 
                type="text" 
                id="duracionEstimada" 
                name="duracionEstimada" 
                value={formData.duracionEstimada} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Ej: 3 horas"
                disabled={isReadOnly}
              />
            </div>
            <div className="form-group">
              <label htmlFor="distanciaKm">Distancia (km)</label>
              <input 
                type="number" 
                id="distanciaKm" 
                name="distanciaKm" 
                value={formData.distanciaKm} 
                onChange={handleChange} 
                step="0.1"
                className="form-control" 
                disabled={isReadOnly}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dificultad">Dificultad</label>
              <select 
                id="dificultad" 
                name="dificultad" 
                value={formData.dificultad} 
                onChange={handleChange} 
                className="form-control"
                disabled={isReadOnly}
              >
                <option value="">Seleccionar...</option>
                <option value="Fácil">Fácil</option>
                <option value="Moderada">Moderada</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>

          {/* Etiquetas */}
          <div className="form-group">
            <label>Etiquetas</label>
            <div className="array-input-row">
              <input 
                type="text" 
                value={tempEtiqueta} 
                onChange={e => setTempEtiqueta(e.target.value)} 
                className="form-control" 
                placeholder="Ej: gastronómica, cultural"
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addEtiqueta())}
                disabled={isReadOnly}
              />
              {!isReadOnly && <button type="button" className="btn btn-small" onClick={addEtiqueta}>Añadir</button>}
            </div>
            {formData.etiquetas.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {formData.etiquetas.map(etiq => (
                  <span key={etiq} className="pill-badge" style={{ background: '#e0e7ff', color: '#3730a3', cursor: isReadOnly ? 'default' : 'pointer' }} onClick={() => !isReadOnly && removeEtiqueta(etiq)}>
                    {etiq} {!isReadOnly && '×'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar Ruta' : 'Crear Ruta')}
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
            {isReadOnly ? 'Volver' : 'Cancelar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RouteForm;
