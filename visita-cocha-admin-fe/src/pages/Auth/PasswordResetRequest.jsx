import React, { useState } from 'react';
import * as api from '../../api';

export default function PasswordResetRequest({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.requestPasswordReset(email);
      setSuccess(true);
      if (onSuccess) onSuccess(email);
    } catch (err) {
      if (err?.response?.status === 404) {
        setError('Correo inválido o no existe en la base de datos');
      } else {
        setError(err?.response?.data?.message || err.message || 'Error al solicitar reseteo');
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
        <h2>Revisa tu correo</h2>
        <p>Te hemos enviado un enlace o código para restablecer tu contraseña.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <h2>¿Olvidaste tu contraseña?</h2>
      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" style={{ width: '100%', marginBottom: 12 }} />
      {error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Enviando...' : 'Enviar enlace de reseteo'}
      </button>
    </form>
  );
}
