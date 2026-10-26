import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const SEARCHABLE_TOPICS = [
  { id: 1, title: 'useState Hook', tag: 'State', desc: 'Preserves state values between component renders.' },
  { id: 2, title: 'useEffect Lifecycle', tag: 'Side Effects', desc: 'Runs side effects after paint; handles subscription & cleanup.' },
  { id: 3, title: 'useRef Mutable Container', tag: 'References', desc: 'Holds mutable values that do not trigger re-render on change.' },
  { id: 4, title: 'useContext Consumer', tag: 'Context', desc: 'Reads and subscribes to context from the nearest provider.' },
  { id: 5, title: 'useReducer State Machine', tag: 'State', desc: 'Predictable action dispatching for complex state interactions.' },
  { id: 6, title: 'useMemo Value Caching', tag: 'Performance', desc: 'Caches calculation results between renders based on dependencies.' },
  { id: 7, title: 'useCallback Function Stability', tag: 'Performance', desc: 'Caches a callback function definition between renders.' },
  { id: 8, title: 'useLayoutEffect Synchronous', tag: 'Side Effects', desc: 'Fires synchronously after all DOM mutations, before paint.' },
  { id: 9, title: 'useTransition Non-Blocking', tag: 'Concurrent', desc: 'Marks state updates as transitions to keep UI responsive.' },
  { id: 10, title: 'useDeferredValue Deferral', tag: 'Concurrent', desc: 'Defers updating a value until heavy re-renders settle.' },
  { id: 11, title: 'useId Stable Identifiers', tag: 'Accessibility', desc: 'Generates unique IDs for wiring accessibility attributes.' },
  { id: 12, title: 'Reconciliation Algorithm', tag: 'Core', desc: 'Diffing algorithm React uses to determine DOM mutations.' },
];

/**
 * Feature 5: Reusable useDebounce Demonstration
 */
export function SearchDebounce() {
  const [searchTerm, setSearchTerm] = useState('');
  const [delay, setDelay] = useState(500);

  // Custom hook in action
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // Tracking API efficiency metrics
  const unthrottledKeystrokesRef = useRef(0);
  const debouncedFetchCountRef = useRef(0);
  const [isSearching, setIsSearching] = useState(false);

  // Track raw keystrokes
  const handleInputChange = (e) => {
    unthrottledKeystrokesRef.current += 1;
    setSearchTerm(e.target.value);
  };

  // Simulate network fetch when debounced value changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debouncedFetchCountRef.current += 1;

    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm]);

  // Filtered topics based on debounced query
  const filteredTopics = SEARCHABLE_TOPICS.filter(item => {
    const query = debouncedSearchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.tag.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query)
    );
  });

  const apiRequestsSaved = Math.max(0, unthrottledKeystrokesRef.current - debouncedFetchCountRef.current);
  const savingsPercent = unthrottledKeystrokesRef.current > 0
    ? Math.round((apiRequestsSaved / unthrottledKeystrokesRef.current) * 100)
    : 0;

  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-cyan">Feature 5 • Custom Hook: useDebounce</div>
        <h2 className="card-title">Debounced Search &amp; Rate-Limiting</h2>
        <p className="card-subtitle">
          Optimize network usage and compute by debouncing user inputs. Extract reusable timing logic into a clean custom hook.
        </p>
      </div>

      <div className="card-body">
        {/* Controls and Delay Slider */}
        <div className="debounce-controls-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search concepts (e.g., 'state', 'reducer', 'memo')..."
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="clear-input-btn"
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <div className="slider-wrapper">
            <div className="slider-header">
              <span className="slider-label">Debounce Delay:</span>
              <span className="slider-value">{delay} ms</span>
            </div>
            <input
              type="range"
              min="150"
              max="1500"
              step="50"
              value={delay}
              onChange={e => setDelay(Number(e.target.value))}
              className="delay-slider"
            />
          </div>
        </div>

        {/* Live Comparison Gauge */}
        <div className="debounce-comparator-grid">
          <div className="gauge-card">
            <div className="gauge-title">Raw Immediate Input</div>
            <div className="gauge-value">{searchTerm || <span className="text-muted">(empty)</span>}</div>
            <div className="gauge-footer text-warning">
              ⚡ Keystrokes fired: <strong>{unthrottledKeystrokesRef.current}</strong> (Without debounce, 1 API call per key)
            </div>
          </div>

          <div className="gauge-card highlight-cyan">
            <div className="gauge-title">Debounced Value (useDebounce)</div>
            <div className="gauge-value">
              {debouncedSearchTerm || <span className="text-muted">(waiting...)</span>}
              {searchTerm !== debouncedSearchTerm && (
                <span className="pulse-indicator" title="Debounce timer active">
                  ⏳ waiting {delay}ms...
                </span>
              )}
            </div>
            <div className="gauge-footer text-success">
              🚀 Debounced API fetches: <strong>{debouncedFetchCountRef.current}</strong>
            </div>
          </div>
        </div>

        {/* Network Savings Stats Banner */}
        <div className="stats-banner">
          <div className="stat-pill">
            <span className="stat-pill-num">{unthrottledKeystrokesRef.current}</span>
            <span className="stat-pill-label">Total Keystrokes</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-num">{debouncedFetchCountRef.current}</span>
            <span className="stat-pill-label">Actual API Calls</span>
          </div>
          <div className="stat-pill highlight-green">
            <span className="stat-pill-num">{apiRequestsSaved} ({savingsPercent}%)</span>
            <span className="stat-pill-label">Server Requests Saved</span>
          </div>
        </div>

        {/* Search Results Display */}
        <div className="search-results-section">
          <div className="results-header">
            <h4>
              Matching Concepts {isSearching && <span className="spinner-icon">🔄 Fetching...</span>}
            </h4>
            <span className="results-count">{filteredTopics.length} matches found</span>
          </div>

          <div className="results-grid">
            {filteredTopics.length === 0 ? (
              <div className="no-results-box">
                No React concepts found matching &ldquo;{debouncedSearchTerm}&rdquo;
              </div>
            ) : (
              filteredTopics.map(topic => (
                <div key={topic.id} className="topic-card">
                  <div className="topic-header">
                    <span className="topic-title">{topic.title}</span>
                    <span className="topic-tag">{topic.tag}</span>
                  </div>
                  <p className="topic-desc">{topic.desc}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchDebounce;
