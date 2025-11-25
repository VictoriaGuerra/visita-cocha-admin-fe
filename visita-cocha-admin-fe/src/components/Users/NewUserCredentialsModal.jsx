// src/components/Users/NewUserCredentialsModal.jsx
import React from 'react'

export default function NewUserCredentialsModal({ email, password, onClose }){
  if (!email || !password) return null
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Usuario: ${email}\nContraseña temporal: ${password}`)
      alert('Credenciales copiadas en el portapapeles')
    } catch {}
  }
  return (
    <div className="vc-modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:220 }}>
      <div className="form-card" style={{ width:'100%', maxWidth:520, padding:24, borderRadius:14 }}>
        <h3 style={{ marginTop:0, marginBottom:8 }}>Usuario creado</h3>
        <p style={{ marginTop:0, color:'#6b7280', fontSize:13 }}>Se enviaron las credenciales temporales al correo. También las tienes aquí para registro rápido.</p>
        <div style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10, padding:12, marginBottom:12 }}>
          <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', rowGap:8 }}>
            <div style={{ color:'#6b7280' }}>Usuario (correo)</div>
            <div style={{ fontWeight:600 }}>{email}</div>
            <div style={{ color:'#6b7280' }}>Contraseña temporal</div>
            <div style={{ fontWeight:600, letterSpacing:0.3 }}>{password}</div>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button className="btn" onClick={handleCopy}><i className="fas fa-copy" /> Copiar</button>
          <button className="btn btn-primary" onClick={onClose}>Listo</button>
        </div>
        <small style={{ display:'block', marginTop:10, color:'#6b7280' }}>Al primer ingreso, el sistema obligará a cambiar la contraseña por una segura.</small>
      </div>
    </div>
  )
}
