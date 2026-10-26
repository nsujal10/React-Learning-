import { useReducer, useState } from 'react';
import {
  cartReducer,
  initialCartState,
  calculateCartTotals,
  CART_ACTIONS,
  SAMPLE_PRODUCTS,
} from '../reducers/cartReducer';

/**
 * Feature 4: Shopping Cart using useReducer
 * 
 * Demonstrates:
 * 1. Dispatching structured actions with type & payload
 * 2. Immutable state transitions in a pure reducer function
 * 3. Derived calculation helpers (subtotal, tax, discounts, total count)
 * 4. Action log / Reducer visualizer
 */
export function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);
  const [actionHistory, setActionHistory] = useState([
    { id: 1, type: 'INIT', payload: 'Cart initialized with sample items', time: new Date().toLocaleTimeString() },
  ]);

  // Derived totals calculated on every render (no need to store redundant totals in state!)
  const totals = calculateCartTotals(state);

  // Helper to dispatch and log action
  const logAndDispatch = (action) => {
    const time = new Date().toLocaleTimeString();
    setActionHistory(prev => [
      { id: Date.now() + Math.random(), type: action.type, payload: JSON.stringify(action.payload), time },
      ...prev.slice(0, 9),
    ]);
    dispatch(action);
  };

  const handleAddToCart = (product) => {
    logAndDispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: product,
    });
  };

  const handleRemoveFromCart = (id, name) => {
    logAndDispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: id,
    });
  };

  const handleUpdateQuantity = (id, quantity) => {
    logAndDispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, quantity },
    });
  };

  const handleClearCart = () => {
    logAndDispatch({
      type: CART_ACTIONS.CLEAR_CART,
    });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const code = promoInput.trim().toUpperCase();
    logAndDispatch({
      type: CART_ACTIONS.APPLY_DISCOUNT,
      payload: code,
    });

    if (['REACT10', 'HOOKS20', 'DEEPDIVE50'].includes(code)) {
      setPromoMessage({ success: true, text: `Coupon ${code} applied successfully!` });
    } else {
      setPromoMessage({ success: false, text: `Invalid code '${code}'. Try REACT10 or HOOKS20` });
    }
    setPromoInput('');
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <div className="badge badge-amber">Feature 4 • useReducer</div>
        <h2 className="card-title">Shopping Cart &amp; Predictable State Machine</h2>
        <p className="card-subtitle">
          Manage complex, interdependent state logic using <code className="inline-code">useReducer</code>, structured action dispatches, and computed derived state.
        </p>
      </div>

      <div className="card-body">
        <div className="cart-grid">
          {/* Column 1: Product Catalog */}
          <div className="catalog-panel">
            <div className="section-title-row">
              <h3>Available Inventory</h3>
              <span className="badge badge-subtle">{SAMPLE_PRODUCTS.length} Items</span>
            </div>

            <div className="products-list">
              {SAMPLE_PRODUCTS.map(product => {
                const inCart = state.items.find(item => item.id === product.id);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-icon">{product.icon}</div>
                    <div className="product-details">
                      <div className="product-name">{product.name}</div>
                      <div className="product-meta">
                        <span className="product-category">{product.category}</span>
                        <span className="product-price">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                    >
                      {inCart ? `+ Add More (${inCart.quantity})` : '+ Add to Cart'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Active Cart & Totals */}
          <div className="cart-panel">
            <div className="section-title-row">
              <h3>Your Cart</h3>
              <div className="cart-header-actions">
                <span className="cart-badge">{totals.itemCount} items</span>
                {state.items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="clear-btn"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {state.items.length === 0 ? (
              <div className="empty-cart-state">
                <span className="empty-icon">🛒</span>
                <p>Your shopping cart is empty.</p>
                <span className="empty-hint">Add items from the inventory to dispatch <code className="inline-code">ADD_ITEM</code> actions.</span>
              </div>
            ) : (
              <div className="cart-items-wrapper">
                <div className="cart-items-list">
                  {state.items.map(item => (
                    <div key={item.id} className="cart-item-card">
                      <span className="cart-item-icon">{item.icon}</span>
                      <div className="cart-item-info">
                        <span className="cart-item-title">{item.name}</span>
                        <span className="cart-item-rate">${item.price.toFixed(2)} each</span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="qty-stepper">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                          title="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.id, item.name)}
                        className="delete-item-btn"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="promo-form">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    placeholder="Enter coupon (e.g. REACT10, HOOKS20)"
                    className="promo-input"
                  />
                  <button type="submit" className="action-btn btn-secondary btn-sm">
                    Apply Code
                  </button>
                </form>

                {promoMessage && (
                  <div className={`promo-msg ${promoMessage.success ? 'msg-success' : 'msg-error'}`}>
                    {promoMessage.text}
                  </div>
                )}

                {/* Bill Summary Breakdown */}
                <div className="cart-summary">
                  <div className="summary-line">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>

                  {state.discountPercentage > 0 && (
                    <div className="summary-line discount-line">
                      <span>Discount ({state.discountCode} - {state.discountPercentage}%):</span>
                      <span>-${totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="summary-line">
                    <span>Estimated Tax ({(state.taxRate * 100).toFixed(0)}%):</span>
                    <span>${totals.taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="summary-divider" />

                  <div className="summary-line total-line">
                    <span>Grand Total:</span>
                    <span className="grand-total-amount">${totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Reducer Action Log */}
        <div className="log-panel mt-4">
          <div className="log-header">
            <span className="log-title">useReducer Action Dispatch Stream</span>
            <span className="text-xs text-muted">Demonstrates Redux-style Unidirectional Data Flow</span>
          </div>
          <div className="log-stream">
            {actionHistory.map(entry => (
              <div key={entry.id} className="log-row log-accent">
                <span className="log-time">[{entry.time}]</span>
                <span className="log-badge-action">{entry.type}</span>
                <span className="log-payload">{entry.payload}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
