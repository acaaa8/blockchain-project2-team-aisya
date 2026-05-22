const hre = require("hardhat");

async function main() {
  // Masukkan alamat kontrak hasil deployment Anda di sini
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  console.log("==================================================");
  console.log("Mulai Interaksi Programmatic dengan Kontrak Voting");
  console.log(`Alamat Kontrak: ${contractAddress}`);
  console.log("==================================================\n");

  // Ambil contract instance
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = Voting.attach(contractAddress);

  // Ambil signers (akun test)
  const [owner, voter1, voter2] = await hre.ethers.getSigners();

  // 1. MEMBACA STATE AWAL
  console.log("--- 1. MEMBACA STATE AWAL ---");
  console.log(`Owner Kontrak      : ${await voting.owner()}`);
  console.log(`Status Voting Aktif: ${await voting.votingActive()}`);
  
  const remainingTime = await voting.getRemainingTime();
  console.log(`Sisa Waktu Voting  : ${remainingTime} detik`);
  
  const initialCandidatesCount = await voting.candidatesCount();
  console.log(`Jumlah Kandidat Awal: ${initialCandidatesCount}`);
  console.log("-------------------------------------------\n");

  // 2. MELAKUKAN MINIMAL 2 TRANSAKSI
  console.log("--- 2. MELAKUKAN TRANSAKSI (INTERAKSI) ---");

  // Transaksi 1: Owner mendaftarkan Kandidat Baru
  console.log("Transaksi 1: Mendaftarkan kandidat 'Alice' oleh Owner...");
  const tx1 = await voting.connect(owner).addCandidate("Alice");
  await tx1.wait();
  console.log(`[SUKSES] Transaksi 1 Hash: ${tx1.hash}`);

  // Transaksi 2: Pemilih melakukan vote untuk kandidat 1
  console.log("Transaksi 2: Voter1 memberikan suara untuk Alice (Kandidat ID: 1)...");
  const tx2 = await voting.connect(voter1).vote(1);
  await tx2.wait();
  console.log(`[SUKSES] Transaksi 2 Hash: ${tx2.hash}`);
  console.log("-------------------------------------------\n");

  // 3. MEMBACA STATE AKHIR
  console.log("--- 3. MEMBACA STATE AKHIR ---");
  const finalCandidatesCount = await voting.candidatesCount();
  console.log(`Jumlah Kandidat Akhir: ${finalCandidatesCount}`);

  // Ambil detail kandidat ID 1
  const candidate = await voting.getCandidate(1);
  console.log(`Detail Kandidat ID 1 : Nama: ${candidate.name}, Jumlah Suara: ${candidate.voteCount}`);

  // Cek apakah voter1 terdaftar telah memilih
  const hasVotedStatus = await voting.hasVoted(voter1.address);
  console.log(`Apakah Voter1 sudah memilih? ${hasVotedStatus}`);
  console.log("==================================================");
  console.log("Interaksi selesai dengan sukses!");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
