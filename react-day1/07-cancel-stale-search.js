/**
 * Exercise 7: Cancel Stale Searches with AbortController
 * 
 * Problem:
 * Build a search function that aborts the previous fetch when a new query is issued.
 * Solves the race condition where older, slower network responses overwrite newer results.
 */

/**
 * Factory that creates a search manager with auto-cancellation of pending requests.
 */
export function createSearchManager(fetcher) {
  let activeController = null;

  return async function search(query) {
    // 1. Abort any previous pending in-flight request
    if (activeController) {
      activeController.abort();
      console.log(`[AbortController] Aborted stale search for previous query`);
    }

    // 2. Instantiate a fresh AbortController for this new request
    const controller = new AbortController();
    activeController = controller;

    try {
      console.log(`[Search Started] query="${query}"`);
      const data = await fetcher(query, controller.signal);
      console.log(`[Search Completed] query="${query}" -> data received:`, data);
      return { status: 'success', data, query };
    } catch (error) {
      // 3. Gracefully handle aborted requests
      if (error.name === 'AbortError') {
        console.log(`[Search Aborted Handled] Request for query="${query}" was successfully cancelled.`);
        return { status: 'aborted', query };
      }
      // Re-throw genuine network or API errors
      throw error;
    } finally {
      // If this was the active controller, clear it upon finish
      if (activeController === controller) {
        activeController = null;
      }
    }
  };
}

/**
 * React Pattern Reference:
 * How you implement this inside a React component's useEffect:
 * 
 * useEffect(() => {
 *   if (!query) return;
 *   const controller = new AbortController();
 * 
 *   async function fetchResults() {
 *     try {
 *       const res = await fetch(`/api/search?q=${query}`, { signal: controller.signal });
 *       const data = await res.json();
 *       setResults(data);
 *     } catch (err) {
 *       if (err.name !== 'AbortError') setError(err);
 *     }
 *   }
 * 
 *   fetchResults();
 * 
 *   // Cleanup function runs before next effect run or on unmount:
 *   return () => controller.abort();
 * }, [query]);
 */

// Verification Script simulating real network delays and cancellation
export async function runCancelSearchVerification() {
  console.log('--- Exercise 7: Cancel Stale Searches ---');

  // Simulated async fetcher that takes variable delays
  const mockFetcher = (query, signal) => {
    return new Promise((resolve, reject) => {
      // Set different delays to simulate slow stale response vs fast new response
      const delay = query === 'slow_query' ? 300 : 50;

      const timer = setTimeout(() => {
        resolve({ results: [`Result for ${query}`] });
      }, delay);

      // Listen for abort signal
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        const abortErr = new Error('The user aborted a request.');
        abortErr.name = 'AbortError';
        reject(abortErr);
      });
    });
  };

  const search = createSearchManager(mockFetcher);

  console.log('\n--- Step 1: Issuing slow search query "slow_query" ---');
  const slowPromise = search('slow_query');

  // After 50ms (before slow query completes at 300ms), user enters a new query
  await new Promise((r) => setTimeout(r, 50));
  console.log('\n--- Step 2: User types faster new query "fast_query" ---');
  const fastPromise = search('fast_query');

  const [slowResult, fastResult] = await Promise.all([slowPromise, fastPromise]);

  console.log('\n--- Results Summary ---');
  console.log('Slow Query Result:', slowResult);
  console.log('Fast Query Result:', fastResult);

  const verificationPassed = slowResult.status === 'aborted' && fastResult.status === 'success';
  console.log('Verification Passed:', verificationPassed);
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runCancelSearchVerification();
}
