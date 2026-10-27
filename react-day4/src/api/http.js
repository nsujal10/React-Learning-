/**
 * HTTP Client with built-in REST mock engine, localStorage persistence,
 * AbortController signal support, customizable latency, and server error handling.
 */

const STORAGE_KEY = 'talentpulse_employees_v1';

// Initial seed data for realistic HR management demo
export const INITIAL_EMPLOYEES = [
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
    notes: 'Leads core infrastructure and Kubernetes clusters.',
    createdAt: '2022-03-15T09:00:00.000Z',
    updatedAt: '2024-01-10T14:20:00.000Z',
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
    notes: 'Spearheading design system migration to Figma variables.',
    createdAt: '2021-08-01T10:00:00.000Z',
    updatedAt: '2024-02-18T11:00:00.000Z',
  },
  {
    id: 'emp-103',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@talentpulse.com',
    role: 'Senior Product Manager',
    department: 'Product',
    employmentType: 'Full-time',
    salary: 138000,
    startDate: '2023-01-10',
    status: 'On Leave',
    notes: 'Managing quarterly roadmap for enterprise integrations.',
    createdAt: '2023-01-10T08:30:00.000Z',
    updatedAt: '2024-03-01T16:45:00.000Z',
  },
  {
    id: 'emp-104',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@talentpulse.com',
    role: 'Growth Marketing Director',
    department: 'Marketing',
    employmentType: 'Full-time',
    salary: 132000,
    startDate: '2022-11-20',
    status: 'Active',
    notes: 'Responsible for B2B inbound funnel and brand campaigns.',
    createdAt: '2022-11-20T09:00:00.000Z',
    updatedAt: '2023-12-14T10:15:00.000Z',
  },
  {
    id: 'emp-105',
    firstName: 'Amina',
    lastName: 'Diallo',
    email: 'amina.diallo@talentpulse.com',
    role: 'People Operations Specialist',
    department: 'HR',
    employmentType: 'Full-time',
    salary: 82000,
    startDate: '2023-06-01',
    status: 'Active',
    notes: 'Handles employee onboarding, benefits, and workplace culture.',
    createdAt: '2023-06-01T11:00:00.000Z',
    updatedAt: '2024-04-05T09:30:00.000Z',
  },
  {
    id: 'emp-106',
    firstName: 'Liam',
    lastName: 'O\'Connor',
    email: 'liam.oconnor@talentpulse.com',
    role: 'Full Stack Engineer',
    department: 'Engineering',
    employmentType: 'Contract',
    salary: 110000,
    startDate: '2024-01-15',
    status: 'Active',
    notes: 'Contractor working on high-performance GraphQL endpoints.',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'emp-107',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@talentpulse.com',
    role: 'Senior Financial Analyst',
    department: 'Finance',
    employmentType: 'Full-time',
    salary: 118000,
    startDate: '2022-05-10',
    status: 'Active',
    notes: 'Conducts quarterly budget variance and revenue forecasting.',
    createdAt: '2022-05-10T10:00:00.000Z',
    updatedAt: '2023-11-20T12:00:00.000Z',
  },
  {
    id: 'emp-108',
    firstName: 'Julian',
    lastName: 'Navarro',
    email: 'julian.navarro@talentpulse.com',
    role: 'Operations Coordinator',
    department: 'Operations',
    employmentType: 'Part-time',
    salary: 48000,
    startDate: '2023-09-01',
    status: 'Terminated',
    notes: 'Previous operations assistant. Departed in Q1.',
    createdAt: '2023-09-01T08:00:00.000Z',
    updatedAt: '2024-02-01T17:00:00.000Z',
  },
  {
    id: 'emp-109',
    firstName: 'Chloe',
    lastName: 'Dupont',
    email: 'chloe.dupont@talentpulse.com',
    role: 'Junior Frontend Developer',
    department: 'Engineering',
    employmentType: 'Intern',
    salary: 42000,
    startDate: '2024-03-01',
    status: 'Active',
    notes: 'Intern contributing to accessibility audits and UI components.',
    createdAt: '2024-03-01T09:30:00.000Z',
    updatedAt: '2024-03-01T09:30:00.000Z',
  },
];

export class HttpError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
    this.validationErrors = data?.errors || null;
  }
}

// Storage helpers
function getStoredEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      return [...INITIAL_EMPLOYEES];
    }
    return JSON.parse(raw);
  } catch {
    return [...INITIAL_EMPLOYEES];
  }
}

function saveStoredEmployees(employees) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function resetDatabase() {
  saveStoredEmployees(INITIAL_EMPLOYEES);
  return [...INITIAL_EMPLOYEES];
}

// Latency simulator that respects AbortSignal
const sleep = (ms, signal) => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('The operation was aborted.', 'AbortError'));
    }
    const timer = setTimeout(() => {
      resolve();
    }, ms);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    });
  });
};

/**
 * Mock REST API Server Dispatcher
 */
