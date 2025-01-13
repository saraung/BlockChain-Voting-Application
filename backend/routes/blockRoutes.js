import express from "express";
import {
    getElectionResults,
    getCandidateDetails,
    getVotingStatus,
    startVoting,
    stopVoting,
    castVote,
    getVotesForSingleCandidate,
    getVotingSessionById,
    getAllVotingSessions
} from "../controllers/blockController.js"; // Import results-related controllers
import { authenticate,authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post('/start-voting',authenticate,authorizeAdmin,startVoting).
post('/stop-voting',authenticate,authorizeAdmin,stopVoting);

router.post('/vote',authenticate,castVote);

router.get('/candidates',authenticate,getCandidateDetails);

router.get('/results',authenticate,authorizeAdmin,getElectionResults).
get('/voting-status',authenticate,getVotingStatus).
get('/voting-sessions',authenticate,authorizeAdmin,getAllVotingSessions)

router.get('/votes/:candidateIndex',authenticate,authorizeAdmin,getVotesForSingleCandidate).
get('/voting-session/:sessionIndex',authenticate,authorizeAdmin,getVotingSessionById)


export default router;


