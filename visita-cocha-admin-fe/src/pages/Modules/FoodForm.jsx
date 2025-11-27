import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import '../../styles/common.css';
import '../../styles/forms.css';

// Formulario CRUD para Comidas
const FoodForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverUrl: '',
    available: true,
    rating: 0,
    ingredients: [],
    order: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temp, setTemp] = useState({ ingredient: '' });

  useEffect(() => { if (isEdit) loadFood(); }, [id]);

  const loadFood = async () => {
    try {
      setLoading(true);
      const item = await api.getContentById('foods', id);
      setFormData(item);
    } catch (err) {
      setError('Error al cargar la comida');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
  };

  const tempChange = (e) => setTemp(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const pushIngredient = () => {
    const val = temp.ingredient.trim();
    if (!val) return;
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, val] }));
    setTemp(prev => ({ ...prev, ingredient: '' }));
  };
  const removeIngredient = (index) => setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));

  const validate = () => {
    if (!formData.name.trim()) return 'Nombre requerido';
    if (!formData.description.trim()) return 'Descripción requerida';
    if (formData.rating < 0 || formData.rating > 5) return 'Rating debe estar entre 0 y 5';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }
    try {
      setLoading(true);
      if (isEdit) await api.updateContent('foods', id, formData);
      else await api.createContent('foods', formData);
      navigate('/modules/foods');
    } catch (err) {
      setError('Error al guardar la comida');
    } finally { setLoading(false); }
  };

  const handleCancel = () => navigate('/modules/foods');

  return (
    <div className="form-container">
      <div className="form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/modules/foods')} className="btn-back" title="Volver a la lista">← Volver a la lista</button>
          <h2>{isEdit ? 'Editar Comida' : 'Nueva Comida'}</h2>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="food-form">
        <div className="form-section">
          <h3>Información Básica</h3>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="coverUrl">URL imagen portada</label>
            <input type="url" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} className="form-control" placeholder="https://..." />
            {formData.coverUrl && <div className="image-preview"><img src={formData.coverUrl} alt="Preview" style={{ maxWidth: '300px', marginTop: 10 }} /></div>}
          </div>
          <div className="form-row">
            <div className="form-group"><label><input type="checkbox" name="available" checked={formData.available} onChange={handleChange} /> Disponible</label></div>
          </div>
        </div>

        <div className="form-section">
          <h3>Ingredientes</h3>
          <div className="form-group">
            <div className="array-input-row">
              <input type="text" name="ingredient" value={temp.ingredient} onChange={tempChange} className="form-control" placeholder="Ingrediente" />
              <button type="button" className="btn btn-small" onClick={pushIngredient}>Añadir</button>
            </div>
            {formData.ingredients.length > 0 && (
              <ul className="array-list">
                {formData.ingredients.map((ing, i) => (
                  <li key={i}><span>{ing}</span><button type="button" className="btn btn-danger btn-xsmall" onClick={() => removeIngredient(i)}>x</button></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Clasificación y Orden</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rating">Calificación (0-5)</label>
              <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} min={0} max={5} step={0.1} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="order">Orden de visualización</label>
              <input type="number" id="order" name="order" value={formData.order} onChange={handleChange} className="form-control" />
            </div>
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

export default FoodForm;
