import React from 'react';
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

// Dummy data
const resultsData = [
  {
    candidates: ['Alice', 'Bob', 'Charlie'],
    votes: ['2', '1', '0'],
    endTime: '1736747116',
  },
  {
    candidates: ['ney', 'rono', 'messi'],
    votes: ['0', '1', '0'],
    endTime: '1736747144',
  },
  {
    candidates: ['ney', 'rono', 'messi'],
    votes: ['0', '1', '0'],
    endTime: '1736747306',
  },
  {
    candidates: ['ney', 'rono', 'messi'],
    votes: ['0', '1', '0'],
    endTime: '1736747405',
  },
  {
    candidates: ['Alice', 'Maya'],
    votes: ['0', '0'],
    endTime: '1736755681',
  },
];

// Helper function to convert Unix timestamp to readable date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const Results = () => {
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
