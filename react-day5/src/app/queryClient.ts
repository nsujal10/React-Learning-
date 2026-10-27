import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute fresh cache
      gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
      retry: (failureCount, error: any) => {
        // Do not retry on 404 not found or 422 validation errors
        if (error?.status === 404 || error?.status === 422) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
