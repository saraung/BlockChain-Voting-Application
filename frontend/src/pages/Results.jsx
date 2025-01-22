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
      <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
        Loading results...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: 3, color: 'red' }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Previous Voting Sessions
      </Typography>
      <Grid container spacing={3}>
        {resultsData.map((session, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <FaRegCalendarAlt /> Ended On: {formatDate(session.endTime)}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Results:</strong>
                </Typography>
                <List>
                  {session.candidates.map((candidate, i) => (
                    <ListItem key={i} sx={{ padding: 0 }}>
                      <ListItemText
                        primary={`${candidate}: ${session.votes[i]} vote(s)`}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        primaryTypographyProps={{
                          variant: 'body1',
                        }}
                      />
                      <FaVoteYea color="#3f51b5" />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Results;
