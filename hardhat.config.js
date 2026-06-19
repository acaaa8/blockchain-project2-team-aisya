require("@nomicfoundation/hardhat-toolbox");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Ambil dan bersihkan data (menghapus spasi/baris baru yang tidak sengaja terikut)
const SEPOLIA_URL = process.env.SEPOLIA_URL ? process.env.SEPOLIA_URL.trim() : "";
const PRIVATE_KEY = process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.trim() : "";

console.log("--- PENGECEKAN KONFIGURASI ---");
if (!SEPOLIA_URL) console.log("❌ SEPOLIA_URL Kosong");
if (!PRIVATE_KEY) console.log("❌ PRIVATE_KEY Kosong");

// Cek panjang karakter untuk debug
if (PRIVATE_KEY) {
    // Private key standar (dengan 0x) harusnya 66 karakter
    console.log("Panjang Private Key:", PRIVATE_KEY.length, "karakter");
    if (PRIVATE_KEY.length > 66) console.log("⚠️ Peringatan: Key kamu kepanjangan! Cek apakah ada tanda kutip atau spasi.");
}
console.log("------------------------------");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    sepolia: {
      url: SEPOLIA_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    }
  }
};