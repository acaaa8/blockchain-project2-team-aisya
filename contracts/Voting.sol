// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    // 1. Struktur Data Kandidat
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // 2. State Variables (Sekarang ada 4 - Melebihi syarat minimal 3)
    address public owner;
    uint256 public candidatesCount;
    bool public votingActive;
    uint256 public votingDeadline; // Fitur Bonus: Menyimpan waktu Unix Timestamp kapan voting berakhir

    // 3. Mappings (Ada 2 - Melebihi syarat minimal 1)
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    // 4. Events (Ada 3 - Melebihi syarat minimal 2)
    event CandidateAdded(uint256 indexed candidateId, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event VotingClosed();

    // 5. Modifiers (Ada 2 - Melebihi syarat minimal 1)
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier isVotingActive() {
        require(votingActive == true, "Voting is already closed manually");
        require(block.timestamp < votingDeadline, "Voting deadline has passed!"); // Fitur Bonus: Cek batas waktu
        _;
    }

    // 6. Constructor (Sekarang dinamis menerima input durasi dalam menit saat deploy)
    constructor(uint256 _durationInMinutes) {
        owner = msg.sender;
        votingActive = true;
        // block.timestamp adalah waktu detik saat ini di blockchain
        votingDeadline = block.timestamp + (_durationInMinutes * 1 minutes); 
    }

    // 7. Functions (Ada 5 - Melebihi syarat minimal 4)
    
    // Fungsi 1: Menambah kandidat baru (Hanya Owner)
    function addCandidate(string memory _name) external onlyOwner isVotingActive {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        
        emit CandidateAdded(candidatesCount, _name);
    }

    // Fungsi 2: Memberikan suara/vote (Siapa saja, hanya 1 kali, sebelum deadline)
    function vote(uint256 _candidateId) external isVotingActive {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    // Fungsi 3: Menutup sesi voting secara manual sebelum deadline (Hanya Owner)
    function closeVoting() external onlyOwner {
        votingActive = false;
        emit VotingClosed();
    }

    // Fungsi 4: Mengambil data kandidat berdasarkan ID
    function getCandidate(uint256 _candidateId) external view returns (uint256 id, string memory name, uint256 voteCount) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Candidate does not exist");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    // Fungsi 5 (Tambahan): Memeriksa sisa waktu voting dalam detik (View Function)
    function getRemainingTime() external view returns (uint256) {
        if (block.timestamp >= votingDeadline || !votingActive) {
            return 0;
        }
        return votingDeadline - block.timestamp;
    }
}