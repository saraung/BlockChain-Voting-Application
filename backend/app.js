import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import web3 from './config/web3.js';
import { getContractInstance } from './config/web3.js';  // Import the function to get the contract instance
import votingABI from './build/contracts/Voting.json' assert { type: 'json' };
// import { startVoting } from './web3Utils.js';
import { extractRevertReason } from './utils/errorUtils.js' 
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Replace with your deployed contract address and admin account
const contractAddress = '0xD1747fa0fa2390C298e5CB79226ad95c8C223239';
const adminAddress = '0x8b12636Be8EC3Cd0f2C54D860DB720868BF5FB91';

// Get the contract instance
const votingContract = getContractInstance(votingABI.abi, contractAddress);

// API: Test endpoint
app.get('/api/testing', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

// API: Start voting
app.post('/api/start-voting', async (req, res) => {
  const { candidates, durationInSeconds,
    //  adminAddress
     } = req.body;  // Assuming you pass contract address and admin address

  try {
    // Ensure admin address is valid
    const accounts = await web3.eth.getAccounts();
    if (!accounts.includes(adminAddress)) {
      throw new Error('Admin address is not valid.');
    }

    const candidateNames = candidates.map((candidate) => candidate.toString()); // Convert candidates to string

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
});


app.post('/api/stop-voting', async (req, res) => {
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
});


// API: Vote for a candidate
app.post('/api/vote', async (req, res) => {
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
});



// API: Fetch candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await votingContract.methods.getCandidates().call();
    res.json({ candidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).send(`Error fetching candidates: ${error.message}`);
  }
});

// API: Get votes for a candidate
app.get('/api/votes/:candidateIndex', async (req, res) => {
  const { candidateIndex } = req.params;
  try {
    const votes = await votingContract.methods.getVotes(candidateIndex).call();
    res.json({ votes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).send(`Error fetching votes: ${error.message}`);
  }
});

// API: Get voting status
app.get('/api/voting-status', async (req, res) => {
  try {
    const status = await votingContract.methods.isVotingActiveStatus().call();
    const timeRemaining = await votingContract.methods.getTimeRemaining().call();
    res.json({ status, timeRemaining });
  } catch (error) {
    console.error('Error fetching voting status:', error);
    res.status(500).send(`Error fetching voting status: ${error.message}`);
  }
});

// Ensure BigInt is properly serialized to JSON
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

// API: Get voting results
app.get('/api/results', async (req, res) => {
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
});

// API: Get voting session results by session index
app.get('/api/voting-session/:sessionIndex', async (req, res) => {
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
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
