import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import EmployeeList from '../features/employees/EmployeeList';
import { ToastProvider } from '../components/Toast';
import * as employeesApi from '../api/employees';

vi.mock('../api/employees', async () => {
  const actual = await vi.importActual('../api/employees');
  return {
    ...actual,
    getEmployees: vi.fn(),
    deleteEmployee: vi.fn(),
  };
});

function renderEmployeeList(initialUrl = '/employees') {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <ToastProvider>
        <EmployeeList />
      </ToastProvider>
    </MemoryRouter>
  );
}

const mockResponse = {
  data: [
    {
      id: 'emp-101',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah.connor@cyberdyne.io',
      role: 'Staff Platform Engineer',
      department: 'Engineering',
      employmentType: 'Full-time',
      salary: 145000,
      startDate: '2022-03-15',
      status: 'Active',
    },
    {
      id: 'emp-102',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.vance@talentpulse.com',
      role: 'Lead Product Designer',
      department: 'Design',
      employmentType: 'Full-time',
      salary: 128000,
      startDate: '2021-08-01',
      status: 'Active',
    },
  ],
  pagination: {
    total: 2,
    page: 1,
    limit: 5,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

describe('EmployeeList (Loading, Error & List States)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading indicator while fetch is in progress', () => {
    // Hang promise to test loading state
    employeesApi.getEmployees.mockReturnValueOnce(new Promise(() => {}));

    renderEmployeeList();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading directory\.\.\./i)).toBeInTheDocument();
  });

  it('renders employee records upon successful API response', async () => {
    employeesApi.getEmployees.mockResolvedValueOnce(mockResponse);

    renderEmployeeList();

    expect(await screen.findByText('Sarah Connor')).toBeInTheDocument();
    expect(screen.getByText('Marcus Vance')).toBeInTheDocument();
    expect(screen.getByText('sarah.connor@cyberdyne.io')).toBeInTheDocument();
    expect(screen.getByText('Staff Platform Engineer')).toBeInTheDocument();
  });

  it('displays API error banner and allows user to retry', async () => {
    const user = userEvent.setup();

    // Reject first call
    employeesApi.getEmployees.mockRejectedValueOnce(new Error('Network gateway timeout 504'));
    // Resolve second call (retry)
    employeesApi.getEmployees.mockResolvedValueOnce(mockResponse);

    renderEmployeeList();

    // Expect error message
    expect(
      await screen.findByText(/directory fetch error/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/network gateway timeout 504/i)
    ).toBeInTheDocument();

    // Click Try Again
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    await user.click(retryBtn);

    // Expect list to load after retry
    expect(await screen.findByText('Sarah Connor')).toBeInTheDocument();
  });

  it('displays empty state when zero records are returned', async () => {
    employeesApi.getEmployees.mockResolvedValueOnce({
      data: [],
      pagination: { total: 0, page: 1, limit: 5, totalPages: 1 },
    });

    renderEmployeeList();

    expect(await screen.findByText(/no employees found/i)).toBeInTheDocument();
  });
});
