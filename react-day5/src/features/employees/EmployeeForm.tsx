import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import {
  employeeFormSchema,
  defaultEmployeeFormValues,
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  EMPLOYEE_STATUSES,
  type EmployeeFormValues,
} from './employeeSchema';
import {
  useEmployeeDetailQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from './useEmployees';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import { useToast } from '../../components/Toast';

export const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [skillInput, setSkillInput] = useState('');
  const [serverErrorBanner, setServerErrorBanner] = useState<string | null>(null);

  // Queries and mutations
  const {
    data: existingEmployee,
    isLoading: isFetchingEmployee,
    isError: isFetchError,
    error: fetchError,
  } = useEmployeeDetailQuery(id);

  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: defaultEmployeeFormValues,
    mode: 'onTouched',
  });

  const currentSkills = watch('skills') || [];

  // Prepopulate form when editing existing employee
  useEffect(() => {
    if (isEditMode && existingEmployee) {
      reset({
        firstName: existingEmployee.firstName,
        lastName: existingEmployee.lastName,
        email: existingEmployee.email,
        role: existingEmployee.role,
        department: existingEmployee.department,
        employmentType: existingEmployee.employmentType,
        salary: existingEmployee.salary,
        startDate: existingEmployee.startDate.split('T')[0] as string,
        status: existingEmployee.status,
        performanceRating: existingEmployee.performanceRating,
        skills: existingEmployee.skills,
        notes: existingEmployee.notes || '',
      });
    }
  }, [isEditMode, existingEmployee, reset]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setValue('skills', [...currentSkills, trimmed], { shouldValidate: true });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      'skills',
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (values: EmployeeFormValues) => {
    setServerErrorBanner(null);

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: values });
        addToast(`Profile for ${values.firstName} ${values.lastName} updated!`, 'success');
        navigate(`/employees/${id}`);
      } else {
        const created = await createMutation.mutateAsync(values);
        addToast(`Staff profile for ${created.firstName} ${created.lastName} created!`, 'success');
        navigate(`/employees/${created.id}`);
      }
    } catch (err: any) {
      if (err?.validationErrors) {
        Object.entries(err.validationErrors).forEach(([field, msg]) => {
          setError(field as any, {
            type: 'server',
            message: msg as string,
          });
        });
      }
      setServerErrorBanner(err?.message || 'Failed to submit form. Please check requirements.');
    }
  };

  if (isEditMode && isFetchingEmployee) {
    return <LoadingState message="Loading employee intelligence profile..." />;
  }

  if (isEditMode && isFetchError) {
    return (
      <div className="card" style={{ maxWidth: '640px', margin: '2rem auto', padding: '2rem' }}>
        <div className="alert alert-danger">
          <AlertCircle size={20} />
          <div>
            <strong>Employee Not Found</strong>
            <p>{fetchError?.message || 'Unable to retrieve employee details from the system.'}</p>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/employees" className="btn btn-secondary">
            <ArrowLeft size={16} /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
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
        <div className="form-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="form-badge-icon">
              <Sparkles size={20} color="var(--primary)" />
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: '1.75rem' }}>
                {isEditMode ? 'Edit Employee Intelligence Profile' : 'Onboard New Employee'}
              </h1>
              <p className="page-subtitle">
                {isEditMode
                  ? 'Update compensation, department, skills and performance telemetry.'
                  : 'Register a staff member with strict validation and automated cache synchronization.'}
              </p>
            </div>
          </div>
        </div>

        {serverErrorBanner && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700 }}>Submission Error</div>
              <div style={{ fontSize: '0.875rem' }}>{serverErrorBanner}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name Row */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                className={`form-input ${errors.firstName ? 'has-error' : ''}`}
                placeholder="e.g. Evelyn"
                {...register('firstName')}
                aria-invalid={errors.firstName ? 'true' : 'false'}
              />
              {errors.firstName && (
                <div className="form-error" role="alert">
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
                placeholder="e.g. Vance"
                {...register('lastName')}
                aria-invalid={errors.lastName ? 'true' : 'false'}
              />
              {errors.lastName && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.lastName.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Email & Role Row */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Work Email <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="evelyn.vance@nexushr.io"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role / Title <span className="required">*</span>
              </label>
              <input
                id="role"
                type="text"
                className={`form-input ${errors.role ? 'has-error' : ''}`}
                placeholder="e.g. Principal AI Architect"
                {...register('role')}
                aria-invalid={errors.role ? 'true' : 'false'}
              />
              {errors.role && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.role.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Department & Employment Type */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                className={`form-select ${errors.department ? 'has-error' : ''}`}
                {...register('department')}
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

          {/* Salary, Date & Status */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="salary" className="form-label">
                Annual Salary ($ USD) <span className="required">*</span>
              </label>
              <input
                id="salary"
                type="number"
                step="1000"
                min="1000"
                className={`form-input ${errors.salary ? 'has-error' : ''}`}
                placeholder="165000"
                {...register('salary')}
              />
              {errors.salary && (
                <div className="form-error" role="alert">
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
              />
              {errors.startDate && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.startDate.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status & Performance Rating */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status <span className="required">*</span>
              </label>
              <select
                id="status"
                className={`form-select ${errors.status ? 'has-error' : ''}`}
                {...register('status')}
              >
                {EMPLOYEE_STATUSES.map((status) => (
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

            <div className="form-group">
              <label htmlFor="performanceRating" className="form-label">
                Performance Rating (1 to 5)
              </label>
              <select
                id="performanceRating"
                className="form-select"
                {...register('performanceRating')}
              >
                <option value={5}>5 - Exceptional Leadership &amp; Impact</option>
                <option value={4}>4 - Exceeds Expectations</option>
                <option value={3}>3 - Consistently Meets Expectations</option>
                <option value={2}>2 - Needs Development</option>
                <option value={1}>1 - Underperforming</option>
              </select>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div className="form-group">
            <label className="form-label">Core Technical &amp; Leadership Skills</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type a skill and press Add or Enter (e.g. Distributed Systems)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddSkill}
                leftIcon={<Plus size={16} />}
              >
                Add
              </Button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
              {currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="badge badge-purple"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    aria-label={`Remove skill ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Confidential HR Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="form-textarea"
              placeholder="Career progression, focus projects, onboarding notes..."
              {...register('notes')}
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Link
              to={isEditMode ? `/employees/${id}` : '/employees'}
              className="btn btn-secondary"
            >
              Cancel
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving || isSubmitting}
              leftIcon={<Save size={16} />}
            >
              {isEditMode ? 'Update Profile' : 'Save Employee Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
