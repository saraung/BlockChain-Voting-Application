import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  CircularProgress,
  IconButton,
  CardActions,
  useTheme,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";

const Candidates = () => {
  const theme = useTheme();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    photoUrl: "",
    description: "",
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Fetch all candidates on component mount
  useEffect(() => {
    fetchCandidates();
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

  const handleOpenDialog = (candidate = null) => {
    setSelectedCandidate(candidate);
    setFormData(candidate || { name: "", party: "", photoUrl: "", description: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCandidate(null);
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.party || !formData.photoUrl || !formData.description) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      if (selectedCandidate) {
        // Update candidate
        await axios.put(
          `http://localhost:4777/api/candidates/update/${selectedCandidate._id}`,
          formData,
          { withCredentials: true }
        );
        toast.success("Candidate updated successfully.");
      } else {
        // Create candidate
        await axios.post("http://localhost:4777/api/candidates/register", formData, {
          withCredentials: true,
        });
        toast.success("Candidate added successfully.");
      }

      fetchCandidates();
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting candidate form:", error);
      toast.error("Failed to save candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:4777/api/candidates/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Candidate deleted successfully.");
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
        Candidate Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ marginBottom: 3, boxShadow: 3, "&:hover": { boxShadow: 6 } }}
      >
        Add Candidate
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {candidates.map((candidate) => (
            <Grid item xs={12} sm={6} md={4} key={candidate._id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <Avatar
                  src={candidate.photoUrl}
                  alt={candidate.name}
                  sx={{ width: 100, height: 100, marginBottom: 2, border: `2px solid ${theme.palette.primary.main}` }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                    {candidate.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {candidate.party}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                    {candidate.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(candidate)}
                    sx={{ "&:hover": { backgroundColor: theme.palette.primary.light } }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCandidate(candidate._id)}
                    sx={{ "&:hover": { backgroundColor: theme.palette.error.light } }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Candidate Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}>
          {selectedCandidate ? "Edit Candidate" : "Add Candidate"}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Party"
            type="text"
            fullWidth
            value={formData.party}
            onChange={(e) => setFormData({ ...formData, party: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Photo URL"
            type="url"
            fullWidth
            value={formData.photoUrl}
            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Candidates;