import { useState, useEffect, useRef } from 'react';

/**
 * Timer Widget Child Component
 * Demonstrates interval management, ref storage, and unmount cleanup.
 */
function TimerWidget({ onCleanupFired }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // useRef 1: Holds interval ID across renders without causing re-render on change
  const intervalRef = useRef(null);

  // useRef 2: Render counter (tracks how many times this component re-rendered)
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // useRef 3: Timestamp for exact precision delta
  const startTimeRef = useRef(0);

  // Start the timer
  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
  };

  // Pause / Stop the timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    setLaps([]);
  };

  // Record a lap
  const recordLap = () => {
    if (seconds === 0) return;
    setLaps(prev => [
      { id: Date.now(), index: prev.length + 1, time: seconds },
      ...prev,
    ]);
  };

  // Core effect: manages the interval
  useEffect(() => {
    if (isRunning) {
      // Set interval and store reference in intervalRef.current
      intervalRef.current = setInterval(() => {
        // Functional update ensures we do not need `seconds` in the dependency array!
        // This avoids tearing down and recreating the interval every second.
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      // Clear interval when paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // CLEANUP FUNCTION: Runs before every re-run of this effect AND on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        onCleanupFired?.('useEffect cleanup fired: cleared interval ID to prevent memory leaks!');
      }
    };
  }, [isRunning, onCleanupFired]);

  // Format seconds into MM:SS
  const formatTime = totalSec => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="timer-widget">
      <div className="timer-metrics-bar">
        <span className="metric-tag">
          <strong>Component Renders:</strong> {renderCountRef.current} (Tracked via <code className="inline-code">useRef</code>)
        </span>
        <span className={`status-badge ${isRunning ? 'status-active' : 'status-idle'}`}>
          {isRunning ? '● Timer Running' : '○ Timer Paused'}
        </span>
      </div>

      <div className="timer-display">
        <div className="timer-digits">{formatTime(seconds)}</div>
        <div className="timer-subtext">Total Elapsed Seconds: {seconds}s</div>
      </div>

      <div className="button-group timer-controls">
        {!isRunning ? (
          <button
            type="button"
            onClick={startTimer}
            className="action-btn btn-primary"
          >
            ▶ Start Timer
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseTimer}
            className="action-btn btn-warning"
          >
            ⏸ Pause Timer
          </button>
        )}

        <button
          type="button"
          onClick={recordLap}
          disabled={!isRunning && seconds === 0}
          className="action-btn btn-secondary"
        >
          🏁 Record Lap
        </button>

        <button
          type="button"
          onClick={resetTimer}
          className="action-btn btn-outline"
        >
          ↺ Reset
        </button>
      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="laps-container">
          <h4 className="laps-title">Recorded Laps</h4>
          <div className="laps-list">
            {laps.map(lap => (
              <div key={lap.id} className="lap-item">
                <span className="lap-number">Lap #{lap.index}</span>
                <span className="lap-time">{formatTime(lap.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Feature 2: Container with Mount/Unmount toggle to prove unmount cleanup
 */
export function Timer() {
  const [isMounted, setIsMounted] = useState(true);
  const [cleanupLogs, setCleanupLogs] = useState([]);

  const handleCleanupFired = msg => {
    const timestamp = new Date().toLocaleTimeString();
    setCleanupLogs(prev => [{ id: Math.random(), time: timestamp, text: msg }, ...prev.slice(0, 4)]);
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-blue">Feature 2 • useEffect &amp; useRef</div>
        <h2 className="card-title">Stopwatch with Lifecycle &amp; Memory Safety</h2>
        <p className="card-subtitle">
          Manage recurring timers with <code className="inline-code">useEffect</code>, persist timer identifiers across renders with <code className="inline-code">useRef</code>, and guarantee unmount cleanup to avoid memory leaks.
        </p>
      </div>

      <div className="card-body">
        {/* Mount / Unmount Toggle */}
        <div className="lifecycle-controller">
          <div className="controller-info">
            <span className="controller-label">Component Lifecycle Tester:</span>
            <span className="text-muted text-sm">
              Start the timer, then click Unmount. Watch the cleanup function fire immediately, cancelling the timer!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMounted(prev => !prev)}
            className={`action-btn ${isMounted ? 'btn-danger-soft' : 'btn-success-soft'}`}
          >
            {isMounted ? '💥 Unmount Timer Component' : '✨ Re-mount Timer Component'}
          </button>
        </div>

        {/* The Timer Widget */}
        {isMounted ? (
          <TimerWidget onCleanupFired={handleCleanupFired} />
        ) : (
          <div className="unmounted-placeholder">
            <div className="unmounted-icon">🛑</div>
            <h3>Timer Component is Unmounted</h3>
            <p>
              The timer interval was safely wiped via the <code className="inline-code">useEffect</code> return callback.
              No rogue timer loops are lingering in background memory!
            </p>
            <button
              type="button"
              onClick={() => setIsMounted(true)}
              className="action-btn btn-primary"
            >
              Mount Timer Again
            </button>
          </div>
        )}

        {/* Concept Architecture Notes */}
        <div className="concept-notes-grid">
          <div className="concept-card">
            <span className="concept-icon">💡</span>
            <div className="concept-text">
              <strong>Why store interval in useRef?</strong>
              <p>
                If stored in state, setting the interval ID would trigger an unnecessary re-render. If stored in a plain variable (<code className="inline-code">let id</code>), it would be re-declared and lost on every re-render. <code className="inline-code">useRef</code> gives a persistent mutable container.
              </p>
            </div>
          </div>
          <div className="concept-card">
            <span className="concept-icon">🛡️</span>
            <div className="concept-text">
              <strong>Why functional update inside setInterval?</strong>
              <p>
                Using <code className="inline-code">setSeconds(prev =&gt; prev + 1)</code> avoids adding <code className="inline-code">seconds</code> to the effect dependency array. Otherwise, the interval would be destroyed and recreated every single second.
              </p>
            </div>
          </div>
        </div>

        {/* Cleanup Audit Trail */}
        {cleanupLogs.length > 0 && (
          <div className="log-panel mt-4">
            <div className="log-header">
              <span className="log-title">Cleanup Verification Trail</span>
            </div>
            <div className="log-stream">
              {cleanupLogs.map(l => (
                <div key={l.id} className="log-row log-success">
                  <span className="log-time">[{l.time}]</span>
                  <span className="log-text">{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;
