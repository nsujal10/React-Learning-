import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useEmployeesQuery,
  useUpdateEmployeeMutation,
  employeeKeys,
} from '../features/employees/useEmployees';
import * as employeesApi from '../api/employees';
import type { Employee } from '../types/employee';

vi.mock('../api/employees', async () => {
  const actual = await vi.importActual('../api/employees');
  return {
    ...actual,
    getEmployees: vi.fn(),
    getEmployeeById: vi.fn(),
    updateEmployee: vi.fn(),
  };
});

const mockEmployee: Employee = {
  id: 'emp-501',
  firstName: 'Dr. Evelyn',
  lastName: 'Vance',
  email: 'evelyn.vance@nexushr.io',
  role: 'Principal AI Architect',
  department: 'Engineering',
  employmentType: 'Full-time',
  salary: 215000,
  startDate: '2021-04-10',
  status: 'Active',
  performanceRating: 5,
  skills: ['PyTorch', 'Distributed Systems'],
  createdAt: '2021-04-10T08:00:00.000Z',
  updatedAt: '2024-02-15T10:00:00.000Z',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, Wrapper };
}

describe('TanStack Query Behavior & Optimistic Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles query lifecycle: starts loading, resolves data with query keys', async () => {
    vi.mocked(employeesApi.getEmployees).mockResolvedValueOnce({
      data: [mockEmployee],
      pagination: {
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useEmployeesQuery({ search: 'Evelyn' }), {
      wrapper: Wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data[0]?.firstName).toBe('Dr. Evelyn');
    expect(result.current.isLoading).toBe(false);
  });

  it('performs optimistic updates immediately on mutation and invalidates queries on settle', async () => {
    const { queryClient, Wrapper } = createWrapper();

    // Seed query cache with original employee
    queryClient.setQueryData(employeeKeys.detail('emp-501'), mockEmployee);

    let resolveMutation: any;
    const pendingUpdatePromise = new Promise((resolve) => {
      resolveMutation = resolve;
    });
    vi.mocked(employeesApi.updateEmployee).mockReturnValueOnce(pendingUpdatePromise as any);

    const { result } = renderHook(() => useUpdateEmployeeMutation(), { wrapper: Wrapper });

    // Trigger update
    act(() => {
      result.current.mutate({
        id: 'emp-501',
        data: { role: 'Chief Technology Officer', salary: 250000 },
      });
    });

    // Check that cache was updated OPTIMISTICALLY before server responded
    await waitFor(() => {
      const cachedData = queryClient.getQueryData<Employee>(employeeKeys.detail('emp-501'));
      expect(cachedData?.role).toBe('Chief Technology Officer');
      expect(cachedData?.salary).toBe(250000);
    });

    // Resolve server promise
    await act(async () => {
      resolveMutation({
        ...mockEmployee,
        role: 'Chief Technology Officer',
        salary: 250000,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('rolls back optimistic update when server mutation fails', async () => {
    const { queryClient, Wrapper } = createWrapper();

    // Seed cache
    queryClient.setQueryData(employeeKeys.detail('emp-501'), mockEmployee);

    // Make mutation reject
    vi.mocked(employeesApi.updateEmployee).mockRejectedValueOnce(
      new Error('Internal server error 500')
    );

    const { result } = renderHook(() => useUpdateEmployeeMutation(), { wrapper: Wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          id: 'emp-501',
          data: { role: 'Failed Optimistic Update' },
        });
      } catch {
        // Expected mutation failure
      }
    });

    // Cache should be rolled back to original mockEmployee
    const restoredCache = queryClient.getQueryData<Employee>(employeeKeys.detail('emp-501'));
    expect(restoredCache?.role).toBe('Principal AI Architect');
  });
});
