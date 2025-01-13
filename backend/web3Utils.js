// web3Utils.js
import Web3 from 'web3';

const web3 = new Web3(process.env.ALCHEMY_URL); // Connect to Alchemy or Ganache

// Function to check balance
export const checkBalance = async (address) => {
  try {
    const balance = await web3.eth.getBalance(address);
    console.log(`Balance of ${address}:`, web3.utils.fromWei(balance, 'ether'), 'ETH');
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

// Function to start voting (with gas limit and balance check)
export const startVoting = async (contract, adminAddress, candidates, durationInSeconds) => {
    const candidateNames = candidates.map((candidate) => candidate.toString());
  
    try {
      const accounts = await web3.eth.getAccounts();
  
      // Ensure admin address is valid
      if (!accounts.includes(adminAddress)) {
        throw new Error('Admin address is not valid.');
      }
  
      // Estimate gas before sending the transaction (in case it's large)
      const estimatedGas = await contract.methods
        .startVoting(candidateNames, durationInSeconds)
        .estimateGas({ from: adminAddress });
  
      // Convert BigInt to a String if needed
      const gasLimit = String(estimatedGas);  // Ensure it's a String or a Number, not a BigInt
  
      // Send the transaction with the appropriate gas limit
      const tx = await contract.methods
        .startVoting(candidateNames, durationInSeconds)
        .send({ from: adminAddress, gas: gasLimit });
  
      console.log('Transaction successful:', tx);
    } catch (error) {
      console.error('Error starting voting:', error);
      throw new Error(error.message);
    }
  };
  

export default web3;
