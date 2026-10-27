import React from 'react';
import type { EmployeeStatus, Department } from '../types/employee';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  return <span className={`badge badge-${variant} badge-${size}`}>{children}</span>;
};

export const StatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => {
  switch (status) {
    case 'Active':
      return <Badge variant="success">Active</Badge>;
    case 'On Leave':
      return <Badge variant="warning">On Leave</Badge>;
    case 'Terminated':
      return <Badge variant="danger">Terminated</Badge>;
    case 'Probation':
      return <Badge variant="info">Probation</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const DepartmentBadge: React.FC<{ department: Department }> = ({ department }) => {
  const getVariant = (dept: Department) => {
    switch (dept) {
      case 'Engineering':
        return 'purple';
      case 'Design':
        return 'info';
      case 'Product':
        return 'success';
      case 'Marketing':
        return 'warning';
      case 'Legal':
        return 'danger';
      default:
        return 'default';
    }
  };

  return <Badge variant={getVariant(department)} size="sm">{department}</Badge>;
};

export default Badge;
