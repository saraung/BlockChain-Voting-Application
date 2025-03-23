import React, { useRef, useState, useEffect } from "react";

const FaceAuth = () => {
  const videoRef = useRef(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [faceData, setFaceData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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

  const handleSubmit = async () => {
    if (!username.trim() || !email.trim()) {
      alert("❌ Username and email are required!");
      return;
    }

    if (!faceData) {
      alert("❌ No face data captured!");
      return;
    }

    const endpoint = isRegistering ? "http://localhost:5001/register" : "http://localhost:5001/login";
    const payload = { username, email, image: faceData };

    try {
      console.log("📤 Sending request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("🔍 Response from server:", data);

      if (response.ok) {
        setStatusMessage(data.message || "✅ Success!");
      } else {
        setStatusMessage(data.error || "❌ Authentication failed.");
      }
    } catch (error) {
      console.error("❌ Request failed:", error);
      setStatusMessage("❌ Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">{isRegistering ? "Register" : "Login"} with Face Recognition</h2>

      {cameraError ? (
        <p className="text-red-500">❌ Camera access denied. Please enable it.</p>
      ) : (
        <video ref={videoRef} autoPlay playsInline className="w-80 h-60 border border-gray-300 rounded-md" />
      )}

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-4 p-2 border rounded-md w-64"
      />

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 p-2 border rounded-md w-64"
      />

      <button onClick={captureFace} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md" disabled={loading}>
        {loading ? "Capturing..." : "Capture Face"}
      </button>

      <button onClick={handleSubmit} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">
        {isRegistering ? "Register" : "Login"}
      </button>

      <button onClick={() => setIsRegistering(!isRegistering)} className="mt-4 text-blue-600 underline">
        Switch to {isRegistering ? "Login" : "Register"}
      </button>

      {statusMessage && <p className="mt-2 text-lg font-semibold">{statusMessage}</p>}
    </div>
  );
};

export default FaceAuth;