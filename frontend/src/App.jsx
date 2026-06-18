import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contract';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  // Connect ke MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask tidak terdeteksi! Silakan install MetaMask.');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setAccount(accounts[0]);
      setContract(votingContract);

      try {
        // Cek apakah user adalah owner
        const owner = await votingContract.owner();
        setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());
      } catch (err) {
        console.error("Gagal membaca owner. Pastikan MetaMask di jaringan Localhost 8545!", err);
        alert("Gagal terhubung ke Smart Contract! Pastikan MetaMask kamu berada di jaringan 'Localhost 8545' dan contract address sudah benar.");
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Load data dari contract
  const loadContractData = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);

      // Get semua kandidat
      // Note: Contract original doesn't have getAllCandidates, we have to loop 1 by 1
      const count = await contract.candidatesCount();
      const formattedCandidates = [];
      
      let total = 0;
      for (let i = 1; i <= count; i++) {
        const c = await contract.getCandidate(i);
        const voteCountNum = Number(c.voteCount);
        total += voteCountNum;
        formattedCandidates.push({
          id: Number(c.id),
          name: c.name,
          voteCount: voteCountNum
        });
      }
      
      setCandidates(formattedCandidates);
      setTotalVotes(total);

      // Cek status voting
      const isActive = await contract.votingActive();
      setVotingOpen(isActive);

      // Cek apakah user sudah vote
      const voted = await contract.hasVoted(account);
      setHasVoted(voted);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vote untuk kandidat
  const voteForCandidate = async (candidateId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.vote(candidateId);
      await tx.wait();

      alert('Vote berhasil!');
      await loadContractData();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Gagal vote: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Toggle status voting (owner only)
  const toggleVoting = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      if (votingOpen) {
          const tx = await contract.closeVoting();
          await tx.wait();
      } else {
          alert('Voting tidak bisa dibuka lagi berdasarkan smart contract saat ini.');
      }

      await loadContractData();
    } catch (error) {
      console.error('Error toggling voting:', error);
      alert('Gagal mengubah status voting');
    } finally {
      setLoading(false);
    }
  };

  // Add Candidate (owner only)
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!contract) return;
    const name = e.target.candidateName.value;
    if (!name) return;

    try {
      setLoading(true);
      const tx = await contract.addCandidate(name);
      await tx.wait();
      e.target.reset();
      await loadContractData();
    } catch(err) {
      console.error(err);
      alert('Gagal tambah kandidat');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setIsOwner(false);
    setCandidates([]);
  };

  // Load data ketika contract atau account berubah
  useEffect(() => {
    if (contract && account) {
      loadContractData();
    }
  }, [contract, account]);

   // Real-time Event Listener: Mendeteksi jika ada orang lain yang vote
  useEffect(() => {
    if (contract) {
      const onVoted = (candidateId) => {
        console.log("Ada suara baru masuk untuk kandidat ID:", candidateId);
        // Refresh data secara otomatis agar angka di UI berubah real-time
        loadContractData(); 
      };

      // Memasang listener
      contract.on("Voted", onVoted);

      // Cleanup function: Menghapus listener saat komponen tidak digunakan
      // Agar tidak terjadi memory leak atau listener ganda
      return () => {
        contract.off("Voted", onVoted);
      };
    }
  }, [contract]); 
  
  // Listen untuk perubahan account
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
        }
      });
    }
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Voting dApp</h1>
        <p>Sistem Pemilihan Terdesentralisasi</p>
      </header>

      <main>
        {!account ? (
          <div className="connect-section">
            <div className="hero-icon">🗳️</div>
            <h2>Selamat Datang di Voting dApp</h2>
            <p>Silakan connect MetaMask kamu untuk berpartisipasi dalam pemilihan.</p>
            <button onClick={connectWallet} className="btn-primary pulse-effect">
              Connect MetaMask
            </button>
          </div>
        ) : (
          <div className="voting-section fade-in">
            <div className="dashboard-grid">
              <div className="info-box glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                  <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Informasi Pemilih</h3>
                  <button onClick={disconnectWallet} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Disconnect</button>
                </div>
                <p><strong>Wallet:</strong> <span className="highlight">{account.slice(0, 6)}...{account.slice(-4)}</span></p>
                <p><strong>Status:</strong> {votingOpen ? <span className="status-open">🟢 Voting Aktif</span> : <span className="status-closed">🔴 Voting Ditutup</span>}</p>
                <p><strong>Total Suara Masuk:</strong> <span className="highlight">{totalVotes}</span></p>
                {hasVoted && <div className="voted-badge">✓ Anda sudah melakukan voting</div>}
              </div>

              {isOwner && (
                <div className="admin-panel glass-panel">
                  <h3>👑 Panel Panitia</h3>
                  {votingOpen && (
                    <button
                      onClick={toggleVoting}
                      disabled={loading}
                      className="btn-danger w-full mb-3"
                    >
                      Tutup Sesi Voting
                    </button>
                  )}
                  
                  <form onSubmit={handleAddCandidate} className="add-candidate-form">
                    <h4>Tambah Kandidat</h4>
                    <input type="text" name="candidateName" placeholder="Nama Kandidat..." disabled={!votingOpen || loading} />
                    <button type="submit" disabled={!votingOpen || loading} className="btn-success">Tambah</button>
                  </form>
                </div>
              )}
            </div>

            <h2 className="section-title">Kandidat Pemilihan</h2>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Memproses data ke Blockchain...</p>
              </div>
            ) : (
              <div className="candidates-grid">
                {candidates.length === 0 ? (
                  <p className="no-data">Belum ada kandidat yang terdaftar.</p>
                ) : candidates.map((candidate) => (
                  <div key={candidate.id} className="candidate-card glass-panel">
                    <div className="candidate-avatar">{candidate.name.charAt(0)}</div>
                    <h3>{candidate.name}</h3>
                    <p className="vote-count">{candidate.voteCount} Suara</p>
                    
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{
                            width: totalVotes > 0
                              ? `${(candidate.voteCount / totalVotes) * 100}%`
                              : '0%'
                          }}
                        />
                      </div>
                      <span className="progress-text">
                        {totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                      </span>
                    </div>

                    <button
                      onClick={() => voteForCandidate(candidate.id)}
                      disabled={hasVoted || !votingOpen || loading}
                      className={`btn-vote ${hasVoted ? 'btn-disabled' : ''}`}
                    >
                      {hasVoted ? 'Sudah Vote' : 'Pilih Kandidat'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>Tugas Final Project - Teknologi Blockchain</p>
        <p className="credit">Anggota 1, 2, 3</p>
      </footer>
    </div>
  );
}

export default App;
