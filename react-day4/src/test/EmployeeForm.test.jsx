import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EmployeeForm from '../features/employees/EmployeeForm';
import { ToastProvider } from '../components/Toast';
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

function renderForm(route = '/employees/new') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ToastProvider>
        <Routes>
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/:id/edit" element={<EmployeeForm />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('EmployeeForm (React Hook Form & Zod Validation)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form inputs with initial defaults', () => {
    renderForm();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position \/ role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save employee/i })).toBeInTheDocument();
  });

  it('displays client-side Zod validation errors on empty submission', async () => {
    const user = userEvent.setup();
    renderForm();

    const submitBtn = screen.getByRole('button', { name: /save employee/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/job title\/role is required/i)).toBeInTheDocument();

    // Verify API was not called
    expect(employeesApi.createEmployee).not.toHaveBeenCalled();
  });

  it('displays server-side validation error and sets field error when API rejects duplicate email', async () => {
    const user = userEvent.setup();

    // Mock API rejecting with 422 validation error
    const serverError = new Error('Validation failed: Email is already registered');
    serverError.status = 422;
    serverError.validationErrors = {
      email: 'This email is already in use by another team member.',
    };
    employeesApi.createEmployee.mockRejectedValueOnce(serverError);

    renderForm();

    // Fill valid form fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Connor');
    await user.type(screen.getByLabelText(/email address/i), 'sarah.connor@cyberdyne.io');
    await user.type(screen.getByLabelText(/position \/ role/i), 'Systems Engineer');
    await user.type(screen.getByLabelText(/annual salary/i), '95000');

    const submitBtn = screen.getByRole('button', { name: /save employee/i });
    await user.click(submitBtn);

    // Verify server error message shows up on email field and banner
    expect(
      await screen.findByText(/this email is already in use by another team member/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/submission failed/i)
    ).toBeInTheDocument();
  });

  it('prevents duplicate submissions by disabling button while in-flight', async () => {
    const user = userEvent.setup();

    // Long running promise
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    employeesApi.createEmployee.mockReturnValueOnce(promise);

    renderForm();

    await user.type(screen.getByLabelText(/first name/i), 'Kyle');
    await user.type(screen.getByLabelText(/last name/i), 'Reese');
    await user.type(screen.getByLabelText(/email address/i), 'kyle@resistance.io');
    await user.type(screen.getByLabelText(/position \/ role/i), 'Tactical Lead');
    await user.type(screen.getByLabelText(/annual salary/i), '88000');

    const submitBtn = screen.getByRole('button', { name: /save employee/i });
    await user.click(submitBtn);

    // Submit button should be disabled during flight
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/creating employee\.\.\./i)).toBeInTheDocument();

    // Clean up
    resolvePromise({ id: 'emp-999', firstName: 'Kyle', lastName: 'Reese' });
  });
});
