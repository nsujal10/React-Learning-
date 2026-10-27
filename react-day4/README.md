# TalentPulse — Employee Management System (React Day 4)

A production-grade, interview-ready Employee Management Application built with React 19, React Router, React Hook Form, Zod, and full REST CRUD integration.

---

## 🎯 Features Checklist

- [x] **React 19 & React Router (v7)**: Shared responsive layout (`AppLayout`) with active navigation and header/footer branding.
- [x] **Core Directory Views**:
  - Employee Directory (`/employees`)
  - Employee Details (`/employees/:id`)
  - Create Employee (`/employees/new`)
  - Edit Employee (`/employees/:id/edit`)
  - HR Executive Dashboard (`/`)
- [x] **Dynamic Route Parameters**: Deep-linked employee views utilizing dynamic `:id` params with clean unmount/fetch lifecycle.
- [x] **URL Query State Synchronization**: Real-time URL synchronization for search queries, department/status filters, sorting (`sort` & `order`), and pagination (`page`). Enables bookmarking, browser back/forward, and direct link sharing.
- [x] **Full REST API Integration**:
  - `GET /api/employees` (filtered, sorted, paginated)
  - `GET /api/employees/:id`
  - `POST /api/employees`
  - `PATCH /api/employees/:id`
  - `DELETE /api/employees/:id`
  - Client REST engine with `localStorage` persistence and initial seed database.
- [x] **Complete UI State Machine**:
  - **Loading**: Skeleton spinners with accessible `role="status"`
  - **Error**: Error banner with status details and "Try Again" retry action
  - **Empty**: Friendly empty state with "Clear Filters" or "Add Employee" CTA
  - **Success**: Non-blocking toast notifications with auto-dismiss
- [x] **Debounced Search & Request Cancellation**:
  - Custom `useDebouncedValue` hook
  - `AbortController` cancellation for in-flight requests on rapid keystrokes to eliminate search race conditions.
- [x] **Robust Form Validation**:
  - Powered by **React Hook Form** + **Zod** schema resolver
  - Validates names, email format, salary boundaries, department/status enums, calendar dates.
- [x] **Duplicate Submission Prevention & Server Errors**:
  - Submits are guarded with disabled state and loading indicators
  - Server-side 422 conflict errors (e.g., duplicate emails) are mapped back to form fields and displayed in error banners.
- [x] **Auth & Protected Routes**:
  - Client-side protected route guard (`ProtectedRoute`)
  - Dedicated `/login` page with mock credentials autofill helper
  - Preserves requested URL via `location.state.from` for post-login redirect.
- [x] **Catch-All 404 & Direct Refreshes**:
  - Handled via `*` wildcard route to custom `NotFound` page with quick navigation back.
- [x] **Comprehensive Test Suite (Vitest + React Testing Library)**:
  - 19 automated tests covering schema validation, form submission & server errors, directory loading/empty/retry states, search debounce & race conditions, and auth guards.

---

## 📁 Architecture & Folder Structure

```
react-day4/
├── src/
│   ├── api/
│   │   ├── http.js               # Universal fetch client, mock REST engine & AbortController support
│   │   └── employees.js          # REST resource functions (GET, POST, PATCH, DELETE)
│   ├── components/
│   │   ├── AppLayout.jsx         # Shared layout (Navbar, user badge, reset tool, outlet, footer)
│   │   ├── LoadingState.jsx      # Loading spinner & accessible status
│   │   ├── ErrorMessage.jsx      # Error banner with retry callback
│   │   └── Toast.jsx             # Toast notification provider & hook
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthContext.jsx   # Authentication state, login & logout
│   │   │   └── ProtectedRoute.jsx# Route guard redirecting unauthenticated users to /login
│   │   └── employees/
│   │       ├── EmployeeList.jsx  # Directory table, search, filters, sorting & pagination
│   │       ├── EmployeeDetails.jsx # Detailed profile view with dynamic :id parameter
│   │       ├── EmployeeForm.jsx  # Shared create/edit form with React Hook Form + Zod
│   │       ├── employeeSchema.js # Zod schema validation rules & constants
│   │       └── useEmployees.js   # Custom directory hook (URL params, debounce, cancellation)
│   ├── hooks/
│   │   └── useDebouncedValue.js  # Debounce hook
│   ├── pages/
│   │   ├── Home.jsx              # Executive dashboard
│   │   ├── Login.jsx             # Public login screen
│   │   └── NotFound.jsx          # 404 Catch-all error page
│   ├── routes/
│   │   └── AppRoutes.jsx         # Route hierarchy (public, protected, dynamic, catch-all)
│   ├── test/
│   │   ├── setup.js              # Vitest setup with @testing-library/jest-dom
│   │   ├── employeeSchema.test.js# Schema unit tests
│   │   ├── EmployeeForm.test.jsx # Form validation, duplicate submit & server error tests
│   │   ├── EmployeeList.test.jsx # Loading, empty, list, and error retry tests
│   │   ├── searchRaceCondition.test.jsx # Debounce & cancellation race condition tests
│   │   └── auth.test.jsx         # Auth & protected route tests
│   ├── App.jsx                   # Root application wrapper
│   ├── index.css                 # Modern CSS design system
│   └── main.jsx                  # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Running Locally

```bash
# Navigate to the project directory
cd react-day4

# Install dependencies (already pre-installed)
npm install

# Start Vite dev server
npm run dev

# Run Vitest test suite
npm test

# Build for production
npm run build
```

---

## 🔑 Demo Login Credentials
- **Email**: `admin@talentpulse.com`
- **Password**: `admin123`
*(A "Fill Credentials" button is also provided directly on the login page)*
