# Simple Voting Smart Contract (Project 2)

## Deskripsi Proyek
Proyek ini adalah implementasi **Smart Contract Voting Sederhana** yang berjalan di atas jaringan Ethereum (EVM). Sistem ini dirancang untuk menyediakan kotak suara digital yang transparan, terdesentralisasi, aman, dan anti-manipulasi. 

Sistem ini memastikan bahwa setiap pemilih hanya dapat memberikan satu suara secara unik menggunakan identitas dompet Web3 mereka (MetaMask) tanpa perlu menggunakan sistem database eksternal terpusat. Proyek ini dibangun menggunakan framework **Solidity** dan **Hardhat** versi 2.

| Name                          | NRP                              | Role        |
|-------------------------------|-----------------------------------|------------|
| Fadlillah Cantika Sari Hermawan     | 5027231042             | Orang Pertama-Smart Contract Developer |
|   Callista Meyra Azizah |   5027231060 | Orang Kedua-QA / Unit Tester |
|      Aisyah Rahmasari      |   5027231072                |  Orang Ketiga-Deployment & Dokumentasi  |


## Fitur Smart Contract
### Fitur Wajib (Mandatory):
*   **Registrasi Kandidat:** Owner (panitia) dapat mendaftarkan nama-nama kandidat secara dinamis.
*   **Sistem Satu Suara (One Vote per Wallet):** Menjamin setiap alamat dompet hanya bisa memilih sekali (mencegah *double voting*).
*   **Pencatatan Hasil:** Hasil voting tersimpan aman di blockchain dan dapat dilihat secara transparan oleh siapa saja.
*   **Event Log:** Memicu sinyal event (`CandidateAdded`, `Voted`, `VotingClosed`) untuk kebutuhan pelacakan riwayat transaksi.

### Fitur Bonus (Implemented):
*   **Dinamis & Bebas Hardcode:** Durasi voting ditentukan secara dinamis dalam hitungan menit saat proses *deployment*.
*   **Voting Deadline (Batas Waktu Otomatis):** Voting otomatis tertutup secara sistem sistemis jika waktu blockchain (`block.timestamp`) telah melewati batas waktu yang ditentukan.
*   **Fungsi Sisa Waktu:** Menyediakan fungsi eksternal (`getRemainingTime`) untuk memeriksa sisa durasi pemilihan secara transparan.
