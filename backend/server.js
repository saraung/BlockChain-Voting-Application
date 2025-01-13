import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

import userRoutes from './routes/userRoutes.js'
import blockRoutes from './routes/blockRoutes.js'
import voterRoutes from './routes/voterRoutes.js'
import candidateRoutes from './routes/candidateRoutes.js'

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', process.env.FRONTEND_URL],
    exposedHeaders: ['set-cookie'],
  })); 

app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy!");
});


app.use("/api/users",userRoutes);

app.use("/api/blocks", blockRoutes);

app.use("/api/voters",voterRoutes);

app.use("/api/candidates",candidateRoutes);
// Start the server
try {
    app.listen(port, () => {
        console.log(`Server running at port ${port}`);
    });
} catch (error) {
    console.error("Failed to start the server:", error);
}
