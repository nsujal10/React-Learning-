import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../../api/employees';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

/**
 * Custom hook managing employee directory fetching, URL query parameter synchronization,
 * debounced search, request cancellation, sorting, and pagination.
 */
export function useEmployees({ pageSize = 5 } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract state from URL search params
  const urlSearch = searchParams.get('search') || '';
  const urlDepartment = searchParams.get('department') || '';
  const urlStatus = searchParams.get('status') || '';
  const urlSort = searchParams.get('sort') || 'name';
  const urlOrder = searchParams.get('order') || 'asc';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  // Local search input state for immediate UI feedback before debounce
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // Fetching state
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: pageSize,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep track of active AbortController to cancel in-flight requests
  const abortControllerRef = useRef(null);

  // Sync debounced search input to URL query params
  useEffect(() => {
    // Only update URL if debounced search differs from URL search param
    if (debouncedSearch !== urlSearch) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (debouncedSearch.trim()) {
            next.set('search', debouncedSearch.trim());
          } else {
            next.delete('search');
          }
          // Reset to page 1 on new search term
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    }
  }, [debouncedSearch, urlSearch, setSearchParams]);

  // Keep searchInput in sync if URL is modified externally (e.g. back/forward button)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Fetch employees whenever URL search params change
  const fetchEmployees = useCallback(async () => {
    // Cancel previous request if still in flight
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getEmployees({
        search: urlSearch,
        department: urlDepartment,
        status: urlStatus,
        sort: urlSort,
        order: urlOrder,
        page: urlPage,
        limit: pageSize,
        signal: controller.signal,
      });

      // Update state with server response
      setEmployees(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled intentionally, do not set error state
        return;
      }
      setError(err.message || 'Failed to load employees.');
    } finally {
      // If this controller was not aborted, reset loading indicator
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [urlSearch, urlDepartment, urlStatus, urlSort, urlOrder, urlPage, pageSize]);

  useEffect(() => {
    fetchEmployees();

    return () => {
      // Abort in flight request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchEmployees]);

  // Query parameter modifiers
  const handleSortChange = (field) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const currentSort = next.get('sort') || 'name';
      const currentOrder = next.get('order') || 'asc';

      if (currentSort === field) {
        next.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
      } else {
        next.set('sort', field);
        next.set('order', 'asc');
      }
      return next;
    });
  };

  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set('page', '1'); // Reset to page 1 on filter change
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', newPage.toString());
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
    fetchEmployees();
  };

  return {
    employees,
    pagination,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    filters: {
      search: urlSearch,
      department: urlDepartment,
      status: urlStatus,
      sort: urlSort,
      order: urlOrder,
      page: urlPage,
    },
    handleSortChange,
    handleFilterChange,
    handlePageChange,
    clearAllFilters,
    handleDelete,
    refetch: fetchEmployees,
  };
}

export default useEmployees;
