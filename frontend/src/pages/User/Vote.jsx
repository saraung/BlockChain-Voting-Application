import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CheckCircle, HowToVote } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchCandidates();
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4777/api/candidates/all", {
        withCredentials: true,
      });
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = (candidate, index) => {
    setSelectedCandidate({ candidate, index });
    setConfirmationOpen(true);
  };

  const confirmVote = async () => {
    if (!userInfo) {
      toast.error("User info not found. Please log in again.");
      return;
    }

    try {
      setVoting(selectedCandidate.index);
      setConfirmationOpen(false);
      const voterAddress = "0x50541B3EF38008C3382D09B95EEa67082d790D13";
      const voterId = userInfo.username;

      await axios.post("http://localhost:4777/api/blocks/vote", {
        candidateIndex: selectedCandidate.index,
        voterAddress,
        voterId,
      }, { withCredentials: true });

      setVoteSuccess(true);
      toast.success("Vote cast successfully!");
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setVoting(null);
    }
  };

  return (
    <Box sx={{
      padding: 4,
      textAlign: "center",
        background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #e94560)",     

      minHeight: "100vh",
      color: "#fff",
    }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#ffcc00" }}>
        Cast Your Vote
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
          <CircularProgress sx={{ color: "#ffcc00" }} />
        </Box>
      ) : voteSuccess ? (
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
          <CheckCircle sx={{ fontSize: 80, color: "#00e676" }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 2, color: "#ffffff" }}>
            Your vote has been successfully cast!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {candidates.map((candidate, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: "0px 0px 15px rgba(255, 204, 0, 0.7)",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 0px 30px rgba(255, 204, 0, 1)",
                  },
                }}
              >
                <Avatar
                  src={candidate.photoUrl}
                  alt={candidate.name}
                  sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                    {candidate.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: "#c3c3c3" }}>
                    {candidate.party}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(90deg, #ff4081, #e94560)",
                    color: "#fff",
                    fontWeight: "bold",
                    width: "80%",
                    transition: "0.3s",
                    "&:hover": {
                      background: "linear-gradient(90deg, #e94560, #ff4081)",
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => handleVoteClick(candidate, index)}
                  disabled={voting === index}
                  startIcon={<HowToVote />}
                >
                  {voting === index ? <CircularProgress size={24} sx={{ color: "#ffffff" }} /> : "Cast Vote"}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} sx={{
        "& .MuiPaper-root": {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          borderRadius: "10px",
        }
      }}>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", color: "#ffcc00" }}>Confirm Your Vote</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#c3c3c3", textAlign: "center" }}>
            Are you sure you want to vote for <strong>{selectedCandidate?.candidate.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setConfirmationOpen(false)} sx={{ color: "#ff1744", fontWeight: "bold" }}>Cancel</Button>
          <Button onClick={confirmVote} sx={{ color: "#ffcc00", fontWeight: "bold" }} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vote;
