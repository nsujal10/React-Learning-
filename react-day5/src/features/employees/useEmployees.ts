import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  batchUpdateEmployeeStatus,
} from '../../api/employees';
import type {
  Employee,
  EmployeeFilters,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeStatus,
  PaginatedResponse,
} from '../../types/employee';

/**
 * Query Key Factory for clean cache invalidation and query targeting
 */
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: EmployeeFilters) => [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated and filtered employees with request cancellation
 */
export function useEmployeesQuery(filters: EmployeeFilters = {}) {
  return useQuery<PaginatedResponse<Employee>, Error>({
    queryKey: employeeKeys.list(filters),
    queryFn: ({ signal }) => getEmployees(filters, { signal }),
  });
}

/**
 * Hook to fetch a single employee by ID with request cancellation
 */
export function useEmployeeDetailQuery(id: string | undefined) {
  return useQuery<Employee, Error>({
    queryKey: employeeKeys.detail(id || ''),
    queryFn: ({ signal }) => {
      if (!id) throw new Error('Employee ID is required');
      return getEmployeeById(id, { signal });
    },
    enabled: Boolean(id),
  });
}

/**
 * Mutation for creating a new employee
 */
export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => createEmployee(input),
    onSuccess: (newEmployee) => {
      // Invalidate directory list to show the new record
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      // Set created employee in cache immediately
      queryClient.setQueryData(employeeKeys.detail(newEmployee.id), newEmployee);
    },
  });
}

/**
 * Mutation for updating an employee with Optimistic Updates & Safe Cache Invalidation
 */
export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeInput }) =>
      updateEmployee(id, data),

    // OPTIMISTIC UPDATE: Executed before mutation function runs
    onMutate: async ({ id, data }) => {
      // 1. Cancel ongoing queries for this employee detail to prevent overwriting optimistic state
      await queryClient.cancelQueries({ queryKey: employeeKeys.detail(id) });

      // 2. Snapshot previous value for rollback
      const previousEmployee = queryClient.getQueryData<Employee>(employeeKeys.detail(id));

      // 3. Optimistically update the single employee detail cache
      if (previousEmployee) {
        queryClient.setQueryData<Employee>(employeeKeys.detail(id), {
          ...previousEmployee,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      // Return context with snapshot
      return { previousEmployee };
    },

    // If mutation fails, rollback cache to snapshot
    onError: (_err, { id }, context) => {
      if (context?.previousEmployee) {
        queryClient.setQueryData(employeeKeys.detail(id), context.previousEmployee);
      }
    },

    // Always invalidate after error or success to synchronize with actual server state
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

/**
 * Mutation for deleting an employee
 */
export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: (_data, id) => {
      // Remove detail from cache
      queryClient.removeQueries({ queryKey: employeeKeys.detail(id) });
      // Invalidate directory list queries
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

/**
 * Mutation for bulk updating employee status
 */
export function useBatchUpdateStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: EmployeeStatus }) =>
      batchUpdateEmployeeStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}
