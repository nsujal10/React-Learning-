import { z } from 'zod';
import type { Department, EmploymentType, EmployeeStatus, PerformanceRating } from '../../types/employee';

export const DEPARTMENTS: readonly Department[] = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Legal',
] as const;

export const EMPLOYMENT_TYPES: readonly EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Intern',
] as const;

export const EMPLOYEE_STATUSES: readonly EmployeeStatus[] = [
  'Active',
  'On Leave',
  'Terminated',
  'Probation',
] as const;

export const performanceRatingSchema = z.preprocess(
  (val) => Number(val),
  z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ])
);

// Single Employee Runtime Validation Schema
export const employeeSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'.-]+$/, 'First name contains invalid characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'.-]+$/, 'Last name contains invalid characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please provide a valid work email address'),
  role: z
    .string()
    .min(1, 'Job title is required')
    .min(2, 'Job title must be at least 2 characters')
    .max(80, 'Job title cannot exceed 80 characters'),
  department: z.enum(DEPARTMENTS as [Department, ...Department[]], {
    errorMap: () => ({ message: 'Please select a valid department' }),
  }),
  employmentType: z.enum(EMPLOYMENT_TYPES as [EmploymentType, ...EmploymentType[]], {
    errorMap: () => ({ message: 'Please select an employment type' }),
  }),
  salary: z
    .coerce
    .number({ invalid_type_error: 'Salary must be a valid number' })
    .positive('Salary must be greater than zero')
    .min(1000, 'Minimum annual salary is $1,000')
    .max(2000000, 'Maximum annual salary limit is $2,000,000'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Please provide a valid start date',
    }),
  status: z.enum(EMPLOYEE_STATUSES as [EmployeeStatus, ...EmployeeStatus[]], {
    errorMap: () => ({ message: 'Please select a valid employment status' }),
  }),
  performanceRating: performanceRatingSchema.default(3),
  skills: z.array(z.string()).default([]),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional().default(''),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Form Schema for Creating/Editing Employees
export const employeeFormSchema = employeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// API Paginated Response Runtime Validation Schema
export const paginatedEmployeesResponseSchema = z.object({
  data: z.array(employeeSchema),
  pagination: z.object({
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
});

export const defaultEmployeeFormValues: EmployeeFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  department: 'Engineering',
  employmentType: 'Full-time',
  salary: 100000,
  startDate: new Date().toISOString().split('T')[0] as string,
  status: 'Active',
  performanceRating: 3 as PerformanceRating,
  skills: ['TypeScript', 'React'],
  notes: '',
};
