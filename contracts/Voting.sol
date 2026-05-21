// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public owner;
    uint256 public candidatesCount;
    bool public votingActive;
    uint256 public votingDeadline;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint256 indexed candidateId, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event VotingClosed();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier isVotingActive() {
        require(votingActive == true, "Voting is already closed manually");
        require(block.timestamp < votingDeadline, "Voting deadline has passed!");
        _;
    }

    constructor(uint256 _durationInMinutes) {
        owner = msg.sender;
        votingActive = true;
        votingDeadline = block.timestamp + (_durationInMinutes * 1 minutes); 
    }

    function addCandidate(string memory _name) external onlyOwner isVotingActive {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function vote(uint256 _candidateId) external isVotingActive {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }

    function closeVoting() external onlyOwner {
        votingActive = false;
        emit VotingClosed();
    }

    function getCandidate(uint256 _candidateId) external view returns (uint256 id, string memory name, uint256 voteCount) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Candidate does not exist");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getRemainingTime() external view returns (uint256) {
        if (block.timestamp >= votingDeadline || !votingActive) {
            return 0;
        }
        return votingDeadline - block.timestamp;
    }
}