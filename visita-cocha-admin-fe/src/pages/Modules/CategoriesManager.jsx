import React, { useEffect, useMemo, useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { isSuperAdmin, isAdmin } from '../../utils/roleUtils';
import { categoriesApi } from '../../api/categoriesApi';
import '../../styles/categories.css';
import { initializeAttractionCategories, initializeRestaurantCategories, initializeMainCategoriesSeed } from '../../data/sampleData';
import '../../styles/common.css';

const TYPES = [
  { key: 'attractions', label: 'Categorías de Atracciones' },
  { key: 'restaurants', label: 'Categorías de Restaurantes' },
  { key: 'pois', label: 'Categorías de Puntos de Interés (POI)' }
];

const ensureSeed = (type) => {
  if (type === 'attractions') return initializeAttractionCategories();
  if (type === 'restaurants') return initializeRestaurantCategories();
  if (type === 'pois') return [
    { id: 'universidades', name: 'Universidades', order: 1, available: true, icon: 'bi-mortarboard-fill', description: 'Instituciones de educación superior' },
    { id: 'consulados', name: 'Consulados', order: 2, available: true, icon: 'bi-flag-fill', description: 'Representaciones consulares' },
    { id: 'policia', name: 'Policía', order: 3, available: true, icon: 'bi-shield-fill-check', description: 'Estaciones de policía' },
    { id: 'hospitales', name: 'Hospitales', order: 4, available: true, icon: 'bi-hospital', description: 'Centros de salud y hospitales' },
    { id: 'bancos', name: 'Bancos', order: 5, available: true, icon: 'bi-bank', description: 'Entidades bancarias' }
  ];
  if (type === 'main') return initializeMainCategoriesSeed();
  return [];
};

const emptyItem = (type) => ({
  id: '', name: '', order: 0, available: true,
  ...(type === 'pois' ? { icon: '', description: '' } : {}),
  ...(type === 'main' ? { icon: '', photoUrl: '', isFeatured: false } : {})
});

export default function CategoriesManager(){
  const { user } = useContext(AuthContext);
  const canDelete = isSuperAdmin(user) || isAdmin(user);
  const [type, setType] = useState('attractions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyItem('attractions'));
  const [editingId, setEditingId] = useState(null);
  const isMain = useMemo(()=> type === 'main', [type]);
  const isPoi = useMemo(()=> type === 'pois', [type]);

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
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{margin: 0, fontSize: '18px', fontWeight: 600}}>Gestor de Categorías</h2>
      </div>

      {/* Tabs */}
      <div style={{display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px'}}>
        {TYPES.map(t => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            style={{
              padding: '8px 16px',
              background: type === t.key ? '#3f908e' : 'transparent',
              color: type === t.key ? '#fff' : '#6b7280',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontWeight: type === t.key ? 600 : 400,
              transition: 'all 0.2s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger" style={{marginBottom: 16}}>{error}</div>}

      {/* Formulario */}
      <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)', marginBottom: 20}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, alignItems: 'flex-end'}}>
          <div className="form-group">
            <label htmlFor="id" style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500}}>ID</label>
            <input 
              id="id" 
              name="id" 
              value={form.id} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="ej: popular"
              style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500}}>Nombre</label>
            <input 
              id="name" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className="form-control"
              style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="order" style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500}}>Orden</label>
            <input 
              id="order" 
              name="order" 
              type="number" 
              value={form.order} 
              onChange={handleChange} 
              className="form-control"
              style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6}}
            />
          </div>
          <div className="form-group">
            <label style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
              <input type="checkbox" name="available" checked={!!form.available} onChange={handleChange} />
              <span style={{fontSize: 14, fontWeight: 500}}>Disponible</span>
            </label>
          </div>
          {isPoi && (
            <>
              <div className="form-group">
                <label htmlFor="icon" style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500}}>Icono (Bootstrap)</label>
                <input 
                  id="icon" 
                  name="icon" 
                  value={form.icon || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                  placeholder="bi-icon-name"
                  style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6}}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description" style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500}}>Descripción</label>
                <input 
                  id="description" 
                  name="description" 
                  value={form.description || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                  placeholder="Breve descripción"
                  style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6}}
                />
              </div>
            </>
          )}
          {isMain && (
            <>
              <div className="form-group">
                <label htmlFor="icon" style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500}}>Icono</label>
                <input 
                  id="icon" 
                  name="icon" 
                  value={form.icon || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                  placeholder="ion-icon name"
                  style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6}}
                />
              </div>
              <div className="form-group">
                <label htmlFor="photoUrl" style={{display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500}}>Foto URL</label>
                <input 
                  id="photoUrl" 
                  name="photoUrl" 
                  value={form.photoUrl || ''} 
                  onChange={handleChange} 
                  className="form-control" 
                  placeholder="https://..."
                  style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6}}
                />
              </div>
              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'}}>
                  <input type="checkbox" name="isFeatured" checked={!!form.isFeatured} onChange={handleChange} />
                  <span style={{fontSize: 14, fontWeight: 500}}>Destacado</span>
                </label>
              </div>
            </>
          )}
          <div className="form-group" style={{display: 'flex', gap: 8}}>
            <button 
              onClick={save}
              style={{
                padding: '10px 20px',
                background: '#3f908e',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {editingId ? 'Actualizar' : 'Agregar'}
            </button>
            {editingId && (
              <button 
                onClick={cancelEdit}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <h3 style={{margin: '0 0 16px 0', fontSize: 16, fontWeight: 600}}>Listado</h3>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead style={{background:'#e0f2f1'}}>
                <tr>
                  <th style={{padding:'12px', textAlign:'left', fontWeight:600}}>ID</th>
                  <th style={{padding:'12px', textAlign:'left', fontWeight:600}}>Nombre</th>
                  {isMain && <th style={{padding:'12px', textAlign:'left', fontWeight:600}}>Icono</th>}
                  {isMain && <th style={{padding:'12px', textAlign:'left', fontWeight:600}}>Foto</th>}
                  <th style={{padding:'12px', textAlign:'center', fontWeight:600}}>Orden</th>
                  <th style={{padding:'12px', textAlign:'center', fontWeight:600}}>Disponible</th>
                  <th style={{padding:'12px', textAlign:'center', fontWeight:600}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.id} style={{borderBottom:'1px solid #e5e7eb'}}>
                    <td style={{padding:'12px'}}>{it.id}</td>
                    <td style={{padding:'12px'}}><strong>{it.name}</strong></td>
                    {isMain && <td style={{padding:'12px'}}>{it.icon || '-'}</td>}
                    {isMain && <td style={{padding:'12px'}}>{it.photoUrl ? <a href={it.photoUrl} target="_blank" rel="noreferrer" style={{color: '#3f908e', textDecoration: 'underline'}}>ver</a> : '-'}</td>}
                    <td style={{padding:'12px', textAlign:'center'}}>{it.order ?? 0}</td>
                    <td style={{padding:'12px', textAlign:'center'}}>
                      {it.available ? (
                        <span style={{background:'#d1fae5', color:'#065f46', padding:'4px 8px', borderRadius:'4px', fontSize:'14px'}}>Sí</span>
                      ) : (
                        <span style={{background:'#fee2e2', color:'#991b1b', padding:'4px 8px', borderRadius:'4px', fontSize:'14px'}}>No</span>
                      )}
                    </td>
                    <td style={{padding:'12px', textAlign:'center'}}>
                      <div style={{display:'flex', gap:'12px', justifyContent:'center'}}>
                        <i 
                          className="fas fa-edit" 
                          onClick={() => startEdit(it)}
                          title="Editar"
                          style={{cursor:'pointer', fontSize:'18px'}}
                        ></i>
                        {canDelete && (
                          <i 
                            className="fas fa-trash" 
                            onClick={() => remove(it.id)}
                            title="Eliminar"
                            style={{cursor:'pointer', fontSize:'18px'}}
                          ></i>
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
  );
}
