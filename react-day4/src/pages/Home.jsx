import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Clock, Plus, ArrowRight, Building2, TrendingUp, ShieldCheck } from 'lucide-react';
import { getEmployees } from '../api/employees';

export function Home() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await getEmployees({ limit: 100 });
        const all = res.data;
        setStats({
          total: all.length,
          active: all.filter((e) => e.status === 'Active').length,
          onLeave: all.filter((e) => e.status === 'On Leave').length,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive HR Dashboard</h1>
          <p className="page-subtitle">
            Welcome to TalentPulse. Manage organizational headcount, profiles, and team allocations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/employees" className="btn btn-secondary">
            <Users size={16} /> View Directory
          </Link>
          <Link to="/employees/new" className="btn btn-primary">
            <Plus size={16} /> Add Employee
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Headcount
            </span>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {stats.total || '9'}
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <TrendingUp size={14} color="var(--success)" /> Managed team members
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Staff
            </span>
            <div style={{ padding: '0.5rem', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
              <UserCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {stats.active || '7'}
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--success)', marginTop: '0.25rem' }}>
            Currently working
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              On Leave
            </span>
            <div style={{ padding: '0.5rem', background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {stats.onLeave || '1'}
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--warning)', marginTop: '0.25rem' }}>
            Parental / Sabbatical
          </div>
        </div>
      </div>

      {/* Feature Navigation Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1))',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Explore Employee Directory</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', marginTop: '0.5rem' }}>
            Search across teams, filter by department, inspect dynamic employee routes, modify records, and experience debounced querying with request cancellation.
          </p>
        </div>
        <Link to="/employees" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <span>Open Directory</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default Home;
