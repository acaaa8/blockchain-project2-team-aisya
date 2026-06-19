const hre = require("hardhat");

async function main() {
  // Alamat kontrak lokal Anda
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Ambil instance kontrak Voting yang sudah ter-deploy
  const Voting = await hre.ethers.getContractAt("Voting", contractAddress);
  
  console.log("Memulai pendaftaran kandidat via CMD...");

  // Daftarkan Kandidat 1
  const tx1 = await Voting.addCandidate("Cantika");
  await tx1.wait();
  console.log("✅ Kandidat 1 'Cantika' sukses didaftarkan!");

  // Daftarkan Kandidat 2
  const tx2 = await Voting.addCandidate("Rara");
  await tx2.wait();
  console.log("✅ Kandidat 2 'Rara' sukses didaftarkan!");

  // Daftarkan Kandidat 3
  const tx3 = await Voting.addCandidate("Arya");
  await tx3.wait();
  console.log("✅ Kandidat 3 'Arya' sukses didaftarkan!");
  
  console.log("\n=========================================");
  console.log("SELESAI! Silakan segarkan (refresh) halaman Vercel Anda!");
  console.log("=========================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});