import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../auth/AuthContext';
import './Layout.css';

const roleDisplay = (user) => {
  if (!user) return 'No autenticado';
  // soporta roles: array "roles" o propiedad singular "role"
  const roles = user.roles || (user.role ? [user.role] : []);
  if (!roles.length) return 'Rol no definido';
  const map = {
    SuperAdmin: 'Super Admin',
    SUPER_ADMIN: 'Super Admin',
    Admin: 'Administrador',
    Mantenedor: 'Mantenedor',
    Editor: 'Editor',
    Viewer: 'Observador'
  };
  return map[roles[0]] || roles[0];
};

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="user-header">
          <div className="user-info">
            {user?.photo ? (
              <img src={user.photo} alt="avatar" className="user-avatar" />
            ) : (
              <div className="user-avatar" style={{ background: 'var(--gray-200)', display:'flex',alignItems:'center',justifyContent:'center' }}>
                <i className="fas fa-user" style={{ color: 'var(--gray-600)' }}></i>
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span className="user-name">{user?.name || user?.email || 'Usuario'}</span>
              <span className="user-role">{roleDisplay(user)}</span>
            </div>
            <button type="button" className="logout-inline" onClick={logout} title="Cerrar sesión">
              <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Cerrar sesión</span>
            </button>
          </div>
        </div>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;