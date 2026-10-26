import { useState } from 'react';

// Child component with INTERNAL local state to expose reconciliation bugs
function StatefulTodoItem({ item, keyType, onDelete }) {
  // Local state that lives inside this component instance
  const [userNote, setUserNote] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className={`reconcile-item ${isCompleted ? 'item-checked' : ''}`}>
      <div className="reconcile-item-meta">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={e => setIsCompleted(e.target.checked)}
          className="reconcile-checkbox"
          id={`${keyType}-${item.id}-check`}
        />
        <label htmlFor={`${keyType}-${item.id}-check`} className="reconcile-name">
          {item.name}
        </label>
        <span className="reconcile-stable-id">ID: {item.id}</span>
      </div>

      <div className="reconcile-user-input-box">
        <label className="text-xs text-muted">Internal Component State:</label>
        <input
          type="text"
          value={userNote}
          onChange={e => setUserNote(e.target.value)}
          placeholder="Type private note here..."
          className="reconcile-note-input"
        />
      </div>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="delete-pill-btn"
        title="Delete this task"
      >
        🗑️
      </button>
    </div>
  );
}

const INITIAL_TASKS = [
  { id: 'task-101', name: 'Master React Hook Primitives' },
  { id: 'task-102', name: 'Optimize Re-renders with Profiler' },
  { id: 'task-103', name: 'Ace Technical Interview Live Coding' },
];

/**
 * Feature 6: Rendering and Reconciliation Demo
 */
export function ReconciliationDemo() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [taskCounter, setTaskCounter] = useState(104);

  // Add to beginning of list (The ultimate test for index keys!)
  const handlePrependTask = () => {
    const newTask = {
      id: `task-${taskCounter}`,
      name: `New Task #${taskCounter} (Added to Top)`,
    };
    setTasks(prev => [newTask, ...prev]);
    setTaskCounter(c => c + 1);
  };

  // Delete first item
  const handleDeleteFirst = () => {
    if (tasks.length === 0) return;
    setTasks(prev => prev.slice(1));
  };

  // Delete specific item
  const handleDeleteItem = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Shuffle list
  const handleShuffle = () => {
    setTasks(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Reset to initial
  const handleReset = () => {
    setTasks(INITIAL_TASKS);
    setTaskCounter(104);
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-rose">Feature 6 • Reconciliation &amp; Keys</div>
        <h2 className="card-title">Stable IDs vs. Index Keys in Stateful Lists</h2>
        <p className="card-subtitle">
          Experience firsthand why using <code className="inline-code">key=&#123;index&#125;</code> causes insidious state preservation bugs, and how stable unique keys keep React&apos;s virtual DOM diffing accurate.
        </p>
      </div>

      <div className="card-body">
        {/* Interactive Experiment Instruction Guide */}
        <div className="reconcile-instructions-banner">
          <div className="banner-icon">🧪</div>
          <div className="banner-content">
            <strong>How to trigger the bug:</strong>
            <ol>
              <li>Type something in the &ldquo;Internal Component State&rdquo; input of <strong>&ldquo;Master React Hook Primitives&rdquo;</strong> (the 1st item) in BOTH lists below.</li>
              <li>Click the <strong>&ldquo;➕ Prepend Task to Top&rdquo;</strong> button.</li>
              <li>
                <strong>Observe the bug on the Left (Index Key):</strong> The note you typed stays at the top with the newly added task, while the original task lost its note!
              </li>
              <li>
                <strong>Observe the Right (Stable ID Key):</strong> The note travels faithfully with its original task.
              </li>
            </ol>
          </div>
        </div>

        {/* Global List Action Bar */}
        <div className="button-group reconcile-actions">
          <button
            type="button"
            onClick={handlePrependTask}
            className="action-btn btn-primary"
          >
            ➕ Prepend Task to Top
          </button>
          <button
            type="button"
            onClick={handleDeleteFirst}
            disabled={tasks.length === 0}
            className="action-btn btn-danger-soft"
          >
            ❌ Delete First Task
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            disabled={tasks.length < 2}
            className="action-btn btn-secondary"
          >
            🔀 Shuffle Items
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="action-btn btn-outline"
          >
            ↺ Reset Tasks
          </button>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="reconcile-columns-grid">
          {/* Column A: Bad (key = index) */}
          <div className="reconcile-col col-buggy">
            <div className="col-header">
              <div className="col-title-row">
                <span className="col-status-pill status-danger">⚠️ ANTI-PATTERN</span>
                <h4>key=&#123;index&#125;</h4>
              </div>
              <p className="col-subtext">
                Keys match index 0, 1, 2. When items shift, React maps new data to old component instances!
              </p>
            </div>

            <div className="col-items-list">
              {tasks.length === 0 ? (
                <div className="text-muted p-4 text-center">List is empty. Click Prepend to test.</div>
              ) : (
                tasks.map((task, index) => (
                  <div key={index} className="key-wrapper">
                    <span className="key-annotation text-danger">key={index}</span>
                    <StatefulTodoItem
                      item={task}
                      keyType="index"
                      onDelete={handleDeleteItem}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column B: Good (key = item.id) */}
          <div className="reconcile-col col-stable">
            <div className="col-header">
              <div className="col-title-row">
                <span className="col-status-pill status-success">✅ BEST PRACTICE</span>
                <h4>key=&#123;item.id&#125;</h4>
              </div>
              <p className="col-subtext">
                Unique persistent IDs. React reconciles each DOM node and its state to its exact entity!
              </p>
            </div>

            <div className="col-items-list">
              {tasks.length === 0 ? (
                <div className="text-muted p-4 text-center">List is empty. Click Prepend to test.</div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="key-wrapper">
                    <span className="key-annotation text-success">key={task.id}</span>
                    <StatefulTodoItem
                      item={task}
                      keyType="stable"
                      onDelete={handleDeleteItem}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Callout */}
        <div className="algorithm-callout">
          <h4>How React&apos;s Diffing Algorithm Works</h4>
          <p>
            During reconciliation, React inspects the <code className="inline-code">key</code> attribute of sibling elements.
            If the key is unchanged between renders (e.g. index <code className="inline-code">0</code>), React assumes the component identity is the same and merely updates its props, keeping the existing fiber and local state intact.
            When you prepend an item, the new item becomes index <code className="inline-code">0</code>, inheriting the state of whatever was previously at index <code className="inline-code">0</code>!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReconciliationDemo;
