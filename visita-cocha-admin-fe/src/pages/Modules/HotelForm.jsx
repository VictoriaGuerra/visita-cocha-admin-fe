import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

const HotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    estrellas: 3,
    rating: 0,
    categorias: [],
    amenidades: [],
    tipos_habitacion: [],
    precio_min: 0,
    precio_max: 0,
    moneda: 'BOB',
    check_in: '',
    check_out: '',
    direccion: '',
    ciudad: '',
    pais: '',
    telefono: '',
    email: '',
    disponible: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState({ categoria: '', amenidad: '', tipo_habitacion: '' });

  const categoriaOptions = ['hotel', 'familiar', 'boutique', 'resort', 'hostal'];

  useEffect(() => { if (isEdit) loadHotel(); }, [id]);

  const loadHotel = async () => {
    try {
      setLoading(true);
      const hotel = await api.getContentById('hotels', id);
      
      console.log('📥 Hotel cargado del backend:', hotel);
      
      // Mapear del backend al estado del formulario
      setFormData({
        nombre: hotel.nombre || '',
        descripcion: hotel.descripcion || '',
        imagen: hotel.imagen || '',
        estrellas: hotel.estrellas || 3,
        rating: hotel.rating || 0,
        categorias: hotel.categorias || [],
        amenidades: hotel.amenidades || [],
        tipos_habitacion: hotel.tipos_habitacion || [],
        precio_min: hotel.precio?.min || 0,
        precio_max: hotel.precio?.max || 0,
        moneda: hotel.precio?.moneda || 'BOB',
        check_in: hotel.check_in || '',
        check_out: hotel.check_out || '',
        direccion: hotel.ubicacion?.direccion || '',
        ciudad: hotel.ubicacion?.ciudad || '',
        pais: hotel.ubicacion?.pais || '',
        telefono: hotel.contacto?.telefono || '',
        email: hotel.contacto?.email || '',
        disponible: hotel.disponible ?? true
      });
    } catch (err) {
      console.error('Error cargando hotel:', err);
      setError('Error al cargar el hotel');
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
  
  const pushAmenidad = () => {
    const val = (temp.amenidad || '').trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, amenidades: [...prev.amenidades, val] }));
    setTemp(prev => ({ ...prev, amenidad: '' }));
  };
  
  const removeAmenidad = (index) => setFormData(prev => ({ 
    ...prev, 
    amenidades: prev.amenidades.filter((_, i) => i !== index) 
  }));

  const pushTipoHabitacion = () => {
    const val = (temp.tipo_habitacion || '').trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, tipos_habitacion: [...prev.tipos_habitacion, val] }));
    setTemp(prev => ({ ...prev, tipo_habitacion: '' }));
  };
  
  const removeTipoHabitacion = (index) => setFormData(prev => ({ 
    ...prev, 
    tipos_habitacion: prev.tipos_habitacion.filter((_, i) => i !== index) 
  }));

  const validate = () => {
    if (!formData.nombre.trim()) return 'Nombre requerido';
    if (!formData.descripcion.trim()) return 'Descripción requerida';
    if (formData.estrellas < 1 || formData.estrellas > 5) return 'Estrellas debe estar entre 1 y 5';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    // Construir payload según el DTO del backend
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || '',
      imagen: formData.imagen || '',
      estrellas: formData.estrellas || 3,
      rating: formData.rating || 0,
      categorias: formData.categorias || [],
      amenidades: formData.amenidades || [],
      tipos_habitacion: formData.tipos_habitacion || [],
      precio_min: formData.precio_min || 0,
      precio_max: formData.precio_max || 0,
      moneda: formData.moneda || 'BOB',
      check_in: formData.check_in || '',
      check_out: formData.check_out || '',
      direccion: formData.direccion || '',
      ciudad: formData.ciudad || '',
      pais: formData.pais || '',
      telefono: formData.telefono || '',
      email: formData.email || '',
      disponible: formData.disponible ?? true
    };

    console.log('📤 Payload que se enviará:', payload);

    try {
      setLoading(true);
      if (isEdit) {
        await api.updateContent('hotels', id, payload);
      } else {
        await api.createContent('hotels', payload);
      }
      navigate('/modules/hotels');
    } catch (err) {
      console.error('Error guardando hotel:', err);
      console.error('Detalles del error:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message;
      const errorDetails = err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : '';
      setError(`Error al guardar el hotel: ${errorMsg} ${errorDetails}`);
    } finally { 
      setLoading(false); 
    }
  };

  const handleCancel = () => navigate('/modules/hotels');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/modules/hotels')} 
            className="btn-back" 
            title="Volver a la lista"
          >
            ← Volver a la lista
          </button>
          <h2>{isEdit ? 'Editar Hotel' : 'Nuevo Hotel'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="hotel-form">
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
            <label htmlFor="descripcion">Descripción *</label>
            <textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              required 
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
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estrellas">Estrellas (1-5) *</label>
              <input 
                type="number" 
                id="estrellas" 
                name="estrellas" 
                value={formData.estrellas} 
                onChange={handleChange} 
                min={1} 
                max={5} 
                required 
                className="form-control" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rating">Calificación (0-5)</label>
              <input 
                type="number" 
                id="rating" 
                name="rating" 
                value={formData.rating} 
                onChange={handleChange} 
                min={0} 
                max={5} 
                step={0.1} 
                className="form-control" 
              />
            </div>
          </div>

          <div className="form-row">
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
        </div>

        {/* Categorías */}
        <div className="form-section">
          <h3>Categorías</h3>
          <div className="checkbox-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
            {categoriaOptions.map(c => (
              <label key={c} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={formData.categorias.includes(c)} 
                  onChange={() => toggleCategoria(c)} 
                /> {c}
              </label>
            ))}
          </div>
        </div>

        {/* Amenidades */}
        <div className="form-section">
          <h3>Amenidades</h3>
          <div className="form-group">
            <div className="array-input-row">
              <input 
                type="text" 
                name="amenidad" 
                value={temp.amenidad} 
                onChange={tempChange} 
                className="form-control" 
                placeholder="Ej: WiFi, Piscina, Desayuno"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), pushAmenidad())}
              />
              <button 
                type="button" 
                className="btn btn-small" 
                onClick={pushAmenidad}
              >
                Añadir
              </button>
            </div>
            {formData.amenidades.length > 0 && (
              <ul className="array-list">
                {formData.amenidades.map((item, i) => (
                  <li key={i}>
                    <span>{item}</span>
                    <button 
                      type="button" 
                      className="btn btn-danger btn-xsmall" 
                      onClick={() => removeAmenidad(i)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Tipos de habitación */}
        <div className="form-section">
          <h3>Tipos de Habitación</h3>
          <div className="form-group">
            <div className="array-input-row">
              <input 
                type="text" 
                name="tipo_habitacion" 
                value={temp.tipo_habitacion} 
                onChange={tempChange} 
                className="form-control" 
                placeholder="Ej: Single, Doble, Suite"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), pushTipoHabitacion())}
              />
              <button 
                type="button" 
                className="btn btn-small" 
                onClick={pushTipoHabitacion}
              >
                Añadir
              </button>
            </div>
            {formData.tipos_habitacion.length > 0 && (
              <ul className="array-list">
                {formData.tipos_habitacion.map((item, i) => (
                  <li key={i}>
                    <span>{item}</span>
                    <button 
                      type="button" 
                      className="btn btn-danger btn-xsmall" 
                      onClick={() => removeTipoHabitacion(i)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Precios */}
        <div className="form-section">
          <h3>Precios</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio_min">Precio mínimo</label>
              <input 
                type="number" 
                id="precio_min" 
                name="precio_min" 
                value={formData.precio_min} 
                onChange={handleChange} 
                min={0} 
                className="form-control" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="precio_max">Precio máximo</label>
              <input 
                type="number" 
                id="precio_max" 
                name="precio_max" 
                value={formData.precio_max} 
                onChange={handleChange} 
                min={0} 
                className="form-control" 
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
        </div>

        {/* Check-in/out */}
        <div className="form-section">
          <h3>Check-in / Check-out</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="check_in">Check-in</label>
              <input 
                type="time" 
                id="check_in" 
                name="check_in" 
                value={formData.check_in} 
                onChange={handleChange} 
                className="form-control" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="check_out">Check-out</label>
              <input 
                type="time" 
                id="check_out" 
                name="check_out" 
                value={formData.check_out} 
                onChange={handleChange} 
                className="form-control" 
              />
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
              placeholder="Ej: Av. Principal 123"
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
                placeholder="Ej: Cochabamba"
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
                placeholder="Ej: Bolivia"
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="form-section">
          <h3>Contacto</h3>
          
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input 
              type="tel" 
              id="telefono" 
              name="telefono" 
              value={formData.telefono} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="+591 4 4411111"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="reservas@hotel.com"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary"
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
