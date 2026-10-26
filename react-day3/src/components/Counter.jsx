import { useState } from 'react';

/**
 * Feature 1: Counter using useState
 * 
 * Demonstrates:
 * 1. Basic state initialization and setters (increment, decrement, reset)
 * 2. Step size modifier
 * 3. Functional updates vs Direct value updates (React batching experiment)
 * 4. Stale closure simulation with async setTimeout
 */
export function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [logs, setLogs] = useState([]);
  const [isAsyncPending, setIsAsyncPending] = useState(false);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ id: Math.random(), time: timestamp, message, type }, ...prev.slice(0, 7)]);
  };

  // Direct increment / decrement / reset
  const handleIncrement = () => {
    setCount(prev => prev + step);
    addLog(`Incremented by ${step} using functional update. Current: ${count + step}`, 'success');
  };

  const handleDecrement = () => {
    setCount(prev => prev - step);
    addLog(`Decremented by ${step}. Current: ${count - step}`, 'warning');
  };

  const handleReset = () => {
    setCount(0);
    addLog('Counter reset to 0.', 'neutral');
  };

  /**
   * THE CLASSIC INTERVIEW EXPERIMENT:
   * "What happens if you call setCount(count + 1) three times in a single event handler?"
   * 
   * Answer: In direct updates, `count` is captured from the current render's closure.
   * All 3 calls evaluate to `setCount(0 + 1)`. React batches them and the result is 1!
   */
  const handleTripleDirectUpdate = () => {
    // Stale value captured in this render cycle
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    addLog(
      `Called setCount(count + 1) x3 synchronously. React batches them with current closure count (${count})! Result only adds +1.`,
      'danger'
    );
  };

  /**
   * FUNCTIONAL UPDATES:
   * `setCount(prev => prev + 1)`
   * React queues the update functions in sequence:
   * 1. receives current value `c` -> returns `c + 1`
   * 2. receives intermediate value `c + 1` -> returns `c + 2`
   * 3. receives intermediate value `c + 2` -> returns `c + 3`
   */
  const handleTripleFunctionalUpdate = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    addLog(
      `Called setCount(prev => prev + 1) x3. Each updater receives the queued intermediate value! Result adds +3.`,
      'success'
    );
  };

  /**
   * ASYNC DELAYED UPDATE EXPERIMENT:
   * Demonstrates stale closure bug vs functional updater fix.
   */
  const handleAsyncDirectUpdate = () => {
    setIsAsyncPending(true);
    addLog(`Async direct update started (will set count to current ${count} + 1 in 2s)...`, 'info');
    setTimeout(() => {
      // Direct update uses count captured 2 seconds ago!
      setCount(count + 1);
      setIsAsyncPending(false);
      addLog(`Async direct executed: set to stale (${count} + 1). If you clicked elsewhere meanwhile, it overwrote state!`, 'danger');
    }, 2000);
  };

  const handleAsyncFunctionalUpdate = () => {
    setIsAsyncPending(true);
    addLog(`Async functional update started (will increment newest state by 1 in 2s)...`, 'info');
    setTimeout(() => {
      // Functional updater always gets the latest committed state
      setCount(prev => {
        addLog(`Async functional executed: fresh prev was ${prev}, new value is ${prev + 1}`, 'success');
        return prev + 1;
      });
      setIsAsyncPending(false);
    }, 2000);
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-purple">Feature 1 • useState</div>
        <h2 className="card-title">Interactive Counter & Functional Updates</h2>
        <p className="card-subtitle">
          Master state primitives, React 18/19 automatic batching, and why functional updates (<code className="inline-code">prev =&gt; prev + 1</code>) prevent stale closure bugs.
        </p>
      </div>

      <div className="card-body">
        {/* Main Display */}
        <div className="counter-hero">
          <div className="counter-value-container">
            <span className="counter-label">Current Count</span>
            <span className={`counter-digit ${count < 0 ? 'text-negative' : count > 0 ? 'text-positive' : ''}`}>
              {count}
            </span>
          </div>

          {/* Step Size Selector */}
          <div className="step-selector">
            <span className="text-muted text-sm font-semibold">Step Increment:</span>
            <div className="step-pills">
              {[1, 5, 10, 25].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`pill-btn ${step === s ? 'pill-active' : ''}`}
                >
                  ±{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="button-group primary-controls">
          <button
            type="button"
            onClick={handleDecrement}
            className="action-btn btn-secondary"
            title={`Decrease by ${step}`}
          >
            <span className="btn-icon">−</span> Decrement ({step})
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="action-btn btn-outline"
            title="Reset count to 0"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleIncrement}
            className="action-btn btn-primary"
            title={`Increase by ${step}`}
          >
            <span className="btn-icon">+</span> Increment ({step})
          </button>
        </div>

        {/* Deep Dive Experiments */}
        <div className="experiments-grid">
          {/* Experiment A: Batching & Functional Updates */}
          <div className="experiment-box">
            <div className="experiment-header">
              <span className="experiment-tag">Experiment A</span>
              <h4>Synchronous 3x Batching</h4>
            </div>
            <p className="experiment-desc">
              Compare calling <code className="inline-code">setCount</code> three times in one event.
            </p>
            <div className="experiment-actions">
              <button
                type="button"
                onClick={handleTripleDirectUpdate}
                className="action-btn btn-warning-soft"
              >
                Direct: setCount(count + 1) ×3
                <span className="sub-text">Adds only +1 (Batched with stale count)</span>
              </button>
              <button
                type="button"
                onClick={handleTripleFunctionalUpdate}
                className="action-btn btn-success-soft"
              >
                Functional: setCount(prev =&gt; prev + 1) ×3
                <span className="sub-text">Adds +3 (Chained via state queue)</span>
              </button>
            </div>
          </div>

          {/* Experiment B: Asynchronous Stale Closure */}
          <div className="experiment-box">
            <div className="experiment-header">
              <span className="experiment-tag">Experiment B</span>
              <h4>Async Stale Closure (2s Delay)</h4>
            </div>
            <p className="experiment-desc">
              Click then rapidly click Increment to see whether intermediate changes are preserved or wiped.
            </p>
            <div className="experiment-actions">
              <button
                type="button"
                disabled={isAsyncPending}
                onClick={handleAsyncDirectUpdate}
                className="action-btn btn-danger-soft"
              >
                Async Direct Update
                <span className="sub-text">Captures count from 2s ago (bugs out!)</span>
              </button>
              <button
                type="button"
                disabled={isAsyncPending}
                onClick={handleAsyncFunctionalUpdate}
                className="action-btn btn-accent-soft"
              >
                Async Functional Update
                <span className="sub-text">Safely fetches latest committed state</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Execution Logs */}
        <div className="log-panel">
          <div className="log-header">
            <span className="log-title">Execution State & Trace Log</span>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={() => setLogs([])}
                className="clear-log-btn"
              >
                Clear Log
              </button>
            )}
          </div>
          <div className="log-stream">
            {logs.length === 0 ? (
              <div className="log-empty">Click the buttons above to inspect state updates and React batching behavior.</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className={`log-row log-${log.type}`}>
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-text">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counter;
