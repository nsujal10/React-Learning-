import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Sun,
  Moon,
  Database,
  Cpu,
  Layers,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { resetEmployeesDatabase } from '../api/employees';
import { useQueryClient } from '@tanstack/react-query';
import { employeeKeys } from '../features/employees/useEmployees';
import { useToast } from './Toast';

export const AppLayout: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const handleResetData = () => {
    if (window.confirm('Reset all employee records to seed database?')) {
      resetEmployeesDatabase();
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      addToast('Mock employee database restored to initial seed state!', 'success');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="brand" aria-label="NexusHR Home">
            <div className="brand-icon">
              <Cpu size={20} />
            </div>
            <span>
              Nexus<span style={{ color: 'var(--primary)' }}>HR</span>
            </span>
          </NavLink>

          <nav className="nav-links" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/employees"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Users size={16} />
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Reset Database Tool */}
            <button
              type="button"
              onClick={handleResetData}
              className="btn btn-secondary btn-sm"
              title="Reset mock database to initial seed"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Database size={14} />
              <span className="btn-text-hide-mobile">Reset DB</span>
            </button>

            {/* Theme Toggle Button (Light/Dark via Context API) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-secondary btn-icon-only btn-sm"
              title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle visual theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun size={16} color="#fbbf24" />
              ) : (
                <Moon size={16} color="#6366f1" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} color="var(--primary)" />
            <span>NexusHR Intelligence Enterprise &bull; React 19 + TypeScript + TanStack Query v5 + Zustand</span>
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            Optimistic Updates &bull; Runtime Zod Schema Validation &bull; Request Cancellation
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
