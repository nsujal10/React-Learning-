/**
 * Exercise 4: Group Employees by Department
 * 
 * Problem:
 * Convert an array of employee objects into an object keyed by department.
 * Example:
 * [
 *   { name: 'Alice', department: 'Engineering' },
 *   { name: 'Bob', department: 'HR' },
 *   { name: 'Charlie', department: 'Engineering' }
 * ]
 * Output:
 * {
 *   Engineering: [ { name: 'Alice', ... }, { name: 'Charlie', ... } ],
 *   HR: [ { name: 'Bob', ... } ]
 * }
 */

// Approach 1: Using Array.prototype.reduce (Universal & robust)
// Time Complexity: O(n), Space Complexity: O(n)
export function groupByDepartment(employees) {
  if (!Array.isArray(employees)) {
    throw new TypeError('Input must be an array');
  }

  return employees.reduce((groups, employee) => {
    const dept = employee.department || 'Unassigned';
    if (!groups[dept]) {
      groups[dept] = [];
    }
    groups[dept].push(employee);
    return groups;
  }, {});
}

// Approach 2: Using modern Object.groupBy (ECMAScript 2024)
export function groupByDepartmentModern(employees) {
  if (typeof Object.groupBy === 'function') {
    return Object.groupBy(employees, (employee) => employee.department || 'Unassigned');
  }
  // Fallback for older JS engines
  return groupByDepartment(employees);
}

// Approach 3: Generic GroupBy helper by key or selector function
export function groupBy(items, keySelector) {
  const getKey = typeof keySelector === 'function' ? keySelector : (item) => item[keySelector];
  return items.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  console.log('--- Exercise 4: Group Employees by Department ---');
  const employees = [
    { id: 1, name: 'Alice', department: 'Engineering', role: 'Frontend Engineer' },
    { id: 2, name: 'Bob', department: 'HR', role: 'Recruiter' },
    { id: 3, name: 'Charlie', department: 'Engineering', role: 'Backend Engineer' },
    { id: 4, name: 'Dana', department: 'Design', role: 'Product Designer' },
    { id: 5, name: 'Evan', department: 'Design', role: 'Design Lead' }
  ];

  const grouped = groupByDepartment(employees);
  console.log('Grouped Result:');
  console.dir(grouped, { depth: null });

  console.log('Departments found:', Object.keys(grouped));
  console.log('Verification Passed:', grouped.Engineering.length === 2 && grouped.Design.length === 2 && grouped.HR.length === 1);
}
