import React from 'react';
import { FaHeart, FaUniversity, FaMobileAlt } from 'react-icons/fa';

const Donate = () => {
  return (
    <div className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">Support Our Cause</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            Your generous contributions help us provide better facilities and opportunities for our students. Every donation makes a significant impact on their future.
          </p>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
          <div className="card" style={{ padding: '3rem', borderTop: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
              <FaUniversity size={32} style={{ marginRight: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem' }}>Bank Transfer</h3>
            </div>
            <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>You can directly transfer your donation to our bank account.</p>
            <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
              <p><strong>Account Name:</strong> Kamma Vidyardhi Sahaya Sangham</p>
              <p><strong>Account Number:</strong> XXXXX XXXXX XXXXX</p>
              <p><strong>IFSC Code:</strong> XXXX0000000</p>
              <p><strong>Bank Name:</strong> Example Bank, Vijayawada Branch</p>
            </div>
          </div>

          <div className="card" style={{ padding: '3rem', borderTop: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: '#10b981' }}>
              <FaMobileAlt size={32} style={{ marginRight: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem' }}>UPI / Online Payment</h3>
            </div>
            <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Scan the QR code below or use our UPI ID to donate instantly.</p>
            <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid #eee' }}>
              <div style={{ width: '150px', height: '150px', background: '#ccc', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                QR Code Here
              </div>
              <p><strong>UPI ID:</strong> kvssvja1910@upi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
