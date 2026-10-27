import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  DollarSign,
  Star,
  Plus,
  ArrowRight,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useEmployeesQuery } from '../features/employees/useEmployees';
import LoadingState from '../components/LoadingState';
import { StatusBadge } from '../components/Badge';

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useEmployeesQuery({ limit: 100 });
  const employees = data?.data || [];

  if (isLoading) {
    return <LoadingState message="Aggregating enterprise workforce intelligence..." />;
  }

  const total = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;
  const highPerformers = employees.filter((e) => e.performanceRating === 5).length;

  const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const avgSalary = total > 0 ? Math.round(totalPayroll / total) : 0;

  // Department counts
  const deptCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
              NexusHR Intelligence v2.0
            </span>
          </div>
          <h1 className="page-title">Workforce Intelligence &amp; Analytics</h1>
          <p className="page-subtitle">
            Live telemetry, performance distributions, compensation overview, and team allocation metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/employees" className="btn btn-secondary btn-md">
            <Users size={16} /> Directory Table
          </Link>
          <Link to="/employees/new" className="btn btn-primary btn-md">
            <Plus size={16} /> Add Employee
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Headcount</span>
            <div className="stat-icon-wrapper stat-purple">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-number">{total}</div>
          <div className="stat-trend" style={{ color: 'var(--text-muted)' }}>
            Across 8 functional units
          </div>
        </div>

        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Active Headcount</span>
            <div className="stat-icon-wrapper stat-emerald">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="stat-number">{activeCount}</div>
          <div className="stat-trend" style={{ color: 'var(--success)' }}>
            {total > 0 ? Math.round((activeCount / total) * 100) : 0}% active &bull; {onLeaveCount} on leave
          </div>
        </div>

        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">High Performers</span>
            <div className="stat-icon-wrapper stat-amber">
              <Star size={20} fill="#f59e0b" />
            </div>
          </div>
          <div className="stat-number">{highPerformers}</div>
          <div className="stat-trend" style={{ color: '#f59e0b' }}>
            5.0 rating achievers
          </div>
        </div>

        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Average Compensation</span>
            <div className="stat-icon-wrapper stat-cyan">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-number" style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(avgSalary)}
          </div>
          <div className="stat-trend" style={{ color: 'var(--text-dim)' }}>
            Annual base salary
          </div>
        </div>
      </div>

      {/* Two Column Layout: Department Distribution & Recent Staff */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Department Allocation Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} color="var(--primary)" /> Department Allocation Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600 }}>{dept}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Staff Members */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" /> Key Staff Members
            </h3>
            <Link to="/employees" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {employees.slice(0, 5).map((emp) => {
              const initials = `${emp.firstName[0] || ''}${emp.lastName[0] || ''}`;
              return (
                <div
                  key={emp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                      {initials}
                    </div>
                    <div>
                      <Link
                        to={`/employees/${emp.id}`}
                        style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)' }}
                      >
                        {emp.firstName} {emp.lastName}
                      </Link>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>{emp.role}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusBadge status={emp.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.12))',
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
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Explore Directory &amp; Batch Tools</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', marginTop: '0.35rem' }}>
            Switch between Grid and Table views, perform bulk status mutations, toggle row density, and experience TanStack Query caching with optimistic updates.
          </p>
        </div>
        <Link to="/employees" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <span>Open Full Directory</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
