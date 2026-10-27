import type { Employee } from '../types/employee';

const STORAGE_KEY = 'nexushr_enterprise_employees_v1';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
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
    skills: ['PyTorch', 'Distributed Systems', 'LLMs', 'Kubernetes'],
    notes: 'Key architect for internal semantic retrieval and evaluation pipelines.',
    createdAt: '2021-04-10T08:00:00.000Z',
    updatedAt: '2024-02-15T10:00:00.000Z',
  },
  {
    id: 'emp-502',
    firstName: 'Tariq',
    lastName: 'Mansour',
    email: 'tariq.mansour@nexushr.io',
    role: 'Staff Product Manager',
    department: 'Product',
    employmentType: 'Full-time',
    salary: 178000,
    startDate: '2022-01-15',
    status: 'Active',
    performanceRating: 4,
    skills: ['Roadmapping', 'Telemetry', 'User Research', 'A/B Testing'],
    notes: 'Spearheading enterprise telemetry and RBAC feature delivery.',
    createdAt: '2022-01-15T09:00:00.000Z',
    updatedAt: '2024-03-01T14:30:00.000Z',
  },
  {
    id: 'emp-503',
    firstName: 'Seraphina',
    lastName: 'Chen',
    email: 'seraphina.chen@nexushr.io',
    role: 'Lead Design Systems Engineer',
    department: 'Design',
    employmentType: 'Full-time',
    salary: 165000,
    startDate: '2022-06-01',
    status: 'Active',
    performanceRating: 5,
    skills: ['Design Systems', 'Figma Tokens', 'Accessibility', 'CSS Architecture'],
    notes: 'Crafted the WCAG AAA enterprise design token library.',
    createdAt: '2022-06-01T11:00:00.000Z',
    updatedAt: '2024-01-20T09:15:00.000Z',
  },
  {
    id: 'emp-504',
    firstName: 'Lucas',
    lastName: 'Moretti',
    email: 'lucas.moretti@nexushr.io',
    role: 'Senior DevOps Specialist',
    department: 'Engineering',
    employmentType: 'Full-time',
    salary: 155000,
    startDate: '2023-02-20',
    status: 'On Leave',
    performanceRating: 4,
    skills: ['Terraform', 'AWS', 'ArgoCD', 'Prometheus'],
    notes: 'Currently on parental leave through Q2.',
    createdAt: '2023-02-20T10:30:00.000Z',
    updatedAt: '2024-02-10T16:00:00.000Z',
  },
  {
    id: 'emp-505',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@nexushr.io',
    role: 'Chief Legal Counsel',
    department: 'Legal',
    employmentType: 'Full-time',
    salary: 195000,
    startDate: '2020-11-05',
    status: 'Active',
    performanceRating: 5,
    skills: ['GDPR', 'Compliance', 'IP Licensing', 'Commercial Law'],
    notes: 'Oversees intellectual property and global regulatory compliance.',
    createdAt: '2020-11-05T08:30:00.000Z',
    updatedAt: '2023-11-15T12:00:00.000Z',
  },
  {
    id: 'emp-506',
    firstName: 'Henrik',
    lastName: 'Lindqvist',
    email: 'henrik.lindqvist@nexushr.io',
    role: 'Financial Planning Director',
    department: 'Finance',
    employmentType: 'Full-time',
    salary: 182000,
    startDate: '2021-08-18',
    status: 'Active',
    performanceRating: 4,
    skills: ['SaaS Metrics', 'Capital Allocation', 'Forecasting', 'Auditing'],
    notes: 'Directs budget planning and financial modeling.',
    createdAt: '2021-08-18T09:45:00.000Z',
    updatedAt: '2024-01-05T15:20:00.000Z',
  },
  {
    id: 'emp-507',
    firstName: 'Maya',
    lastName: 'Patel',
    email: 'maya.patel@nexushr.io',
    role: 'Talent Acquisition Partner',
    department: 'HR',
    employmentType: 'Full-time',
    salary: 98000,
    startDate: '2023-04-12',
    status: 'Active',
    performanceRating: 3,
    skills: ['Technical Sourcing', 'Candidate Experience', 'Compensation Benchmarking'],
    notes: 'Handles engineering hiring pipeline and university relations.',
    createdAt: '2023-04-12T10:00:00.000Z',
    updatedAt: '2023-12-10T11:00:00.000Z',
  },
  {
    id: 'emp-508',
    firstName: 'Dmitri',
    lastName: 'Volkov',
    email: 'dmitri.volkov@nexushr.io',
    role: 'Frontend Performance Engineer',
    department: 'Engineering',
    employmentType: 'Contract',
    salary: 130000,
    startDate: '2024-01-10',
    status: 'Probation',
    performanceRating: 3,
    skills: ['Web Vitals', 'WASM', 'React 19', 'Performance Profiling'],
    notes: 'Contractor optimizing bundle load and hydration times.',
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2024-01-10T09:00:00.000Z',
  },
  {
    id: 'emp-509',
    firstName: 'Zoe',
    lastName: 'Kaufman',
    email: 'zoe.kaufman@nexushr.io',
    role: 'Enterprise Account Executive',
    department: 'Sales',
    employmentType: 'Full-time',
    salary: 140000,
    startDate: '2022-09-01',
    status: 'Terminated',
    notes: 'Transferred out of territory in Q4.',
    performanceRating: 2,
    skills: ['Solution Selling', 'Contract Negotiation', 'CRM'],
    createdAt: '2022-09-01T08:00:00.000Z',
    updatedAt: '2023-12-31T17:00:00.000Z',
  },
  {
    id: 'emp-510',
    firstName: 'Gabriel',
    lastName: 'Silva',
    email: 'gabriel.silva@nexushr.io',
    role: 'Growth Marketing Lead',
    department: 'Marketing',
    employmentType: 'Full-time',
    salary: 125000,
    startDate: '2023-08-01',
    status: 'Active',
    performanceRating: 4,
    skills: ['SEO', 'Conversion Optimization', 'Performance Ads', 'Lifecycle Email'],
    notes: 'Scaled organic acquisition by 65% across technical blogs.',
    createdAt: '2023-08-01T09:30:00.000Z',
    updatedAt: '2024-02-28T14:10:00.000Z',
  },
];

