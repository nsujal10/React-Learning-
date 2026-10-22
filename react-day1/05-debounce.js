/**
 * Exercise 5: Implement Debounce
 * 
 * Problem:
 * Implement `debounce(callback, delay)` and verify that rapid calls invoke
 * the callback once after the quiet period.
 */

/**
 * Creates a debounced function that delays invoking `callback` until after
 * `delay` milliseconds have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} callback - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced wrapper function.
 */
export function debounce(callback, delay = 300) {
  let timeoutId = null;

  function debounced(...args) {
    const context = this;

    // Clear previous pending execution
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Schedule new execution after the quiet period
    timeoutId = setTimeout(() => {
      timeoutId = null;
      callback.apply(context, args);
    }, delay);
  }

  // Cancel method to abort pending invocation (useful in React useEffect cleanup)
  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  // Immediate flush method to invoke pending call right away
  debounced.flush = function (...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      callback.apply(this, args);
    }
  };

  return debounced;
}

// Verification Script
export async function runDebounceVerification() {
  console.log('--- Exercise 5: Implement Debounce ---');
  let callCount = 0;
  let lastArgReceived = null;
  const executionTimes = [];
  const startTime = Date.now();

  const mockApiCall = (query) => {
    callCount++;
    lastArgReceived = query;
    executionTimes.push(Date.now() - startTime);
    console.log(`[Debounce Executed] Call #${callCount} with query="${query}" at ${Date.now() - startTime}ms`);
  };

  const debouncedSearch = debounce(mockApiCall, 300);

  console.log('Firing rapid calls:');
  console.log(' - Call 1 at 0ms ("r")');
  debouncedSearch('r');

  await new Promise((r) => setTimeout(r, 50));
  console.log(' - Call 2 at 50ms ("re")');
  debouncedSearch('re');

  await new Promise((r) => setTimeout(r, 50));
  console.log(' - Call 3 at 100ms ("rea")');
  debouncedSearch('rea');

  await new Promise((r) => setTimeout(r, 50));
  console.log(' - Call 4 at 150ms ("reac")');
  debouncedSearch('reac');

  await new Promise((r) => setTimeout(r, 50));
  console.log(' - Call 5 at 200ms ("react")');
  debouncedSearch('react');

  // Total elapsed ~200ms. Now wait for quiet period of 300ms + buffer (450ms)
  console.log('Waiting for quiet period (300ms after last call)...');
  await new Promise((r) => setTimeout(r, 450));

  console.log(`Total callback invocations: ${callCount} (Expected: 1)`);
  console.log(`Last argument received:     "${lastArgReceived}" (Expected: "react")`);
  console.log('Verification Passed:       ', callCount === 1 && lastArgReceived === 'react');
}

// Self-executing demonstration when run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runDebounceVerification();
}
