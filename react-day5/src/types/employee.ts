/**
 * Type definitions for Employee intelligence system, filters, and API contracts
 */

export type Department =
  | 'Engineering'
  | 'Product'
  | 'Design'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance'
  | 'Legal';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated' | 'Probation';

export type PerformanceRating = 1 | 2 | 3 | 4 | 5;

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: Department;
  employmentType: EmploymentType;
  salary: number;
  startDate: string;
  status: EmployeeStatus;
  performanceRating: PerformanceRating;
  skills: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export interface EmployeeFilters {
  search?: string;
  department?: Department | '';
  status?: EmployeeStatus | '';
  employmentType?: EmploymentType | '';
  sort?: keyof Employee | 'name';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
  status: number;
}
