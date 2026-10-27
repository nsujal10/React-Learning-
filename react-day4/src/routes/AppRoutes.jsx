import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import EmployeeList from '../features/employees/EmployeeList';
import EmployeeDetails from '../features/employees/EmployeeDetails';
import EmployeeForm from '../features/employees/EmployeeForm';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes wrapped in Shared AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/new" element={<EmployeeForm />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="employees/:id/edit" element={<EmployeeForm />} />
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
