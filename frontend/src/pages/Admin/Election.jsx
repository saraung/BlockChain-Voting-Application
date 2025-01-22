import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tooltip,
  Paper,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const Election = () => {
  const [durationHours, setDurationHours] = useState(""); // Duration input in hours
  const [remainingTime, setRemainingTime] = useState(null); // Countdown timer in seconds
  const [candidates, setCandidates] = useState([]); // List of candidates
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [adminAddress, setAdminAddress] = useState(""); // Admin address from MetaMask
  const [isRequesting, setIsRequesting] = useState(false); // MetaMask request state
  const [electionStatus, setElectionStatus] = useState(null); // To store election status

  useEffect(() => {
    fetchCandidates();
    fetchElectionStatus();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4777/api/candidates/all", {
        withCredentials: true,
      });
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
    }
  };

  const fetchElectionStatus = async () => {
    try {
      const response = await axios.get("http://localhost:4777/api/blocks/voting-status", {
        withCredentials: true,
      });
      const { status: isVotingActive, timeRemaining } = response.data;

      setElectionStatus({ isVotingActive });
      setRemainingTime(isVotingActive ? parseInt(timeRemaining, 10) : null);
    } catch (error) {
      console.error("Error fetching election status:", error);
    }
  };

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            fetchElectionStatus();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hours ${minutes} minutes`;
    }
    return `${minutes} minutes`;
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install MetaMask.");
      return null;
    }

    try {
      setIsRequesting(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      const formattedAddress = formatAddress(address);

      if (formattedAddress) {
        setAdminAddress(formattedAddress);
        return formattedAddress;
      } else {
        toast.error("Invalid address format.");
        return null;
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast.error("Failed to connect to MetaMask. Please try again.");
      return null;
    } finally {
      setIsRequesting(false);
    }
  };

  const formatAddress = (address) => {
    if (address && address.length === 42 && address.startsWith("0x")) {
      return address.toLowerCase();
    }
    return null;
  };

  const startElection = async () => {
    const address = adminAddress || (await connectMetaMask());
    if (!address) return;

    if (!durationHours || isNaN(durationHours) || durationHours <= 0) {
      toast.error("Please enter a valid duration in hours.");
      return;
    }

    try {
      setLoading(true);
      const durationInSeconds = parseInt(durationHours, 10) * 3600;
      await axios.post(
        "http://localhost:4777/api/blocks/start-voting",
        {
          adminAddress: address,
          durationInSeconds,
        },
        { withCredentials: true }
      );
      setRemainingTime(durationInSeconds);
      setElectionStatus({ isVotingActive: true });
      toast.success("Election started successfully.");
    } catch (error) {
      console.error("Error starting the election:", error);
      toast.error("Failed to start the election. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const stopElection = async () => {
    const address = adminAddress || (await connectMetaMask());
    if (!address) return;

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:4777/api/blocks/stop-voting",
        {
          adminAddress: address,
        },
        { withCredentials: true }
      );
      setRemainingTime(null);
      setElectionStatus({ isVotingActive: false });
      toast.success("Election stopped successfully.");
    } catch (error) {
      console.error("Error stopping the election:", error);
      toast.error("Failed to stop the election. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Paper sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Election Admin Panel
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          Manage and Monitor Election Status
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <TextField
            label="Election Duration (in hours)"
            type="number"
            variant="outlined"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            sx={{ width: "200px" }}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={startElection}
              disabled={loading || isRequesting || electionStatus?.isVotingActive}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Start Election"}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={stopElection}
              disabled={loading || isRequesting || !electionStatus?.isVotingActive}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Stop Election"}
            </Button>
          </Box>

          {electionStatus?.isVotingActive && remainingTime !== null && (
            <Typography variant="h6" color="primary" gutterBottom>
              Time Remaining: {formatTime(remainingTime)}
            </Typography>
          )}
        </Box>

        <Divider sx={{ marginY: 3 }} />
        <Typography variant="h5" gutterBottom>
          Candidates
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {candidates.map((candidate) => (
              <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
                <CardMedia
  component="img"
  height="200" // Increased the height for better visibility
  image={candidate.photoUrl || "/path/to/placeholder.jpg"} // Fallback to a placeholder image if photoUrl is unavailable
  alt={candidate.name}
  sx={{
    objectFit: "cover", // Ensures the image fills the space without distorting
    borderRadius: "8px 8px 0 0",
    boxShadow: 2, // Subtle shadow around the image
  }}
/>

                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{candidate.name}</Typography>
                    <Typography color="text.secondary">{candidate.party}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {candidate.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Election;
