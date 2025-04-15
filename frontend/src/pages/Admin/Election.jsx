// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   CircularProgress,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   Paper,
//   Divider,
// } from "@mui/material";
// import { styled } from '@mui/material/styles'; // Import styled from @mui/material/styles
// import { toast } from "react-toastify";
// import axios from "axios";

// // Styled component for the main container
// const ElectionContainer = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(4),
//   backgroundColor: "#e6f7ff", // Light blue background
//   borderRadius: theme.spacing(2),
// }));

// // Styled component for the paper
// const ElectionPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   boxShadow: theme.shadows[5], // Increased shadow for depth
//   borderRadius: theme.spacing(2),
// }));

// // Styled component for the section title
// const SectionTitle = styled(Typography)(({ theme }) => ({
//   variant: "h5",
//   gutterBottom: true,
//   color: theme.palette.primary.main, // Consistent use of primary color
//   fontWeight: "bold",
// }));

// // Styled component for the candidate card
// const CandidateCard = styled(Card)(({ theme }) => ({
//   maxWidth: 345,
//   borderRadius: theme.spacing(2),
//   boxShadow: theme.shadows[3],
//   transition: "transform 0.2s ease-in-out", // Smooth transition for hover effect
//   "&:hover": {
//     transform: "scale(1.05)", // Slight scale up on hover
//   },
// }));

// const Election = () => {
//   const [durationHours, setDurationHours] = useState("");
//   const [remainingTime, setRemainingTime] = useState(null);
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [adminAddress, setAdminAddress] = useState("");
//   const [isRequesting, setIsRequesting] = useState(false);
//   const [electionStatus, setElectionStatus] = useState(null);

//   useEffect(() => {
//     fetchCandidates();
//     fetchElectionStatus();
//   }, []);

//   const fetchCandidates = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:4777/api/candidates/all", {
//         withCredentials: true,
//       });
//       setCandidates(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//       setLoading(false);
//       toast.error("Failed to load candidates."); // User-friendly error message
//     }
//   };

//   const fetchElectionStatus = async () => {
//     try {
//       const response = await axios.get("http://localhost:4777/api/blocks/voting-status", {
//         withCredentials: true,
//       });
//       const { status: isVotingActive, timeRemaining } = response.data;

//       setElectionStatus({ isVotingActive });
//       setRemainingTime(isVotingActive ? parseInt(timeRemaining, 10) : null);
//     } catch (error) {
//       console.error("Error fetching election status:", error);
//       toast.error("Failed to fetch election status."); // User-friendly error message
//     }
//   };

//   useEffect(() => {
//     if (remainingTime > 0) {
//       const interval = setInterval(() => {
//         setRemainingTime((prevTime) => {
//           if (prevTime <= 1) {
//             clearInterval(interval);
//             fetchElectionStatus();
//             return 0;
//           }
//           return prevTime - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [remainingTime]);

//   const formatTime = (timeInSeconds) => {
//     const hours = Math.floor(timeInSeconds / 3600);
//     const minutes = Math.floor((timeInSeconds % 3600) / 60);
//     if (hours > 0) {
//       return `${hours} hours ${minutes} minutes`;
//     }
//     return `${minutes} minutes`;
//   };

//   const connectMetaMask = async () => {
//     if (!window.ethereum) {
//       toast.error("MetaMask not detected. Please install MetaMask.");
//       return null;
//     }

//     try {
//       setIsRequesting(true);
//       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//       const address = accounts[0];
//       const formattedAddress = formatAddress(address);

//       if (formattedAddress) {
//         setAdminAddress(formattedAddress);
//         console.log(formattedAddress);
//         return formattedAddress;
//       } else {
//         toast.error("Invalid address format.");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error connecting to MetaMask:", error);
//       toast.error("Failed to connect to MetaMask. Please try again.");
//       return null;
//     } finally {
//       setIsRequesting(false);
//     }
//   };

//   const formatAddress = (address) => {
//     if (address && address.length === 42 && address.startsWith("0x")) {
//       return address.toLowerCase();
//     }
//     return null;
//   };

//   const startElection = async () => {
//     const address = adminAddress || (await connectMetaMask());
//     if (!address) return;

//     if (!durationHours || isNaN(durationHours) || durationHours <= 0) {
//       toast.error("Please enter a valid duration in hours.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const durationInSeconds = parseInt(durationHours, 10) * 3600;
//       await axios.post(
//         "http://localhost:4777/api/blocks/start-voting",
//         {
//           adminAddress: address,
//           durationInSeconds,
//         },
//         { withCredentials: true }
//       );
//       setRemainingTime(durationInSeconds);
//       setElectionStatus({ isVotingActive: true });
//       toast.success("Election started successfully.");
//     } catch (error) {
//       console.error("Error starting the election:", error);
//       toast.error("Failed to start the election. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stopElection = async () => {
//     const address = adminAddress || (await connectMetaMask());
//     if (!address) return;

