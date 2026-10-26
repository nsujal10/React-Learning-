import { useState, useMemo, useCallback, memo, Profiler, useRef } from 'react';

// Generates a mock dataset of 5,000 items
const GENERATED_DATA = Array.from({ length: 4000 }, (_, i) => ({
  id: i + 1,
  val: (i * 37) % 1000,
  tag: ['Engineering', 'Design', 'Product', 'QA', 'Marketing'][i % 5],
}));

// A heavy computational function simulating CPU-intensive data transformation
function expensiveCalculation(items, filterTag, multiplier) {
  const start = performance.now();
  // Artificial CPU work: sorting and math
  let result = items.filter(item => filterTag === 'All' || item.tag === filterTag);
  for (let i = 0; i < 300000; i++) {
    // Busy loop to simulate real data crunching
    Math.sqrt(i) * Math.sin(i);
  }
  const sum = result.reduce((acc, curr) => acc + curr.val * multiplier, 0);
  const end = performance.now();
  return { sum, count: result.length, computeTimeMs: (end - start).toFixed(2) };
}

// Child component - Raw (Unmemoized)
function RawStatsCard({ stats, onAction, title }) {
  const renderRef = useRef(0);
  renderRef.current += 1;

  return (
    <div className="perf-card raw-card">
      <div className="perf-card-badge text-warning">Standard Child (No memo)</div>
      <h4>{title}</h4>
      <div className="perf-stat-row">
        <span>Render Count:</span>
        <strong className="text-warning">{renderRef.current}</strong>
      </div>
      <div className="perf-stat-row">
        <span>Computed Sum:</span>
        <strong>{stats.sum.toLocaleString()}</strong>
      </div>
      <div className="perf-stat-row">
        <span>CPU Work Time:</span>
        <span className="time-badge">{stats.computeTimeMs} ms</span>
      </div>
      <button type="button" onClick={onAction} className="action-btn btn-secondary btn-sm mt-2">
        Trigger Child Action
      </button>
    </div>
  );
}

// Child component - Memoized with React.memo
const MemoizedStatsCard = memo(function MemoizedStatsCard({ stats, onAction, title }) {
  const renderRef = useRef(0);
  renderRef.current += 1;

  return (
    <div className="perf-card memo-card">
      <div className="perf-card-badge text-success">React.memo() Protected</div>
      <h4>{title}</h4>
      <div className="perf-stat-row">
        <span>Render Count:</span>
        <strong className="text-success">{renderRef.current}</strong>
      </div>
      <div className="perf-stat-row">
        <span>Computed Sum:</span>
        <strong>{stats.sum.toLocaleString()}</strong>
      </div>
      <div className="perf-stat-row">
        <span>CPU Work Time:</span>
        <span className="time-badge">{stats.computeTimeMs} ms</span>
      </div>
      <button type="button" onClick={onAction} className="action-btn btn-secondary btn-sm mt-2">
        Trigger Child Action
      </button>
    </div>
  );
});

/**
 * Feature 7: Performance Experiment with React Profiler
 */
