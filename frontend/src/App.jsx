import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contract';
import './App.css';

// Import Components
import ConnectWallet from './components/ConnectWallet';
import VotingInfo from './components/VotingInfo';
import AdminPanel from './components/AdminPanel';
import CandidateCard from './components/CandidateCard';
import Toast from './components/Toast';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingOpen, setVotingOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  // UI States
  const [toast, setToast] = useState({ message: '', type: '' });
  const [theme, setTheme] = useState('dark');

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Set default theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  // Connect ke MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        showToast('MetaMask tidak terdeteksi! Silakan install MetaMask.', 'error');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Deteksi Jaringan
      const network = await provider.getNetwork();
      // Misal kita expect localhost 8545 (chain id 31337)
      if (network.chainId !== 31337n) {
        showToast('Peringatan: Kamu tidak berada di jaringan Localhost 8545.', 'error');
      }

      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setAccount(accounts[0]);
      setContract(votingContract);
      showToast('Wallet berhasil terkoneksi!', 'success');

      try {
        const owner = await votingContract.owner();
        setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());
      } catch (err) {
        console.error("Gagal membaca owner", err);
        showToast("Gagal terhubung ke Smart Contract. Pastikan jaringan benar.", "error");
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      showToast('Gagal connect wallet', 'error');
    }
  };

  // Load data dari contract
  const loadContractData = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);

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

      const isActive = await contract.votingActive();
      setVotingOpen(isActive);

      const voted = await contract.hasVoted(account);
      setHasVoted(voted);

    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Gagal memuat data dari blockchain', 'error');
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
      showToast('Transaksi diproses, mohon tunggu...', 'info');
      await tx.wait();

      showToast('Vote berhasil!', 'success');
      await loadContractData();
    } catch (error) {
      console.error('Error voting:', error);
      showToast('Gagal vote: ' + (error.reason || error.message), 'error');
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
          showToast('Menutup sesi voting...', 'info');
          await tx.wait();
          showToast('Voting berhasil ditutup!', 'success');
      } else {
          showToast('Voting tidak bisa dibuka lagi berdasarkan smart contract saat ini.', 'error');
      }

      await loadContractData();
    } catch (error) {
      console.error('Error toggling voting:', error);
      showToast('Gagal mengubah status voting', 'error');
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
      showToast('Menambahkan kandidat...', 'info');
      await tx.wait();
      e.target.reset();
      showToast('Kandidat berhasil ditambahkan!', 'success');
      await loadContractData();
    } catch(err) {
      console.error(err);
      showToast('Gagal tambah kandidat', 'error');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setIsOwner(false);
    setCandidates([]);
    showToast('Wallet disconnected', 'info');
  };

  useEffect(() => {
    if (contract && account) {
      loadContractData();
    }
  }, [contract, account]);

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
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="app">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })} 
      />

      <header>
        <h1>Voting dApp</h1>
        <p>Sistem Pemilihan Terdesentralisasi</p>
      </header>

      <main>
        {!account ? (
          <ConnectWallet onConnect={connectWallet} />
        ) : (
          <div className="voting-section fade-in">
            <div className="dashboard-grid">
              <VotingInfo 
                account={account}
                votingOpen={votingOpen}
                totalVotes={totalVotes}
                hasVoted={hasVoted}
                onDisconnect={disconnectWallet}
              />

              {isOwner && (
                <AdminPanel 
                  votingOpen={votingOpen}
                  loading={loading}
                  onToggleVoting={toggleVoting}
                  onAddCandidate={handleAddCandidate}
                />
              )}
            </div>

            <h2 className="section-title">Kandidat Pemilihan</h2>

            <div className="candidates-grid">
              {loading && candidates.length === 0 ? (
                // Tampilkan Skeleton jika sedang loading dan data kosong
                [1, 2, 3].map((n) => <CandidateCard key={n} isSkeleton={true} />)
              ) : candidates.length === 0 ? (
                <p className="no-data" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Belum ada kandidat yang terdaftar.</p>
              ) : (
                candidates.map((candidate) => (
                  <CandidateCard 
                    key={candidate.id}
                    candidate={candidate}
                    totalVotes={totalVotes}
                    hasVoted={hasVoted}
                    votingOpen={votingOpen}
                    loading={loading}
                    onVote={voteForCandidate}
                  />
                ))
              )}
            </div>
            
            {loading && candidates.length > 0 && (
              <div className="loading-spinner" style={{ marginTop: '30px' }}>
                <div className="spinner"></div>
                <p>Memproses data ke Blockchain...</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>Tugas Final Project - Teknologi Blockchain</p>
        <p className="credit">Kelompok XYZ</p>
      </footer>
    </div>
  );
}

export default App;
