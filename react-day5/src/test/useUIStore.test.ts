import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../stores/useUIStore';

describe('useUIStore (Zustand Store)', () => {
  beforeEach(() => {
    useUIStore.getState().resetUI();
  });

  it('initializes with default UI preferences', () => {
    const state = useUIStore.getState();
    expect(state.viewMode).toBe('table');
    expect(state.density).toBe('comfortable');
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.selectedEmployeeIds).toEqual([]);
    expect(state.modal.type).toBeNull();
  });

  it('updates view mode between table and grid', () => {
    useUIStore.getState().setViewMode('grid');
    expect(useUIStore.getState().viewMode).toBe('grid');

    useUIStore.getState().setViewMode('table');
    expect(useUIStore.getState().viewMode).toBe('table');
  });

  it('updates row density between comfortable and compact', () => {
    useUIStore.getState().setDensity('compact');
    expect(useUIStore.getState().density).toBe('compact');
  });

  it('handles single employee selection toggle', () => {
    useUIStore.getState().toggleEmployeeSelection('emp-501');
    expect(useUIStore.getState().selectedEmployeeIds).toContain('emp-501');

    // Toggling again should remove it
    useUIStore.getState().toggleEmployeeSelection('emp-501');
    expect(useUIStore.getState().selectedEmployeeIds).not.toContain('emp-501');
  });

  it('handles batch selection and clearSelection', () => {
    const ids = ['emp-501', 'emp-502', 'emp-503'];
    useUIStore.getState().selectAllEmployees(ids);
    expect(useUIStore.getState().selectedEmployeeIds).toEqual(ids);

    useUIStore.getState().clearSelection();
    expect(useUIStore.getState().selectedEmployeeIds).toEqual([]);
  });

  it('controls modal state and payload', () => {
    useUIStore.getState().openModal('delete', { id: 'emp-501' });
    expect(useUIStore.getState().modal.type).toBe('delete');
    expect(useUIStore.getState().modal.data).toEqual({ id: 'emp-501' });

    useUIStore.getState().closeModal();
    expect(useUIStore.getState().modal.type).toBeNull();
    expect(useUIStore.getState().modal.data).toBeNull();
  });
});