//     try {
//       setLoading(true);
//       await axios.post(
//         "http://localhost:4777/api/blocks/stop-voting",
//         {
//           adminAddress: address,
//         },
//         { withCredentials: true }
//       );
//       setRemainingTime(null);
//       setElectionStatus({ isVotingActive: false });
//       toast.success("Election stopped successfully.");
//     } catch (error) {
//       console.error("Error stopping the election:", error);
//       toast.error("Failed to stop the election. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ElectionContainer>
//       <ElectionPaper>
//         <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
//           Election Admin Panel
//         </Typography>
//         <Typography variant="h6" gutterBottom align="center" color="textSecondary">
//           Manage and Monitor Election Status
//         </Typography>
//         <Divider sx={{ marginBottom: 2 }} />

//         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
//           <TextField
//             label="Election Duration (in hours)"
//             type="number"
//             variant="outlined"
//             value={durationHours}
//             onChange={(e) => setDurationHours(e.target.value)}
//             sx={{ width: "200px" }}
//           />
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={startElection}
//               disabled={loading || isRequesting || electionStatus?.isVotingActive}
//               sx={{ minWidth: 150 }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : "Start Election"}
//             </Button>

//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={stopElection}
//               disabled={loading || isRequesting || !electionStatus?.isVotingActive}
//               sx={{ minWidth: 150 }}
//             >
//               {loading ? <CircularProgress size={24} color="inherit" /> : "Stop Election"}
//             </Button>
//           </Box>

//           {electionStatus?.isVotingActive && remainingTime !== null && (
//             <Typography variant="h6" color="primary" gutterBottom>
//               Time Remaining: {formatTime(remainingTime)}
//             </Typography>
//           )}
//         </Box>

//         <Divider sx={{ marginY: 3 }} />
//         <SectionTitle>Candidates</SectionTitle>
//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <Grid container spacing={3}>
//             {candidates.map((candidate) => (
//               <Grid item xs={12} sm={6} md={4} key={candidate._id}>
//                 <CandidateCard>
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={candidate.photoUrl || "/path/to/placeholder.jpg"}
//                     alt={candidate.name}
//                     sx={{
//                       objectFit: "cover",
//                       borderRadius: "8px 8px 0 0",
//                       boxShadow: 2,
//                     }}
//                   />
//                   <CardContent>
//                     <Typography variant="h6" fontWeight="bold" color="primary">{candidate.name}</Typography>
//                     <Typography color="textSecondary">{candidate.party}</Typography>
//                     <Typography variant="body2" color="textSecondary" noWrap>
//                       {candidate.description}
//                     </Typography>
//                   </CardContent>
//                 </CandidateCard>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </ElectionPaper>
//     </ElectionContainer>
//   );
// };

// export default Election;

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
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import axios from "axios";

const ElectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#0f3460", // Updated background color
  borderRadius: theme.spacing(2),
}));

const ElectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[5],
  borderRadius: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  variant: "h5",
  gutterBottom: true,
  color: theme.palette.primary.main,
  fontWeight: "bold",
}));

const CandidateCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const Election = () => {
  const [durationHours, setDurationHours] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [electionStatus, setElectionStatus] = useState(null);
  const adminAddress = "0x8b12636be8ec3cd0f2c54d860db720868bf5fb91";

  useEffect(() => {
    fetchCandidates();
    fetchElectionStatus();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4777/api/candidates/all", { withCredentials: true });
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
      toast.error("Failed to load candidates.");
    }
  };

  const fetchElectionStatus = async () => {
    try {
      const response = await axios.get("http://localhost:4777/api/blocks/voting-status", { withCredentials: true });
      const { status: isVotingActive, timeRemaining } = response.data;
      setElectionStatus({ isVotingActive });
      setRemainingTime(isVotingActive ? parseInt(timeRemaining, 10) : null);
    } catch (error) {
      console.error("Error fetching election status:", error);
      toast.error("Failed to fetch election status.");
    }
  };

  const startElection = async () => {
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
          adminAddress,
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
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:4777/api/blocks/stop-voting",
        { adminAddress },
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
    <ElectionContainer>
      <ElectionPaper>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
          Election Admin Panel
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
              disabled={loading || electionStatus?.isVotingActive}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Start Election"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={stopElection}
              disabled={loading || !electionStatus?.isVotingActive}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Stop Election"}
            </Button>
          </Box>
          {electionStatus?.isVotingActive && remainingTime !== null && (
            <Typography variant="h6" color="primary" gutterBottom>
              Time Remaining: {remainingTime / 3600} hours
            </Typography>
          )}
        </Box>
        <Divider sx={{ marginY: 3 }} />
        <SectionTitle>Candidates</SectionTitle>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {candidates.map((candidate) => (
              <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                <CandidateCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={candidate.photoUrl || "/path/to/placeholder.jpg"}
                    alt={candidate.name}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="primary">{candidate.name}</Typography>
                    <Typography color="textSecondary">{candidate.party}</Typography>
                  </CardContent>
                </CandidateCard>
              </Grid>
            ))}
          </Grid>
        )}
      </ElectionPaper>
    </ElectionContainer>
  );
};

export default Election;
