import { httpClient, resetDatabase } from './http';

/**
 * REST API client functions for Employee resource
 */

export async function getEmployees({
  search = '',
  department = '',
  status = '',
  sort = 'name',
  order = 'asc',
  page = 1,
  limit = 5,
  signal,
} = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (department) params.set('department', department);
  if (status) params.set('status', status);
  if (sort) params.set('sort', sort);
  if (order) params.set('order', order);
  if (page) params.set('page', page.toString());
  if (limit) params.set('limit', limit.toString());

  const query = params.toString() ? `?${params.toString()}` : '';
  return httpClient(`/api/employees${query}`, { method: 'GET', signal });
}

export async function getEmployeeById(id, { signal } = {}) {
  return httpClient(`/api/employees/${id}`, { method: 'GET', signal });
}

export async function createEmployee(data, { signal } = {}) {
  return httpClient('/api/employees', {
    method: 'POST',
    body: JSON.stringify(data),
    signal,
  });
}

export async function updateEmployee(id, data, { signal } = {}) {
  return httpClient(`/api/employees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    signal,
  });
}

export async function deleteEmployee(id, { signal } = {}) {
  return httpClient(`/api/employees/${id}`, {
    method: 'DELETE',
    signal,
  });
}

export function resetEmployeesToDefault() {
  return resetDatabase();
}
