import React, { useState, useEffect } from 'react';
import { hotelCategoriesApi } from '../../api/hotelCategoriesApi';
import IconPicker from '../UI/IconPicker';
import '../../styles/categories.css';
import '../../styles/common.css';

const HotelCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    available: true,
    isFeatured: false,
    order: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await hotelCategoriesApi.getAll();
      // Ordenar por campo order
      const sorted = (data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(sorted);
      setError(null);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError(err.response?.data?.message || 'Error al cargar las categorías de hoteles');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCategories = async () => {
    if (!window.confirm('¿Deseas poblar las 8 categorías iniciales de hoteles? Esto no duplicará las existentes.')) {
      return;
    }

    try {
      setSeeding(true);
      setError(null);
      const result = await hotelCategoriesApi.seed();
      setSuccess(`✅ ${result.message || 'Categorías iniciales creadas exitosamente'}`);
      await loadCategories();
    } catch (err) {
      console.error('Error al poblar categorías:', err);
      setError(err.response?.data?.message || 'Error al poblar categorías iniciales');
    } finally {
      setSeeding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingCategory) {
        await hotelCategoriesApi.update(editingCategory._id, formData);
        setSuccess('✅ Categoría actualizada exitosamente');
      } else {
        await hotelCategoriesApi.create(formData);
        setSuccess('✅ Categoría creada exitosamente');
      }
      
      resetForm();
      await loadCategories();
    } catch (err) {
      console.error('Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      available: category.available !== undefined ? category.available : true,
      isFeatured: category.isFeatured || false,
      order: category.order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setError(null);
      await hotelCategoriesApi.delete(id);
      setSuccess('✅ Categoría eliminada exitosamente');
      await loadCategories();
    } catch (err) {
      console.error('Error al eliminar:', err);
      setError(err.response?.data?.message || 'Error al eliminar la categoría. Puede estar en uso por hoteles.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      available: true,
      isFeatured: false,
      order: 0
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  if (loading) {
    return <div className="loading">Cargando categorías de hoteles...</div>;
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>🏨 Categorías de Hoteles</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            onClick={handleSeedCategories}
            disabled={seeding}
          >
            {seeding ? '⏳ Poblando...' : '🌱 Poblar Categorías Iniciales'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✖ Cancelar' : '➕ Nueva Categoría'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#991b1b',
          marginBottom: '16px'
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{
          background: '#d1fae5',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#065f46',
          marginBottom: '16px'
        }}>
          {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form" style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3>{editingCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                required
                placeholder="Ej: Hotel Boutique"
              />
              <small>{formData.name.length}/100 caracteres</small>
            </div>

            <div className="form-group">
              <label>Icono (emoji o código)</label>
              <IconPicker
                value={formData.icon}
                onChange={handleChange}
                type="hotel"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción de la categoría..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Orden</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
                Disponible
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                Destacada
              </label>
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? '💾 Actualizar' : '➕ Crear'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="categories-list">
        <table className="data-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Icono</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Destacada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No hay categorías de hoteles</p>
                  <button className="btn btn-secondary" onClick={handleSeedCategories}>
                    🌱 Poblar Categorías Iniciales
                  </button>
                </td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat._id}>
                  <td>{cat.order}</td>
                  <td style={{ fontSize: '24px', textAlign: 'center' }}>
                    {cat.icon ? (
                      cat.icon.startsWith('bi-') ? 
                        <i className={`bi ${cat.icon}`} style={{ fontSize: '24px' }}></i> :
                      cat.icon.startsWith('fa-') ? 
                        <i className={`fas ${cat.icon}`} style={{ fontSize: '24px' }}></i> :
                      cat.icon
                    ) : '🏨'}
                  </td>
                  <td><strong>{cat.name}</strong></td>
                  <td>{cat.description || '-'}</td>
                  <td>
                    <span className={`badge ${cat.available ? 'badge-success' : 'badge-danger'}`}>
                      {cat.available ? '✅ Disponible' : '❌ No disponible'}
                    </span>
                  </td>
                  <td>
                    {cat.isFeatured ? '⭐ Sí' : '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(cat)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(cat._id, cat.name)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelCategories;
