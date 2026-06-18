import React from 'react';

const CandidateCard = ({ 
  candidate, 
  totalVotes, 
  hasVoted, 
  votingOpen, 
  loading, 
  onVote,
  isSkeleton = false
}) => {
  if (isSkeleton) {
    return (
      <div className="candidate-card glass-panel skeleton-card">
        <div className="skeleton-avatar skeleton"></div>
        <div className="skeleton-title skeleton"></div>
        <div className="skeleton-text skeleton"></div>
        <div className="skeleton-progress skeleton"></div>
        <div className="skeleton-button skeleton"></div>
      </div>
    );
  }

  const percentage = totalVotes > 0 
    ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) 
    : 0;

  return (
    <div className="candidate-card glass-panel fade-in">
      <div className="candidate-avatar">{candidate.name.charAt(0).toUpperCase()}</div>
      <h3>{candidate.name}</h3>
      <p className="vote-count">{candidate.voteCount} Suara</p>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="progress-text">{percentage}%</span>
      </div>

      <button
        onClick={() => onVote(candidate.id)}
        disabled={hasVoted || !votingOpen || loading}
        className={`btn-vote ${hasVoted || !votingOpen ? 'btn-disabled' : ''}`}
      >
        {hasVoted ? 'Sudah Vote' : !votingOpen ? 'Voting Tutup' : 'Pilih Kandidat'}
      </button>
    </div>
  );
};

export default CandidateCard;
