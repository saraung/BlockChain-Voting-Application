import React from 'react';
import { Button, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { FaEthereum, FaLock, FaVoteYea } from 'react-icons/fa';

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Blockchain Voting System
      </Typography>
      
      <Typography variant="h5" align="center" paragraph>
        A secure, transparent, and efficient way to cast your vote with blockchain technology.
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <CardContent>
              <FaEthereum size={40} color="#3f51b5" />
              <Typography variant="h6" gutterBottom>
                Blockchain Technology
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Using blockchain for secure and immutable voting, ensuring transparency and trust.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <CardContent>
              <FaLock size={40} color="#3f51b5" />
              <Typography variant="h6" gutterBottom>
                Enhanced Security
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your vote is securely encrypted, ensuring that it cannot be tampered with or altered.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
            <CardContent>
              <FaVoteYea size={40} color="#3f51b5" />
              <Typography variant="h6" gutterBottom>
                Easy Voting
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Cast your vote easily with our user-friendly interface, all while ensuring your privacy.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', marginTop: 5 }}>
        <Button variant="contained" color="primary" size="large">
          Start Voting
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
