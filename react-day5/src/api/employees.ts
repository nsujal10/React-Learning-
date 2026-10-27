import { httpClient, resetDatabase } from './http';
import {
  employeeSchema,
  paginatedEmployeesResponseSchema,
} from '../features/employees/employeeSchema';
import type {
  Employee,
  EmployeeFilters,
  PaginatedResponse,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeStatus,
} from '../types/employee';

interface ApiRequestOptions {
  signal?: AbortSignal;
}

/**
 * Fetch paginated and filtered employees with runtime schema validation
 */
export async function getEmployees(
  filters: EmployeeFilters = {},
  options: ApiRequestOptions = {}
): Promise<PaginatedResponse<Employee>> {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.department) params.set('department', filters.department);
  if (filters.status) params.set('status', filters.status);
  if (filters.employmentType) params.set('employmentType', filters.employmentType);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.order) params.set('order', filters.order);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());

  const query = params.toString() ? `?${params.toString()}` : '';

  const rawData = await httpClient<PaginatedResponse<Employee>>(`/api/employees${query}`, {
    method: 'GET',
    signal: options.signal,
  });

  // Runtime validation of API response with Zod
  return paginatedEmployeesResponseSchema.parse(rawData);
}

/**
 * Fetch a single employee by ID with runtime schema validation
 */
export async function getEmployeeById(
  id: string,
  options: ApiRequestOptions = {}
): Promise<Employee> {
  const rawData = await httpClient<Employee>(`/api/employees/${id}`, {
    method: 'GET',
    signal: options.signal,
  });

  // Runtime validation of API response with Zod
  return employeeSchema.parse(rawData);
}

/**
 * Create a new employee profile
 */
export async function createEmployee(
  input: CreateEmployeeInput,
  options: ApiRequestOptions = {}
): Promise<Employee> {
  const rawData = await httpClient<Employee>('/api/employees', {
    method: 'POST',
    body: input,
    signal: options.signal,
  });

  return employeeSchema.parse(rawData);
}

/**
 * Update an existing employee profile
 */
export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput,
  options: ApiRequestOptions = {}
): Promise<Employee> {
  const rawData = await httpClient<Employee>(`/api/employees/${id}`, {
    method: 'PATCH',
    body: input,
    signal: options.signal,
  });

  return employeeSchema.parse(rawData);
}

/**
 * Delete an employee profile
 */
export async function deleteEmployee(
  id: string,
  options: ApiRequestOptions = {}
): Promise<{ success: boolean; deleted: Employee }> {
  return httpClient<{ success: boolean; deleted: Employee }>(`/api/employees/${id}`, {
    method: 'DELETE',
    signal: options.signal,
  });
}

/**
 * Bulk update status for multiple employees
 */
export async function batchUpdateEmployeeStatus(
  ids: string[],
  status: EmployeeStatus,
  options: ApiRequestOptions = {}
): Promise<{ success: boolean; modifiedCount: number }> {
  return httpClient<{ success: boolean; modifiedCount: number }>(
    '/api/employees/batch-status',
    {
      method: 'POST',
      body: { ids, status },
      signal: options.signal,
    }
  );
}

export function resetEmployeesDatabase(): Employee[] {
  return resetDatabase();
}
