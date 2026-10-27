import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  Briefcase,
  DollarSign,
  Calendar,
  Building,
} from 'lucide-react';
import {
  employeeSchema,
  defaultEmployeeValues,
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  STATUS_OPTIONS,
} from './employeeSchema';
import {
  createEmployee,
  updateEmployee,
  getEmployeeById,
} from '../../api/employees';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import { useToast } from '../../components/Toast';

export function EmployeeForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isLoadingInitial, setIsLoadingInitial] = useState(isEditMode);
  const [initialFetchError, setInitialFetchError] = useState(null);
  const [serverErrorBanner, setServerErrorBanner] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultEmployeeValues,
    mode: 'onTouched',
  });

  // Load employee for Edit mode
  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;
    async function loadData() {
      setIsLoadingInitial(true);
      setInitialFetchError(null);
      try {
        const data = await getEmployeeById(id);
        if (isMounted) {
          reset({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            role: data.role || '',
            department: data.department || 'Engineering',
            employmentType: data.employmentType || 'Full-time',
            salary: data.salary || '',
            startDate: data.startDate ? data.startDate.split('T')[0] : '',
            status: data.status || 'Active',
            notes: data.notes || '',
          });
        }
      } catch (err) {
        if (isMounted) {
          setInitialFetchError(err.message || 'Unable to load employee details');
        }
      } finally {
        if (isMounted) {
          setIsLoadingInitial(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode, reset]);

  const onSubmit = async (formData) => {
    setServerErrorBanner(null);

    try {
      if (isEditMode) {
        const updated = await updateEmployee(id, formData);
        addToast(
          `Employee ${updated.firstName} ${updated.lastName} updated successfully!`,
          'success'
        );
        navigate(`/employees/${id}`);
      } else {
        const created = await createEmployee(formData);
        addToast(
          `Employee ${created.firstName} ${created.lastName} created successfully!`,
          'success'
        );
        navigate(`/employees/${created.id}`);
      }
    } catch (err) {
      // Map server-side validation errors back to React Hook Form fields
      if (err.validationErrors) {
        Object.entries(err.validationErrors).forEach(([field, msg]) => {
          setError(field, {
            type: 'server',
            message: msg,
          });
        });
      }

      setServerErrorBanner(
        err.message || 'Submission failed. Please check form inputs and try again.'
      );
    }
  };

  if (isLoadingInitial) {
    return <LoadingState message="Loading employee information..." />;
  }

  if (initialFetchError) {
    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
        <ErrorMessage
          title="Could Not Load Employee Record"
          message={initialFetchError}
        />
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/employees" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={isEditMode ? `/employees/${id}` : '/employees'}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={15} />{' '}
          {isEditMode ? 'Cancel and Return to Profile' : 'Back to Directory'}
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {isEditMode ? 'Edit Employee Profile' : 'Add New Employee'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
            {isEditMode
              ? 'Update personal credentials, role, compensation, and work assignment.'
              : 'Enter staff details to onboard a new team member into the directory.'}
          </p>
        </div>

        {/* Server error banner */}
        {serverErrorBanner && (
          <div
            className="alert alert-danger"
            style={{ marginBottom: '1.5rem' }}
            role="alert"
          >
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700 }}>Submission Failed</div>
              <div style={{ fontSize: '0.875rem' }}>{serverErrorBanner}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Personal Info Grid */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                className={`form-input ${errors.firstName ? 'has-error' : ''}`}
                placeholder="e.g. Sarah"
                {...register('firstName')}
                aria-invalid={errors.firstName ? 'true' : 'false'}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <div id="firstName-error" className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.firstName.message}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                className={`form-input ${errors.lastName ? 'has-error' : ''}`}
                placeholder="e.g. Connor"
                {...register('lastName')}
                aria-invalid={errors.lastName ? 'true' : 'false'}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              {errors.lastName && (
                <div id="lastName-error" className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.lastName.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact and Title Grid */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="s.connor@cyberdyne.io"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <div id="email-error" className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Position / Role <span className="required">*</span>
              </label>
              <input
                id="role"
                type="text"
                className={`form-input ${errors.role ? 'has-error' : ''}`}
                placeholder="e.g. Senior Frontend Engineer"
                {...register('role')}
                aria-invalid={errors.role ? 'true' : 'false'}
                aria-describedby={errors.role ? 'role-error' : undefined}
              />
              {errors.role && (
                <div id="role-error" className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.role.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Department and Employment Type */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                className={`form-select ${errors.department ? 'has-error' : ''}`}
                {...register('department')}
                aria-invalid={errors.department ? 'true' : 'false'}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.department.message}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="employmentType" className="form-label">
                Employment Type <span className="required">*</span>
              </label>
              <select
                id="employmentType"
                className={`form-select ${errors.employmentType ? 'has-error' : ''}`}
                {...register('employmentType')}
                aria-invalid={errors.employmentType ? 'true' : 'false'}
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.employmentType && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.employmentType.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Salary and Start Date */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="salary" className="form-label">
                Annual Salary ($ USD) <span className="required">*</span>
              </label>
              <input
                id="salary"
                type="number"
                step="500"
                min="1000"
                max="1000000"
                className={`form-input ${errors.salary ? 'has-error' : ''}`}
                placeholder="115000"
                {...register('salary')}
                aria-invalid={errors.salary ? 'true' : 'false'}
                aria-describedby={errors.salary ? 'salary-error' : undefined}
              />
              {errors.salary && (
                <div id="salary-error" className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.salary.message}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Start Date <span className="required">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                className={`form-input ${errors.startDate ? 'has-error' : ''}`}
                {...register('startDate')}
                aria-invalid={errors.startDate ? 'true' : 'false'}
                aria-describedby={errors.startDate ? 'startDate-error' : undefined}
              />
              {errors.startDate && (
                <div id="startDate-error" className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.startDate.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Employment Status <span className="required">*</span>
            </label>
            <select
              id="status"
              className={`form-select ${errors.status ? 'has-error' : ''}`}
              {...register('status')}
              aria-invalid={errors.status ? 'true' : 'false'}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <div className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.status.message}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Internal Notes / Comments
            </label>
            <textarea
              id="notes"
              rows={3}
              className={`form-textarea ${errors.notes ? 'has-error' : ''}`}
              placeholder="Add key highlights, project focus, onboarding notes..."
              {...register('notes')}
            ></textarea>
            {errors.notes && (
              <div className="form-error" role="alert">
                <AlertCircle size={14} />
                <span>{errors.notes.message}</span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '2rem',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.5rem',
            }}
          >
            <Link
              to={isEditMode ? `/employees/${id}` : '/employees'}
              className="btn btn-secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                  <span>{isEditMode ? 'Saving Changes...' : 'Creating Employee...'}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditMode ? 'Update Profile' : 'Save Employee'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
