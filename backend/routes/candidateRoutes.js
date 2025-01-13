import express from "express";
import {
    registerCandidate,
    updateCandidate,
    deleteCandidate,
    getAllCandidates,
} from "../controllers/candidateController.js"; // Candidate-related logic
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js"; // Authentication & Authorization middleware

const router = express.Router();

// Route to register a new candidate (accessible by admin only)
router.post("/register", authenticate, authorizeAdmin, registerCandidate);

// Route to update an existing candidate (accessible by admin only)
router.put("/update/:candidateId", authenticate, authorizeAdmin, updateCandidate);

// Route to delete a candidate (accessible by admin only)
router.delete("/delete/:candidateId", authenticate, authorizeAdmin, deleteCandidate);

// Route to get all candidates (authentication required only)
router.get("/all", authenticate, getAllCandidates);

export default router;
