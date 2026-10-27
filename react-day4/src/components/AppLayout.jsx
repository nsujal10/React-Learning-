import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, UserPlus, LogOut, Database, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { resetEmployeesToDefault } from '../api/employees';
import { useToast } from './Toast';

export function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all employee records to default seed data?')) {
      resetEmployeesToDefault();
      addToast('Employee database restored to initial state!', 'success');
      // Trigger a page refresh or route re-render
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="navbar-inner">
          <NavLink to="/employees" className="brand" aria-label="TalentPulse Home">
            <div className="brand-icon">
              <Users size={20} />
            </div>
            <span>Talent<span style={{ color: 'var(--primary)' }}>Pulse</span></span>
          </NavLink>

          <nav className="nav-links" aria-label="Primary navigation">
            <NavLink
              to="/employees"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Briefcase size={16} />
              <span>Directory</span>
            </NavLink>

            <NavLink
              to="/employees/new"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <UserPlus size={16} />
              <span>Add Employee</span>
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick Demo Reset DB Tool */}
            <button
              type="button"
              onClick={handleResetData}
              title="Reset mock database to initial seed data"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Database size={14} />
              <span style={{ fontSize: '0.8rem' }}>Reset DB</span>
            </button>

            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="user-badge" title={`Signed in as ${user.email}`}>
                  <div className="user-avatar-small">
                    {user.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.825rem' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                    Admin
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary btn-icon-only btn-sm"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-primary btn-sm">
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span>TalentPulse Enterprise HRM &middot; React 19 + React Router + Zod + REST</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Search, Sorting, Pagination &amp; Forms with Server Validation
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
