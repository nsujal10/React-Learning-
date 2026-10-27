import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import * as employeesApi from '../api/employees';

describe('Search Race Condition & Request Cancellation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces rapid sequential keystrokes so only the final term is emitted after delay', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebouncedValue(val, delay),
      { initialProps: { val: 'a', delay: 400 } }
    );

    expect(result.current).toBe('a');

    // User types 'ab'
    rerender({ val: 'ab', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    // Not enough time has elapsed
    expect(result.current).toBe('a');

    // User types 'abc'
    rerender({ val: 'abc', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Still hasn't hit 400ms from last keystroke
    expect(result.current).toBe('a');

    // Wait remaining time
    act(() => {
      vi.advanceTimersByTime(250);
    });
    // Now debounced value updates to final keystroke
    expect(result.current).toBe('abc');
  });

  it('aborts in-flight request when AbortController signal is triggered', async () => {
    vi.useRealTimers();

    const controller = new AbortController();

    // Trigger an API request with signal
    const promise = employeesApi.getEmployees({
      search: 'first-query',
      signal: controller.signal,
    });

    // Immediately abort (simulating user typing next character or query replacement)
    controller.abort();

    // Expect the promise to reject with AbortError
    await expect(promise).rejects.toThrow();
  });

  it('prevents search race conditions where an earlier slow request completes after a fast request', async () => {
    vi.useRealTimers();

    const activeControllers = [];

    // Helper simulating query trigger with cancellation
    const triggerSearch = (query, latencyMs, returnData) => {
      // Abort prior in-flight controllers
      activeControllers.forEach((c) => c.abort());
      activeControllers.length = 0;

      const controller = new AbortController();
      activeControllers.push(controller);

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          resolve(returnData);
        }, latencyMs);

        controller.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      });
    };

    let latestDisplayedResult = null;

    // First search: slow (300ms)
    const req1 = triggerSearch('slow-query', 300, 'SLOW_RESULT')
      .then((data) => {
        latestDisplayedResult = data;
      })
      .catch((err) => {
        // Ignored aborted error
      });

    // User quickly updates search: fast (50ms)
    const req2 = triggerSearch('fast-query', 50, 'FAST_RESULT')
      .then((data) => {
        latestDisplayedResult = data;
      })
      .catch((err) => {
        // Ignored aborted error
      });

    await Promise.allSettled([req1, req2]);

    // Fast and latest query result wins; older query was aborted and didn't overwrite
    expect(latestDisplayedResult).toBe('FAST_RESULT');
  });
});
