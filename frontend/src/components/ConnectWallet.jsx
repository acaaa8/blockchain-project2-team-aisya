import React from 'react';

const ConnectWallet = ({ onConnect }) => {
  return (
    <div className="connect-section fade-in">
      <div className="hero-icon">🗳️</div>
      <h2>Selamat Datang di Voting dApp</h2>
      <p>Silakan connect MetaMask kamu untuk berpartisipasi dalam pemilihan.</p>
      <button onClick={onConnect} className="btn-primary pulse-effect">
        Connect MetaMask
      </button>
    </div>
  );
};

export default ConnectWallet;
