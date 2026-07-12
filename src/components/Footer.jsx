import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--color-primary)', 
      color: 'white',
      paddingTop: '5rem',
      paddingBottom: '2rem'
    }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ gap: '4rem', marginBottom: '3rem' }}>
          
          {/* Brand Col */}
          <div>
            <h2 className="font-telugu" style={{ color: 'var(--color-accent)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              కమ్మ విద్యార్థి సహాయ సంఘం
            </h2>
            <p style={{ color: '#cbd5e0', lineHeight: 1.8, marginBottom: '2rem' }}>
              A premium residential facility for boys, providing a secure and nurturing environment for academic excellence.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' 
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}>
                <FaFacebook size={20} />
              </a>
              <a href="#" style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' 
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}>
                <FaInstagram size={20} />
              </a>
            </div>
          </div>



          {/* Contact Col */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Contact Us</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <FaMapMarkerAlt color="var(--color-accent)" size={20} style={{ marginTop: '5px' }} />
                <span style={{ color: '#cbd5e0' }}>
                  సాలిపేట, 4/4 అరండల్ పేట, గుంటూరు, 522001.
                </span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <FaPhoneAlt color="var(--color-accent)" size={18} />
                <span style={{ color: '#cbd5e0' }}>2577606</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <FaEnvelope color="var(--color-accent)" size={18} />
                <span style={{ color: '#cbd5e0' }}>kvssgnt1930@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '2rem', 
          textAlign: 'center',
          color: '#a0aec0',
          fontSize: '0.9rem'
        }}>
          &copy; {new Date().getFullYear()} కమ్మ విద్యార్థి సహాయ సంఘం. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
