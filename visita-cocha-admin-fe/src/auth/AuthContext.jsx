import React, { createContext, useState, useEffect, useContext } from 'react';
// Cambiado a adaptador que decide backend vs mock
import * as api from '../api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const CURRENT_USER_KEY = 'vc_current_user'

export const AuthProvider = ({ children }) => {
  // Always start with no user to force login on every fresh load
  const [user, setUser] = useState(null);

  // On app mount, ensure any persisted session is cleared
  useEffect(() => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      // noop
    }
  }, []);

  // async login using mockApi
  const login = async (email, password) => {
    try{
      const loginData = await api.authLogin(email, password)
      
      console.log('[AuthContext] 🔍 Respuesta completa del backend:', loginData)
      
      // El backend devuelve el usuario en loginData.usuario, usarlo directamente
      let newUser = loginData?.usuario
      
      // Si el backend no devolvió usuario en el login, intentar obtenerlo
      if (!newUser) {
        console.log('[AuthContext] Login no devolvió usuario, intentando /user/me')
        try {
          const me = await api.getMe()
          if (me) newUser = me
        } catch (err) {
          console.log('[AuthContext] /user/me falló:', err.message)
        }
      }
      
      // Si aún no tenemos usuario, intentar obtener del listado
      if (!newUser){
        try {
          const users = await api.getUsers()
          const u = users.find(x => x.email === email)
          newUser = u ? { ...u } : null
        } catch (err) {
          console.log('[AuthContext] No se pudo obtener usuario desde /user', err.message)
        }
      }
      
      // Fallback: crear usuario básico
      if (!newUser) {
        newUser = { email, name: email, roles: ['SuperAdmin'] }
      }
      
      // Normalizar roles: convertir 'role' o 'rol' singular en 'roles' array
      if (newUser && !newUser.roles) {
        const singleRole = newUser.role || newUser.rol;
        if (singleRole) {
          newUser.roles = Array.isArray(singleRole) ? singleRole : [singleRole];
        } else {
          newUser.roles = ['SuperAdmin']; // fallback por defecto
        }
      }
      
      // Mapear debe_cambiar_password a mustChangePassword para el frontend
      // El backend puede enviar el flag en varios lugares:
      // 1. loginData.debe_cambiar_password (raíz de respuesta)
      // 2. loginData.mustChangePassword (raíz de respuesta)
      // 3. newUser.debe_cambiar_password (dentro del objeto usuario)
      // 4. newUser.mustChangePassword (dentro del objeto usuario)
      if (newUser) {
        console.log('[AuthContext] 🔍 Verificando flags de cambio de contraseña:', {
          'loginData.debe_cambiar_password': loginData?.debe_cambiar_password,
          'loginData.mustChangePassword': loginData?.mustChangePassword,
          'usuario.debe_cambiar_password': newUser.debe_cambiar_password,
          'usuario.mustChangePassword': newUser.mustChangePassword,
          'usuario.requiresPasswordChange': newUser.requiresPasswordChange
        })
        
        const backendFlag = 
          loginData?.debe_cambiar_password ?? 
          loginData?.mustChangePassword ?? 
          newUser.debe_cambiar_password ?? 
          newUser.mustChangePassword ?? 
          newUser.requiresPasswordChange ?? 
          false;
        
        console.log('[AuthContext] 🎯 Flag final detectado:', backendFlag)
        
        newUser.mustChangePassword = Boolean(backendFlag);
        newUser.debe_cambiar_password = Boolean(backendFlag);
      }
      
      console.log('[AuthContext] ✅ Usuario autenticado:', { 
        email: newUser.email, 
        roles: newUser.roles, 
        mustChangePassword: newUser.mustChangePassword,
        debe_cambiar_password: newUser.debe_cambiar_password,
        loginData_flag: loginData?.debe_cambiar_password,
        loginData_mustChange: loginData?.mustChangePassword
      });
      
      setUser(newUser)
      // We no longer persist sessions across reloads to force login every time
      // localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
      return true
    }catch(e){
      console.error('Login fallido:', e)
      // Re-lanzar el error para que el componente Login pueda mostrarlo
      throw e
    }
  }

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(CURRENT_USER_KEY)
      localStorage.removeItem('access_token')
    } catch (e) {
      // noop
    }
    console.log('Sesión cerrada');
  };

  // update profile (persist to users storage and local current user)
  const updateProfile = async (id, patch) => {
    try{
  const updated = await api.updateUser(id, patch)
      const merged = { ...user, ...updated }
      setUser(merged)
      // Session persistence disabled across reloads
      // localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(merged))
      return merged
    }catch(e){ throw e }
  }

  // complete initial password change on first login
  const completeInitialPasswordSetup = async (newPassword) => {
    if (!user?.email) throw new Error('No user email available')
    const responseData = await api.completeInitialPasswordSetup(user.email, newPassword)
    
    // El backend devuelve { token, usuario, debe_cambiar_password }
    // Actualizar el usuario con los nuevos datos y el flag en false
    const updatedUser = {
      ...user,
      ...responseData.usuario,
      mustChangePassword: false,
      debe_cambiar_password: false
    }
    
    console.log('[AuthContext] Contraseña inicial cambiada:', { 
      email: updatedUser.email, 
      mustChangePassword: updatedUser.mustChangePassword 
    })
    
    setUser(updatedUser)
    return updatedUser
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, completeInitialPasswordSetup }}>
      {children}
    </AuthContext.Provider>
  );
};
