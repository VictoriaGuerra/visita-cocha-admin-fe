import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { USE_BACKEND, getContentById, createContent, updateContent } from '../../api';
import '../../styles/common.css';
import '../../components/Modules/ModuleForm.css';

const TransportRouteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isReadOnly = location.pathname.includes('/view/');
  const isEdit = !!id && !isReadOnly;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    routeType: 'micro',
    color: '#3f908e',
    active: true,
    order: 0
  });
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getContentById('transport-routes', id);
      setFormData({
        id: data.id || '',
        name: data.name || '',
        description: data.description || '',
        routeType: data.routeType || 'micro',
        color: data.color || '#3f908e',
        active: data.active !== undefined ? data.active : true,
        order: data.order || 0
      });
      setExistingFile({
        fileName: data.fileName,
        fileType: data.fileType,
        fileUrl: data.fileUrl
      });
    } catch (err) {
      setError('Error al cargar la ruta de transporte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validar extensión
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      if (!['kml', 'geojson', 'json'].includes(extension)) {
        setError('Solo se permiten archivos KML o GeoJSON');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!USE_BACKEND) {
      setError('Backend requerido. Configura VITE_USE_BACKEND=true en .env');
      return;
    }

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!isEdit && !file) {
      setError('Debe seleccionar un archivo KML o GeoJSON');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Si no hay ID o está vacío, generar desde el nombre
      const finalId = formData.id.trim() || generateSlug(formData.name);
      
      if (isEdit) {
        // Para editar, si no hay archivo nuevo, enviar JSON normal (sin FormData)
        if (!file) {
          const jsonData = {
            name: formData.name,
            description: formData.description,
            routeType: formData.routeType,
            color: formData.color,
            active: Boolean(formData.active),
            order: Number(formData.order)
          };
          await updateContent('transport-routes', id, jsonData);
        } else {
          // Si hay archivo nuevo, usar FormData
          const dataToSend = new FormData();
          dataToSend.append('file', file);
          dataToSend.append('name', formData.name);
          dataToSend.append('description', formData.description);
          dataToSend.append('routeType', formData.routeType);
          dataToSend.append('color', formData.color);
          dataToSend.append('active', String(formData.active));
          dataToSend.append('order', String(formData.order));
          await updateContent('transport-routes', id, dataToSend);
        }
      } else {
        // Para crear, SIEMPRE debe haber archivo
        if (!file) {
          setError('Debe seleccionar un archivo KML o GeoJSON');
          setLoading(false);
          return;
        }
        
        const dataToSend = new FormData();
        dataToSend.append('file', file);
        dataToSend.append('id', finalId);
        dataToSend.append('name', formData.name);
        dataToSend.append('description', formData.description);
        dataToSend.append('routeType', formData.routeType);
        dataToSend.append('color', formData.color);
        dataToSend.append('active', String(formData.active));
        dataToSend.append('order', String(formData.order));
        
        await createContent('transport-routes', dataToSend);
      }

      navigate('/transport-routes');
    } catch (err) {
      console.error('Error al guardar:', err);
      
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Error al guardar la ruta de transporte';
      setError(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="module-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>
          {isReadOnly ? 'Ver Ruta de Transporte' : isEdit ? 'Editar Ruta de Transporte' : 'Nueva Ruta de Transporte'}
        </h2>
      </div>

      {error && <div className="alert alert-danger" style={{
        background: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '12px 16px',
        color: '#991b1b',
        marginBottom: '16px'
      }}>
        <strong>Error:</strong> {error}
      </div>}

      <form onSubmit={handleSubmit} className="module-form">
        <div className="form-card">
          <h3>Información Básica</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id">
                ID/Slug <span style={{ fontSize: 12, color: '#6b7280' }}>(opcional, se genera automáticamente)</span>
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={isEdit || isReadOnly}
                placeholder="ej: linea-a, micro-12"
                className="form-control"
              />
              <small style={{ fontSize: 12, color: '#6b7280' }}>
                Solo minúsculas, números y guiones. Ej: linea-a, trole-1
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isReadOnly}
                required
                placeholder="ej: Línea A, Micro 12"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isReadOnly}
              rows={3}
              placeholder="Descripción de la ruta de transporte"
              className="form-control"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="routeType">Tipo de Transporte</label>
              <select
                id="routeType"
                name="routeType"
                value={formData.routeType}
                onChange={handleChange}
                disabled={isReadOnly}
                className="form-control"
              >
                <option value="bus">🚌 Bus</option>
                <option value="micro">🚍 Micro</option>
                <option value="trolebus">🚎 Trolebús</option>
                <option value="taxi">🚕 Taxi</option>
                <option value="otro">🚗 Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">Color (para el mapa)</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  style={{ width: 60, height: 40, border: '1px solid #d1d5db', borderRadius: 6 }}
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  placeholder="#3f908e"
                  className="form-control"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="order">Orden</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                disabled={isReadOnly}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                disabled={isReadOnly}
              />
              <span>Activo</span>
            </label>
          </div>
        </div>

        <div className="form-card">
          <h3>Archivo de Ruta</h3>

          {existingFile && (
            <div style={{
              background: '#f3f4f6',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              border: '1px solid #d1d5db'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <i className="fas fa-file" style={{ fontSize: 24, color: '#3f908e' }}></i>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{existingFile.fileName}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                    Tipo: {existingFile.fileType?.toUpperCase()}
                  </div>
                </div>
                {existingFile.fileUrl && (
                  <a
                    href={existingFile.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 12px',
                      background: '#3f908e',
                      color: '#fff',
                      borderRadius: 6,
                      textDecoration: 'none',
                      fontSize: 14
                    }}
                  >
                    <i className="fas fa-download"></i> Descargar
                  </a>
                )}
              </div>
            </div>
          )}

          {!isReadOnly && (
            <div className="form-group">
              <label htmlFor="file">
                {isEdit ? 'Cambiar Archivo (opcional)' : 'Archivo KML/GeoJSON *'}
              </label>
              <input
                type="file"
                id="file"
                accept=".kml,.geojson,.json"
                onChange={handleFileChange}
                disabled={isReadOnly}
                className="form-control"
              />
              <small style={{ fontSize: 12, color: '#6b7280' }}>
                Formatos permitidos: .kml, .geojson, .json
              </small>
              {file && (
                <div style={{
                  marginTop: 8,
                  padding: 8,
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: 6,
                  fontSize: 14
                }}>
                  ✓ Archivo seleccionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/transport-routes')}
            className="btn btn-secondary"
          >
            {isReadOnly ? 'Volver' : 'Cancelar'}
          </button>
          {!isReadOnly && (
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransportRouteForm;
