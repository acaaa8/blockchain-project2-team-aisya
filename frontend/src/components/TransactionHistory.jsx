import React from "react";

const TransactionHistory = ({ transactions }) => {
  return (
    <div className="transaction-history-card" style={{
      marginTop: '40px',
      backgroundColor: '#151f32', // Biru gelap menyatu dengan background dApp Anda
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      border: '1px solid #1e293b',
      textAlign: 'left', // Memaksa perataan kiri agar rapi
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxSizing: 'border-box'
    }}>
      {/* Bagian Header Komponen */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '12px'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: '#ffffff',
          margin: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Riwayat Aktivitas Voting
        </h3>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#34d399', // Warna hijau emerald menyala
          backgroundColor: 'rgba(52, 211, 153, 0.1)',
          padding: '4px 12px',
          borderRadius: '9999px'
        }}>
          Live On-Chain
        </span>
      </div>

      {/* Bagian List Skenario Riwayat */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {transactions.length === 0 ? (
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            margin: '20px 0',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            Belum ada transaksi voting terdeteksi di sesi ini...
          </p>
        ) : (
          transactions.map((tx, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#1b253b', // Warna baris list
                borderRadius: '8px',
                border: '1px solid #22304e',
                fontSize: '0.9rem',
                boxSizing: 'border-box'
              }}
            >
              {/* Sisi Kiri: ID & Alamat Pemilih */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontWeight: '700',
                  color: '#475569'
                }}>
                  #{index + 1}
                </span>
                <span style={{
                  fontFamily: 'monospace',
                  color: '#818cf8', // Warna ungu indigo terang khas dompet address
                  fontWeight: '500'
                }}>
                  {tx.voter.substring(0, 6)}...{tx.voter.substring(tx.voter.length - 4)}
                  {tx.isCurrentUser && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: '#06b6d4', // Cyan
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Anda
                    </span>
                  )}
                </span>
              </div>

              {/* Sisi Kanan: Pilihan & Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#e2e8f0',
                  backgroundColor: '#334155',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  Kandidat #{tx.candidateId}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: '#34d399',
                  fontWeight: '500'
                }}>
                  <span style={{
                    height: '8px',
                    width: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#34d399'
                  }}></span>
                  Berhasil
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;