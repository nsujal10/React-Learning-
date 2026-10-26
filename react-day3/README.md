# ⚛️ React Hooks Playground — Day 3 Comprehensive Guide

A hands-on, production-grade interactive playground demonstrating every core React hook, lifecycle nuances, state management paradigms, reconciliation mechanics, performance profiling, and interview-level debugging analysis.

---

## 📁 Project Structure

```
react-day3/
├── src/
│   ├── components/
│   │   ├── Counter.jsx              # Feature 1: useState, functional updates, async batching
│   │   ├── Timer.jsx                # Feature 2: useEffect & useRef lifecycle, unmount cleanup
│   │   ├── ThemePanel.jsx           # Feature 3: useContext, zero prop-drilling, theme switching
│   │   ├── Cart.jsx                 # Feature 4: useReducer, predictable state machine, derived totals
│   │   ├── SearchDebounce.jsx       # Feature 5: useDebounce custom hook, search rate-limiting
│   │   ├── ReconciliationDemo.jsx   # Feature 6: Stable IDs vs. Index keys virtual DOM diffing
│   │   ├── PerformanceExperiment.jsx# Feature 7: React.Profiler, useMemo, useCallback, React.memo
│   │   └── DebuggingNotes.jsx       # Feature 8: Top 6 React interview bugs, root causes & fixes
│   ├── hooks/
│   │   └── useDebounce.js           # Reusable custom debounce hook with cleanup
│   ├── context/
│   │   └── ThemeContext.jsx         # Context provider, consumer hook, localStorage persistence
│   ├── reducers/
│   │   └── cartReducer.js           # Pure cart reducer, action constants, calculation helpers
│   ├── App.jsx                      # Main playground dashboard with tabbed & scroll modes
│   ├── index.css                    # Design system (light/dark themes, accent palettes)
│   └── main.jsx                     # Application entry point with React.StrictMode
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

1. **Navigate to the project directory:**
   ```bash
   cd react-day3
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Launch the development server:**
   ```bash
   npm run dev
   ```
4. Open the browser link (typically `http://localhost:5173/`).

---

## 📚 Deep Dive: Feature-by-Feature Conceptual Guide

### [x] 1. Counter using `useState`
**File:** [`src/components/Counter.jsx`](src/components/Counter.jsx)

#### Core Concepts Explored:
- **Direct vs Functional Updates:**
  - `setCount(count + 1)`: Reads `count` from the current render's lexical scope closure.
  - `setCount(prev => prev + 1)`: Receives the latest committed state from React's internal update queue.
- **The "Triple Increment" Interview Question:**
  - *Question:* What happens if you call `setCount(count + 1)` three times in an event handler?
  - *Answer:* React 18/19 batches state updates. All 3 calls evaluate `setCount(0 + 1)`. The component re-renders once and count increases by **only 1**.
  - *Solution:* Calling `setCount(prev => prev + 1)` three times queues the updater functions sequentially: `0 -> 1 -> 2 -> 3`, increasing count by **3**.
- **Asynchronous Stale Closure Experiment:**
  - A 2-second `setTimeout` update demonstrates how delayed callbacks capture stale state if direct updates are used, whereas functional updaters always access the freshest state.

---

### [x] 2. Timer using `useEffect` & `useRef`
**File:** [`src/components/Timer.jsx`](src/components/Timer.jsx)

#### Core Concepts Explored:
- **Why store timer ID in `useRef` instead of `useState`?**
  - Updating `ref.current` **does not trigger a re-render**. If we saved the interval ID in state (`setIntervalId`), storing it would cause an unnecessary render.
  - A plain variable (`let timerId`) would be wiped and re-initialized every render cycle. `useRef` preserves a mutable object across the entire component lifecycle.
- **Why use functional updates inside `setInterval`?**
  - `setSeconds(prev => prev + 1)` eliminates the need to put `seconds` into the `useEffect` dependency array. If `seconds` was in the dependency array, the interval would be torn down and recreated every 1,000ms.
- **Component Lifecycle Teardown:**
  - The `return () => clearInterval(intervalRef.current)` cleanup function is verified with a live "Unmount Component" button to prove no background intervals or memory leaks persist when components leave the DOM.

---

### [x] 3. Theme Switcher using `useContext`
**Files:** [`src/context/ThemeContext.jsx`](src/context/ThemeContext.jsx) & [`src/components/ThemePanel.jsx`](src/components/ThemePanel.jsx)

#### Core Concepts Explored:
- **Eliminating Prop-Drilling:**
  - State (`theme`, `accentColor`, `toggleTheme`, `setAccentColor`) is provided at the root and consumed directly by Level 3 child components without touching intermediate parents.
- **Defensive Custom Hook Pattern:**
  - `useTheme()` throws an explicit error if called outside a `<ThemeProvider>`, catching component tree mistakes during development.
