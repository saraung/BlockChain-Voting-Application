import React from 'react';
import { Button, Card, CardContent, Typography, Grid, Box, Container } from '@mui/material';
import { FaEthereum, FaLock, FaVoteYea } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate=useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #e94560)',
        color: '#fff',
        padding: 4,
        width: '100%',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 0, // Ensure no margin
        padding: 0, // Ensure no padding
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      <Container
        sx={{
          marginRight: '40px', // Add left margin of 20px
          padding: 0, // No extra padding around the container
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Blockchain Voting System
        </Typography>

        <Typography variant="h5" paragraph>
          Secure, Transparent, and Efficient Voting with Blockchain Technology.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  maxWidth: 360,
                  boxShadow: 6,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  textAlign: 'center',
                  padding: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 10,
                  },
                }}
              >
                <CardContent>
                  {card.icon}
                  <Typography variant="h6" gutterBottom sx={{ marginTop: 1, fontWeight: 'bold' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="inherit">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* <Box sx={{ marginTop: 5 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#ff4081',
              padding: '10px 20px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#e73370',
              },
            }}
            onClick={() => {
              navigate('/face')
            }}
          >
            Start Voting
          </Button>
        </Box> */}
      </Container>
    </Box>
  );
};

const cardData = [
  {
    icon: <FaEthereum size={40} color="#ffcc00" />,
    title: 'Blockchain Technology',
    description: 'Using blockchain for secure and immutable voting, ensuring transparency and trust.',
  },
  {
    icon: <FaLock size={40} color="#ffcc00" />,
    title: 'Enhanced Security',
    description: 'Your vote is securely encrypted, ensuring that it cannot be tampered with or altered.',
  },
  {
    icon: <FaVoteYea size={40} color="#ffcc00" />,
    title: 'Easy Voting',
    description: 'Cast your vote easily with our user-friendly interface, all while ensuring your privacy.',
  },
];

export default Home;
