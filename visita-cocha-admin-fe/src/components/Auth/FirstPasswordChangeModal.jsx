// src/components/Auth/FirstPasswordChangeModal.jsx
import React, { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

function validate(p){
  return {
    length: p.length >= 8,
    lower: /[a-z]/.test(p),
    upper: /[A-Z]/.test(p),
    number: /[0-9]/.test(p),
  }
}

export default function FirstPasswordChangeModal(){
  const { user, completeInitialPasswordSetup } = useAuth()
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  const v = validate(pass1)
  const strong = v.length && v.lower && v.upper && v.number

  const onSubmit = async (e)=>{
    e.preventDefault()
    setErr(''); setMsg('')
    if (pass1 !== pass2) { setErr('Las contraseñas no coinciden'); return }
    if (!strong) { setErr('La contraseña no cumple los requisitos'); return }
    setSaving(true)
    try{
      await completeInitialPasswordSetup(pass1)
      setMsg('Contraseña actualizada. Ya puedes continuar.')
    }catch(e){ setErr(e.message || 'Error al actualizar contraseña') }
    setSaving(false)
  }

  if (!user?.mustChangePassword) return null

  return (
    <div className="vc-modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
      <div className="form-card" style={{ width:'100%', maxWidth:460, padding:24, borderRadius:14 }}>
        <h3 style={{ marginTop:0, marginBottom:8 }}>Cambia tu contraseña</h3>
        <p style={{ marginTop:0, color:'#6b7280', fontSize:13 }}>Es tu primer ingreso. Define una contraseña segura para {user?.email}.</p>
        {err && <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'8px 10px', borderRadius:8, marginBottom:12 }}>{err}</div>}
        {msg && <div style={{ background:'#ecfdf5', color:'#065f46', padding:'8px 10px', borderRadius:8, marginBottom:12 }}>{msg}</div>}
        <form onSubmit={onSubmit}>
          <label style={{ display:'block', marginBottom:6, fontSize:13 }}>Nueva contraseña</label>
          <input className="input" type="password" value={pass1} onChange={e=>setPass1(e.target.value)} required />
          <label style={{ display:'block', marginBottom:6, marginTop:12, fontSize:13 }}>Confirmar contraseña</label>
          <input className="input" type="password" value={pass2} onChange={e=>setPass2(e.target.value)} required />

          <ul style={{ listStyle:'none', padding:0, margin:'10px 0', fontSize:12, color:'#6b7280' }}>
            <li style={{ color: v.length ? '#16a34a' : '#6b7280' }}>• Al menos 8 caracteres</li>
            <li style={{ color: v.lower ? '#16a34a' : '#6b7280' }}>• Una minúscula</li>
            <li style={{ color: v.upper ? '#16a34a' : '#6b7280' }}>• Una mayúscula</li>
            <li style={{ color: v.number ? '#16a34a' : '#6b7280' }}>• Un número</li>
          </ul>

          <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
