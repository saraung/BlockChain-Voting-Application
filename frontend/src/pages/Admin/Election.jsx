import React from 'react';
import { Button, Typography, Box } from '@mui/material';

const Election = () => {
  const startElection = () => {
    // Logic to start the election (API call)
    console.log('Election Started');
  };

  const endElection = () => {
    // Logic to end the election (API call)
    console.log('Election Ended');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel - Election Management
      </Typography>
      <Button variant="contained" color="primary" onClick={startElection} sx={{ marginRight: 2 }}>
        Start Election
      </Button>
      <Button variant="contained" color="secondary" onClick={endElection}>
        End Election
      </Button>
    </Box>
  );
};

export default Election;
