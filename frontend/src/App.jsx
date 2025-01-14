import React from 'react';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Results from './pages/Results';
import Election from './pages/Admin/Election';
import Vote from './pages/User/Vote';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <NavBar />
      <ToastContainer/>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: '0px', // Adjust based on the NavBar width
        }}
      >
        <Routes>
          {/* Public Routes: accessible by anyone */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />

          {/* Admin Routes: accessible only by admins */}
          <Route path="/election" element={<AdminRoute element={<Election />} />} />

          {/* User Routes: accessible only by authenticated users */}
          <Route path="/vote" element={<PrivateRoute element={<Vote />} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
