import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import UsersList from './pages/Users/UsersList';
import ModulesList from './pages/Modules/ModulesList';
import ConfigPage from './pages/Config/ConfigPage';
import ModuleGenericList from './pages/Modules/ModuleGenericList';
import ModuleForm from './components/Modules/ModuleForm';

const AuthenticatedContent = () => {
  const { user } = React.useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/modules" element={<ModulesList />} />
        <Route path="/modules/configuracion" element={<ConfigPage />} />
        <Route path="/modules/:moduleType" element={<ModuleGenericList />} />
        <Route path="/modules/:moduleType/new" element={<ModuleForm />} />
        <Route path="/modules/:moduleType/:id/edit" element={<ModuleForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthenticatedContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;