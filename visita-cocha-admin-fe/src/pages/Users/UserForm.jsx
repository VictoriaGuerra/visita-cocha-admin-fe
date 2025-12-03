// src/pages/Users/UserForm.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import * as api from '../../api'
import { MODULE_TYPES } from '../../config/moduleTypes'
import { AuthContext } from '../../auth/AuthContext'

export default function UserForm(){
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isView = location.pathname.includes('/view/')
  const isEdit = Boolean(id) && !isView
  const { user: currentUser } = useContext(AuthContext)
  
  const handleClose = () => navigate('/users')

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [ci, setCi] = useState('')
  const [department, setDepartment] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('active')
  const [permissions, setPermissions] = useState([])
  const [moduleAccess, setModuleAccess] = useState({})

  const [availableModules, setAvailableModules] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(false)

  useEffect(() => {
    let mounted = true
    // Cargar módulos desde la configuración central (ids coinciden con rutas)
    const mods = Object.values(MODULE_TYPES || {}).map(m => ({ id: m.id, name: m.name }))
    if (mounted) setAvailableModules(mods)
    
    // Solo cargar datos si hay un ID válido (no undefined, no null, no cadena vacía)
    if (id && id !== 'new' && (isEdit || isView)) {
      loadUser()
    } else {
      // Si no hay ID o es 'new', limpiar el formulario
      if (mounted) {
        setNombre('')
        setLastname('')
        setEmail('')
        setCi('')
        setDepartment('')
        setPhone('')
        setRole('')
        setStatus('active')
        setPermissions([])
        setModuleAccess({})
        setError(null)
      }
    }
    
    return () => { mounted = false }
  }, [id, isEdit, isView])
  
  const loadUser = async () => {
    try {
      const userData = await api.getUserById(id)
      setNombre(userData.nombre || '')
      setLastname(userData.lastname || '')
      setEmail(userData.email || '')
      setCi(userData.ci || '')
      setDepartment(userData.department || '')
      setPhone(userData.phone || '')
      setRole(userData.role || '')
      setStatus(userData.status || 'active')
      setPermissions(userData.permissions || [])
      setModuleAccess(userData.moduleAccess || {})
    } catch (err) {
      console.error('Error cargando usuario:', err)
      setError('Error al cargar el usuario')
    }
  }

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
        permissions
      };
      
      if (isEdit) {
        await api.updateUser(id, payload);
        handleClose();
      } else {
        await api.createUser(payload);
        setCreated(true); // Ya no se devuelve tempPassword del backend
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
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#25636f' }}>{isView ? 'Ver usuario' : isEdit ? 'Editar usuario' : 'Crear usuario'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
          <fieldset disabled={isView} style={{ border: 'none', padding: 0, margin: 0 }}>
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
            <div style={{ background:'#ecfdf5', color:'#065f46', padding:'12px 16px', borderRadius:8, marginBottom:8, border: '1px solid #a7f3d0' }}>
              <strong>✅ Usuario creado exitosamente</strong><br/><br/>
              Se han enviado las credenciales de acceso al correo:<br/>
              <strong style={{ fontSize: '16px' }}>{email}</strong><br/><br/>
              <span style={{ fontSize: '14px', color: '#047857' }}>
                ⚠️ El usuario debe revisar su bandeja de entrada (y spam) para obtener su contraseña temporal.
              </span>
            </div>
          )}
          </fieldset>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
            <button type="button" onClick={handleClose} className="btn" style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: '#e0f2f1', color: '#25636f', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{isView ? 'Cerrar' : created ? 'Cerrar' : 'Cancelar'}</button>
            {!isView && !created && <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: '#3f908e', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{saving ? 'Guardando...' : (isEdit ? 'Guardar' : 'Crear')}</button>}
          </div>
        </form>
      </div>
    </div>
  )
}
