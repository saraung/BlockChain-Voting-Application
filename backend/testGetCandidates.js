import Web3 from 'web3';
import votingABI from './build/contracts/Voting.json' assert { type: 'json' };

// Replace with your Alchemy URL and contract address
const alchemyUrl = 'http://127.0.0.1:7545';
const contractAddress = '0x4c83F19f1082774DEd774E253C7e91B8a7c8dbAB';

const main = async () => {
  try {
    // Initialize Web3 and Contract Instance
    const web3 = new Web3(alchemyUrl);
    const votingContract = new web3.eth.Contract(votingABI.abi, contractAddress);

    // Call the getCandidates function
    const candidates = await votingContract.methods.getCandidates().call();

    console.log('Candidates:', candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error.message);
  }
};

main();
