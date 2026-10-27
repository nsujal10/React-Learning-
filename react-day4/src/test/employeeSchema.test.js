import { describe, it, expect } from 'vitest';
import { employeeSchema } from '../features/employees/employeeSchema';

describe('employeeSchema (Zod Validation)', () => {
  const validData = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    role: 'Software Architect',
    department: 'Engineering',
    employmentType: 'Full-time',
    salary: 120000,
    startDate: '2023-01-15',
    status: 'Active',
    notes: 'Key engineer',
  };

  it('passes validation for valid employee data', () => {
    const result = employeeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails when required fields are missing or empty', () => {
    const invalidData = {
      ...validData,
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    };
    const result = employeeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    const errors = result.error.flatten().fieldErrors;
    expect(errors.firstName).toBeDefined();
    expect(errors.lastName).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.role).toBeDefined();
  });

  it('rejects invalid email formats', () => {
    const invalidEmails = ['plainaddress', 'missing@domain', '@nodomain.com', 'spaces in@mail.com'];
    invalidEmails.forEach((email) => {
      const result = employeeSchema.safeParse({ ...validData, email });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    });
  });

  it('validates salary rules (positive, min limit)', () => {
    const zeroSalary = employeeSchema.safeParse({ ...validData, salary: 0 });
    expect(zeroSalary.success).toBe(false);

    const belowMinSalary = employeeSchema.safeParse({ ...validData, salary: 500 });
    expect(belowMinSalary.success).toBe(false);

    const validSalary = employeeSchema.safeParse({ ...validData, salary: 75000 });
    expect(validSalary.success).toBe(true);
  });

  it('validates department and employmentType enums', () => {
    const invalidDept = employeeSchema.safeParse({ ...validData, department: 'NonExistentDept' });
    expect(invalidDept.success).toBe(false);

    const invalidType = employeeSchema.safeParse({ ...validData, employmentType: 'FreelanceSpecial' });
    expect(invalidType.success).toBe(false);
  });

  it('validates startDate is a valid calendar date', () => {
    const invalidDate = employeeSchema.safeParse({ ...validData, startDate: 'not-a-date' });
    expect(invalidDate.success).toBe(false);
  });
});
