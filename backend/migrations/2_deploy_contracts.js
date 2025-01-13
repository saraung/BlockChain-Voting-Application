const Voting = artifacts.require("Voting");

module.exports = async function (deployer, network, accounts) {
    const candidateNames = ["Alice", "Bob", "Charlie"]; // Example candidate names

    console.log("Deploying Voting contract with candidates: ", candidateNames);

    try {
        await deployer.deploy(Voting, candidateNames);
        console.log("Voting contract deployed successfully");
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};
