import React, { useEffect, useState } from 'react';

const ManagementCommittee = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:5000';
            try {
                const res = await fetch(`${apiUrl}/api/pages/management-committee`);
                if (res.ok) {
                    const data = await res.json();
                    setPageData(data);
                }
            } catch (error) {
                console.error("Failed to load content", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) return <div className="section container text-center">Loading...</div>;
    if (!pageData) return <div className="section container text-center">Content not found.</div>;

    return (
        <section className="section" style={{ minHeight: '80vh', background: 'var(--color-bg)' }}>
            <div className="container">
                <div className="text-center" style={{ marginBottom: '3rem' }}>
                    <h2 className="section-title" style={{ display: 'inline-block' }}>{pageData.title}</h2>
                    {pageData.subtitle && <p style={{ fontSize: '1.2rem', color: '#64748b', marginTop: '1rem' }}>{pageData.subtitle}</p>}
                </div>
                
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {pageData.profiles && pageData.profiles.map((profile, index) => (
                        <div key={index} className="card animate-fade-in" style={{ padding: '2rem', textAlign: 'center', transitionDelay: `${index * 100}ms` }}>
                            {profile.image ? (
                                <img src={profile.image} alt={profile.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem', border: '4px solid var(--color-surface)' }} />
                            ) : (
                                <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#94a3b8' }}>
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{profile.name}</h3>
                            <h4 style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{profile.role}</h4>
                            <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>{profile.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ManagementCommittee;
