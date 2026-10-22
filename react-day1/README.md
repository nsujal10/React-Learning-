# React Day 1: JavaScript & Async Foundations

A collection of 8 essential coding exercises designed to prepare for React development and frontend technical interviews.

---

## 🚀 Quick Start

Run all solutions and verification tests:
```bash
npm start
# or: node index.js
```

Or run any exercise independently:
```bash
node 01-reverse-string.js
node 02-remove-duplicates.js
node 03-count-occurrences.js
node 04-group-by-department.js
node 05-debounce.js
node 06-retry.js
node 07-cancel-stale-search.js
node 08-predict-async-output.js
```

---

## 📚 Problem Summaries & Solutions

### 1. Reverse a string (`01-reverse-string.js`)
* **Difficulty:** Easy
* **Problem:** Write `reverseString('React')` that returns `'tcaeR'`.
* **Approach:**
  - `str.split('').reverse().join('')` provides the clean idiomatic solution in $O(n)$ time and $O(n)$ space.
  - Also includes a loop version and a two-pointer Unicode-aware version using `Array.from()` to properly preserve surrogate pairs (such as emojis).

---

### 2. Remove duplicates (`02-remove-duplicates.js`)
* **Difficulty:** Easy
* **Problem:** Given `[1, 2, 2, 3, 3, 4]`, return `[1, 2, 3, 4]`.
* **Approach:**
  - `[...new Set(arr)]` creates a unique set in $O(n)$ time.
  - Also demonstrated: custom key uniqueness using `reduce` and `Set` for deduplicating arrays of objects by `id`.

---

### 3. Count occurrences (`03-count-occurrences.js`)
* **Difficulty:** Easy
* **Problem:** For `['a', 'b', 'a', 'c', 'b', 'a']`, return counts for each letter.
* **Approach:**
  - `Array.prototype.reduce((acc, item) => { acc[item] = (acc[item] || 0) + 1; return acc; }, {})`
  - $O(n)$ time complexity and $O(k)$ space complexity where $k$ is the number of distinct keys.

---

### 4. Group employees by department (`04-group-by-department.js`)
* **Difficulty:** Medium
* **Problem:** Convert an array of employee objects into an object keyed by department.
* **Approach:**
  - Universal `reduce` accumulator that creates an array bucket for each department.
  - Modern ES2024 `Object.groupBy(employees, emp => emp.department)` method with fallback.

---

### 5. Implement debounce (`05-debounce.js`)
* **Difficulty:** Medium
* **Problem:** Implement `debounce(callback, 300)` and verify that rapid calls invoke the callback once after the quiet period.
* **Approach:**
  - Uses a closure with a `timeoutId` variable.
  - Resets the timer with `clearTimeout(timeoutId)` on every invocation.
  - Delivers proper `this` binding and `arguments` forwarding using `callback.apply(context, args)`.
  - Includes `.cancel()` and `.flush()` methods, which are essential for cleanup in React `useEffect` hooks.

---

### 6. Implement retry (`06-retry.js`)
* **Difficulty:** Medium
* **Problem:** Create an async helper that retries a failed operation up to three attempts before throwing the final error.
* **Approach:**
  - Uses an asynchronous `for` loop (`for (let attempt = 1; attempt <= maxAttempts; attempt++)`).
  - Wraps the async call in a `try...catch`.
  - Captures the last error and re-throws it only if all attempts are exhausted.
  - Supports an optional delay between retries.

---

### 7. Cancel stale searches (`07-cancel-stale-search.js`)
* **Difficulty:** Advanced
* **Problem:** Build a search function that aborts the previous fetch when a new query is issued.
* **Why this matters in React:**
  - Prevents race conditions where a slow response for an older query arrives after a fast response for a newer query, overwriting modern state with stale data.
* **Approach:**
  - Holds an active `AbortController` reference.
  - Aborts the existing controller (`activeController.abort()`) before creating a new one and passing `controller.signal` to `fetch`.
  - Gracefully catches and suppresses `error.name === 'AbortError'`.

---

### 8. Predict async output (`08-predict-async-output.js`)
* **Difficulty:** Advanced
* **Problem:** Explain the output order of synchronous logs, a resolved promise, `queueMicrotask()`, and `setTimeout()`.
* **Execution Order:**
  1. `[Sync] Script start`
  2. `[Sync] Script end`
  3. `[Microtask] Promise.then 1`
  4. `[Microtask] queueMicrotask`
  5. `[Microtask] Promise.then 2 (chained)`
  6. `[Macrotask] setTimeout 0ms`
* **Event Loop Rules:**
  - **Call Stack**: Executes synchronous code first.
  - **Microtask Queue**: Empties completely whenever the call stack is clear, before the event loop touches any macrotask. Promise callbacks and `queueMicrotask` share this high-priority queue.
  - **Macrotask Queue**: Timers (`setTimeout`) execute in subsequent event loop iterations.
