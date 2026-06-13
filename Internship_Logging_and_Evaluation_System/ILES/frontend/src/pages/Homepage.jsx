import React from "react";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const navigate = useNavigate();
    return (
        <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#0f1117', color: '#fff' }}>
            <div style={{ textAlign: 'center', padding: '4rem 2rem 2rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#378ADD', background: '#0c2340', padding: '4px 14px', borderRadius: '20px' }}>
                    Makerere University · Group 13
                </span>
                <h1 style={{ fontSize: '2.4rem', fontWeight: 500, lineHeight: 1.2, margin: '1.5rem auto 1rem', maxWidth: '560px' }}>
                    Internship <span style={{ color: '#378ADD' }}>Logging</span> &amp; Evaluation System
                </h1>
                <p style={{ fontSize: '1rem', color: '#888', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto 2rem' }}>
                    Track weekly internship logs, supervise students, and evaluate performance — all in one place.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/login')} style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
                        Log in
                    </button>
                    <button onClick={() => navigate('/login#signup')} style={{ background: 'transparent', color: '#fff', border: '1px solid #333', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
                        Register
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', maxWidth: '680px', margin: '3rem auto', padding: '0 2rem' }}>
                {[
                    { icon: '📓', title: 'Weekly logs', desc: 'Submit and track internship activity every week with deadline enforcement.' },
                    { icon: '✅', title: 'Supervisor review', desc: 'Supervisors review, approve, or reject submitted logs.' },
                    { icon: '📊', title: 'Evaluations', desc: 'Structured scoring across punctuality, skills, communication, and initiative.' },
                    { icon: '🔔', title: 'Notifications', desc: 'Real-time alerts keep students and supervisors in sync.' },
                ].map((f, i) => (
                    <div key={i} style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>{f.icon}</div>
                        <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>{f.title}</h3>
                        <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', padding: '1rem 2rem 3rem', color: '#555', fontSize: '13px' }}>
                Designed for student interns · workplace supervisors · academic supervisors · administrators
            </div>
        </div>
    );
}

export default Homepage;