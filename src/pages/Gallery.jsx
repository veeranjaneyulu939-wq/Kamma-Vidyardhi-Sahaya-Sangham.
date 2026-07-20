import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Gallery = () => {
  const [content, setContent] = useState({
    title: 'Photo Gallery',
    subtitle: 'Glimpses of our hostels, events, and activities.',
    images: []
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'gallery_photos'));
        const data = [];
        querySnapshot.forEach(doc => data.push({id: doc.id, ...doc.data()}));
        setPhotos(data.reverse());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPhotos();
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

        {loading ? <p className="text-center">Loading gallery...</p> : (
          <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
            {photos.length > 0 ? photos.map((photo) => (
              <div key={photo.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                <img src={photo.imageUrl} alt={photo.title || 'Gallery image'} style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} 
                     onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                {photo.title && photo.title !== 'Untitled' && <p style={{ padding: '0.5rem', textAlign: 'center', margin: 0, fontWeight: 'bold' }}>{photo.title}</p>}
              </div>
            )) : <p className="text-center" style={{ gridColumn: 'span 3', color: '#718096' }}>No photos have been uploaded yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
