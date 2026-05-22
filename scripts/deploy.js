const hre = require("hardhat");

async function main() {
  console.log("Mulai melakukan deployment smart contract Voting...");

  // Deploy dengan durasi default 20 menit
  const durationInMinutes = 20;
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(durationInMinutes);

  // Tunggu deployment selesai
  await voting.waitForDeployment();

  // Ambil address contract
  const address = await voting.getAddress();

  console.log("=========================================");
  console.log(`Voting Smart Contract BERHASIL dideploy!`);
  console.log(`Address Kontrak     : ${address}`);
  console.log(`Durasi Voting (Mnt) : ${durationInMinutes} menit`);
  console.log(`Owner/Panitia       : ${await voting.owner()}`);
  console.log("=========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
