import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ParkingSearchPage from './pages/ParkingSearchPage';
import BookingPage from './pages/BookingPage';
import OwnerDashboard from './pages/OwnerDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import FavoritesPage from './pages/FavoritesPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import MyParkingSlotsPage from './pages/owner/MyParkingSlotsPage';
import EarningsPage from './pages/owner/EarningsPage';
import AddNewSlotPage from './pages/owner/AddNewSlotPage';
import BookingsPage from './pages/owner/BookingsPage';
import UserLayout from './layouts/UserLayout';
import OwnerLayout from './layouts/OwnerLayout';
import RouteNavigationPage from './pages/user/RouteNavigationPage';
import OwnerSettingsPage from './pages/owner/OwnerSettingsPage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (!user) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes with UserLayout */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="search" element={<ParkingSearchPage />} />
          <Route path="booking/:id" element={<BookingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="payments" element={<PaymentHistoryPage />} />
          <Route path="navigate/:parkingId" element={<RouteNavigationPage />} />
        </Route>

        {/* Owner Routes with OwnerLayout */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="parking-slots" element={<MyParkingSlotsPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="add-slot" element={<AddNewSlotPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<OwnerSettingsPage />} />
        </Route>

        {/* Legacy redirects for backward compatibility */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/search" element={<Navigate to="/user/search" replace />} />
        <Route path="/booking/:id" element={<Navigate to="/user/booking/:id" replace />} />
        <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
        <Route path="/settings" element={<Navigate to="/user/settings" replace />} />
        <Route path="/bookings" element={<Navigate to="/user/bookings" replace />} />
        <Route path="/favorites" element={<Navigate to="/user/favorites" replace />} />
        <Route path="/payments" element={<Navigate to="/user/payments" replace />} />
        <Route path="/owner-dashboard" element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="/my-bookings" element={<Navigate to="/user/bookings" replace />} />
        <Route path="/navigation" element={<Navigate to="/user/search" replace />} />
        <Route path="/navigate/:parkingId" element={<Navigate to="/user/navigate/:parkingId" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
