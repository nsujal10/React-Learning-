import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  RotateCcw,
  UserX,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  CheckSquare,
  Square,
  AlertCircle,
  RefreshCw,
  Star,
  Users,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import {
  useEmployeesQuery,
  useDeleteEmployeeMutation,
  useBatchUpdateStatusMutation,
} from './useEmployees';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from './employeeSchema';
import type { Department, EmployeeStatus, EmploymentType, Employee } from '../../types/employee';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { StatusBadge, DepartmentBadge } from '../../components/Badge';
import LoadingState from '../../components/LoadingState';
import { useToast } from '../../components/Toast';

export const EmployeeList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  // Read URL search params
  const search = searchParams.get('search') || '';
  const department = (searchParams.get('department') as Department) || '';
  const status = (searchParams.get('status') as EmployeeStatus) || '';
  const employmentType = (searchParams.get('employmentType') as EmploymentType) || '';
  const sort = (searchParams.get('sort') as keyof Employee | 'name') || 'name';
  const order = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  // Zustand UI State
  const {
    viewMode,
    setViewMode,
    density,
    setDensity,
    selectedEmployeeIds,
    toggleEmployeeSelection,
    selectAllEmployees,
    clearSelection,
  } = useUIStore();

  // TanStack Query
  const filters = { search, department, status, employmentType, sort, order, page, limit };
  const { data, isLoading, isFetching, isError, error, refetch } = useEmployeesQuery(filters);

  // Mutations
  const deleteMutation = useDeleteEmployeeMutation();
  const batchStatusMutation = useBatchUpdateStatusMutation();

  // Local state for delete dialog
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [targetBulkStatus, setTargetBulkStatus] = useState<EmployeeStatus>('Active');

  const employees = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // URL query state helpers
  const updateQuery = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  };

  const handleSort = (field: keyof Employee | 'name') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const currentSort = next.get('sort') || 'name';
      const currentOrder = next.get('order') || 'asc';

      if (currentSort === field) {
        next.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
      } else {
        next.set('sort', field);
        next.set('order', 'asc');
      }
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteMutation.mutateAsync(employeeToDelete.id);
      addToast(
        `Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} removed from directory.`,
        'info'
      );
      setEmployeeToDelete(null);
    } catch (err: any) {
      addToast(err?.message || 'Failed to delete employee', 'error');
    }
  };

  const handleBulkStatusConfirm = async () => {
    if (selectedEmployeeIds.length === 0) return;
    try {
      await batchStatusMutation.mutateAsync({
        ids: selectedEmployeeIds,
        status: targetBulkStatus,
      });
      addToast(
        `Updated status to "${targetBulkStatus}" for ${selectedEmployeeIds.length} staff member(s).`,
        'success'
      );
      clearSelection();
      setBulkStatusModalOpen(false);
    } catch (err: any) {
      addToast(err?.message || 'Failed to update bulk status', 'error');
    }
  };

  const formatSalary = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const renderSortIcon = (field: keyof Employee | 'name') => {
    if (sort !== field) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return order === 'asc' ? (
      <ArrowUp size={14} color="var(--primary)" />
    ) : (
      <ArrowDown size={14} color="var(--primary)" />
    );
  };

  const allVisibleSelected =
    employees.length > 0 && employees.every((e) => selectedEmployeeIds.includes(e.id));

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Intelligence Directory</h1>
          <p className="page-subtitle">
            Enterprise telemetry, compensation tracking, performance ratings, and team operations.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => refetch()}
            leftIcon={<RefreshCw size={15} className={isFetching ? 'spin-icon' : ''} />}
            title="Refetch directory from server"
          >
            Refresh
          </Button>
          <Link to="/employees/new" className="btn btn-primary btn-md">
            <Plus size={16} />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Filter & Controls Panel */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
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
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by name, role, skills, or email..."
              value={search}
              onChange={(e) => updateQuery('search', e.target.value)}
              aria-label="Search employees"
            />
          </div>

          {/* Department Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={department}
            onChange={(e) => updateQuery('department', e.target.value)}
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={status}
            onChange={(e) => updateQuery('status', e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            {EMPLOYEE_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Employment Type Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={employmentType}
            onChange={(e) => updateQuery('employmentType', e.target.value)}
            aria-label="Filter by contract type"
          >
            <option value="">All Types</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Reset button */}
          {(search || department || status || employmentType) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearAllFilters}
              leftIcon={<RotateCcw size={14} />}
            >
              Reset
            </Button>
          )}

          {/* View Mode & Density Toggles from Zustand */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm ${density === 'comfortable' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDensity('comfortable')}
                title="Comfortable row density"
              >
                Normal
              </button>
              <button
                type="button"
                className={`btn btn-sm ${density === 'compact' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDensity('compact')}
                title="Compact row density"
              >
                Compact
              </button>
            </div>

            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-icon-only btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className={`btn btn-icon-only btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry info and background refetching indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span>
            Displaying {employees.length} of {pagination.total} records (Page {pagination.page} of{' '}
            {pagination.totalPages})
          </span>

          {/* Background refetch indicator */}
          {isFetching && !isLoading && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              <span className="spinner spinner-sm" style={{ width: '12px', height: '12px' }} />
              Updating background cache...
            </span>
          )}
        </div>
      </div>

      {/* Bulk Action Bar (Powered by Zustand selectedEmployeeIds) */}
      {selectedEmployeeIds.length > 0 && (
        <div
          className="alert alert-info"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckSquare size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>
              {selectedEmployeeIds.length} staff member(s) selected
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBulkStatusModalOpen(true)}
            >
              Change Status
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: 700 }}>Telemetry Query Failed</h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>
              {error?.message || 'Unable to fetch records from server.'}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingState message="Fetching live employee intelligence records..." minHeight="320px" />
      ) : employees.length === 0 ? (
        <div className="card empty-state">
          <UserX className="empty-state-icon" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No employees match current criteria</h3>
          <p style={{ marginTop: '0.5rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
            Try broadening your search keywords or resetting active filters.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={clearAllFilters}>
              Reset Filters
            </Button>
            <Link to="/employees/new" className="btn btn-primary">
              <Plus size={16} /> Add Employee
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          {employees.map((emp) => {
            const isSelected = selectedEmployeeIds.includes(emp.id);
            const initials = `${emp.firstName[0] || ''}${emp.lastName[0] || ''}`;

            return (
              <div
                key={emp.id}
                className="card employee-grid-card"
                style={{
                  borderColor: isSelected ? 'var(--primary)' : undefined,
                  background: isSelected ? 'rgba(99, 102, 241, 0.05)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => toggleEmployeeSelection(emp.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      aria-label={`Select ${emp.firstName} ${emp.lastName}`}
                    >
                      {isSelected ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
                    </button>
                    <div className="avatar">{initials}</div>
                    <div>
                      <Link
                        to={`/employees/${emp.id}`}
                        style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', display: 'block' }}
                      >
                        {emp.firstName} {emp.lastName}
                      </Link>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.role}</span>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>

                <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Department:</span>
                    <DepartmentBadge department={emp.department} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Compensation:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{formatSalary(emp.salary)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Performance:</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24' }}>
                      <Star size={14} fill="#fbbf24" /> {emp.performanceRating} / 5
                    </span>
                  </div>
                </div>

                {/* Skills tags preview */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                  {emp.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="badge badge-default" style={{ fontSize: '0.7rem' }}>
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="badge badge-default" style={{ fontSize: '0.7rem' }}>
                      +{emp.skills.length - 3}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <Link to={`/employees/${emp.id}`} className="btn btn-secondary btn-sm">
                    <Eye size={14} /> View
                  </Link>
                  <Link to={`/employees/${emp.id}/edit`} className="btn btn-secondary btn-sm">
                    <Pencil size={14} /> Edit
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setEmployeeToDelete(emp)}
                    aria-label={`Delete ${emp.firstName}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-wrapper">
          <table className={`data-table density-${density}`}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (allVisibleSelected) {
                        clearSelection();
                      } else {
                        selectAllEmployees(employees.map((e) => e.id));
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    aria-label="Select all visible employees"
                  >
                    {allVisibleSelected ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} />}
                  </button>
                </th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Employee</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('department')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Department &amp; Role</span>
                    {renderSortIcon('department')}
                  </div>
                </th>
                <th>Contract</th>
                <th className="sortable" onClick={() => handleSort('salary')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Salary</span>
                    {renderSortIcon('salary')}
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('performanceRating')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Rating</span>
                    {renderSortIcon('performanceRating')}
                  </div>
                </th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const isSelected = selectedEmployeeIds.includes(emp.id);
                const initials = `${emp.firstName[0] || ''}${emp.lastName[0] || ''}`;

                return (
                  <tr
                    key={emp.id}
                    style={{
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.08)' : undefined,
                    }}
                  >
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleEmployeeSelection(emp.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        aria-label={`Select ${emp.firstName}`}
                      >
                        {isSelected ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} />}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                          {initials}
                        </div>
                        <div>
                          <Link
                            to={`/employees/${emp.id}`}
                            style={{ fontWeight: 700, color: 'var(--text-main)', display: 'block' }}
                          >
                            {emp.firstName} {emp.lastName}
                          </Link>
                          <span style={{ fontSize: '0.775rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            {emp.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{emp.role}</div>
                      <DepartmentBadge department={emp.department} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {emp.employmentType}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {formatSalary(emp.salary)}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Star size={14} fill="#fbbf24" /> {emp.performanceRating}.0
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={emp.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <Link
                          to={`/employees/${emp.id}`}
                          className="btn btn-secondary btn-icon-only btn-sm"
                          title="View Intelligence Profile"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/employees/${emp.id}/edit`}
                          className="btn btn-secondary btn-icon-only btn-sm"
                          title="Edit Profile"
                        >
                          <Pencil size={15} />
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="btn-icon-only"
                          onClick={() => setEmployeeToDelete(emp)}
                          title="Delete Employee"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={15} />
                        </Button>
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
              Showing {employees.length} of {pagination.total} employees
            </div>

            <div className="pagination-pages">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateQuery('page', (pagination.page - 1).toString())}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => updateQuery('page', p.toString())}
                  className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '32px' }}
                >
                  {p}
                </button>
              ))}

              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateQuery('page', (pagination.page + 1).toString())}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(employeeToDelete)}
        onClose={() => setEmployeeToDelete(null)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.4rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', color: 'var(--danger)' }}>
              <AlertCircle size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Confirm Deletion</h3>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              onClick={() => setEmployeeToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteMutation.isPending}
            >
              Delete Profile
            </Button>
          </div>
        }
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
          Are you sure you want to permanently remove profile for{' '}
          <strong>
            {employeeToDelete?.firstName} {employeeToDelete?.lastName}
          </strong>
          ? This deletes their records and invalidates relevant TanStack Query caches.
        </p>
      </Modal>

      {/* Bulk Status Update Modal */}
      <Modal
        isOpen={bulkStatusModalOpen}
        onClose={() => setBulkStatusModalOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.4rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Users size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Batch Status Update</h3>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              onClick={() => setBulkStatusModalOpen(false)}
              disabled={batchStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleBulkStatusConfirm}
              isLoading={batchStatusMutation.isPending}
            >
              Apply Status to {selectedEmployeeIds.length} Selected
            </Button>
          </div>
        }
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1rem' }}>
          Select the new employment status to apply across all {selectedEmployeeIds.length} selected employee(s):
        </p>
        <select
          className="form-select"
          value={targetBulkStatus}
          onChange={(e) => setTargetBulkStatus(e.target.value as EmployeeStatus)}
        >
          {EMPLOYEE_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  );
};

export default EmployeeList;
