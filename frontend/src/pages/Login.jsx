  import React, { useEffect, useState } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { useNavigate, useLocation } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import axios from 'axios';
  import { setCredentials } from '../redux/auth/authSlice';
  import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material';

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
        const { data } = await axios.post('http://localhost:4777/api/users/auth', { email, password }, { withCredentials: true });
        dispatch(setCredentials(data));
        toast.success('Login successful!');
        navigate(redirect);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'An error occurred');
      }
    };

    return (
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #e94560)',
          color: 'white',
          margin: 0, // Ensure no margin
          padding: 0, // Ensure no padding
          overflow: 'hidden', // Prevent scrolling
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
            color: 'white',
            textAlign: 'center',
            width: '400px',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Voter Login
          </Typography>
          <Typography variant="body1" paragraph>
            Securely access the blockchain voting system
          </Typography>

          <Box component="form" onSubmit={submitHandler} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Aadhar Number"
              type="text"
              required
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                input: { color: 'white' },
                '& label': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: '#e94560' },
                  '&.Mui-focused fieldset': { borderColor: '#e94560' },
                },
              }}
            />
            <TextField
              label="Voter ID"
              type="password"
              required
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                input: { color: 'white' },
                '& label': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: '#e94560' },
                  '&.Mui-focused fieldset': { borderColor: '#e94560' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #e94560, #ff5733)',
                '&:hover': { background: 'linear-gradient(90deg, #ff5733, #e94560)' },
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
