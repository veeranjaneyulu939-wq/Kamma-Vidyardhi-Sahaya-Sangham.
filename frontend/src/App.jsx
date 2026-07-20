import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import QRCodes from './pages/QRCodes';
import Admins from './pages/Admins';
import Layout from './components/Layout';

function App() {
  // Simple auth check (in a real app, you'd check context/localstorage for token)
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="qr-codes" element={<QRCodes />} />
          <Route path="admins" element={<Admins />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
