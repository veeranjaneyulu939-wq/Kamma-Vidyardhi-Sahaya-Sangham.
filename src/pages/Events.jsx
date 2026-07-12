import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/events`);
      const data = await res.json();
      
      if (res.ok) {
        setEvents(data);
      } else {
        setError(data.error || 'Failed to load events');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ background: 'var(--color-bg)', minHeight: '80vh' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">Latest News & Events</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            Stay updated with the latest happenings, meetings, and celebrations at Kamma Vidyarthi Sahaya Sangam.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            No upcoming events at the moment. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
            {events.map((event) => (
              <div key={event.id} className="card" style={{ padding: '2rem', transition: 'var(--transition)' }} 
                   onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                
                {event.image && (
                  <div style={{ width: '100%', height: '250px', marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>{event.title}</h3>
                
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCalendarAlt color="var(--color-accent)" />
                    <span>{event.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaMapMarkerAlt color="var(--color-accent)" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p style={{ lineHeight: 1.7, color: 'var(--color-text)' }}>
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
