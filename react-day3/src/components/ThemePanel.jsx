import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Deeply nested component (Level 3)
 * Demonstrates direct context consumption with ZERO prop-drilling!
 */
function DeeplyNestedControl() {
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();

  return (
    <div className="nested-box">
      <div className="nested-badge">Deeply Nested Child (Level 3 Component)</div>
      <p className="nested-text">
        I am 3 levels deep in the component tree! I received <strong>NO PROPS</strong> from my parents.
        I consume <code className="inline-code">useTheme()</code> directly from the React Context Provider.
      </p>

      <div className="nested-controls">
        <button
          type="button"
          onClick={toggleTheme}
          className="action-btn btn-primary btn-sm"
        >
          Toggle Theme from Deep Child (Now: {theme})
        </button>

        <div className="accent-picker-inline">
          <span className="text-xs text-muted">Quick Accent:</span>
          {['indigo', 'emerald', 'amber', 'rose', 'cyan'].map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setAccentColor(color)}
              className={`color-dot dot-${color} ${accentColor === color ? 'dot-active' : ''}`}
              title={`Switch accent to ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Intermediate Component (Level 2)
 * Demonstrates that intermediate components do NOT need to care about or pass down props!
 */
function IntermediateWrapper() {
  return (
    <div className="intermediate-container">
      <div className="intermediate-label">Intermediate Container (Level 2 - Zero Props Passed)</div>
      <DeeplyNestedControl />
    </div>
  );
}

/**
 * Theme Header Component
 */
function ThemeHeader() {
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();

  return (
    <header className="theme-header-card">
      <div className="theme-header-left">
        <div className="theme-icon-container">
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
        <div>
          <h3 className="theme-header-title">Global Theme Context Header</h3>
          <p className="theme-header-sub">
            Active Mode: <strong>{theme.toUpperCase()}</strong> • Accent Palette: <strong>{accentColor.toUpperCase()}</strong>
          </p>
        </div>
      </div>

      <div className="theme-header-right">
        {/* Accent Color Palette Selector */}
        <div className="accent-selector">
          <span className="accent-label">Accent Theme:</span>
          <div className="accent-swatches">
            {[
              { id: 'indigo', name: 'Indigo Aura', color: '#6366f1' },
              { id: 'emerald', name: 'Emerald Forest', color: '#10b981' },
              { id: 'amber', name: 'Sunset Amber', color: '#f59e0b' },
              { id: 'rose', name: 'Vibrant Rose', color: '#f43f5e' },
              { id: 'cyan', name: 'Cyber Cyan', color: '#06b6d4' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAccentColor(item.id)}
                className={`swatch-btn ${accentColor === item.id ? 'swatch-active' : ''}`}
                style={{ '--swatch-color': item.color }}
                title={item.name}
              >
                <span className="swatch-indicator" />
                <span className="swatch-name">{item.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-switch-btn"
          aria-label="Toggle light or dark theme"
        >
          <span className="switch-icon">{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
          <span className="switch-pill">
            <span className={`switch-thumb ${theme === 'dark' ? 'thumb-dark' : 'thumb-light'}`} />
          </span>
        </button>
      </div>
    </header>
  );
}

/**
 * Content Panel Component
 */
function ThemeContentPanel() {
  const { theme, accentColor } = useTheme();

  return (
    <div className={`theme-content-card accent-${accentColor}`}>
      <div className="content-card-header">
        <h4>Themed Dynamic Content Panel</h4>
        <span className="tag-pill">Context Subscriber</span>
      </div>

      <div className="theme-stats-grid">
        <div className="theme-stat-item">
          <div className="stat-label">Active Surface</div>
          <div className="stat-value">{theme === 'dark' ? 'Dark Matrix' : 'Light Canvas'}</div>
          <div className="stat-note">Updated via data-theme on document root</div>
        </div>
        <div className="theme-stat-item">
          <div className="stat-label">Context Propagation</div>
          <div className="stat-value">Instantaneous</div>
          <div className="stat-note">O(1) direct hook dispatch to consumers</div>
        </div>
        <div className="theme-stat-item">
          <div className="stat-label">Prop Drilling Saved</div>
          <div className="stat-value">3+ Hierarchy Levels</div>
          <div className="stat-note">Zero pass-through clutter in JSX</div>
        </div>
      </div>

      {/* Prop Drilling vs Context Architecture Diagram / Demo */}
      <IntermediateWrapper />
    </div>
  );
}

/**
 * Feature 3 Main Component
 */
export function ThemePanel() {
  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-emerald">Feature 3 • useContext</div>
        <h2 className="card-title">Theme Switcher &amp; Context Propagation</h2>
        <p className="card-subtitle">
          Eliminate prop-drilling entirely by sharing state across disparate component subtrees using React Context and custom consumer hooks.
        </p>
      </div>

      <div className="card-body">
        <div className="theme-showcase-wrapper">
          <ThemeHeader />
          <ThemeContentPanel />
        </div>

        {/* Context Best Practices & Pitfalls */}
        <div className="best-practices-box">
          <div className="practice-header">
            <span className="practice-icon">⚡</span>
            <h4>Senior React Architect Interview Insights: Context vs Redux/Zustand</h4>
          </div>
          <ul className="practice-list">
            <li>
              <strong>Context is for Dependency Injection, not high-frequency state:</strong> Every component calling <code className="inline-code">useContext(ThemeContext)</code> re-renders whenever the context value reference changes.
            </li>
            <li>
              <strong>Split Contexts by Domain:</strong> Avoid having a single monolithic <code className="inline-code">AppContext</code> that holds theme, auth, cart, and modals. When user auth changes, components caring only about theme would re-render!
            </li>
            <li>
              <strong>Memoize Context Values:</strong> If the provider value is an object (<code className="inline-code">{'{ theme, toggleTheme }'}</code>), wrap it with <code className="inline-code">useMemo</code> or stable callbacks to prevent child re-renders.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ThemePanel;
