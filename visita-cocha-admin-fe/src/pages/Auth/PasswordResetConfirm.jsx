import React, { useState } from 'react';
import * as api from '../../api';

export default function PasswordResetConfirm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(email, token, newPassword);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al cambiar la contraseña');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
        <h2>Contraseña actualizada</h2>
        <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <h2>Restablecer contraseña</h2>
      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" style={{ width: '100%', marginBottom: 12 }} />
      <label>Código o token</label>
      <input type="text" value={token} onChange={e => setToken(e.target.value)} required className="input" style={{ width: '100%', marginBottom: 12 }} />
      <label>Nueva contraseña</label>
      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="input" style={{ width: '100%', marginBottom: 12 }} />
      <label>Confirmar contraseña</label>
      <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="input" style={{ width: '100%', marginBottom: 12 }} />
      {error && <div style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Cambiando...' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}
