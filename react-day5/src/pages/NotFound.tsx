import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div className="card" style={{ maxWidth: '520px', padding: '3rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--warning-bg)',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>404 - Path Not Found</h1>

        <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          The path <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{location.pathname}</code> does not exist in the NexusHR intelligence system.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <Link to="/employees" className="btn btn-primary">
            <Home size={16} /> Return to Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
