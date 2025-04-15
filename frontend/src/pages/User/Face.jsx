import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, CircularProgress } from "@mui/material";

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [faceData, setFaceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;
  const email = userInfo?.email;

  useEffect(() => {
    startVideo();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError(true);
      alert("❌ Camera access denied! Please enable it.");
    }
  };

  const captureFace = async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      setStatusMessage("❌ Camera not ready.");
      return;
    }

    setLoading(true);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    setFaceData(imageData);
    setStatusMessage("✅ Face Captured!");
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!username || !email) {
      alert("❌ User info missing in local storage!");
      return;
    }

    if (!faceData) {
      alert("❌ No face data captured!");
      return;
    }

    const endpoint = "http://localhost:5001/login";
    const payload = { username, email, image: faceData };

    try {
      console.log("📤 Sending login request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("🔍 Response from server:", data);

      if (response.ok) {
        setStatusMessage(data.message || "✅ Authentication Successful!");
        setTimeout(() => navigate("/vote"), 1000); // Navigate after 1s delay
      } else {
        setStatusMessage(data.error || "❌ Authentication failed.");
      }
    } catch (error) {
      console.error("❌ Request failed:", error);
      setStatusMessage("❌ Something went wrong!");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #e94560)',
        color: '#fff',
        padding: 4,
        width: '100%',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 0, // Ensure no margin
        padding: 0, // Ensure no padding
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 2,
          background: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}
      >
        Face Authentication
      </Typography>

      <Paper elevation={10} sx={{
        p: 3,
        background: "rgba(30, 30, 47, 0.8)",
        borderRadius: "16px",
        textAlign: "center",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
      }}>
        {cameraError ? (
          <Typography color="error" sx={{ color: "#ff6b6b", fontWeight: 500 }}>
            ❌ Camera access denied. Please enable it.
          </Typography>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "320px",
              height: "240px",
              borderRadius: "12px",
              border: "2px solid rgba(58, 123, 213, 0.5)",
              boxShadow: "0 4px 20px rgba(0, 210, 255, 0.2)"
            }}
          />
        )}

        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            onClick={captureFace}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              background: "linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "0 4px 15px rgba(58, 123, 213, 0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #3a7bd5 0%, #00d2ff 70%)",
                boxShadow: "0 6px 20px rgba(58, 123, 213, 0.6)"
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "📷 Capture Face"}
          </Button>

          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              mt: 1,
              py: 1.5,
              background: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "0 4px 15px rgba(17, 153, 142, 0.4)"
            }}
          >
            🔓 Authenticate
          </Button>

          {/* Status message below buttons */}
          {statusMessage && (
            <Typography
              sx={{
                mt: 2,
                fontWeight: 600,
                color: statusMessage.includes("❌") ? "#ff6b6b" : "#38ef7d",
              }}
            >
              {statusMessage}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default FaceLogin;
