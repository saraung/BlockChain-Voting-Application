import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setCredentials } from '../redux/auth/authSlice'; // Assuming authSlice exists
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the server
      const { data } = await axios.post(
        'http://localhost:4777/api/users/auth',
        { email, password },
        { withCredentials: true } // Handle cookies
      );

      // Dispatch user info to Redux store
      dispatch(setCredentials(data));
      toast.success('Login successful!');
      navigate(redirect);
    } catch (err) {
      console.error('Error:', err);
      toast.error(err?.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Polling Officer Login
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Securely access the blockchain voting system
        </Typography>

        <Box
          component="form"
          onSubmit={submitHandler}
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              textTransform: 'none',
              backgroundColor: '#3f51b5',
              '&:hover': { backgroundColor: '#2c387e' },
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
