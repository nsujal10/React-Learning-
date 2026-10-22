import { useState } from "react";
import "./App.css";

const initialEmployees = [
  { id: 1, name: "Amit Sharma", role: "Frontend Developer", department: "Engineering", email: "amit.sharma@example.com", location: "Bangalore" },
  { id: 2, name: "Neha Verma", role: "UI Designer", department: "Design", email: "neha.verma@example.com", location: "Mumbai" },
  { id: 3, name: "Rahul Patel", role: "Backend Developer", department: "Engineering", email: "rahul.patel@example.com", location: "Pune" },
  { id: 4, name: "Priya Singh", role: "QA Engineer", department: "Quality", email: "priya.singh@example.com", location: "Delhi" },
  { id: 5, name: "Kavita Rao", role: "Product Manager", department: "Product", email: "kavita.rao@example.com", location: "Hyderabad" },
  { id: 6, name: "Arjun Nair", role: "DevOps Engineer", department: "Engineering", email: "arjun.nair@example.com", location: "Bangalore" }
];

function getDepartmentBadgeClass(dept) {
  switch (dept.toLowerCase()) {
    case "engineering":
      return "badge-engineering";
    case "design":
      return "badge-design";
    case "quality":
      return "badge-quality";
    case "product":
      return "badge-product";
    default:
      return "badge-default";
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

export function EmployeeCard({ employee, onLike, likeCount = 0 }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <article className="employee-card" id={`employee-card-${employee.id}`}>
      <div className="card-header">
        <div className="avatar-circle" aria-hidden="true">
          {getInitials(employee.name)}
        </div>
        <div className="header-info">
          <h2 className="employee-name">{employee.name}</h2>
          <p className="employee-role">{employee.role}</p>
        </div>
        <span className={`badge ${getDepartmentBadgeClass(employee.department)}`}>
          {employee.department}
        </span>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-secondary"
          id={`toggle-details-btn-${employee.id}`}
          onClick={() => setShowDetails(previous => !previous)}
          aria-expanded={showDetails}
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>

        <button
          type="button"
          className="btn btn-primary btn-like"
          id={`like-btn-${employee.id}`}
          onClick={() => onLike(employee.id)}
        >
          <span className="heart-icon">❤️</span> Like
          <span className="like-badge">{likeCount}</span>
        </button>
      </div>

      {showDetails && (
        <div className="employee-details" id={`details-${employee.id}`}>
          <div className="detail-item">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{employee.department}</span>
          </div>
          {employee.email && (
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{employee.email}</span>
            </div>
          )}
          {employee.location && (
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{employee.location}</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function EmployeeList({ employees, onLike, likes = {} }) {
  if (employees.length === 0) {
    return (
      <div className="no-results" id="no-results-message">
        <div className="no-results-icon">🔍</div>
        <h3>No employees found</h3>
        <p>No team members match your search criteria. Try a different query!</p>
      </div>
    );
  }

  return (
    <div className="employee-list" id="employee-list">
      {employees.map(employee => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onLike={onLike}
          likeCount={likes[employee.id] ?? 0}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [employees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [likes, setLikes] = useState({});

  // Derived filtered employees state
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.role.toLowerCase().includes(search.toLowerCase()) ||
    employee.department.toLowerCase().includes(search.toLowerCase())
  );

  function handleLike(employeeId) {
    setLikes(previous => ({
      ...previous,
      [employeeId]: (previous[employeeId] ?? 0) + 1
    }));
  }

  const totalLikes = Object.values(likes).reduce((acc, curr) => acc + curr, 0);

  return (
    <main className="app-container">
      {/* Top Banner */}
      <header className="app-header">
        <div className="header-content">
          <div className="title-group">
            <span className="project-tag">Hands-on Mini Project</span>
            <h1 className="main-title">Employee Directory</h1>
            <p className="subtitle">
              Browse team members, filter by name or department, and give appreciation.
            </p>
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-value">{employees.length}</span>
              <span className="stat-label">Total Staff</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{filteredEmployees.length}</span>
              <span className="stat-label">Matching</span>
            </div>
            <div className="stat-card highlight">
              <span className="stat-value">{totalLikes}</span>
              <span className="stat-label">Total Likes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter Toolbar */}
      <section className="search-section" aria-label="Search and filter controls">
        <div className="search-box">
          <label htmlFor="employee-search" className="search-label">
            Search employees
          </label>
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              id="employee-search"
              type="text"
              className="search-input"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search by name, role, or department..."
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <p className="results-counter" id="matching-employees-count">
          Matching employees: <strong>{filteredEmployees.length}</strong>
        </p>
      </section>

      {/* Main Content Layout: Directory Grid + Likes Sidebar/Panel */}
      <div className="content-layout">
        <section className="directory-column" aria-label="Employee List">
          <EmployeeList
            employees={filteredEmployees}
            onLike={handleLike}
            likes={likes}
          />
        </section>

        {/* Employee Likes Leaderboard */}
        <aside className="likes-summary-panel" aria-label="Likes Overview">
          <div className="panel-card">
            <div className="panel-header">
              <h2>Employee Likes</h2>
              <span className="likes-chip">Leaderboard</span>
            </div>
            <p className="panel-desc">Live tracker of kudos distributed across the team:</p>
            <ul className="likes-list" id="likes-list">
              {employees.map(employee => {
                const count = likes[employee.id] ?? 0;
                return (
                  <li key={employee.id} className="likes-item">
                    <div className="likes-item-info">
                      <span className="likes-employee-name">{employee.name}</span>
                      <span className="likes-employee-dept">{employee.department}</span>
                    </div>
                    <div className="likes-badge-container">
                      <span className={`likes-count-pill ${count > 0 ? "has-likes" : ""}`}>
                        ❤️ {count}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Architecture Insights Card for Review */}
          <div className="panel-card architecture-card">
            <h3>Architecture & State Design</h3>
            <ul className="architecture-list">
              <li>
                <strong>App:</strong> Owns <code>search</code> and <code>likes</code> state because they are shared across components.
              </li>
              <li>
                <strong>EmployeeCard:</strong> Owns local <code>showDetails</code> state since card expansion is isolated per card.
              </li>
              <li>
                <strong>Derived State:</strong> <code>filteredEmployees</code> is computed on every render, avoiding duplicate state bugs.
              </li>
              <li>
                <strong>Stable Keys:</strong> Uses <code>employee.id</code> for optimal reconciliation.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
