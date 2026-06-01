import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import DealsPage from './pages/DealsPage';
import RoutesPage from './pages/RoutesPage';
import TrackBusPage from './pages/TrackBusPage';
import LoyaltyPage from './pages/LoyaltyPage';
import SavedPaymentsPage from './pages/SavedPaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import HelpPage from './pages/HelpPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/book/:routeId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path="/booking-success/:bookingId" element={<PrivateRoute><BookingSuccessPage /></PrivateRoute>} />
          <Route path="/my-bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/track" element={<PrivateRoute><TrackBusPage /></PrivateRoute>} />
          <Route path="/rewards" element={<PrivateRoute><LoyaltyPage /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><SavedPaymentsPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;