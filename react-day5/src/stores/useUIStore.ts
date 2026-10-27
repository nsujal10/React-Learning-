import { create } from 'zustand';

export type ViewMode = 'table' | 'grid';
export type Density = 'comfortable' | 'compact';
export type ModalType = 'delete' | 'export' | 'bulk-status' | null;

export interface UIState {
  viewMode: ViewMode;
  density: Density;
  sidebarCollapsed: boolean;
  selectedEmployeeIds: string[];
  filterDrawerOpen: boolean;
  modal: {
    type: ModalType;
    data: any;
  };

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setDensity: (density: Density) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleEmployeeSelection: (id: string) => void;
  selectAllEmployees: (ids: string[]) => void;
  clearSelection: () => void;
  toggleFilterDrawer: () => void;
  setFilterDrawerOpen: (open: boolean) => void;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  resetUI: () => void;
}

const initialState = {
  viewMode: 'table' as ViewMode,
  density: 'comfortable' as Density,
  sidebarCollapsed: false,
  selectedEmployeeIds: [] as string[],
  filterDrawerOpen: false,
  modal: {
    type: null as ModalType,
    data: null,
  },
};

export const useUIStore = create<UIState>((set) => ({
  ...initialState,

  setViewMode: (viewMode) => set({ viewMode }),

  setDensity: (density) => set({ density }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  toggleEmployeeSelection: (id) =>
    set((state) => {
      const exists = state.selectedEmployeeIds.includes(id);
      return {
        selectedEmployeeIds: exists
          ? state.selectedEmployeeIds.filter((item) => item !== id)
          : [...state.selectedEmployeeIds, id],
      };
    }),

  selectAllEmployees: (ids) => set({ selectedEmployeeIds: ids }),

  clearSelection: () => set({ selectedEmployeeIds: [] }),

  toggleFilterDrawer: () => set((state) => ({ filterDrawerOpen: !state.filterDrawerOpen })),

  setFilterDrawerOpen: (filterDrawerOpen) => set({ filterDrawerOpen }),

  openModal: (type, data = null) => set({ modal: { type, data } }),

  closeModal: () => set({ modal: { type: null, data: null } }),

  resetUI: () => set({ ...initialState }),
}));
