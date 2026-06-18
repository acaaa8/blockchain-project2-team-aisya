import React from 'react';

const AdminPanel = ({ votingOpen, loading, onToggleVoting, onAddCandidate }) => {
  return (
    <div className="admin-panel glass-panel">
      <h3>👑 Panel Panitia</h3>
      {votingOpen && (
        <button
          onClick={onToggleVoting}
          disabled={loading}
          className="btn-danger w-full mb-3"
        >
          Tutup Sesi Voting
        </button>
      )}
      
      <form onSubmit={onAddCandidate} className="add-candidate-form">
        <h4>Tambah Kandidat</h4>
        <input 
          type="text" 
          name="candidateName" 
          placeholder="Nama Kandidat..." 
          disabled={!votingOpen || loading} 
        />
        <button type="submit" disabled={!votingOpen || loading} className="btn-success">
          Tambah
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
