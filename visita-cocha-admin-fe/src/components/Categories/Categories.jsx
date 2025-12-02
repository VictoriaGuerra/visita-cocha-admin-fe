import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { categoriesAPI } from '../../api/api';
import { MODULE_TYPES } from '../../config/moduleTypes';

const Categories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getHierarchy();
      setCategories(data);
    } catch (err) {
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Reordenar categorías
    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(source.index, 1);
    reorderedCategories.splice(destination.index, 0, removed);

    setCategories(reorderedCategories);

    try {
      await categoriesAPI.update(removed.id, {
        ...removed,
        order: destination.index
      });
    } catch (err) {
      console.error('Error al actualizar el orden:', err);
      loadCategories(); // Recargar en caso de error
    }
  };

  const handleAddCategory = () => {
    setEditingCategory({
      id: null,
      name: '',
      description: '',
      parentId: null,
      moduleType: '',
      icon: ''
    });
  };

  const handleSaveCategory = async (category) => {
    try {
      if (category.id) {
        await categoriesAPI.update(category.id, category);
      } else {
        await categoriesAPI.create(category);
      }
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error('Error al guardar la categoría:', err);
    }
  };

  const renderCategoryForm = () => {
    if (!editingCategory) return null;

    return (
      <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <h3 style={{fontSize: 16, fontWeight: 600, marginBottom: 16}}>
          {editingCategory.id ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveCategory(editingCategory);
        }}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({
                ...editingCategory,
                name: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              value={editingCategory.description}
              onChange={(e) => setEditingCategory({
                ...editingCategory,
                description: e.target.value
              })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Módulo</label>
            <select
              className="form-control"
              value={editingCategory.moduleType}
              onChange={(e) => setEditingCategory({
                ...editingCategory,
                moduleType: e.target.value
              })}
              required
            >
              <option value="">Seleccionar módulo</option>
              {Object.entries(MODULE_TYPES).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ícono</label>
            <div className="icon-selector">
              <input
                type="text"
                className="form-control"
                value={editingCategory.icon}
                onChange={(e) => setEditingCategory({
                  ...editingCategory,
                  icon: e.target.value
                })}
                placeholder="fa-icon-name"
              />
              <i className={`fas ${editingCategory.icon} preview-icon`}></i>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Categoría Padre</label>
            <select
              className="form-control"
              value={editingCategory.parentId || ''}
              onChange={(e) => setEditingCategory({
                ...editingCategory,
                parentId: e.target.value || null
              })}
            >
              <option value="">Sin categoría padre</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16}}>
            <button
              type="button"
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: '#fff',
                cursor: 'pointer'
              }}
              onClick={() => setEditingCategory(null)}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={{
                padding: '8px 16px',
                background: '#3f908e',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (loading) return (
    <div className="module-container">
      <div className="loading">Cargando categorías...</div>
    </div>
  );
  
  if (error) return (
    <div className="module-container">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="module-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{margin: 0, fontSize: '18px', fontWeight: 600}}>Gestión de Categorías</h2>
        <button
          style={{
            padding: '10px 20px',
            background: '#3f908e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={handleAddCategory}
        >
          <i className="fas fa-plus"></i>
          Nueva Categoría
        </button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: editingCategory ? '1fr 1fr' : '1fr', gap: '20px'}}>
        <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{display: 'flex', flexDirection: 'column', gap: '8px'}}
                >
                  {categories.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <i className={`fas ${category.icon}`} style={{color: '#3f908e', marginRight: 12, fontSize: 18}}></i>
                          <div style={{flex: 1}}>
                            <h3 style={{margin: 0, fontWeight: 600, fontSize: 14}}>{category.name}</h3>
                            <p style={{margin: 0, fontSize: 12, color: '#6b7280'}}>
                              {MODULE_TYPES[category.moduleType]?.name}
                            </p>
                          </div>
                          <div style={{display:'flex', gap:'12px'}}>
                            <i
                              className="fas fa-edit"
                              onClick={() => setEditingCategory(category)}
                              style={{cursor:'pointer', fontSize:'18px'}}
                              title="Editar"
                            ></i>
                            <i
                              className="fas fa-trash"
                              onClick={() => {
                                if (confirm('¿Eliminar esta categoría?')) {
                                  categoriesAPI.delete(category.id)
                                    .then(loadCategories);
                                }
                              }}
                              style={{cursor:'pointer', fontSize:'18px'}}
                              title="Eliminar"
                            ></i>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {renderCategoryForm()}
      </div>
    </div>
  );
};

export default Categories;