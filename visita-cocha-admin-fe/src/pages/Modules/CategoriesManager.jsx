import React, { useEffect, useMemo, useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { categoriesApi } from '../../api/categoriesApi';
import '../../styles/categories.css';
import { initializeAttractionCategories, initializeRestaurantCategories, initializeMainCategoriesSeed } from '../../data/sampleData';
import '../../styles/common.css';

const TYPES = [
  { key: 'attractions', label: 'Categorías de Atracciones' },
  { key: 'restaurants', label: 'Categorías de Restaurantes' },
  { key: 'main', label: 'Categorías Principales' }
];

const ensureSeed = (type) => {
  if (type === 'attractions') return initializeAttractionCategories();
  if (type === 'restaurants') return initializeRestaurantCategories();
  if (type === 'main') return initializeMainCategoriesSeed();
  return [];
};

const emptyItem = (type) => ({
  id: '', name: '', order: 0, available: true,
  ...(type === 'main' ? { icon: '', photoUrl: '', isFeatured: false } : {})
});

export default function CategoriesManager(){
  const { user } = useContext(AuthContext);
  const canDelete = user?.roles?.includes('SuperAdmin') || user?.roles?.includes('Admin');
  const [type, setType] = useState('attractions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyItem('attractions'));
  const [editingId, setEditingId] = useState(null);

  const isMain = useMemo(()=> type === 'main', [type]);

  const load = async (t) => {
    setLoading(true);
    try {
      let data = await categoriesApi.getAll(t);
      if (!data || data.length === 0) {
        data = ensureSeed(t);
      }
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setError('Error al cargar categorías');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    setForm(emptyItem(type));
    setEditingId(null);
    load(type);
  }, [type]);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
  };
  const cancelEdit = () => { setEditingId(null); setForm(emptyItem(type)); };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: inputType === 'checkbox' ? checked : (name==='order'? Number(value): value) }));
  };

  const save = async () => {
    if (!form.name.trim()) { setError('Nombre requerido'); return; }
    if (!form.id.trim()) {
      // si no puso id, generamos desde nombre (slug sencillo)
      form.id = form.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
    }
    try{
      if (editingId) await categoriesApi.update(type, editingId, form);
      else await categoriesApi.create(type, form);
      await load(type);
      cancelEdit();
    }catch(e){ setError('No se pudo guardar'); }
  };

  const remove = async (id) => {
    if (!canDelete) { setError('No tienes permisos para eliminar'); return; }
    if (!window.confirm('¿Eliminar categoría?')) return;
    try { await categoriesApi.delete(type, id); await load(type); }
    catch(e){ setError('No se pudo eliminar'); }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Gestor de Categorías</h2>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="pill-group">
            {TYPES.map(t => (
              <button
                key={t.key}
                className={`pill ${type === t.key ? 'active' : ''}`}
                onClick={() => setType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-row" style={{ gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input id="id" name="id" value={form.id} onChange={handleChange} className="form-control" placeholder="ej: popular" />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="order">Orden</label>
              <input id="order" name="order" type="number" value={form.order} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label><input type="checkbox" name="available" checked={!!form.available} onChange={handleChange} /> Disponible</label>
            </div>
            {isMain && (
              <>
                <div className="form-group">
                  <label htmlFor="icon">Icono</label>
                  <input id="icon" name="icon" value={form.icon || ''} onChange={handleChange} className="form-control" placeholder="ion-icon name" />
                </div>
                <div className="form-group">
                  <label htmlFor="photoUrl">Foto URL</label>
                  <input id="photoUrl" name="photoUrl" value={form.photoUrl || ''} onChange={handleChange} className="form-control" placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label><input type="checkbox" name="isFeatured" checked={!!form.isFeatured} onChange={handleChange} /> Destacado</label>
                </div>
              </>
            )}
            <div className="form-group">
              <button className="btn btn-primary" onClick={save}>{editingId ? 'Actualizar' : 'Agregar'}</button>
              {editingId && <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={cancelEdit}>Cancelar</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Listado</h3>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    {isMain && <th>Icono</th>}
                    {isMain && <th>Foto</th>}
                    <th>Orden</th>
                    <th>Disponible</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id}>
                      <td>{it.id}</td>
                      <td>{it.name}</td>
                      {isMain && <td>{it.icon || '-'}</td>}
                      {isMain && <td>{it.photoUrl ? <a href={it.photoUrl} target="_blank" rel="noreferrer">ver</a> : '-'}</td>}
                      <td>{it.order ?? 0}</td>
                      <td>{it.available ? <span className="pill-badge" style={{background:'#d1fae5', color:'#065f46'}}>Disponible</span> : <span className="pill-badge" style={{background:'#fee2e2', color:'#991b1b'}}>No</span>}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-primary btn-sm" onClick={() => startEdit(it)}><i className="fas fa-edit"></i></button>
                          {canDelete && (
                            <button className="btn btn-danger btn-sm" onClick={() => remove(it.id)}><i className="fas fa-trash"></i></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
