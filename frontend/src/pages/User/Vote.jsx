import React from 'react';
import { Typography, Box, Button } from '@mui/material';

const Vote = () => {
  const castVote = () => {
    // Logic to cast a vote (API call)
    console.log('Vote Casted');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vote for Your Favorite Candidate
      </Typography>
      <Button variant="contained" color="primary" onClick={castVote}>
        Cast Vote
      </Button>
    </Box>
  );
};

export default Vote;