async function mockFetch(url, options = {}) {
  const { method = 'GET', body, signal, delay = 250 } = options;

  // Simulate network latency (0 in test environment if configured)
  const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  const simulatedDelay = isTest ? (delay > 0 ? 10 : 0) : delay;
  if (simulatedDelay > 0) {
    await sleep(simulatedDelay, signal);
  }

  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  let employees = getStoredEmployees();

  // ROUTE: GET /api/employees
  if (pathname === '/api/employees' && method === 'GET') {
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const sortField = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    let filtered = employees.filter((emp) => {
      const matchesSearch =
        !search ||
        emp.firstName.toLowerCase().includes(search) ||
        emp.lastName.toLowerCase().includes(search) ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.role.toLowerCase().includes(search) ||
        emp.department.toLowerCase().includes(search);

      const matchesDept = !department || emp.department === department;
      const matchesStatus = !status || emp.status === status;

      return matchesSearch && matchesDept && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'name') {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));
    const start = (validPage - 1) * limit;
    const paginatedItems = filtered.slice(start, start + limit);

    return {
      status: 200,
      data: {
        data: paginatedItems,
        pagination: {
          total,
          page: validPage,
          limit,
          totalPages,
          hasNextPage: validPage < totalPages,
          hasPrevPage: validPage > 1,
        },
      },
    };
  }

  // ROUTE: GET /api/employees/:id
  const matchDetail = pathname.match(/^\/api\/employees\/([^/]+)$/);
  if (matchDetail && method === 'GET') {
    const id = matchDetail[1];
    const employee = employees.find((e) => e.id === id);
    if (!employee) {
      throw new HttpError(`Employee with ID "${id}" was not found`, 404, {
        message: 'Employee not found',
      });
    }
    return { status: 200, data: employee };
  }

  // ROUTE: POST /api/employees
  if (pathname === '/api/employees' && method === 'POST') {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;

    // Check duplicate email (server-side validation simulation)
    const emailConflict = employees.find(
      (e) => e.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (emailConflict) {
      throw new HttpError('Validation failed: Email is already registered', 422, {
        message: 'A registered employee already exists with this email address.',
        errors: {
          email: 'This email is already in use by another team member.',
        },
      });
    }

    const newEmployee = {
      ...payload,
      id: `emp-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    employees.unshift(newEmployee);
    saveStoredEmployees(employees);

    return { status: 201, data: newEmployee };
  }

  // ROUTE: PATCH /api/employees/:id
  if (matchDetail && (method === 'PATCH' || method === 'PUT')) {
    const id = matchDetail[1];
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new HttpError(`Employee with ID "${id}" was not found`, 404, {
        message: 'Employee not found',
      });
    }

    // Check duplicate email against other records
    if (payload.email) {
      const emailConflict = employees.find(
        (e) => e.id !== id && e.email.toLowerCase() === payload.email.toLowerCase()
      );
      if (emailConflict) {
        throw new HttpError('Validation failed: Email is already registered', 422, {
          message: 'A registered employee already exists with this email address.',
          errors: {
            email: 'This email is already in use by another team member.',
          },
        });
      }
    }

    const updated = {
      ...employees[index],
      ...payload,
      id,
      updatedAt: new Date().toISOString(),
    };

    employees[index] = updated;
    saveStoredEmployees(employees);

    return { status: 200, data: updated };
  }

  // ROUTE: DELETE /api/employees/:id
  if (matchDetail && method === 'DELETE') {
    const id = matchDetail[1];
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new HttpError(`Employee with ID "${id}" was not found`, 404, {
        message: 'Employee not found',
      });
    }

    const [deleted] = employees.splice(index, 1);
    saveStoredEmployees(employees);

    return { status: 200, data: { success: true, deleted } };
  }

  // Auth mock: POST /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    if (payload.email === 'admin@talentpulse.com' && payload.password === 'admin123') {
      return {
        status: 200,
        data: {
          token: 'mock-jwt-token-xyz-123456789',
          user: {
            id: 'usr-001',
            name: 'Alex Morgan',
            email: 'admin@talentpulse.com',
            role: 'HR Administrator',
          },
        },
      };
    }
    throw new HttpError('Invalid email or password', 401, {
      message: 'Invalid credentials. Please use admin@talentpulse.com / admin123',
    });
  }

  throw new HttpError(`Cannot ${method} ${pathname}`, 404);
}

/**
 * Universal HTTP client wrapper
 */
export async function httpClient(endpoint, options = {}) {
  const { headers = {}, body, ...rest } = options;

  const mergedHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  // If endpoint is a simulated API endpoint, route to mock server dispatcher
  if (endpoint.startsWith('/api/')) {
    const response = await mockFetch(endpoint, {
      ...rest,
      headers: mergedHeaders,
      body,
    });
    return response.data;
  }

  // Real fetch fallback if configured
  const response = await fetch(endpoint, {
    ...rest,
    headers: mergedHeaders,
    body: typeof body === 'object' ? JSON.stringify(body) : body,
  });

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // not json
    }
    throw new HttpError(
      errorData?.message || `HTTP error ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}
