import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Dashboard from '../pages/Dashboard';
import EmployeeList from '../features/employees/EmployeeList';
import EmployeeDetails from '../features/employees/EmployeeDetails';
import EmployeeForm from '../features/employees/EmployeeForm';
import NotFound from '../pages/NotFound';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/new" element={<EmployeeForm />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="employees/:id/edit" element={<EmployeeForm />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
