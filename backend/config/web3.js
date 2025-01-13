import dotenv from 'dotenv';
dotenv.config();
// dotenv.config({ path: '../.env' });
// Import required modules
import Web3 from 'web3';


// Connect to Alchemy using the URL from the environment variables
const web3 = new Web3(process.env.ALCHEMY_URL);

// Define a function to get the latest block number (for testing)
export const getLatestBlock = async () => {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Latest Block Number:', blockNumber);
    return blockNumber;
  } catch (error) {
    console.error('Error fetching latest block:', error);
    throw error;
  }
};

// Function to get a smart contract instance
export const getContractInstance = (abi, address) => {
  return new web3.eth.Contract(abi, address);
};


// const checkNetwork = async () => {
//   try {
//     const networkId = await web3.eth.net.getId();
//     if (networkId === 1) {
//       console.log("Connected to Ethereum Mainnet");
//     } else {
//       console.log("Not connected to Mainnet, Network ID:", networkId);
//     }
//   } catch (error) {
//     console.error("Error checking network:", error);
//   }
// };

// checkNetwork();
// Export the web3 instance for other files to use
export default web3;