- **Senior Architect Guidelines:**
  - Split contexts by domain (e.g. separate `ThemeContext` from `AuthContext`) so frequent auth changes don't force theme-only components to re-render.
  - Wrap provider values in `useMemo` when necessary to prevent reference-based consumer re-renders.

---

### [x] 4. Shopping Cart using `useReducer`
**Files:** [`src/reducers/cartReducer.js`](src/reducers/cartReducer.js) & [`src/components/Cart.jsx`](src/components/Cart.jsx)

#### Core Concepts Explored:
- **Redux-Style Predictable State Machine:**
  - Actions dispatched: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`, `APPLY_DISCOUNT`.
  - Purity rule: Reducer is a pure function that never mutates existing state (`state.items.push()` is forbidden; always return brand new arrays `[...state.items, newItem]`).
- **Minimal State & Derived State:**
  - The cart state only stores raw items and discount percentage. Totals (`itemCount`, `subtotal`, `discountAmount`, `taxAmount`, `grandTotal`) are calculated dynamically on each render via `calculateCartTotals()`, preventing out-of-sync state bugs.
- **Live Action Stream:**
  - An interactive visualizer shows actions as they are dispatched along with payload telemetry.

---

### [x] 5. Reusable `useDebounce` Hook
**Files:** [`src/hooks/useDebounce.js`](src/hooks/useDebounce.js) & [`src/components/SearchDebounce.jsx`](src/components/SearchDebounce.jsx)

#### Core Concepts Explored:
- **How `useDebounce` Works Under the Hood:**
  1. Sets up an internal `debouncedValue` state.
  2. Inside `useEffect`, creates a `setTimeout` for the specified `delay`.
  3. If the user types another character before the timer completes, the effect cleanup (`clearTimeout(timerId)`) cancels the pending execution.
  4. Only after user inactivity for `delay` ms does `setDebouncedValue` commit.
- **Bandwidth & Compute Telemetry:**
  - Real-time comparison between raw keystrokes and debounced network calls displays exact percentage of saved server requests (typically 70%–85% reduction).

---

### [x] 6. Rendering & Reconciliation Demo
**File:** [`src/components/ReconciliationDemo.jsx`](src/components/ReconciliationDemo.jsx)

#### Core Concepts Explored:
- **The Bug:** `key={index}` in dynamic lists.
  - When items are prepended or reordered, React matches elements by index (`key="0"`, `key="1"`).
  - Uncontrolled DOM nodes and local component state (like text typed into an input or a checked checkbox) stay bound to **index 0**, causing the newly prepended item to inherit the old item's text!
- **The Fix:** `key={item.id}`.
  - Stable IDs allow React's diffing algorithm to accurately identify moved, inserted, and deleted fiber nodes, preserving state integrity across re-orders.

---

### [x] 7. Performance Experiment with React Profiler
**File:** [`src/components/PerformanceExperiment.jsx`](src/components/PerformanceExperiment.jsx)

#### Core Concepts Explored:
- **React `<Profiler>`:**
  - Measures `actualDuration` (time spent rendering the committed update) and `baseDuration` (estimated time to render subtree without memoization).
- **The Three Optimization Pillars:**
  1. `useMemo`: Caches results of expensive calculations (e.g. 300,000 math operations across thousands of records).
  2. `useCallback`: Maintains stable function references across parent renders.
  3. `React.memo`: Prevents child components from re-rendering if their props have not changed by shallow comparison (`Object.is`).
- **When NOT to Memoize:**
  - Memoization carries memory overhead (allocating closures and running dependency comparisons). Only optimize when profiling proves measurable frame drops (&gt; 16ms).

---

### [x] 8. Debugging & Interview Notes
**File:** [`src/components/DebuggingNotes.jsx`](src/components/DebuggingNotes.jsx)

#### Top 6 Critical React Bugs Documented:
1. **Stale Closure Timer:** `setInterval` capturing initial render closure; solved via functional state updates `setVal(prev => prev + 1)`.
2. **Missing Cleanup Function:** Orphaned `window.addEventListener` and intervals causing memory leaks; solved by returning teardown callbacks.
3. **Direct State Mutation:** Calling `array.push()` or mutating objects directly; breaks shallow reference equality (`Object.is`) causing React to skip re-renders.
4. **Infinite Re-render Loop:** Declaring non-memoized object literals `{}` inside component body and including them in `useEffect` dependency arrays.
5. **Dynamic List Index Keys:** Reordering or prepending items with `key={index}` causes local state to bleed across rows.
6. **Violating Rules of Hooks:** Calling hooks conditionally or inside loops breaks React's fiber hook linked list pointer alignment.

---

## 🧪 Tech Stack
- **React 19.3.1**
- **Vite 8.3.5**
- **Vanilla CSS Design System** (custom dark/light tokens, responsive layout, glassmorphism)
- **Google Fonts:** Plus Jakarta Sans & JetBrains Mono
