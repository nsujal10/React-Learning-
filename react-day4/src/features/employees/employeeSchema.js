import { z } from 'zod';

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
];

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'];

export const STATUS_OPTIONS = ['Active', 'On Leave', 'Terminated'];

export const employeeSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please provide a valid email address (e.g. name@company.com)'),
  role: z
    .string()
    .min(1, 'Job title/role is required')
    .min(2, 'Job title must be at least 2 characters')
    .max(80, 'Job title cannot exceed 80 characters'),
  department: z.enum(DEPARTMENTS, {
    errorMap: () => ({ message: 'Please select a valid department' }),
  }),
  employmentType: z.enum(EMPLOYMENT_TYPES, {
    errorMap: () => ({ message: 'Please select an employment type' }),
  }),
  salary: z
    .coerce
    .number({ invalid_type_error: 'Salary must be a valid number' })
    .positive('Salary must be greater than zero')
    .min(1000, 'Minimum annual salary is $1,000')
    .max(1000000, 'Maximum salary limit is $1,000,000'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'Please provide a valid calendar date',
    }),
  status: z.enum(STATUS_OPTIONS, {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
});

export const defaultEmployeeValues = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  department: 'Engineering',
  employmentType: 'Full-time',
  salary: '',
  startDate: new Date().toISOString().split('T')[0],
  status: 'Active',
  notes: '',
};
