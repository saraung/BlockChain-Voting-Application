import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { FaRegCalendarAlt, FaVoteYea } from 'react-icons/fa';
import { styled } from '@mui/material/styles';

// Styled components for enhanced UI
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[5],
  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  color: '#ffffff',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '5px',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: '#f0a500',
  fontWeight: 'bold',
}));

// Helper function to convert Unix timestamp to readable date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const Results = () => {
  const [resultsData, setResultsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:4777/api/blocks/voting-sessions', {
          withCredentials: true, // Include credentials if necessary
        });

        // Sort results by endTime in descending order
        const sortedData = response.data.sort((a, b) => b.endTime - a.endTime);
        setResultsData(sortedData);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <StyledTypography variant="h6" align="center" sx={{ marginTop: 3 }}>
        Loading results...
      </StyledTypography>
    );
  }

  if (error) {
    return (
      <StyledTypography variant="h6" align="center" sx={{ marginTop: 3, color: 'red' }}>
        {error}
      </StyledTypography>
    );
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      <StyledTypography variant="h4" align="center" gutterBottom>
        Previous Voting Sessions
      </StyledTypography>
      <Grid container spacing={3}>
        {resultsData.map((session, index) => (
          <Grid item xs={12} md={6} key={index}>
            <StyledCard>
              <CardContent>
                <StyledTypography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <FaRegCalendarAlt /> Ended On: {formatDate(session.endTime)}
                </StyledTypography>
                <Divider sx={{ marginY: 2, backgroundColor: '#f0a500' }} />
                <Typography variant="body1" gutterBottom sx={{ color: '#ffffff' }}>
                  <strong>Results:</strong>
                </Typography>
                <List>
                  {session.candidates.map((candidate, i) => (
                    <StyledListItem key={i} sx={{ padding: 1 }}>
                      <ListItemText
                        primary={`${candidate}: ${session.votes[i]} vote(s)`}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}
                        primaryTypographyProps={{
                          variant: 'body1',
                        }}
                      />
                      <FaVoteYea color="#f0a500" />
                    </StyledListItem>
                  ))}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Results;
