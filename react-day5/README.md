# NexusHR — Enterprise Employee Intelligence Dashboard (React Day 5)

A type-safe, enterprise-grade Employee Intelligence Dashboard built with React 19, strict TypeScript, TanStack Query (v5), Zustand, React Router, and Zod.

---

## 🎯 Functional Requirements Checklist

- [x] **React 19 with Strict TypeScript**: Strict compiler options (`strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`, `strictNullChecks`, `noUnusedLocals`).
- [x] **Type-Safe Domain Model**: Comprehensive `Employee`, `Department`, `EmploymentType`, `EmployeeStatus`, `PerformanceRating`, filters, and API response contracts in `src/types/employee.ts`.
- [x] **Reusable UI Components**:
  - `Button.tsx` (variants: primary, secondary, danger, ghost, outline; sizes: sm, md, lg; loading state & icons)
  - `Modal.tsx` (accessible dialog with escape listener, backdrop, and focus trap)
  - `LoadingState.tsx` (spinner & skeleton loaders with accessible `role="status"`)
  - `Badge.tsx` (status badges, department pills, performance stars)
  - `Toast.tsx` (floating toast notification provider & hook)
- [x] **React Router Routing**:
  - Executive Dashboard (`/`)
  - Employee Intelligence Directory (`/employees`)
  - Employee Details Profile (`/employees/:id`)
  - Onboard New Staff (`/employees/new`)
  - Edit Profile (`/employees/:id/edit`)
  - Catch-All 404 (`*`)
- [x] **TanStack Query (v5)**:
  - Cache management with structured query key factory (`employeeKeys.list(filters)`, `employeeKeys.detail(id)`)
  - `staleTime: 1 min`, garbage collection, and custom retry logic
  - Automatic query cache invalidation on mutations
- [x] **Search, Filter & Pagination in URL Query Params**:
  - `useSearchParams` synchronization for `search`, `department`, `status`, `employmentType`, `sort`, `order`, and `page`
  - Shareable, bookmarkable, and refresh-safe URLs
- [x] **Zustand Client UI State (`useUIStore.ts`)**:
  - Grid View vs. Table View toggle
  - Row density mode (`comfortable` vs `compact`)
  - Multi-select employee selection with batch status update action
  - Modal management
- [x] **Context API Theme Preferences (`ThemeContext.tsx`)**:
  - Dark mode & Light mode toggle with system preference detection
  - Persisted in `localStorage`
  - Sets `data-theme="dark"` / `data-theme="light"` on `document.documentElement`
- [x] **React Hook Form + Zod**:
  - Typed forms powered by `employeeFormSchema` and `@hookform/resolvers/zod`
  - Skills tagging input with dynamic add/remove
  - Real-time client-side feedback on blur/touch
- [x] **UI State Machine**:
  - Accessible loading states
  - Error alert banners with "Retry Query" action
  - Empty states with filter reset CTA
  - Background-refetch indicator (`isFetching && !isLoading`)
- [x] **Optimistic Updates & Safe Cache Invalidation**:
  - `useUpdateEmployeeMutation` immediately updates query cache on mutation (`onMutate`)
  - Snapshots previous state and rolls back cache in `onError`
  - Safely invalidates queries on `onSettled`
- [x] **Request Cancellation & Runtime Response Validation**:
  - TanStack Query `signal` forwarded to HTTP client to abort cancelled in-flight requests
  - Runtime validation of API responses via Zod schemas (`paginatedEmployeesResponseSchema.parse`, `employeeSchema.parse`)
- [x] **Automated Test Suite (Vitest + React Testing Library)**:
  - 18 automated tests covering Zustand stores, forms, API failures, cancellation, and optimistic updates.

---

## 📁 Recommended Project Structure

```
react-day5/
├── src/
│   ├── app/
│   │   ├── App.tsx               # Root application entry
│   │   ├── router.tsx            # Route tree definition
│   │   ├── queryClient.ts        # TanStack QueryClient instance & defaults
│   │   └── providers.tsx         # QueryClientProvider, ThemeProvider, ToastProvider
│   ├── api/
│   │   ├── http.ts               # HTTP client with mock REST engine & AbortSignal support
│   │   └── employees.ts          # Endpoints with runtime Zod validation
│   ├── components/
│   │   ├── Button.tsx            # Reusable typed button
│   │   ├── Modal.tsx             # Accessible dialog component
│   │   ├── LoadingState.tsx      # Accessible loading spinner & skeleton
│   │   ├── Badge.tsx             # Status, department & rating badges
│   │   ├── Toast.tsx             # Floating toast notification system
│   │   └── AppLayout.tsx         # Shared layout with header, theme toggle, DB reset, footer
│   ├── features/
│   │   └── employees/
│   │       ├── EmployeeList.tsx  # Directory with grid/table view, search, batch actions
│   │       ├── EmployeeDetails.tsx # Detail profile with metrics & skills
│   │       ├── EmployeeForm.tsx  # Shared create/edit form with Zod validation
│   │       ├── employeeSchema.ts # Zod schemas for forms and API responses
│   │       └── useEmployees.ts   # TanStack Query hooks, query keys & optimistic updates
│   ├── context/
│   │   └── ThemeContext.tsx      # Context API for Dark/Light theme preferences
│   ├── stores/
│   │   └── useUIStore.ts         # Zustand store for view mode, density, bulk selections
│   ├── types/
│   │   └── employee.ts           # TypeScript interfaces & types
│   ├── pages/
│   │   ├── Dashboard.tsx         # Executive intelligence & workforce telemetry
│   │   └── NotFound.tsx          # 404 Catch-all page
│   ├── test/
│   │   ├── setup.ts              # Vitest setup with @testing-library/jest-dom
│   │   ├── useUIStore.test.ts    # Zustand store unit tests
│   │   ├── employeesApi.test.ts  # Runtime Zod validation, error handling & AbortSignal tests
│   │   ├── EmployeeForm.test.tsx # Form validation, server error & duplicate submit tests
│   │   └── queryBehavior.test.tsx# TanStack Query lifecycle, optimistic updates & rollback tests
│   ├── index.css                 # Comprehensive CSS design system with CSS variables
│   └── main.tsx                  # React 19 entry point
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Running the Project

```bash
# Navigate to the react-day5 folder
cd react-day5

# Run development server
npm run dev

# Run strict TypeScript check
npm run typecheck

# Run Vitest test suite
npm test

# Build for production
npm run build
```
