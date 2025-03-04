import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import VendorRegistration from './components/VendorForm';
import BuyerForm from './components/BuyerForm';
import Login from './components/Login';
import Signup from './components/signup';
import AdminDashboard from './Dashboard/AdminDashboard/AdminDashboard';
import VendorDashboard from './Dashboard/VendorDashboard/VendorDashboard';
import BuyerDashboard from './Dashboard/BuyerDashboard/BuyerDashboard';

const LogoutButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Show button only on dashboard routes
  const isDashboardRoute = [
    '/admin-dashboard',
    '/vendor-dashboard',
    '/buyer-dashboard'
  ].includes(location.pathname);

  return (
    isDashboardRoute && (
      <Box display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="error" 
          sx={{ backgroundColor: 'rgb(20, 20, 20)', color: 'white', '&:hover': { backgroundColor: 'rgb(10, 10, 10)' } }}
          onClick={handleLogout}>
          <LogoutIcon />
          Logout
        </Button>
      </Box>
    )
  );
};

const App = () => {
  return (
    <Router>
      <div style={{ padding: "1rem", backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
        <LogoutButton />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/vendor" element={<VendorRegistration />} />
          <Route path="/vendor/:email" element={<VendorRegistration />} />
          <Route path="/buyer" element={<BuyerForm />} />
          <Route path="/buyer/:email" element={<BuyerForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
