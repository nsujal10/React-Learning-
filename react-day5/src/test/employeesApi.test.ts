import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  resetEmployeesDatabase,
} from '../api/employees';
import { HttpError } from '../api/http';

describe('Employees API (Runtime Zod Validation, Errors & Cancellation)', () => {
  beforeEach(() => {
    resetEmployeesDatabase();
  });

  it('fetches paginated employees and validates schema at runtime', async () => {
    const response = await getEmployees({ limit: 5 });

    expect(response).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.pagination.total).toBeGreaterThan(0);
    expect(response.pagination.limit).toBe(5);

    // Verify first employee matches strict Employee interface
    const first = response.data[0];
    expect(first).toBeDefined();
    expect(first?.id).toMatch(/^emp-/);
    expect(typeof first?.firstName).toBe('string');
    expect(typeof first?.salary).toBe('number');
    expect(Array.isArray(first?.skills)).toBe(true);
  });

  it('retrieves an individual employee by ID with runtime type verification', async () => {
    const employee = await getEmployeeById('emp-501');

    expect(employee.id).toBe('emp-501');
    expect(employee.firstName).toBe('Dr. Evelyn');
    expect(employee.department).toBe('Engineering');
    expect(employee.performanceRating).toBe(5);
  });

  it('throws HttpError 404 when querying non-existent employee ID', async () => {
    await expect(getEmployeeById('emp-non-existent-999')).rejects.toThrow(HttpError);
    try {
      await getEmployeeById('emp-non-existent-999');
    } catch (err: any) {
      expect(err.status).toBe(404);
      expect(err.message).toContain('not found');
    }
  });

  it('throws HttpError 422 when attempting to register duplicate email', async () => {
    const duplicateData = {
      firstName: 'Clone',
      lastName: 'Vance',
      email: 'evelyn.vance@nexushr.io', // Already assigned to emp-501
      role: 'Engineer',
      department: 'Engineering' as const,
      employmentType: 'Full-time' as const,
      salary: 120000,
      startDate: '2024-01-01',
      status: 'Active' as const,
      performanceRating: 4 as const,
      skills: ['Go'],
    };

    await expect(createEmployee(duplicateData)).rejects.toThrow(HttpError);
    try {
      await createEmployee(duplicateData);
    } catch (err: any) {
      expect(err.status).toBe(422);
      expect(err.validationErrors?.email).toBeDefined();
    }
  });

  it('aborts network operation and throws AbortError when AbortController signals', async () => {
    const controller = new AbortController();
    const promise = getEmployees({ search: 'cancelled' }, { signal: controller.signal });

    controller.abort();

    await expect(promise).rejects.toThrow();
  });
});
