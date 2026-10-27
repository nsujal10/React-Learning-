import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  X,
  RotateCcw,
  UserX,
} from 'lucide-react';
import { useEmployees } from './useEmployees';
import { DEPARTMENTS, STATUS_OPTIONS } from './employeeSchema';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import { useToast } from '../../components/Toast';

export function EmployeeList() {
  const {
    employees,
    pagination,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    filters,
    handleSortChange,
    handleFilterChange,
    handlePageChange,
    clearAllFilters,
    handleDelete,
    refetch,
  } = useEmployees({ pageSize: 5 });

  const navigate = useNavigate();
  const { addToast } = useToast();

  // State for delete modal confirmation
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);
    try {
      await handleDelete(employeeToDelete.id);
      addToast(`Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} was deleted.`, 'info');
      setEmployeeToDelete(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete employee', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getSortIcon = (field) => {
    if (filters.sort !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return filters.order === 'asc' ? (
      <ArrowUp size={14} color="var(--primary)" />
    ) : (
      <ArrowDown size={14} color="var(--primary)" />
    );
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-active">Active</span>;
      case 'On Leave':
        return <span className="badge badge-onleave">On Leave</span>;
      case 'Terminated':
        return <span className="badge badge-terminated">Terminated</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.department || filters.status
  );

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">
            Manage your team, track positions, compensation, and active statuses.
          </p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Employee</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Debounced Search Input */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: searchInput ? '2.5rem' : '1rem' }}
              placeholder="Search by name, email, department, or role..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search employees"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '170px' }}>
            <select
              className="form-select"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              aria-label="Filter by department"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn btn-secondary btn-sm"
              title="Reset all search filters"
            >
              <RotateCcw size={14} /> Clear Filters
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.75rem',
          }}
        >
          <span>
            Showing {employees.length} of {pagination.total} matching records
          </span>
          {isLoading && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--primary)',
              }}
            >
              <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
              Syncing directory...
            </span>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorMessage
          title="Directory Fetch Error"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Main Table or Loading/Empty State */}
      {isLoading && employees.length === 0 ? (
        <LoadingState message="Loading directory..." />
      ) : employees.length === 0 ? (
        <div className="card empty-state">
          <UserX className="empty-state-icon" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            No employees found
          </h3>
          <p style={{ marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            {hasActiveFilters
              ? 'No staff members match the current search filters. Try adjusting your query or resetting filters.'
              : 'There are currently no employees in the system. Get started by adding a team member.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            )}
            <Link to="/employees/new" className="btn btn-primary">
              <Plus size={16} /> Add Employee
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th
                  className="sortable"
                  onClick={() => handleSortChange('name')}
                  title="Sort by employee name"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Employee</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSortChange('department')}
                  title="Sort by department"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Department &amp; Role</span>
                    {getSortIcon('department')}
                  </div>
                </th>
                <th>Type</th>
                <th
                  className="sortable"
                  onClick={() => handleSortChange('salary')}
                  title="Sort by annual compensation"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Salary (USD)</span>
                    {getSortIcon('salary')}
                  </div>
                </th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const initials = `${emp.firstName[0] || ''}${emp.lastName[0] || ''}`;
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div className="avatar">{initials}</div>
                        <div>
                          <Link
                            to={`/employees/${emp.id}`}
                            style={{
                              fontWeight: 700,
                              color: 'var(--text-main)',
                              display: 'block',
                            }}
                          >
                            {emp.firstName} {emp.lastName}
                          </Link>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {emp.role}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {emp.department}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.825rem',
                          background: 'var(--bg-surface-elevated)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {emp.employmentType}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {formatSalary(emp.salary)}
                    </td>
                    <td>{getStatusBadge(emp.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Link
                          to={`/employees/${emp.id}`}
                          className="btn btn-secondary btn-icon-only btn-sm"
                          title="View Details"
                          aria-label={`View details for ${emp.firstName} ${emp.lastName}`}
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/employees/${emp.id}/edit`}
                          className="btn btn-secondary btn-icon-only btn-sm"
                          title="Edit Employee"
                          aria-label={`Edit ${emp.firstName} ${emp.lastName}`}
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEmployeeToDelete(emp)}
                          className="btn btn-secondary btn-icon-only btn-sm"
                          title="Delete Employee"
                          aria-label={`Delete ${emp.firstName} ${emp.lastName}`}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>

            <div className="pagination-pages">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage || isLoading}
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`btn btn-sm ${
                      p === pagination.page ? 'btn-primary' : 'btn-secondary'
                    }`}
                    style={{ minWidth: '32px', padding: '0.35rem 0.6rem' }}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage || isLoading}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
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
              Are you sure you want to remove <strong>{employeeToDelete.firstName} {employeeToDelete.lastName}</strong> from the system? This action performs a REST DELETE call and removes their profile records permanently.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEmployeeToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Employee'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
