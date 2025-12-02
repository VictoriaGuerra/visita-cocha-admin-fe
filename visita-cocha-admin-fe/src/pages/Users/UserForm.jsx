// src/pages/Users/UserForm.jsx
import React, { useState, useEffect, useContext } from 'react'
import * as api from '../../api'
import { MODULE_TYPES } from '../../config/moduleTypes'
import { AuthContext } from '../../auth/AuthContext'

export default function UserForm({ editing, onClose }){
  const { user: currentUser } = useContext(AuthContext)

  // Campos del formulario
  const [nombre, setNombre] = useState(editing?.nombre || '')
  const [lastname, setLastname] = useState(editing?.lastname || '')
  const [email, setEmail] = useState(editing?.email || '')
  const [ci, setCi] = useState(editing?.ci || '')
  const [department, setDepartment] = useState(editing?.department || '')
  const [phone, setPhone] = useState(editing?.phone || '')
  // Ya no se pide contraseña manualmente
  const [role, setRole] = useState(editing?.role || '')
  const [status, setStatus] = useState(editing?.status || 'active')
  // Eliminado: mustChangePassword, ahora lo maneja el backend por defecto
  const [permissions, setPermissions] = useState(editing?.permissions || [])
  const [moduleAccess, setModuleAccess] = useState(editing?.moduleAccess || {})

  const [availableModules, setAvailableModules] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(false)

  useEffect(() => {
    let mounted = true
    // Cargar módulos desde la configuración central (ids coinciden con rutas)
    const mods = Object.values(MODULE_TYPES || {}).map(m => ({ id: m.id, name: m.name }))
    if (mounted) setAvailableModules(mods)
    return () => { mounted = false }
  }, [])

  const toggleModule = (modId) => {
    setModuleAccess(prev => {
      const has = !!prev[modId]
      if (has){
        const copy = { ...prev }
        delete copy[modId]
        return copy
      }
      return { ...prev, [modId]: { elements: [] } }
    })
  }

  const handleElementsChange = (modId, text) => {
    const elements = text.split(',').map(s => s.trim()).filter(Boolean)
    setModuleAccess(prev => ({ ...prev, [modId]: { elements } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        nombre,
        lastname,
        email,
        ci,
        department,
        rol: role,
        estado: status,
        phone,
        // debe_cambiar_password eliminado, el backend lo pone en true por defecto
        permissions
      };
      if (!editing) {
        // Generar un id único para el usuario nuevo
        payload.id = `u-${Date.now()}`;
        // No se envía password, el backend la genera automáticamente
      }
      if (editing) {
        await api.updateUser(editing._id, payload);
        onClose();
      } else {
        const res = await api.createUser(payload);
        setCreated(res?.tempPassword || true);
      }
    } catch(err) {
      setError(err.message || 'Error');
    }
    setSaving(false);
  }


  const PERMISSIONS = [
    'acceso_atracciones',
    'acceso_comidas',
    'acceso_itinerarios',
    'acceso_categorias',
    'acceso_restaurantes',
    'acceso_eventos',
    'acceso_hoteles',
    'acceso_puntos',
    'acceso_anuncios',
  ]

  return (
    <div className="vc-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
      <div className="form-card" style={{ width: '100%', maxWidth: 720, background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: '2rem', position: 'relative' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#25636f' }}>{editing ? 'Editar usuario' : 'Crear usuario'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
          {/* Row: nombre / lastname */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Nombre</label>
              <input name="nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Apellido</label>
              <input name="lastname" value={lastname} onChange={e => setLastname(e.target.value)} className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }} />
            </div>
          </div>

          {/* Row: email / ci */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Email</label>
              <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="email" required className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>CI</label>
              <input name="ci" value={ci} onChange={e => setCi(e.target.value)} className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }} />
            </div>
          </div>

          {/* Row: departamento / telefono */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Departamento</label>
              <input name="department" value={department} onChange={e => setDepartment(e.target.value)} className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Teléfono</label>
              <input name="phone" value={phone} onChange={e => setPhone(e.target.value)} className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }} />
            </div>
          </div>

          {/* Row: role / status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Rol</label>
              <select name="role" value={role} onChange={e => setRole(e.target.value)} required className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }}>
                <option value="">Selecciona un rol</option>
                <option value="superadmin">SuperAdmin</option>
                <option value="admin">Admin</option>
                <option value="mantenedor">Mantenedor</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 500 }}>Estado</label>
              <select name="status" value={status} onChange={e => setStatus(e.target.value)} className="input" style={{ padding: '10px', borderRadius: 8, border: '1px solid #b2dfdb' }}>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>



          {/* Eliminado: Checkbox 'Debe cambiar contraseña al ingresar' */}

          {/* Permisos */}
          <div style={{ margin: '10px 0 0 0' }}>
            <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Permisos</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {PERMISSIONS.map(perm => (
                <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, background: permissions.includes(perm) ? '#e0f7fa' : '#f8fafc', borderRadius: 6, padding: '4px 10px', fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={e => {
                      if (e.target.checked) setPermissions(p => [...p, perm]);
                      else setPermissions(p => p.filter(x => x !== perm));
                    }}
                  />
                  {perm.replace('acceso_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          {error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}

          {created && (
            <div style={{ background:'#ecfdf5', color:'#065f46', padding:'8px 10px', borderRadius:8, marginBottom:8 }}>
              Usuario creado. Credenciales temporales:<br/>
              <strong>Usuario:</strong> {email}<br/>
              <strong>Contraseña temporal:</strong> {created === true ? '—' : created}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
            <button type="button" onClick={onClose} className="btn" style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: '#e0f2f1', color: '#25636f', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{created ? 'Cerrar' : 'Cancelar'}</button>
            {!created && <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: '#3f908e', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{saving ? 'Guardando...' : (editing ? 'Guardar' : 'Crear')}</button>}
          </div>
        </form>
      </div>
    </div>
  )
}
