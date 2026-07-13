import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [content, setContent] = useState({
    title: 'Photo Gallery',
    subtitle: 'Glimpses of our hostels, events, and activities.',
    images: Array(6).fill(null).map((_, i) => `https://via.placeholder.com/400x300?text=Gallery+Image+${i + 1}`)
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pages'));
        querySnapshot.forEach((doc) => {
          if (doc.id === 'gallery' || doc.data().page_name === 'gallery') {
            setContent(JSON.parse(doc.data().content));
          }
        });
      } catch (err) { console.error(err); }
    };
    fetchContent();
  }, []);

  return (
    <div className="section" style={{ background: 'var(--color-bg)', minHeight: '80vh' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">{content.title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
          {content.images && content.images.map((src, idx) => (
            <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
              <img src={src} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} 
                   onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
