import { useState } from 'react';

const DEBUGGING_BUGS = [
  {
    id: 'bug-1',
    hook: 'useEffect / useRef',
    title: '1. The Stale Closure Timer Bug',
    severity: 'High',
    symptom: 'Counter or timer gets stuck at 1, or async setTimeout displays old stale state.',
    buggyCode: `// ❌ BUGGY IMPLEMENTATION
function StaleTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // 'seconds' is captured from the initial render closure (0)
      setSeconds(seconds + 1); 
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array captures seconds = 0 forever!
}`,
    rootCause: `In JavaScript closures, functions retain references to variables from their lexical scope at creation time.
When '[]' is passed to useEffect, the interval callback is created ONCE during mount, capturing 'seconds = 0'.
Every second, it evaluates setSeconds(0 + 1), perpetually setting seconds to 1 and never incrementing beyond it.`,
    fixedCode: `// ✅ FIX OPTION A: Functional State Update (Recommended)
function FixedTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Functional update receives fresh committed state from React's internal queue!
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Safe to keep [] because we have zero external closure dependencies!
}

// ✅ FIX OPTION B: Mutable Ref for dynamic values
function FixedTimerWithRef() {
  const [seconds, setSeconds] = useState(0);
  const countRef = useRef(seconds);
  countRef.current = seconds;

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(countRef.current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
}`,
    interviewTip: 'Always use functional state updates (setVal(prev => ...)) whenever the next state depends on the previous state inside timers or async callbacks.',
  },
  {
    id: 'bug-2',
    hook: 'useEffect',
    title: '2. Missing Cleanup Function Causing Memory Leak & Ghost Listeners',
    severity: 'Critical',
    symptom: 'Memory usage balloons, console errors warning of unmounted component state updates, duplicate API requests.',
    buggyCode: `// ❌ BUGGY IMPLEMENTATION
function WindowTracker() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Missing return cleanup function!
  }, []);

  return <div>Width: {width}px</div>;
}`,
    rootCause: `When WindowTracker unmounts, the event listener remains permanently attached to the global 'window' object.
Every time the window resizes, the listener executes, attempting to invoke setWidth on an unmounted component fiber.
In Single Page Applications (SPAs), navigating back and forth creates dozens of orphaned listeners.`,
    fixedCode: `// ✅ FIXED IMPLEMENTATION
function WindowTracker() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // CLEANUP: React runs this when component unmounts or before re-running effect
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>Width: {width}px</div>;
}`,
    interviewTip: 'Every time you setup an event listener, setInterval, WebSocket, or abortable fetch inside useEffect, you MUST return a teardown/cleanup function.',
  },
  {
    id: 'bug-3',
    hook: 'useState / useReducer',
    title: '3. Direct State Mutation (The "Disappearing Re-render" Bug)',
    severity: 'High',
    symptom: 'State visibly changes in console.log or Redux DevTools, but the UI fails to update or re-render.',
    buggyCode: `// ❌ BUGGY IMPLEMENTATION
function TodoList() {
  const [todos, setTodos] = useState(['Buy Milk']);

  const addTodo = (newTodo) => {
    // DIRECT MUTATION: Modifies existing array in place
    todos.push(newTodo);
    // React compares Object.is(prevTodos, newTodos). Since memory reference is identical, React skips re-render!
    setTodos(todos);
  };
}`,
    rootCause: `React uses shallow reference equality (Object.is) to determine if state has changed.
Calling todos.push() alters the array in place, so 'todos' still points to the exact same memory address.
React concludes: oldState === newState -> bailout -> UI does NOT re-render.`,
    fixedCode: `// ✅ FIXED IMPLEMENTATION
function TodoList() {
  const [todos, setTodos] = useState(['Buy Milk']);

  const addTodo = (newTodo) => {
    // IMMUTABLE UPDATE: Create a new array reference with spread operator
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };
}`,
    interviewTip: 'State in React must be treated as completely immutable. Never call .push(), .splice(), or mutate object properties directly (obj.foo = "bar"). Always return new references.',
  },
  {
    id: 'bug-4',
    hook: 'useEffect / useMemo',
    title: '4. The Infinite Re-render Loop from Object / Array Dependencies',
    severity: 'Critical',
    symptom: 'Browser freezes, UI crashes with "Maximum update depth exceeded" error.',
    buggyCode: `// ❌ BUGGY IMPLEMENTATION
function UserProfile({ userId }) {
  const [data, setData] = useState(null);

  // An object literal is created on EVERY render with a brand new memory pointer
  const fetchOptions = { headers: { 'Authorization': 'Bearer 123' } };

  useEffect(() => {
    fetchUserData(userId, fetchOptions).then(res => setData(res));
  }, [userId, fetchOptions]); // fetchOptions changes reference EVERY render!
  // setData triggers re-render -> new fetchOptions -> useEffect runs -> setData -> loop!
}`,
    rootCause: `In JavaScript, {} !== {}. On every render of UserProfile, 'fetchOptions' is allocated a new reference in memory.
React checks dependencies via Object.is(). Since oldOptions !== newOptions, useEffect executes.
useEffect calls setData, which triggers a re-render, creating yet another object reference and causing an infinite loop.`,
    fixedCode: `// ✅ FIX OPTION A: Memoize with useMemo
const fetchOptions = useMemo(() => ({
  headers: { 'Authorization': 'Bearer 123' }
}), []);

// ✅ FIX OPTION B: Move object outside component (if static)
const STATIC_FETCH_OPTIONS = { headers: { 'Authorization': 'Bearer 123' } };

// ✅ FIX OPTION C: Inline object inside useEffect
useEffect(() => {
  const options = { headers: { 'Authorization': 'Bearer 123' } };
  fetchUserData(userId, options).then(res => setData(res));
}, [userId]); // Only primitive 'userId' in dependency array!`,
    interviewTip: 'Avoid placing non-primitive values (objects, arrays, inline functions) in useEffect dependency arrays unless they are memoized with useMemo/useCallback or declared outside the component.',
  },
  {
    id: 'bug-5',
    hook: 'Reconciliation',
    title: '5. Using Array Index as "key" in Dynamic Lists',
    severity: 'Medium',
    symptom: 'Form inputs, checkboxes, or animations stay attached to the wrong item when items are added, deleted, or reordered.',
    buggyCode: `// ❌ BUGGY IMPLEMENTATION
function TaskList({ tasks, onDelete }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        // Key is tied to array position, NOT task identity!
        <li key={index}>
          <input type="checkbox" /> {/* Uncontrolled local state */}
          <span>{task.text}</span>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
    rootCause: `React uses keys during reconciliation to identify which elements in a list correspond to which virtual DOM fibers.
If key=0 is deleted from the top, the item that was previously at index 1 now receives key=0.
React thinks the first DOM element just changed its props, so it keeps the existing DOM node and its internal checkbox state!`,
    fixedCode: `// ✅ FIXED IMPLEMENTATION
function TaskList({ tasks, onDelete }) {
  return (
    <ul>
      {tasks.map(task => (
        // Stable, unique identifier tied directly to entity
        <li key={task.id}>
          <input type="checkbox" />
          <span>{task.text}</span>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
    interviewTip: 'Index keys are only safe if the list is strictly static (never filtered, sorted, prepended, or deleted). For dynamic lists, always use unique IDs from your data (UUID, database ID).',
  },
  {
    id: 'bug-6',
    hook: 'Rules of Hooks',
    title: '6. Calling Hooks Conditionally or Inside Loops',
    severity: 'Critical',
    symptom: 'React throws "Rendered more hooks than during the previous render" or states get mixed up between components.',
    buggyCode: `// ❌ BUGGY IMPLEMENTATION
function UserCard({ user }) {
  if (!user) {
    return <div>Guest</div>; // Early return before hooks!
  }

  // Hook called conditionally after early return!
  const [isExpanded, setIsExpanded] = useState(false);

  if (user.isAdmin) {
    // Hook called inside an 'if' block!
    useEffect(() => {
      fetchAdminStats();
    }, []);
  }

  return <div>{user.name}</div>;
}`,
    rootCause: `React internally stores hook states as a singly-linked list on the component's Fiber node (fiber.memoizedState).
React relies strictly on the CALL ORDER of hooks across renders to know which state belongs to which useState/useEffect.
Conditional hook calls shift the linked list pointers, assigning State #2's value to Hook #1!`,
    fixedCode: `// ✅ FIXED IMPLEMENTATION: Rules of Hooks Obeyed
function UserCard({ user }) {
  // Always call all hooks unconditionally at the very top level!
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Move the condition INSIDE the effect callback
    if (user?.isAdmin) {
      fetchAdminStats();
    }
  }, [user?.isAdmin]);

  // Early returns are only allowed AFTER all hooks have executed
  if (!user) {
    return <div>Guest</div>;
  }

  return <div>{user.name}</div>;
}`,
    interviewTip: 'The 2 Rules of Hooks: 1) Only call hooks at the top level (never in loops, conditions, or nested functions); 2) Only call hooks from React function components or custom hooks.',
  },
];

/**
 * Feature 8: Debugging and Interview Notes Component
 */
export function DebuggingNotes() {
  const [selectedBugId, setSelectedBugId] = useState('bug-1');
  const [copiedSection, setCopiedSection] = useState(null);

  const activeBug = DEBUGGING_BUGS.find(b => b.id === selectedBugId) || DEBUGGING_BUGS[0];

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-emerald">Feature 8 • Architecture &amp; Interview Notes</div>
        <h2 className="card-title">Top 6 React Hooks Bugs &amp; Root Cause Analysis</h2>
        <p className="card-subtitle">
          In-depth architectural analysis of the most frequent React interview bugs, fiber mechanics, closure traps, and production-tested solutions.
        </p>
      </div>

      <div className="card-body">
        {/* Bug Selection Tabs */}
        <div className="bug-tabs-nav">
          {DEBUGGING_BUGS.map(bug => (
            <button
              key={bug.id}
              type="button"
              onClick={() => setSelectedBugId(bug.id)}
              className={`bug-tab-item ${selectedBugId === bug.id ? 'bug-tab-active' : ''}`}
            >
              <div className="bug-tab-hook">{bug.hook}</div>
              <div className="bug-tab-title">{bug.title.split('. ')[1]}</div>
            </button>
          ))}
        </div>

        {/* Selected Bug Detail Dossier */}
        <div className="bug-dossier">
          {/* Header Banner */}
          <div className="dossier-header">
            <div>
              <span className={`severity-tag severity-${activeBug.severity.toLowerCase()}`}>
                Severity: {activeBug.severity}
              </span>
              <h3 className="dossier-title">{activeBug.title}</h3>
            </div>
            <div className="symptom-box">
              <strong>Symptom:</strong> {activeBug.symptom}
            </div>
          </div>

          {/* Side-by-Side Code Comparison */}
          <div className="code-comparison-grid">
            {/* Buggy Code */}
            <div className="code-box box-danger">
              <div className="code-box-header">
                <span className="code-box-title text-danger">❌ Buggy Code (Anti-Pattern)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeBug.buggyCode, 'buggy')}
                  className="copy-btn"
                >
                  {copiedSection === 'buggy' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="code-pre">
                <code>{activeBug.buggyCode}</code>
              </pre>
            </div>

            {/* Fixed Code */}
            <div className="code-box box-success">
              <div className="code-box-header">
                <span className="code-box-title text-success">✅ Fixed Code (Production Grade)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeBug.fixedCode, 'fixed')}
                  className="copy-btn"
                >
                  {copiedSection === 'fixed' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="code-pre">
                <code>{activeBug.fixedCode}</code>
              </pre>
            </div>
          </div>

          {/* Root Cause Analysis & Interview Key */}
          <div className="root-cause-section">
            <div className="root-cause-card">
              <h4>🔬 Deep Root Cause Mechanics</h4>
              <p className="whitespace-pre-line">{activeBug.rootCause}</p>
            </div>

            <div className="interview-takeaway-card">
              <h4>🎯 Staff-Level Interview Takeaway</h4>
              <p>{activeBug.interviewTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebuggingNotes;
