// src/pages/Auth/PasswordReset.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as api from '../../api'
import '../../styles/login.css'
import logo from '../../assets/images/logo.png'

function getQuery(location){
  const p = new URLSearchParams(location.search)
  return { email: p.get('email') || '', code: p.get('code') || '' }
}

export default function PasswordReset(){
  const nav = useNavigate()
  const location = useLocation()
  const { email: initialEmail, code: initialCode } = getQuery(location)
  const [stage, setStage] = useState(initialEmail && initialCode ? 'set' : 'request') // request | verify | set
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState(initialCode)
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(()=>{ document.body.classList.add('login-active'); return ()=> document.body.classList.remove('login-active'); }, [])

  const requestCode = async (e)=>{
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true)
    try { await api.requestPasswordReset(email); setMsg('Código enviado. Revisa el correo simulado.'); setStage('verify') } catch(e){ setErr(e.message||'Error') }
    setLoading(false)
  }

  const verifyCode = async (e)=>{
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true)
    try { await api.verifyResetCode(email, code); setMsg('Código verificado. Ahora define tu contraseña.'); setStage('set') } catch(e){ setErr(e.message||'Error') }
    setLoading(false)
  }

  const setPassword = async (e)=>{
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true)
    try {
      if (pass1 !== pass2) throw new Error('Las contraseñas no coinciden')
      if (pass1.length < 8 || !/[a-z]/.test(pass1) || !/[A-Z]/.test(pass1) || !/[0-9]/.test(pass1)) throw new Error('Debe tener 8+ caracteres, 1 minúscula, 1 mayúscula y 1 número')
      await api.resetPassword(email, code, pass1)
      setMsg('Contraseña actualizada. Puedes iniciar sesión.')
      setTimeout(()=> nav('/'), 1200)
    } catch(e){ setErr(e.message||'Error') }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth:480 }}>
        <div className="login-logo"><img src={logo} alt="Logo" /></div>
        <h2 style={{ marginTop:0 }}>{stage==='request' ? 'Solicitar código' : stage==='verify' ? 'Verificar código' : 'Definir nueva contraseña'}</h2>
        {msg && <div className="error-message" style={{ background:'#ecfdf5', color:'#065f46', border:'1px solid #10b981' }}>{msg}</div>}
        {err && <div className="error-message">{err}</div>}
        {stage==='request' && (
          <form onSubmit={requestCode}>
            <div className="input-group">
              <span className="input-icon"><i className="fas fa-envelope" /></span>
              <input type="email" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <button className="btn-login" disabled={loading}>{loading ? 'Enviando...' : 'Enviar código'}</button>
          </form>
        )}
        {stage==='verify' && (
          <form onSubmit={verifyCode}>
            <div className="input-group">
              <span className="input-icon"><i className="fas fa-key" /></span>
              <input placeholder="Código (6 dígitos)" value={code} onChange={e=>setCode(e.target.value)} required />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
              <button type="button" className="btn" onClick={()=> setStage('request')}>Volver</button>
              <button className="btn-login" disabled={loading}>{loading ? 'Verificando...' : 'Verificar'}</button>
            </div>
          </form>
        )}
        {stage==='set' && (
          <form onSubmit={setPassword}>
            <div className="input-group">
              <span className="input-icon"><i className="fas fa-lock" /></span>
              <input type="password" placeholder="Nueva contraseña" value={pass1} onChange={e=>setPass1(e.target.value)} required />
            </div>
            <div className="input-group">
              <span className="input-icon"><i className="fas fa-lock" /></span>
              <input type="password" placeholder="Confirmar contraseña" value={pass2} onChange={e=>setPass2(e.target.value)} required />
            </div>
            <small style={{ display:'block', textAlign:'left', color:'#6b7280', margin:'4px 0 12px' }}>Debe tener 8+ caracteres, 1 minúscula, 1 mayúscula y 1 número.</small>
            <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
              <button type="button" className="btn" onClick={()=> setStage(initialEmail && initialCode ? 'set':'verify')}>Volver</button>
              <button className="btn-login" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        )}
        <div style={{ marginTop:20 }}>
          <button className="btn" onClick={()=> nav('/')}>Volver a login</button>
        </div>
      </div>
    </div>
  )
}