export class HttpError extends Error {
  status: number;
  data: any;
  validationErrors?: Record<string, string>;

  constructor(message: string, status = 500, data: any = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
    this.validationErrors = data?.errors;
  }
}

function getStoredEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      return [...INITIAL_EMPLOYEES];
    }
    return JSON.parse(raw) as Employee[];
  } catch {
    return [...INITIAL_EMPLOYEES];
  }
}

function saveStoredEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error('Failed to persist to localStorage', err);
  }
}

export function resetDatabase(): Employee[] {
  saveStoredEmployees(INITIAL_EMPLOYEES);
  return [...INITIAL_EMPLOYEES];
}

const sleep = (ms: number, signal?: AbortSignal): Promise<void> => {
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

interface RequestOptions {
  method?: string;
  body?: any;
  signal?: AbortSignal;
  delay?: number;
  headers?: Record<string, string>;
}

export async function httpClient<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, delay = 200 } = options;

  // Simulate network latency (respects AbortSignal)
  const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  const simulatedDelay = isTest ? (delay > 0 ? 5 : 0) : delay;
  if (simulatedDelay > 0) {
    await sleep(simulatedDelay, signal);
  }

  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  const employees = getStoredEmployees();

  // ROUTE: GET /api/employees
  if (pathname === '/api/employees' && method === 'GET') {
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const employmentType = searchParams.get('employmentType') || '';
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    const filtered = employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.role.toLowerCase().includes(search) ||
        emp.department.toLowerCase().includes(search) ||
        emp.skills.some((s) => s.toLowerCase().includes(search));

      const matchesDept = !department || emp.department === department;
      const matchesStatus = !status || emp.status === status;
      const matchesType = !employmentType || emp.employmentType === employmentType;

      return matchesSearch && matchesDept && matchesStatus && matchesType;
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA: any = a[sort as keyof Employee];
      let valB: any = b[sort as keyof Employee];

      if (sort === 'name') {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));
    const start = (validPage - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      data: paginated,
      pagination: {
        total,
        page: validPage,
        limit,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      },
    } as unknown as T;
  }

  // ROUTE: GET /api/employees/:id
  const matchDetail = pathname.match(/^\/api\/employees\/([^/]+)$/);
  if (matchDetail && method === 'GET') {
    const id = matchDetail[1];
    const employee = employees.find((e) => e.id === id);
    if (!employee) {
      throw new HttpError(`Employee "${id}" was not found`, 404, {
        message: 'Employee record does not exist in the database.',
      });
    }
    return employee as unknown as T;
  }

  // ROUTE: POST /api/employees
  if (pathname === '/api/employees' && method === 'POST') {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;

    // Check duplicate email conflict
    const conflict = employees.find(
      (e) => e.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (conflict) {
      throw new HttpError('Email address already registered', 422, {
        message: 'This email is already registered to another active profile.',
        errors: {
          email: 'This work email is already taken by another staff member.',
        },
      });
    }

    const newEmp: Employee = {
      ...payload,
      id: `emp-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    employees.unshift(newEmp);
    saveStoredEmployees(employees);

    return newEmp as unknown as T;
  }

  // ROUTE: PATCH /api/employees/:id
  if (matchDetail && (method === 'PATCH' || method === 'PUT')) {
    const id = matchDetail[1];
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new HttpError(`Employee "${id}" was not found`, 404, {
        message: 'Employee not found',
      });
    }

    if (payload.email) {
      const conflict = employees.find(
        (e) => e.id !== id && e.email.toLowerCase() === payload.email.toLowerCase()
      );
      if (conflict) {
        throw new HttpError('Email address already registered', 422, {
          message: 'This email is already in use by another employee.',
          errors: {
            email: 'This work email is already taken by another staff member.',
          },
        });
      }
    }

    const updated: Employee = {
      ...employees[index]!,
      ...payload,
      id: id!,
      updatedAt: new Date().toISOString(),
    };

    employees[index] = updated;
    saveStoredEmployees(employees);

    return updated as unknown as T;
  }

  // ROUTE: DELETE /api/employees/:id
  if (matchDetail && method === 'DELETE') {
    const id = matchDetail[1];
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new HttpError(`Employee "${id}" was not found`, 404, {
        message: 'Employee not found',
      });
    }

    const [deleted] = employees.splice(index, 1);
    saveStoredEmployees(employees);

    return { success: true, deleted } as unknown as T;
  }

  // ROUTE: POST /api/employees/batch-status
  if (pathname === '/api/employees/batch-status' && method === 'POST') {
    const { ids, status } = typeof body === 'string' ? JSON.parse(body) : body;
    let modifiedCount = 0;
    employees.forEach((emp) => {
      if (ids.includes(emp.id)) {
        emp.status = status;
        emp.updatedAt = new Date().toISOString();
        modifiedCount++;
      }
    });
    saveStoredEmployees(employees);
    return { success: true, modifiedCount } as unknown as T;
  }

  throw new HttpError(`Unhandled route: ${method} ${pathname}`, 404);
}
