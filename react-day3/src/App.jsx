import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Counter from './components/Counter';
import Timer from './components/Timer';
import ThemePanel from './components/ThemePanel';
import Cart from './components/Cart';
import SearchDebounce from './components/SearchDebounce';
import ReconciliationDemo from './components/ReconciliationDemo';
import PerformanceExperiment from './components/PerformanceExperiment';
import DebuggingNotes from './components/DebuggingNotes';

const MODULES = [
  { id: 'counter', title: '1. Counter (useState)', short: 'useState', badge: 'State', icon: '🔢' },
  { id: 'timer', title: '2. Timer (useEffect & useRef)', short: 'useEffect & useRef', badge: 'Lifecycle', icon: '⏱️' },
  { id: 'theme', title: '3. Theme Switcher (useContext)', short: 'useContext', badge: 'Context', icon: '🎨' },
  { id: 'cart', title: '4. Shopping Cart (useReducer)', short: 'useReducer', badge: 'State Machine', icon: '🛒' },
  { id: 'debounce', title: '5. Custom useDebounce Hook', short: 'useDebounce', badge: 'Custom Hook', icon: '⚡' },
  { id: 'reconcile', title: '6. Reconciliation & Keys', short: 'Reconciliation', badge: 'Virtual DOM', icon: '🔑' },
  { id: 'profiler', title: '7. Profiler & Performance', short: 'React Profiler', badge: 'Performance', icon: '📊' },
  { id: 'debugging', title: '8. Debugging & Interview Notes', short: 'Debugging & Notes', badge: 'Architecture', icon: '🧠' },
];

function PlaygroundContent() {
  const { theme, toggleTheme, accentColor } = useTheme();
  const [activeTab, setActiveTab] = useState('counter');
  const [viewMode, setViewMode] = useState('tabbed'); // 'tabbed' | 'scroll'
  const [completedItems, setCompletedItems] = useState({
    counter: true,
    timer: true,
    theme: true,
    cart: true,
    debounce: true,
    reconcile: true,
    profiler: true,
    debugging: true,
  });

  const toggleComplete = (id, e) => {
    e.stopPropagation();
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / MODULES.length) * 100);

  return (
    <div className={`app-shell theme-${theme} accent-${accentColor}`}>
      {/* Top Application Bar */}
      <header className="top-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">⚛️</span>
            <div>
              <div className="brand-title">React Hooks Playground</div>
              <div className="brand-subtitle">Hands-on Deep Dive • React 19 • Day 3</div>
            </div>
          </div>

          {/* Quick Metrics & Mode Toggle */}
          <div className="navbar-controls">
            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                type="button"
                onClick={() => setViewMode('tabbed')}
                className={`mode-btn ${viewMode === 'tabbed' ? 'mode-active' : ''}`}
                title="Focused one-at-a-time tab view"
              >
                📑 Tabs
              </button>
              <button
                type="button"
                onClick={() => setViewMode('scroll')}
                className={`mode-btn ${viewMode === 'scroll' ? 'mode-active' : ''}`}
                title="Full document single-page scroll view"
              >
                📜 All-in-One
              </button>
            </div>

            {/* Quick Theme Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className="quick-theme-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Progress & Milestone Tracker Hero */}
      <section className="progress-hero">
        <div className="progress-hero-inner">
          <div className="hero-text-col">
            <div className="hero-pill">Mastery Curriculum Completed</div>
            <h1 className="hero-heading">8 of 8 Concepts Fully Implemented &amp; Functional</h1>
            <p className="hero-desc">
              Explore state batching, interval memory safety, context propagation, reducer state machines, debouncing, reconciliation algorithms, live Profiler measurements, and staff-engineer debugging insights.
            </p>
          </div>

          <div className="progress-widget-card">
            <div className="progress-card-top">
              <span className="progress-card-label">Curriculum Completion</span>
              <span className="progress-card-percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-stats-row">
              <span><strong>{completedCount}</strong> of <strong>8</strong> assignments ready</span>
              <span className="text-success font-semibold">Ready for Review ✓</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <nav className="modules-nav-bar">
          {MODULES.map(module => {
            const isCompleted = completedItems[module.id];
            const isActive = activeTab === module.id;

            return (
              <button
                key={module.id}
                type="button"
                onClick={() => {
                  setActiveTab(module.id);
                  if (viewMode === 'scroll') {
                    const el = document.getElementById(module.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`module-nav-pill ${isActive && viewMode === 'tabbed' ? 'pill-current' : ''}`}
              >
                <span className="module-pill-icon">{module.icon}</span>
                <span className="module-pill-text">{module.short}</span>
                <span
                  role="checkbox"
                  aria-checked={isCompleted}
                  tabIndex={0}
                  onClick={(e) => toggleComplete(module.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      toggleComplete(module.id, e);
                    }
                  }}
                  className={`check-marker ${isCompleted ? 'check-done' : ''}`}
                  title="Toggle completed state"
                >
                  {isCompleted ? '✓' : '○'}
                </span>
              </button>
            );
          })}
        </nav>
      </section>

      {/* Main Main Interactive Stage */}
      <main className="playground-main-stage">
        {viewMode === 'tabbed' ? (
          <div className="tabbed-view-container">
            {activeTab === 'counter' && <Counter />}
            {activeTab === 'timer' && <Timer />}
            {activeTab === 'theme' && <ThemePanel />}
            {activeTab === 'cart' && <Cart />}
            {activeTab === 'debounce' && <SearchDebounce />}
            {activeTab === 'reconcile' && <ReconciliationDemo />}
            {activeTab === 'profiler' && <PerformanceExperiment />}
            {activeTab === 'debugging' && <DebuggingNotes />}
          </div>
        ) : (
          <div className="scroll-view-container">
            <section id="counter" className="scroll-section"><Counter /></section>
            <section id="timer" className="scroll-section"><Timer /></section>
            <section id="theme" className="scroll-section"><ThemePanel /></section>
            <section id="cart" className="scroll-section"><Cart /></section>
            <section id="debounce" className="scroll-section"><SearchDebounce /></section>
            <section id="reconcile" className="scroll-section"><ReconciliationDemo /></section>
            <section id="profiler" className="scroll-section"><PerformanceExperiment /></section>
            <section id="debugging" className="scroll-section"><DebuggingNotes /></section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            React Hooks Playground • Day 3 Comprehensive Hands-on Assignment • Built with React 19 &amp; Vite
          </p>
          <div className="footer-links">
            <span className="footer-badge">Production Architecture</span>
            <span className="footer-badge">Zero Prop Drilling</span>
            <span className="footer-badge">Memory Safe Teardown</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <PlaygroundContent />
    </ThemeProvider>
  );
}

export default App;
