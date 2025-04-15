import React from 'react';
import { Box } from '@mui/material';
import { Outlet, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Results from './pages/Results';
import Election from './pages/Admin/Election';
import Vote from './pages/User/Vote';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import Candidates from './pages/Admin/Candidates';
import Voters from './pages/User/Voters';
import FaceAuth from './pages/User/FaceAuth';
import { Face } from '@mui/icons-material';
import FaceLogin from './pages/User/Face';

function App() {
  return (
    <Box
    
    sx={{
      display: 'flex',margin:0 }}>
      {/* Sidebar */}
      <NavBar />
      <ToastContainer/>


      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 0,
          marginLeft: '0px', // Adjust based on the NavBar width
        }}
      >
       <Routes>
  {/* Public Routes: accessible by anyone */}
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<Home />} />
  <Route path="/results" element={<Results />} />

  {/* Admin Routes: accessible only by admins */}
  <Route element={<AdminRoute />}>
    <Route path="/election" element={<Election />} />
    <Route path="/candidates" element={<Candidates />} />
  </Route>

  {/* User Routes: accessible only by authenticated users */}
  <Route element={<PrivateRoute />}>
    <Route path="/vote" element={<Vote />} />
    <Route path="/face" element={<FaceLogin/>} />
    <Route path="/facetrial" element={<FaceAuth />} />
    <Route path="/voters" element={<Voters />} />
  </Route>
</Routes>

      </Box>
    </Box>
  );
}

export default App;
