import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ClientLayout from './components/ClientLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #dbeafe',
              boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.1)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
            },
            success: {
              iconTheme: {
                primary: '#2563eb',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#eab308',
                secondary: '#ffffff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Client Routes with Client Navbar & Footer */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Admin Side Pages (NO Client Navbar & NO Client Footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
