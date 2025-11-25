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
      await api.authLogin(email, password)
      // Preferimos /auth/me si existe; si no, caemos a listado y filtramos por email
      let newUser = null
      try {
        const me = await api.getMe(email)
        if (me) newUser = me
      } catch {}
      if (!newUser){
        const users = await api.getUsers()
        const u = users.find(x => x.email === email)
        newUser = u ? { ...u } : { email, name: email, roles: ['SuperAdmin'] }
      }
      setUser(newUser)
      // We no longer persist sessions across reloads to force login every time
      // localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
      return true
    }catch(e){
      console.log('Login fallido', e)
      return false
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
  const updated = await api.completeInitialPasswordSetup(user.email, newPassword)
    setUser(prev => ({ ...prev, ...updated }))
    return updated
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, completeInitialPasswordSetup }}>
      {children}
    </AuthContext.Provider>
  );
};
