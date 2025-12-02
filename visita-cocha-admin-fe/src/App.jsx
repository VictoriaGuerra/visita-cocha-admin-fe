import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import { isSuperAdmin } from './utils/roleUtils';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';
import ModulesList from './pages/Modules/ModulesList';
import ConfigPage from './pages/Config/ConfigPage';
import ModuleGenericList from './pages/Modules/ModuleGenericList';
import ModuleForm from './components/Modules/ModuleForm';
import AttractionForm from './pages/Modules/AttractionForm';
import RestaurantForm from './pages/Modules/RestaurantForm';
import EventForm from './pages/Modules/EventForm';
import HotelForm from './pages/Modules/HotelForm';
import AnnouncementForm from './pages/Modules/AnnouncementForm';
import PoiForm from './pages/Modules/PoiForm';
import FoodForm from './pages/Modules/FoodForm';
import ItineraryForm from './pages/Modules/ItineraryForm';
import ItineraryList from './pages/Modules/ItineraryList';
import RouteForm from './pages/Modules/RouteForm';
import RoutesList from './pages/Modules/RoutesList';
import TransportRoutesList from './pages/TransportRoutes/TransportRoutesList';
import TransportRouteForm from './pages/TransportRoutes/TransportRouteForm';
import CategoriesManager from './pages/Modules/CategoriesManager';
import FirstPasswordChangeModal from './components/Auth/FirstPasswordChangeModal';
import PasswordResetRequest from './pages/Auth/PasswordResetRequest';
import PasswordResetConfirm from './pages/Auth/PasswordResetConfirm';
import Emails from './pages/Dev/Emails';

const AuthenticatedContent = () => {
  const { user } = useContext(AuthContext);
  const isSuperAdminRole = isSuperAdmin(user);

  if (!user) {
    // Permitir acceso a las pantallas de recuperación de contraseña sin login
    return (
      <Routes>
        <Route path="/reset" element={<PasswordResetRequest />} />
        <Route path="/reset/confirm" element={<PasswordResetConfirm />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <FirstPasswordChangeModal />
      <Routes>
        <Route path="/" element={<Dashboard />} />
  <Route path="/users" element={isSuperAdminRole ? <UsersList /> : <Navigate to="/" replace />} />
  <Route path="/users/new" element={isSuperAdminRole ? <UserForm onClose={() => window.history.back()} /> : <Navigate to="/" replace />} />
  <Route path="/users/edit/:id" element={isSuperAdminRole ? <UserForm onClose={() => window.history.back()} /> : <Navigate to="/" replace />} />
        <Route path="/modules" element={<ModulesList />} />
  <Route path="/modules/configuracion" element={<ConfigPage />} />
  <Route path="/settings" element={<ConfigPage />} />
  <Route path="/modules/itineraries" element={<ItineraryList />} />
  <Route path="/modules/routes" element={<RoutesList />} />
  
  {/* Rutas de Transporte */}
  <Route path="/transport-routes" element={<TransportRoutesList />} />
  <Route path="/transport-routes/new" element={<TransportRouteForm />} />
  <Route path="/transport-routes/edit/:id" element={<TransportRouteForm />} />
  <Route path="/transport-routes/view/:id" element={<TransportRouteForm />} />
  
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
  <Route path="/modules/points/new" element={<PoiForm />} />
  <Route path="/modules/points/edit/:id" element={<PoiForm />} />
  <Route path="/modules/foods/new" element={<FoodForm />} />
  <Route path="/modules/foods/edit/:id" element={<FoodForm />} />
  <Route path="/modules/foods/view/:id" element={<FoodForm />} />
  <Route path="/modules/itineraries/new" element={<ItineraryForm />} />
  <Route path="/modules/itineraries/edit/:id" element={<ItineraryForm />} />
  <Route path="/modules/itineraries/view/:id" element={<ItineraryForm />} />
  <Route path="/modules/routes/new" element={<RouteForm />} />
  <Route path="/modules/routes/edit/:id" element={<RouteForm />} />
  <Route path="/modules/routes/view/:id" element={<RouteForm />} />
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