export function PerformanceExperiment() {
  const [unrelatedCounter, setUnrelatedCounter] = useState(0);
  const [filterTag, setFilterTag] = useState('All');
  const [multiplier, setMultiplier] = useState(2);
  const [useOptimization, setUseOptimization] = useState(false);
  const [profilerMetrics, setProfilerMetrics] = useState([]);

  // React Profiler onRender callback
  const onRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    const metric = {
      id: Math.random(),
      phase, // 'mount' or 'update'
      actualDuration: Number(actualDuration.toFixed(2)),
      baseDuration: Number(baseDuration.toFixed(2)),
      timestamp: new Date().toLocaleTimeString(),
    };
    setProfilerMetrics(prev => [metric, ...prev.slice(0, 5)]);
  };

  // 1. Heavy computation: either memoized or recalculating on every parent render
  const memoizedStats = useMemo(() => {
    return expensiveCalculation(GENERATED_DATA, filterTag, multiplier);
  }, [filterTag, multiplier]);

  const rawStats = !useOptimization
    ? expensiveCalculation(GENERATED_DATA, filterTag, multiplier)
    : memoizedStats;

  // 2. Callback function: either memoized with useCallback or recreated every render
  const memoizedCallback = useCallback(() => {
    console.log('Memoized callback triggered');
  }, []);

  const rawCallback = () => {
    console.log('Raw callback triggered');
  };

  const activeCallback = useOptimization ? memoizedCallback : rawCallback;
  const activeStats = useOptimization ? memoizedStats : rawStats;

  const averageDuration = profilerMetrics.length > 0
    ? (profilerMetrics.reduce((sum, m) => sum + m.actualDuration, 0) / profilerMetrics.length).toFixed(2)
    : 0;

  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-purple">Feature 7 • React Profiler &amp; Memoization</div>
        <h2 className="card-title">Performance Profiler &amp; Measured Optimization</h2>
        <p className="card-subtitle">
          Measure before you optimize! Use React&apos;s native <code className="inline-code">&lt;Profiler&gt;</code> to capture actual render durations, comparing raw executions against <code className="inline-code">useMemo</code>, <code className="inline-code">useCallback</code>, and <code className="inline-code">React.memo</code>.
        </p>
      </div>

      <div className="card-body">
        {/* Optimization Master Toggle */}
        <div className="optimization-switch-card">
          <div className="switch-left">
            <span className="switch-status-tag">
              {useOptimization ? '🚀 Optimization: ACTIVE' : '🐢 Optimization: DISABLED'}
            </span>
            <p className="text-sm text-muted">
              {useOptimization
                ? 'useMemo caches heavy CPU calculations; React.memo + useCallback prevents child re-renders when unrelated parent state changes.'
                : 'Raw mode: Recomputes 300,000 CPU cycles and recreates function pointers on every single keystroke or unrelated click!'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUseOptimization(prev => !prev)}
            className={`action-btn ${useOptimization ? 'btn-success' : 'btn-warning'}`}
          >
            {useOptimization ? 'Disable Optimizations (Raw)' : 'Enable Optimizations (Memo)'}
          </button>
        </div>

        {/* Experiment Controls */}
        <div className="perf-controls-grid">
          {/* Unrelated State Trigger */}
          <div className="perf-control-card">
            <h4>1. Unrelated Parent State</h4>
            <p className="text-xs text-muted">
              Clicking this triggers parent re-render. Does the heavy child re-render?
            </p>
            <div className="flex-row items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setUnrelatedCounter(c => c + 1)}
                className="action-btn btn-primary"
              >
                + Increment Counter ({unrelatedCounter})
              </button>
            </div>
          </div>

          {/* Heavy Computation Input */}
          <div className="perf-control-card">
            <h4>2. Heavy Computation Inputs</h4>
            <p className="text-xs text-muted">Changing these legitimately invalidates cached math.</p>
            <div className="flex-row gap-2 mt-2">
              <select
                value={filterTag}
                onChange={e => setFilterTag(e.target.value)}
                className="select-input"
              >
                {['All', 'Engineering', 'Design', 'Product', 'QA', 'Marketing'].map(tag => (
                  <option key={tag} value={tag}>{tag} Department</option>
                ))}
              </select>

              <select
                value={multiplier}
                onChange={e => setMultiplier(Number(e.target.value))}
                className="select-input"
              >
                <option value={1}>1x Multiplier</option>
                <option value={2}>2x Multiplier</option>
                <option value={5}>5x Multiplier</option>
              </select>
            </div>
          </div>
        </div>

        {/* The Profiler Wrapped Tree */}
        <div className="profiler-wrapped-area">
          <div className="profiler-area-header">
            <h4>Subtree Monitored by &lt;Profiler id=&quot;heavy-calculation&quot;&gt;</h4>
          </div>

          <Profiler id="heavy-calculation" onRender={onRenderCallback}>
            <div className="perf-cards-grid">
              {useOptimization ? (
                <MemoizedStatsCard
                  stats={activeStats}
                  onAction={activeCallback}
                  title="Memoized Worker View"
                />
              ) : (
                <RawStatsCard
                  stats={activeStats}
                  onAction={activeCallback}
                  title="Raw Worker View"
                />
              )}
            </div>
          </Profiler>
        </div>

        {/* Profiler Metrics Dashboard */}
        <div className="metrics-dashboard">
          <div className="dashboard-header">
            <h4>Live React Profiler Telemetry</h4>
            <span className="telemetry-badge">
              Avg Render Duration: <strong>{averageDuration} ms</strong>
            </span>
          </div>

          <div className="metrics-table-wrapper">
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Commit Phase</th>
                  <th>Actual Duration (Paint)</th>
                  <th>Base Duration (Estimate)</th>
                  <th>Evaluation</th>
                </tr>
              </thead>
              <tbody>
                {profilerMetrics.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted p-4">
                      Interact with the buttons above to collect profiler measurements.
                    </td>
                  </tr>
                ) : (
                  profilerMetrics.map(m => (
                    <tr key={m.id}>
                      <td>{m.timestamp}</td>
                      <td>
                        <span className={`phase-badge phase-${m.phase}`}>{m.phase}</span>
                      </td>
                      <td className={m.actualDuration > 15 ? 'text-danger font-bold' : 'text-success'}>
                        {m.actualDuration} ms
                      </td>
                      <td>{m.baseDuration} ms</td>
                      <td>
                        {m.actualDuration < 5
                          ? '⚡ Ultra Fast (Smooth 60fps)'
                          : m.actualDuration < 16
                          ? '✅ Within 16ms frame budget'
                          : '⚠️ Frame drop warning'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interview Rule of Thumb */}
        <div className="rule-of-thumb-card">
          <h4>When SHOULD you memoize in React?</h4>
          <ul>
            <li>
              <strong>Heavy Computations:</strong> When recalculating takes &gt; 5-10ms (filterable lists of thousands of items, geometric layouts, regex parsers).
            </li>
            <li>
              <strong>Preventing Child Re-renders:</strong> Passing an object/function to a child wrapped in <code className="inline-code">React.memo()</code> or as a dependency in another hook&apos;s dependency array.
            </li>
            <li>
              <strong>When NOT to:</strong> Simple string concatenations, primitive math, or components that always re-render anyway. The cost of dependency checking exceeds the trivial re-execution!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PerformanceExperiment;
