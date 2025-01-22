// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // State variables
    address public owner; // Owner of the contract
    bool public isVotingActive; // Voting status
    uint public votingEndTime; // Voting end timestamp
    mapping(bytes32 => bool) public hasVoted; // Track whether a voterId has voted
    mapping(uint => uint) public votesReceived; // Track votes for each candidate
    string[] public candidates; // List of candidates
    bytes32[] public voterIds; // Array to track all voters (voterId)

    // Structure to store past voting session results
    struct VotingSession {
        string[] candidates; // Candidates for the session
        uint[] sessionVotes;  // Vote counts for each candidate
        uint endTime;         // Voting session end timestamp
    }

    // Array to store voting session history
    VotingSession[] public votingHistory;

    uint public constant DEFAULT_VOTING_DURATION = 1 days; // Default voting duration

    // Events
    event VotingStarted(string[] candidates, uint duration);
    event VotingStopped();
    event Voted(address voter, uint candidateIndex);
    event Debug(string message); // Added event for debugging

    // Constructor
    constructor(string[] memory _candidateNames) {
        require(_candidateNames.length > 0, "Candidates array cannot be empty");

        owner = msg.sender;
        candidates = _candidateNames;
        votingEndTime = block.timestamp + DEFAULT_VOTING_DURATION;
        isVotingActive = true;

        emit Debug("Voting contract deployed with candidates");
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier votingActive() {
        require(isVotingActive, "Voting is not active");
        require(block.timestamp <= votingEndTime, "Voting period has ended");
        _;
    }

    // Start a new voting session
    function startVoting(
        string[] memory _candidateNames,
        uint _durationInSeconds
    ) external onlyOwner {
        require(!isVotingActive, "Voting is already active");

        emit Debug("Starting a new voting session");

        // Reset votes for all candidates
        for (uint i = 0; i < candidates.length; i++) {
            votesReceived[i] = 0;
        }

        // Set new candidates
        candidates = _candidateNames;

        // Set voting duration
        votingEndTime = block.timestamp + _durationInSeconds;

        // Activate voting
        isVotingActive = true;

        // Emit debug message with voting start time and end time
        emit Debug(
            string(
                abi.encodePacked(
                    "Voting started. Current time: ",
                    uintToString(block.timestamp),
                    ", Voting ends at: ",
                    uintToString(votingEndTime)
                )
            )
        );

        // Clear previous voting history before starting a new session
        clearVotingHistory();

        emit VotingStarted(_candidateNames, _durationInSeconds);
    }

    // Stop the voting session manually
    function stopVoting() external onlyOwner {
        require(isVotingActive, "Voting is not active");
        isVotingActive = false;

        // Store results in the voting history
        uint[] memory currentVotes = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            currentVotes[i] = votesReceived[i];
        }

        // Store the session results
        VotingSession memory newSession = VotingSession({
            candidates: candidates,
            sessionVotes: currentVotes,
            endTime: block.timestamp
        });
        votingHistory.push(newSession);

        // Clear voting history for the next session
        clearVotingHistory();

        emit VotingStopped();
        emit Debug("Voting session stopped");
    }

    // Vote for a candidate
    function vote(bytes32 voterId, uint _candidateIndex) external votingActive {
        require(!hasVoted[voterId], "You have already voted"); // Check voterId, not msg.sender
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        votesReceived[_candidateIndex]++;
        hasVoted[voterId] = true; // Mark voterId as having voted
        voterIds.push(voterId); // Store voterId in the array

        emit Voted(msg.sender, _candidateIndex); // Log voter address for reference
        emit Debug(
            string(
                abi.encodePacked(
                    "Voter ",
                    addressToString(msg.sender),
                    " voted for candidate ",
                    uintToString(_candidateIndex)
                )
            )
        );
    }

    // Clear the hasVoted mapping to reset previous voting records
    function clearVotingHistory() internal {
        // Iterate over the array of voter IDs and clear their voting status
        for (uint i = 0; i < voterIds.length; i++) {
            delete hasVoted[voterIds[i]];
        }
        // Optionally reset the voterIds array if needed
        delete voterIds;
    }

    // Get the total votes for a candidate (only after voting is stopped)
    function getVotes(uint _candidateIndex) external view returns (uint) {
        require(!isVotingActive, "Voting is still active. Results can only be accessed after voting ends.");
        require(_candidateIndex < candidates.length, "Invalid candidate index");
        return votesReceived[_candidateIndex];
    }

    // Get the remaining time until voting ends
    function getTimeRemaining() external view returns (uint) {
        if (block.timestamp > votingEndTime) {
            return 0; // Voting has ended
        }
        return votingEndTime - block.timestamp;  // Current time - votingEndTime
    }

    // Get voting status (active or not)
    function isVotingActiveStatus() external view returns (bool) {
        return isVotingActive && block.timestamp < votingEndTime;
    }

    // Get the list of candidates
    function getCandidates() external view returns (string[] memory) {
        return candidates;
    }

    // Get session results by session index
    function getVotingSessionResults(uint sessionIndex) external view returns (VotingSession memory) {
        require(sessionIndex < votingHistory.length, "Invalid session index");
        return votingHistory[sessionIndex];
    }

    function votingHistoryLength() external view returns (uint) {
        return votingHistory.length;
    }

    // Utility function to convert address to string for logging purposes
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);

        str[0] = '0';
        str[1] = 'x';

        for (uint i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }

        return string(str);
    }

    // Utility function to convert uint to string for logging purposes
    function uintToString(uint _value) internal pure returns (string memory) {
        if (_value == 0) {
            return "0";
        }

        uint temp = _value;
        uint length;
        while (temp != 0) {
            length++;
            temp /= 10;
        }

        bytes memory str = new bytes(length);
        while (_value != 0) {
            length -= 1;
            str[length] = bytes1(uint8(48 + _value % 10));
            _value /= 10;
        }

        return string(str);
    }
}
