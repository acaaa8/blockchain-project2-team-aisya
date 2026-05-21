const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting;
  let voting;
  let owner;
  let addr1;
  let addr2;
  const DURATION_MINUTES = 20; 

  beforeEach(async function () {
    // 1. Ambil akun testing
    [owner, addr1, addr2] = await ethers.getSigners();

    // 2. Load contract
    Voting = await ethers.getContractFactory("Voting");
    
    // 3. Deploy dengan argumen durasi (sesuai constructor: _durationInMinutes)
    voting = await Voting.deploy(DURATION_MINUTES);
  });

  describe("A. Deployment & Initial State", function () {
    it("1. Harus set up owner dengan benar", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("2. Status votingActive harus true di awal", async function () {
      expect(await voting.votingActive()).to.equal(true);
    });

    it("3. Fungsi getRemainingTime harus mengembalikan waktu > 0", async function () {
      const remaining = await voting.getRemainingTime();
      expect(remaining).to.be.gt(0);
    });
  });

  describe("B. Candidate Management (Access Control)", function () {
    it("4. Owner bisa menambah kandidat & memicu event CandidateAdded", async function () {
      await expect(voting.connect(owner).addCandidate("Kandidat A"))
        .to.emit(voting, "CandidateAdded")
        .withArgs(1, "Kandidat A");
      
      expect(await voting.candidatesCount()).to.equal(1);
    });

    it("5. Gagal jika non-owner mencoba menambah kandidat", async function () {
      await expect(
        voting.connect(addr1).addCandidate("Kandidat Ilegal")
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("6. Gagal menambah kandidat dengan nama kosong", async function () {
      await expect(
        voting.connect(owner).addCandidate("")
      ).to.be.revertedWith("Candidate name cannot be empty");
    });
  });

  describe("C. Voting Process", function () {
    beforeEach(async function () {
      // Tambahkan satu kandidat untuk bahan voting
      await voting.addCandidate("Alice");
    });

    it("7. Berhasil melakukan vote & memicu event Voted", async function () {
      await expect(voting.connect(addr1).vote(1))
        .to.emit(voting, "Voted")
        .withArgs(addr1.address, 1);

      const candidate = await voting.getCandidate(1);
      expect(candidate.voteCount).to.equal(1);
    });

    it("8. Gagal jika user mencoba vote dua kali", async function () {
      await voting.connect(addr1).vote(1); // Vote pertama
      await expect(
        voting.connect(addr1).vote(1) // Vote kedua
      ).to.be.revertedWith("You have already voted");
    });

    it("9. Gagal jika vote ke ID kandidat yang tidak terdaftar", async function () {
      await expect(
        voting.connect(addr1).vote(99)
      ).to.be.revertedWith("Invalid candidate ID");
    });
  });

  describe("D. Manual Closure", function () {
    it("10. Voting tidak bisa dilakukan setelah ditutup secara manual oleh owner", async function () {
      await voting.addCandidate("Bob");
      
      // Tutup voting
      await voting.connect(owner).closeVoting();
      expect(await voting.votingActive()).to.equal(false);

      // Coba vote (harus gagal karena isVotingActive)
      await expect(
        voting.connect(addr2).vote(1)
      ).to.be.revertedWith("Voting is already closed manually");
    });
  });
});