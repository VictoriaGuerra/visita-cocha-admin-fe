import React, { useState } from 'react'
import * as api from '../../api'
import { roles as ROLE_CONST } from '../../auth/roles'

export default function ModuleForm({ editing, onClose }){
  const [name, setName] = useState(editing?.name || '')
  const [status, setStatus] = useState(editing?.status || 'Activo')
  const [allowedRoles, setAllowedRoles] = useState(editing?.allowedRoles || (ROLE_CONST ? Object.values(ROLE_CONST) : ['Admin','Mantenedor']))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e)=>{
    e.preventDefault(); setError(null); setSaving(true)
    try{
  if (editing) await api.updateModule(editing.id, { name, status, allowedRoles })
  else await api.createModule({ name, status, allowedRoles })
      onClose()
    }catch(err){ setError(err.message || 'Error') }
    setSaving(false)
  }

  return (
    <div className="vc-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
      <div className="form-card" style={{ width: '100%', maxWidth: 680 }}>
        <h4 style={{ marginBottom: 12, fontSize: 18 }}>{editing ? 'Editar' : 'Crear'} módulo</h4>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 6 }}>Nombre</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required />

          <label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Estado</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="input">
            <option>Activo</option>
            <option>Inactivo</option>
          </select>

          <label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Roles permitidos</label>
          <div style={{ marginBottom: 10 }}>
            {Object.values(ROLE_CONST).map(r => (
              <label key={r} style={{ marginRight: 12 }}>
                <input checked={allowedRoles.includes(r)} onChange={()=>{
                  setAllowedRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r])
                }} type="checkbox" /> <span style={{ marginLeft: 6 }}>{r}</span>
              </label>
            ))}
          </div>

          {error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={onClose} className="btn">Cancelar</button>
            <button type="submit" disabled={saving} className="btn btn-success">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
