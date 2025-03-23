import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import FormData from "form-data";
import Person from "./models/Person.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Adjust frontend port if needed
app.use(bodyParser.json({ limit: "10mb" }));

mongoose
  .connect("mongodb+srv://saraungbabu:w7eyMSc19jZvf1E7@cluster0.0jrnw.mongodb.net/voting?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

function cosineSimilarity(A, B) {
  let dotProduct = A.reduce((sum, a, i) => sum + a * B[i], 0);
  let normA = Math.sqrt(A.reduce((sum, val) => sum + val * val, 0));
  let normB = Math.sqrt(B.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

// ✅ Fixed Register Route
app.post("/register", async (req, res) => {
  try {
    const { username, image } = req.body;
    if (!username || !image) {
      return res.status(400).json({ error: "Username and image are required" });
    }

    const imageBuffer = Buffer.from(image.split(",")[1], "base64");
    const formData = new FormData();
    formData.append("image", imageBuffer, { filename: "face.jpg", contentType: "image/jpeg" });

    console.log("📤 Sending image to Flask for face embedding extraction...");

    const response = await axios.post("http://localhost:5001/extract", formData, {
      headers: formData.getHeaders(),
    });

    const faceEmbeddings = response.data.embeddings;
    if (!faceEmbeddings) {
      return res.status(400).json({ error: "No face detected!" });
    }

    console.log("✅ Face Embeddings Received:", faceEmbeddings.slice(0, 5), "...");

    const newPerson = new Person({ username, faceEmbeddings });
    await newPerson.save();

    console.log("✅ User Registered:", username);
    res.json({ message: "✅ Registered successfully!", username });
  } catch (error) {
    console.error("❌ Face extraction failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Face extraction failed!" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
