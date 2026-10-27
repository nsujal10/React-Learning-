import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmployeeForm from '../features/employees/EmployeeForm';
import ToastProvider from '../components/Toast';
import * as employeesApi from '../api/employees';

vi.mock('../api/employees', async () => {
  const actual = await vi.importActual('../api/employees');
  return {
    ...actual,
    createEmployee: vi.fn(),
    updateEmployee: vi.fn(),
    getEmployeeById: vi.fn(),
  };
});

function renderFormWithProviders(initialRoute = '/employees/new') {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ToastProvider>
          <Routes>
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id/edit" element={<EmployeeForm />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('EmployeeForm (React Hook Form & Zod Validation)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with input fields and save button', () => {
    renderFormWithProviders();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role \/ title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save employee profile/i })).toBeInTheDocument();
  });

  it('displays client-side Zod errors when submitting required fields empty', async () => {
    const user = userEvent.setup();
    renderFormWithProviders();

    const submitBtn = screen.getByRole('button', { name: /save employee profile/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/job title is required/i)).toBeInTheDocument();

    expect(employeesApi.createEmployee).not.toHaveBeenCalled();
  });

  it('displays server-side validation error when backend rejects duplicate email', async () => {
    const user = userEvent.setup();

    const serverError = new Error('Email address already registered') as any;
    serverError.status = 422;
    serverError.validationErrors = {
      email: 'This work email is already taken by another staff member.',
    };
    vi.mocked(employeesApi.createEmployee).mockRejectedValueOnce(serverError);

    renderFormWithProviders();

    await user.type(screen.getByLabelText(/first name/i), 'Ada');
    await user.type(screen.getByLabelText(/last name/i), 'Lovelace');
    await user.type(screen.getByLabelText(/work email/i), 'evelyn.vance@nexushr.io');
    await user.type(screen.getByLabelText(/role \/ title/i), 'Computing Pioneer');

    const submitBtn = screen.getByRole('button', { name: /save employee profile/i });
    await user.click(submitBtn);

    expect(
      await screen.findByText(/this work email is already taken by another staff member/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/submission error/i)).toBeInTheDocument();
  });

  it('disables submit button and shows loading spinner while in-flight', async () => {
    const user = userEvent.setup();

    let resolver: any;
    const pendingPromise = new Promise((resolve) => {
      resolver = resolve;
    });
    vi.mocked(employeesApi.createEmployee).mockReturnValueOnce(pendingPromise as any);

    renderFormWithProviders();

    await user.type(screen.getByLabelText(/first name/i), 'Grace');
    await user.type(screen.getByLabelText(/last name/i), 'Hopper');
    await user.type(screen.getByLabelText(/work email/i), 'grace.hopper@nexushr.io');
    await user.type(screen.getByLabelText(/role \/ title/i), 'Systems Pioneer');

    const submitBtn = screen.getByRole('button', { name: /save employee profile/i });
    await user.click(submitBtn);

    expect(submitBtn).toBeDisabled();

    resolver({
      id: 'emp-999',
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace.hopper@nexushr.io',
      role: 'Systems Pioneer',
      department: 'Engineering',
      employmentType: 'Full-time',
      salary: 175000,
      startDate: '2024-01-01',
      status: 'Active',
      performanceRating: 5,
      skills: ['COBOL'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
});
