import express from "express";
import {
    registerVoter,
    getVotersByPollingStation,
    updateVoterById,
    getAllVoters,
    deleteVoterById
} from "../controllers/voterController.js"; // Voter-related logic
import { authenticate, authorizeAdmin} from "../middlewares/authMiddleware.js"; // Admin authentication middleware

const router = express.Router();

// Route to register a new voter (accessible by admin only)
router.post("/register", authenticate, registerVoter); 


router.get("/",authenticate,authorizeAdmin,getAllVoters);
// Route to get all voters in a specific polling station (protected route, only admin can access)
router.get("/:pollingStationId", authenticate, getVotersByPollingStation);

router.put('/update-voter/:id',authenticate,updateVoterById)

router.delete('/delete-voter/:id',authenticate,deleteVoterById)

export default router;
