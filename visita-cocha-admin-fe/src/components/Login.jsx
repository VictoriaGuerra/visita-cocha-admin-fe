import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import logo from '../assets/images/logo.png';
import '../styles/login.css';
import * as api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // forgot password flow state
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpStage, setFpStage] = useState('request'); // 'request' | 'verify' | 'set'
  const [fpCode, setFpCode] = useState('');
  const [fpNewPass, setFpNewPass] = useState('');
  const [fpNewPass2, setFpNewPass2] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState('');
  const [fpErr, setFpErr] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  // refs for forgot password inputs
  const fpEmailRef = useRef(null);
  const fpCodeRef = useRef(null);

  // Scope background/login styles only while this component is mounted
  useEffect(() => {
    document.body.classList.add('login-active');
    return () => {
      document.body.classList.remove('login-active');
    };
  }, []);

  // Focus management when modal opens or stage changes
  useEffect(() => {
    if (!showForgot) return;
    const t = setTimeout(() => {
      if (fpStage === 'request') fpEmailRef.current?.focus();
      else fpCodeRef.current?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [showForgot, fpStage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // forgot/invite: stage 1 request code
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setFpErr(''); setFpMsg(''); setFpLoading(true);
    try{
  await api.requestPasswordReset(fpEmail);
      setFpMsg('Código enviado. Revisa tu correo (simulado).');
      setFpStage('verify');
    }catch(err){ setFpErr(err.message || 'Error al solicitar código'); }
    setFpLoading(false);
  };

  // stage 2: verify code only
  const handleForgotVerify = async (e) => {
    e.preventDefault();
    setFpErr(''); setFpMsg(''); setFpLoading(true);
    try{
  await api.verifyResetCode(fpEmail, fpCode.trim());
      setFpMsg('Código verificado. Ahora define tu nueva contraseña.');
      setFpStage('set');
    }catch(err){ setFpErr(err.message || 'Error al actualizar contraseña'); }
    setFpLoading(false);
  };

  // stage 3: set password (with confirm)
  const handleForgotSet = async (e) => {
    e.preventDefault();
    setFpErr(''); setFpMsg(''); setFpLoading(true);
    try{
      if (fpNewPass !== fpNewPass2) throw new Error('Las contraseñas no coinciden');
      // UI-side strength hint; backend valida igual
      if (fpNewPass.length < 8 || !/[a-z]/.test(fpNewPass) || !/[A-Z]/.test(fpNewPass) || !/[0-9]/.test(fpNewPass)) {
        throw new Error('La contraseña debe tener 8+ caracteres, 1 minúscula, 1 mayúscula y 1 número');
      }
  await api.resetPassword(fpEmail, fpCode.trim(), fpNewPass);
  // Prefill login form with email + new password for immediate access
  setEmail(fpEmail);
  setPassword(fpNewPass);
  setFpMsg('Contraseña actualizada. Ya puedes ingresar directamente.');
  setTimeout(()=>{ setShowForgot(false); setFpStage('request'); setFpEmail(''); setFpCode(''); setFpNewPass(''); setFpNewPass2(''); }, 1000);
    }catch(err){ setFpErr(err.message || 'Error al actualizar contraseña'); }
    setFpLoading(false);
  };

  const ForgotModal = () => (
    <div className="vc-modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
      <div className="form-card" style={{ width:'100%', maxWidth:420, padding:24, borderRadius:16 }}>
        <h3 style={{ marginTop:0, marginBottom:12, fontSize:20 }}>
          {fpStage === 'request' ? 'Recuperar contraseña' : fpStage === 'verify' ? 'Verificar código' : 'Definir nueva contraseña'}
        </h3>
        <p style={{ marginTop:0, marginBottom:16, fontSize:13, color:'#555' }}>
          {fpStage === 'request' && 'Ingresa tu correo y te enviaremos un código.'}
          {fpStage === 'verify' && 'Ingresa el código que recibiste en tu correo.'}
          {fpStage === 'set' && 'Define tu nueva contraseña y confírmala.'}
        </p>
        {fpErr && <div style={{ background:'#fee2e2', color:'#b91c1c', padding:'8px 10px', borderRadius:8, marginBottom:12 }}>{fpErr}</div>}
        {fpMsg && <div style={{ background:'#ecfdf5', color:'#065f46', padding:'8px 10px', borderRadius:8, marginBottom:12 }}>{fpMsg}</div>}
        {fpStage === 'request' ? (
          <form onSubmit={handleForgotRequest}>
            <label style={{ display:'block', fontSize:13, marginBottom:6 }}>Correo</label>
            <input ref={fpEmailRef} type="email" autoComplete="email" className="input" value={fpEmail} onChange={e=>setFpEmail(e.target.value)} required />
            <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:18 }}>
              <button type="button" className="btn" onClick={()=>{ setShowForgot(false); setFpStage('request'); }}>Cancelar</button>
              <button type="submit" disabled={fpLoading} className="btn btn-primary">{fpLoading ? 'Enviando...' : 'Enviar código'}</button>
            </div>
          </form>
        ) : fpStage === 'verify' ? (
          <form onSubmit={handleForgotVerify}>
            <label style={{ display:'block', fontSize:13, marginBottom:6 }}>Código</label>
            <input ref={fpCodeRef} type="text" inputMode="numeric" pattern="[0-9]*" className="input" value={fpCode} onChange={e=>setFpCode(e.target.value)} required placeholder="6 dígitos" />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
              <button type="button" className="btn" onClick={()=>{ setFpStage('request'); setFpMsg(''); setFpErr(''); }}>Volver</button>
              <div style={{ display:'flex', gap:8 }}>
                <button type="button" className="btn-secondary" disabled={fpLoading} onClick={()=>{ setShowForgot(false); setFpStage('request'); }}>Cancelar</button>
                <button type="submit" disabled={fpLoading} className="btn btn-primary">{fpLoading ? 'Verificando...' : 'Verificar'}</button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotSet}>
            <label style={{ display:'block', fontSize:13, marginBottom:6 }}>Nueva contraseña</label>
            <input type="password" className="input" value={fpNewPass} onChange={e=>setFpNewPass(e.target.value)} required />
            <label style={{ display:'block', fontSize:13, marginBottom:6, marginTop:12 }}>Confirmar contraseña</label>
            <input type="password" className="input" value={fpNewPass2} onChange={e=>setFpNewPass2(e.target.value)} required />
            <small style={{ display:'block', color:'#6b7280', marginTop:8 }}>Debe tener 8+ caracteres, una minúscula, una mayúscula y un número.</small>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
              <button type="button" className="btn" onClick={()=>{ setFpStage('verify'); }}>Volver</button>
              <div style={{ display:'flex', gap:8 }}>
                <button type="button" className="btn-secondary" disabled={fpLoading} onClick={()=>{ setShowForgot(false); setFpStage('request'); }}>Cancelar</button>
                <button type="submit" disabled={fpLoading} className="btn btn-primary">{fpLoading ? 'Guardando...' : 'Actualizar'}</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="Visita Cochabamba" />
        </div>
        <p className="welcome-message">Bienvenido/a al panel administrativo de Visita Cocha</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon"><i className="fas fa-envelope"></i></span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={!showForgot}
            />
          </div>
          <div className="input-group">
            <span className="input-icon"><i className="fas fa-lock"></i></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading && <span className="spinner" />} {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="secondary-actions">
          <a className="forgot-password" href="#" onClick={(e) => { e.preventDefault(); setShowForgot(true); fpEmail && setFpEmail(fpEmail); }}>
            Olvidé mi contraseña
          </a>
        </div>
        <div className="login-footer">
          <img src={logo} alt="Escudo Cocha" className="cocha-shield" />
        </div>
      </div>
      {showForgot && <ForgotModal />}
    </div>
  );
}
