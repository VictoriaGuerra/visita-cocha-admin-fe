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
      <div className="category-form card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">
            {editingCategory.id ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
        </div>
        <div className="card-body">
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

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingCategory(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Cargando categorías...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="categories-manager">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
        <button
          className="btn btn-primary"
          onClick={handleAddCategory}
        >
          <i className="fas fa-plus mr-2"></i>
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="categories-list card">
          <div className="card-body">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
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
                            className="category-item"
                          >
                            <div className="flex items-center p-3 bg-white rounded-lg shadow">
                              <i className={`fas ${category.icon} text-primary mr-3`}></i>
                              <div className="flex-1">
                                <h3 className="font-semibold">{category.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {MODULE_TYPES[category.moduleType]?.name}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setEditingCategory(category)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm text-danger"
                                  onClick={() => {
                                    if (confirm('¿Eliminar esta categoría?')) {
                                      categoriesAPI.delete(category.id)
                                        .then(loadCategories);
                                    }
                                  }}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
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
        </div>

        {renderCategoryForm()}
      </div>
    </div>
  );
};

export default Categories;