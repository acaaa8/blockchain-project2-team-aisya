import React from 'react';

const VotingInfo = ({ account, owner, votingOpen, totalVotes, hasVoted, onDisconnect }) => {
  return (
    <div className="info-box glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Informasi Pemilih</h3>
        <button onClick={onDisconnect} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Disconnect</button>
      </div>
      <p><strong>Wallet:</strong> <span className="highlight">{account.slice(0, 6)}...{account.slice(-4)}</span></p>
      <p><strong>Alamat Admin:</strong> <span className="highlight">{owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : 'Memuat...'}</span></p>
      <p><strong>Status:</strong> {votingOpen ? <span className="status-open">🟢 Voting Aktif</span> : <span className="status-closed">🔴 Voting Ditutup</span>}</p>
      <p><strong>Total Suara Masuk:</strong> <span className="highlight">{totalVotes}</span></p>
      {hasVoted && <div className="voted-badge">✓ Anda sudah melakukan voting</div>}
    </div>
  );
};

export default VotingInfo;
