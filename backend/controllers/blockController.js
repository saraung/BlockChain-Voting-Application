import web3 from '../config/web3.js';
import { getContractInstance } from "../config/web3.js";
import votingABI from '../build/contracts/Voting.json' assert { type: 'json' };
import { extractRevertReason } from '../utils/errorUtils.js' 
import asyncHandler from '../middlewares/asyncHandler.js';
import Candidate from '../models/candidateModel.js';

const contractAddress=process.env.CONTRACT_ADDRESS
const adminAddress=process.env.ADMIN_ADDRESS


const votingContract = getContractInstance(votingABI.abi, contractAddress);


BigInt.prototype['toJSON'] = function () {
    return this.toString();
  };

  export const startVoting = async (req, res) => {
    const { durationInSeconds, adminAddress } = req.body;  // You only need durationInSeconds and adminAddress
    
    try {
      // Ensure admin address is valid
      const accounts = await web3.eth.getAccounts();
      if (!accounts.includes(adminAddress)) {
        throw new Error('Admin address is not valid.');
      }
  
      // Fetch candidate names from the database
      const candidates = await Candidate.find();  // Get all candidates from the database
      const candidateNames = candidates.map(candidate => candidate.name);  // Extract names
  
      // Send the transaction to start voting
      const tx = await votingContract.methods
        .startVoting(candidateNames, durationInSeconds)
        .send({ from: adminAddress });
  
      console.log('Transaction successful:', tx);
      res.send({ message: 'Voting started successfully!' });
    } catch (error) {
      console.error('Error starting voting:', error);
  
      // Extract revert reason if available
      const revertReason = extractRevertReason(error);
      if (revertReason) {
        return res.status(400).send({ message: revertReason });
      }
  
      return res.status(500).send({ message: 'An unexpected error occurred while starting voting.' });
    }
  };

export const stopVoting=async(req,res) => {
     try {
        const estimatedGas = await votingContract.methods.stopVoting().estimateGas({ from: adminAddress });
    console.log(`Estimated Gas: ${estimatedGas}`);
    
        // Call the stopVoting function
        await votingContract.methods.stopVoting().send({ from: adminAddress,gas: 5000000 });
    
        // Prepare the response
        const response = {
          message: "Voting stopped successfully",
        };
    
        // Return the response
        res.json(response);
      } catch (error) {
        console.error('Error stopping voting:', error);
        const revertReason = extractRevertReason(error);
    
        // If revert reason exists, send it as a response
        if (revertReason) {
          return res.status(400).send({ message: revertReason });
        }
    
        // For unexpected errors, send a generic response
        return res.status(500).send({ message: 'An unexpected error occurred while stopping voting.' });
      }
}

export const getCandidateDetails=asyncHandler(
  async (req, res) => {
    try {
      const candidates = await votingContract.methods.getCandidates().call();
      res.json({ candidates });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      res.status(500).send(`Error fetching candidates: ${error.message}`);
    }
  }
)

// cast vote api
export const castVote=async (req, res) => {
    const { candidateIndex, voterAddress, voterId } = req.body;

    if (voterAddress === undefined || voterId === undefined || candidateIndex === undefined) {
      return res.status(400).send('Invalid request: candidateIndex, voterAddress, and voterId are required.');
    }
  
    try {
      console.log('Voting for candidate:', candidateIndex, 'by address:', voterAddress, 'with voterId:', voterId);
  
      // Hash the voterId before sending to the smart contract
      const hashedVoterId = web3.utils.keccak256(voterId);
  
      // Call the vote function on the smart contract
      const receipt = await votingContract.methods
        .vote(hashedVoterId, candidateIndex)
        .send({ from: voterAddress, gas: 3000000 });
  
      res.json({ message: 'Vote cast successfully', receipt });
    } catch (error) {
      console.error('Error voting:', error);
  
      // Attempt to extract the revert reason
      const revertReason = extractRevertReason(error);
      if (revertReason) {
        return res.status(400).send(revertReason);
      }
  
      // Fallback for unexpected errors
      res.status(500).send('An unexpected error occurred while voting.');
    } 
}


export const getElectionResults=async(req,res)=>{
     try {
        const candidates = await votingContract.methods.getCandidates().call();
        const results = [];
        for (let i = 0; i < candidates.length; i++) {
          const votes = await votingContract.methods.getVotes(i).call();
          results.push({ candidate: candidates[i], votes });
        }
        res.json({ results });
      } catch (error) {
        console.error('Error fetching results:', error);
        const revertReason = extractRevertReason(error);
    
        // If revert reason exists, send it as a response
        if (revertReason) {
          return res.status(400).send({ message: revertReason });
        }
    
        // For unexpected errors, send a generic response
        return res.status(500).send({ message: 'An unexpected error occurred while retrieving results.' });
      }
}


export const getVotingStatus =async(req, res) => {
  try {
    const status = await votingContract.methods.isVotingActiveStatus().call();
    const timeRemaining = await votingContract.methods.getTimeRemaining().call();
    res.json({ status, timeRemaining });
  } catch (error) {
    console.error('Error fetching voting status:', error);
    res.status(500).send(`Error fetching voting status: ${error.message}`);
  }
}


export const getVotesForSingleCandidate = async (req,res)=>{
  const { candidateIndex } = req.params;
  try {
    const votes = await votingContract.methods.getVotes(candidateIndex).call();
    res.json({ votes });
  } catch (error) {
    const revertReason = extractRevertReason(error);
    
    // If revert reason exists, send it as a response
    if (revertReason) {
      return res.status(400).send({ message: revertReason });
    }
    res.status(500).send(`Error fetching votes: ${error.message}`);
  }
}

export const getVotingSessionById= async (req,res)=>{
  const { sessionIndex } = req.params;

  try {
    // Call the smart contract function to get session results
    const results = await votingContract.methods.getVotingSessionResults(sessionIndex).call();

    res.json({
      candidates: results.candidates,
      votes: results.sessionVotes,
      endTime: results.endTime,
    });
  } catch (error) {
    console.error('Error fetching session results:', error);
    res.status(500).send(`Error fetching session results: ${error.message}`);
  }
}

export const getAllVotingSessions = async (req, res) => {
  try {
    // Fetch the total number of sessions
    const sessionCount = await votingContract.methods.votingHistoryLength().call();

    const sessions = [];
    for (let i = 0; i < sessionCount; i++) {
      const session = await votingContract.methods.getVotingSessionResults(i).call();
      sessions.push({
        candidates: session.candidates,
        votes: session.sessionVotes,
        endTime: session.endTime,
      });
    }

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching all voting sessions:', error);
    res.status(500).send(`Error fetching all voting sessions: ${error.message}`);
  }
};
