import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * Delays updating the debounced value until after a specified delay
 * has passed since the last time the input value changed.
 * 
 * @template T
 * @param {T} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {T} - The debounced value
 * 
 * How it works under the hood:
 * 1. An internal `debouncedValue` state is initialized with the initial `value`.
 * 2. Every time `value` or `delay` changes, the `useEffect` sets up a `setTimeout`.
 * 3. If `value` changes again BEFORE the timer expires, the effect cleanup
 *    function executes `clearTimeout(handler)` to cancel the pending update.
 * 4. Only after the user stops typing for `delay` ms does `setDebouncedValue` run.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CLEANUP: If value or delay changes before the timer completes,
    // clear the timer so old values never set state (prevents race conditions/memory leaks)
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
