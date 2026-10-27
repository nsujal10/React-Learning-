import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Briefcase,
  DollarSign,
  Calendar,
  Building,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { getEmployeeById, deleteEmployee } from '../../api/employees';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import { useToast } from '../../components/Toast';

export function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchDetail() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEmployeeById(id, { signal: controller.signal });
        if (isMounted) {
          setEmployee(data);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          setError(err.message || 'Failed to load employee details');
        }
      } finally {
        if (isMounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEmployee(id);
      addToast('Employee record was deleted successfully', 'info');
      navigate('/employees');
    } catch (err) {
      addToast(err.message || 'Failed to delete record', 'error');
      setIsDeleting(false);
    }
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
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
    return <LoadingState message="Fetching employee profile..." />;
  }

  if (error || !employee) {
    return (
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <ErrorMessage
          title="Employee Profile Not Found"
          message={error || `Could not find any employee record with identifier "${id}".`}
        />
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/employees" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Directory
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

      {/* Hero Card */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '2rem',
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
            background: 'linear-gradient(90deg, #6366f1, #a855f7, #06b6d4)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              className="avatar"
              style={{ width: '68px', height: '68px', fontSize: '1.5rem' }}
            >
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {employee.firstName} {employee.lastName}
                </h1>
                <span
                  className={`badge ${
                    employee.status === 'Active'
                      ? 'badge-active'
                      : employee.status === 'On Leave'
                      ? 'badge-onleave'
                      : 'badge-terminated'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                  marginTop: '0.2rem',
                }}
              >
                {employee.role} &bull;{' '}
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {employee.department}
                </span>
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.4rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <Mail size={14} /> {employee.email}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/employees/${id}/edit`} className="btn btn-primary">
              <Pencil size={16} /> Edit Profile
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-danger"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Profile Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <DollarSign size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Annual Compensation
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {formatSalary(employee.salary)}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
              }}
            >
              <Briefcase size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Contract Type
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {employee.employmentType}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(14, 165, 233, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--info)',
              }}
            >
              <Calendar size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Start Date
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                {formatDate(employee.startDate)}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--warning)',
              }}
            >
              <Building size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Department Unit
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {employee.department}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Audit Info */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} color="var(--primary)" /> HR Notes &amp; Observations
        </h3>
        <p style={{ color: employee.notes ? 'var(--text-main)' : 'var(--text-dim)', fontStyle: employee.notes ? 'normal' : 'italic', lineHeight: 1.6 }}>
          {employee.notes || 'No specific notes recorded for this employee profile.'}
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
            <Clock size={14} />
            <span>ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{employee.id}</code></span>
          </div>
          {employee.createdAt && (
            <div>Created: {formatDate(employee.createdAt)}</div>
          )}
          {employee.updatedAt && (
            <div>Last Updated: {formatDate(employee.updatedAt)}</div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--danger-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--danger)',
                }}
              >
                <AlertCircle size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Confirm Deletion</h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>{employee.firstName} {employee.lastName}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Record'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDetails;
