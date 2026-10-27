import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  DollarSign,
  Briefcase,
  Calendar,
  Star,
  FileText,
  Clock,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { useEmployeeDetailQuery, useDeleteEmployeeMutation } from './useEmployees';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { StatusBadge, DepartmentBadge } from '../../components/Badge';
import LoadingState from '../../components/LoadingState';
import { useToast } from '../../components/Toast';

export const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: employee, isLoading, isError, error } = useEmployeeDetailQuery(id);
  const deleteMutation = useDeleteEmployeeMutation();

  const handleDelete = async () => {
    if (!id || !employee) return;
    try {
      await deleteMutation.mutateAsync(id);
      addToast(`Employee ${employee.firstName} ${employee.lastName} was deleted.`, 'info');
      navigate('/employees');
    } catch (err: any) {
      addToast(err?.message || 'Failed to delete record', 'error');
    }
  };

  const formatSalary = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return <LoadingState message="Retrieving employee profile & telemetry..." />;
  }

  if (isError || !employee) {
    return (
      <div className="card" style={{ maxWidth: '640px', margin: '3rem auto', padding: '2rem' }}>
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: 700 }}>Profile Not Found</h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {error?.message || `No active or archived record found for identifier "${id}".`}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/employees" className="btn btn-secondary">
            <ArrowLeft size={16} /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const initials = `${employee.firstName[0] || ''}${employee.lastName[0] || ''}`;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/employees"
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={15} /> Back to Directory
        </Link>
      </div>

      {/* Hero Header Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #06b6d4, #6366f1, #a855f7)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div
              className="avatar"
              style={{
                width: '72px',
                height: '72px',
                fontSize: '1.6rem',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              }}
            >
              {initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
                  {employee.firstName} {employee.lastName}
                </h1>
                <StatusBadge status={employee.status} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.05rem' }}>
                  {employee.role}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>&bull;</span>
                <DepartmentBadge department={employee.department} />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  marginTop: '0.4rem',
                }}
              >
                <Mail size={14} /> {employee.email}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/employees/${id}/edit`} className="btn btn-primary btn-md">
              <Pencil size={16} /> Edit Profile
            </Link>
            <Button
              variant="danger"
              size="md"
              onClick={() => setDeleteModalOpen(true)}
              leftIcon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="icon-metric-box icon-purple">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="metric-label">Annual Salary</span>
              <div className="metric-value" style={{ fontFamily: 'var(--font-mono)' }}>
                {formatSalary(employee.salary)}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="icon-metric-box icon-amber">
              <Star size={20} fill="#f59e0b" />
            </div>
            <div>
              <span className="metric-label">Performance Rating</span>
              <div className="metric-value">
                {employee.performanceRating}.0 <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="icon-metric-box icon-cyan">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="metric-label">Contract Type</span>
              <div className="metric-value" style={{ fontSize: '1.15rem' }}>
                {employee.employmentType}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="icon-metric-box icon-emerald">
              <Calendar size={20} />
            </div>
            <div>
              <span className="metric-label">Tenure Start</span>
              <div className="metric-value" style={{ fontSize: '1.05rem' }}>
                {formatDate(employee.startDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Competencies */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={18} color="var(--primary)" /> Technical &amp; Domain Competencies
        </h3>

        {employee.skills.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No specific skill tags linked yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {employee.skills.map((skill) => (
              <span
                key={skill}
                className="badge badge-purple"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes & Metadata */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} color="var(--primary)" /> HR Notes &amp; Observations
        </h3>
        <p style={{ color: employee.notes ? 'var(--text-main)' : 'var(--text-dim)', fontStyle: employee.notes ? 'normal' : 'italic', lineHeight: 1.6 }}>
          {employee.notes || 'No confidential observations recorded for this staff member.'}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={14} /> ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{employee.id}</code>
          </div>
          <div>Created: {formatDate(employee.createdAt)}</div>
          <div>Last Synchronized: {formatDate(employee.updatedAt)}</div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Profile
            </Button>
          </div>
        }
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
          Are you sure you want to delete profile for{' '}
          <strong>
            {employee.firstName} {employee.lastName}
          </strong>
          ? This will invalidate cached lists and remove telemetry data.
        </p>
      </Modal>
    </div>
  );
};

export default EmployeeDetails;
