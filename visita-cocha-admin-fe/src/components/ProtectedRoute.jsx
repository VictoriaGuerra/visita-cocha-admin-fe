// src/auth/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>No autorizado. Inicia sesión primero.</p>;
  }

  // allow if roles not specified
  if (!roles || roles.length === 0) return children;

  const roleName = user.role || (user.roles && user.roles[0])
  if (!roleName) return <p>No tienes permisos para acceder a esta sección.</p>;

  if (!roles.includes(roleName)) {
    return <p>No tienes permisos para acceder a esta sección.</p>;
  }

  return children;
}
