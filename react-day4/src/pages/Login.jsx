import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Users, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { useToast } from '../components/Toast';

export function Login() {
  const [email, setEmail] = useState('admin@talentpulse.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || '/employees';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      addToast('Welcome back, Admin!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@talentpulse.com');
    setPassword('admin123');
    setErrorMsg(null);
  };

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className="brand-icon"
            style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}
          >
            <Users size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Sign in to access your enterprise staff directory
          </p>
        </div>

        {/* Protected route notice if redirected */}
        {location.state?.from && (
          <div
            className="alert alert-info"
            style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}
          >
            Please sign in to view the requested page.
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div
            className="alert alert-danger"
            style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}
            role="alert"
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Work Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@talentpulse.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Helper Pill */}
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <KeyRound size={14} color="var(--primary)" /> Demo Admin Account
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
            >
              Fill Credentials
            </button>
          </div>
          <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
            Email: <strong style={{ color: 'var(--text-main)' }}>admin@talentpulse.com</strong><br />
            Password: <strong style={{ color: 'var(--text-main)' }}>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
