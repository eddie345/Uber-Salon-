import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Nav elements
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import ArtisanSidebar from '../components/ArtisanSidebar';

// Pages
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import SearchPage from '../pages/SearchPage';
import ArtisanProfilePage from '../pages/ArtisanProfilePage';
import BookingPage from '../pages/BookingPage';
import BookingsPage from '../pages/BookingsPage';
import ProfilePage from '../pages/ProfilePage';
import DashboardPage from '../pages/DashboardPage';
import SchedulePage from '../pages/SchedulePage';
import EarningsPage from '../pages/EarningsPage';
import ArtisanProfileSettingsPage from '../pages/ArtisanProfileSettingsPage';

// Layout component to coordinate dynamic navigation elements
const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Outlet />;

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA]">
      {/* Sidebar for Artisan Dashboard on Desktop (lg+) */}
      {isDashboardRoute && user.role === 'artisan' && <ArtisanSidebar />}

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar for non-dashboard routes (or customer routes) on Desktop (lg+) */}
        {!isDashboardRoute && <Navbar />}

        {/* Content Area */}
        <main className="flex-1 pb-[80px] lg:pb-0">
          <Outlet />
        </main>

        {/* Bottom Nav for Mobile and Tablet (hidden on desktop lg+) */}
        <BottomNav />
      </div>
    </div>
  );
};

// Root Redirector based on authenticated role
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'artisan' ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/home" replace />
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside Layout */}
      <Route element={<Layout />}>
        {/* Root Route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Customer Role Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artisan/:id"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ArtisanProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:artisanId"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['customer', 'artisan']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Artisan Role Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/schedule"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <SchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/earnings"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <EarningsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile-settings"
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanProfileSettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
