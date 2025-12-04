import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';
import ModulesList from './pages/Modules/ModulesList';
import ConfigPage from './pages/Config/ConfigPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import { usePermissions } from './auth/permissions';
import ModuleGenericList from './pages/Modules/ModuleGenericList';
import ModuleForm from './components/Modules/ModuleForm';
import AttractionForm from './pages/Modules/AttractionForm';
import RestaurantForm from './pages/Modules/RestaurantForm';
import EventForm from './pages/Modules/EventForm';
import HotelForm from './pages/Modules/HotelForm';
import AnnouncementForm from './pages/Modules/AnnouncementForm';
import PointsForm from './pages/Modules/PointsForm';
import FoodForm from './pages/Modules/FoodForm';
import ItineraryForm from './pages/Modules/ItineraryForm';
import CategoriesManager from './pages/Modules/CategoriesManager';
import FirstPasswordChangeModal from './components/Auth/FirstPasswordChangeModal';
import PasswordReset from './pages/Auth/PasswordReset';
import Emails from './pages/Dev/Emails';
import TransportRoutes from './pages/TransportRoutes';

const AuthenticatedContent = () => {
  const { user } = useContext(AuthContext);
  const rawRoles = user?.roles || (user?.role ? [user.role] : []);
  const normRoles = Array.isArray(rawRoles) ? rawRoles.map(r => String(r).toUpperCase()) : [];
  const isSuper = normRoles.includes('SUPERADMIN') || normRoles.includes('SUPER-ADMIN') || normRoles.includes('SUPER ADMIN');
  const canViewAnalytics = usePermissions(user?.role || user?.roles || user, 'analytics', 'read');

  if (!user) {
    // Allow unauthenticated access to reset page
    return (
      <Routes>
        <Route path="/reset" element={<PasswordReset />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <FirstPasswordChangeModal />
      <Routes>
        <Route path="/routes" element={<TransportRoutes />} />
        <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={canViewAnalytics ? <AnalyticsPage /> : <Navigate to="/" replace />} />
  <Route path="/users" element={isSuper ? <UsersList /> : <Navigate to="/" replace />} />
  <Route path="/users/new" element={isSuper ? <UserForm onClose={() => window.history.back()} /> : <Navigate to="/" replace />} />
  <Route path="/users/edit/:id" element={isSuper ? <UserForm onClose={() => window.history.back()} /> : <Navigate to="/" replace />} />
        <Route path="/modules" element={<ModulesList />} />
  <Route path="/modules/configuracion" element={<ConfigPage />} />
  <Route path="/settings" element={<ConfigPage />} />
        <Route path="/modules/:moduleType" element={<ModuleGenericList />} />
  <Route path="/modules/attractions/new" element={<AttractionForm />} />
  <Route path="/modules/attractions/edit/:id" element={<AttractionForm />} />
  <Route path="/modules/restaurants/new" element={<RestaurantForm />} />
  <Route path="/modules/restaurants/edit/:id" element={<RestaurantForm />} />
  <Route path="/modules/events/new" element={<EventForm />} />
  <Route path="/modules/events/edit/:id" element={<EventForm />} />
  <Route path="/modules/hotels/new" element={<HotelForm />} />
  <Route path="/modules/hotels/edit/:id" element={<HotelForm />} />
  <Route path="/modules/announcements/new" element={<AnnouncementForm />} />
  <Route path="/modules/announcements/edit/:id" element={<AnnouncementForm />} />
  <Route path="/modules/points/new" element={<PointsForm />} />
  <Route path="/modules/points/edit/:id" element={<PointsForm />} />
  <Route path="/modules/foods/new" element={<FoodForm />} />
  <Route path="/modules/foods/edit/:id" element={<FoodForm />} />
  <Route path="/modules/itineraries/new" element={<ItineraryForm />} />
  <Route path="/modules/itineraries/edit/:id" element={<ItineraryForm />} />
  <Route path="/modules/categories" element={<CategoriesManager />} />
  <Route path="/emails" element={<Emails />} />
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