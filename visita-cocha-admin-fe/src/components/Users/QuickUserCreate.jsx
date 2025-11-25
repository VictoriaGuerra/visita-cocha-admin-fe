// src/components/Users/QuickUserCreate.jsx
import React, { useState } from 'react'
import * as api from '../../api'
import { roles as ROLE_CONST } from '../../auth/roles'

export default function QuickUserCreate({ onCreated }){
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [roles, setRoles] = useState(['Mantenedor'])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(false)

  const toggleRole = (r) => setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r])

  const handleSubmit = async (e)=>{
    e.preventDefault(); setError(null); setSuccess(''); setSaving(true)
    try{
  const res = await api.createUser({ email, roles, firstName, lastName, name: `${firstName} ${lastName}`.trim() })
  setSuccess(`Usuario creado. Temporales -> Usuario: ${email} | Contraseña: ${res?.tempPassword || '—'}. Deberá cambiarla en su primer ingreso.`)
  setCreated(true)
  setEmail(''); setFirstName(''); setLastName(''); setRoles(['Mantenedor'])
      onCreated && onCreated()
    }catch(err){ setError(err.message || 'Error al crear usuario') }
    setSaving(false)
  }

  return (
    <>
    <div className="form-card" style={{ position: 'sticky', top: 16 }}>
      <h4 style={{ margin: 0, marginBottom: 12 }}>Crear usuario rápido</h4>
      <p style={{ color: '#6b7280', fontSize: 13, marginTop: 0, marginBottom: 12 }}>Solo SuperAdmin. Útil para alta rápida mientras configuras módulos.</p>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: 6 }}>Correo</label>
        <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Nombres</label>
            <input className="input" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Apellidos</label>
            <input className="input" value={lastName} onChange={(e)=>setLastName(e.target.value)} required />
          </div>
        </div>

        <label style={{ display: 'block', marginTop: 12, marginBottom: 6 }}>Roles</label>
        <div style={{ marginBottom: 12 }}>
          {(ROLE_CONST ? Object.values(ROLE_CONST) : ['Admin','Mantenedor','SuperAdmin']).map(r => (
            <label key={r} style={{ marginRight: 12, display: 'inline-flex', alignItems: 'center' }}>
              <input checked={roles.includes(r)} onChange={()=>toggleRole(r)} type="checkbox" />
              <span style={{ marginLeft: 6 }}>{r}</span>
            </label>
          ))}
        </div>

  {error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}
  {success && <div style={{ background:'#ecfdf5', color:'#065f46', padding:'6px 10px', borderRadius:8, marginBottom: 8 }}>{success}</div>}

  {!created && <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Creando...' : 'Crear'}</button>}
  {created && <button type="button" className="btn" onClick={()=>{ setCreated(false); setSuccess('') }}>Crear otro</button>}
      </form>
      <div style={{ marginTop: 12 }}>
        <small style={{ color: '#6b7280' }}>Tip: Puedes gestionar y editar usuarios en la sección "Usuarios".</small>
      </div>
    </div>
    </>
  )
}
