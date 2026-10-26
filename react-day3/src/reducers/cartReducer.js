/**
 * Cart Reducer Actions
 */
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT',
};

/**
 * Initial sample catalog items
 */
export const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Mechanical Keyboard (RGB)', price: 89.99, category: 'Hardware', icon: '⌨️' },
  { id: 'p2', name: 'Ergonomic Vertical Mouse', price: 49.50, category: 'Hardware', icon: '🖱️' },
  { id: 'p3', name: 'Noise-Cancelling Headphones', price: 149.00, category: 'Audio', icon: '🎧' },
  { id: 'p4', name: 'Ultra-wide 4K Monitor Arm', price: 65.00, category: 'Accessories', icon: '🖥️' },
  { id: 'p5', name: 'React Architecture Handbook', price: 29.99, category: 'Books', icon: '📘' },
];

/**
 * Initial cart state
 */
export const initialCartState = {
  items: [
    { id: 'p1', name: 'Mechanical Keyboard (RGB)', price: 89.99, quantity: 1, icon: '⌨️' },
    { id: 'p5', name: 'React Architecture Handbook', price: 29.99, quantity: 2, icon: '📘' },
  ],
  discountCode: 'REACT10',
  discountPercentage: 10, // 10%
  taxRate: 0.08, // 8% sales tax
};

/**
 * Helper to compute derived cart summary metrics.
 * Demonstrates keeping minimal state and computing derived values!
 */
export function calculateCartTotals(cartState) {
  const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * cartState.discountPercentage) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * cartState.taxRate;
  const grandTotal = taxableAmount + taxAmount;

  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}

/**
 * Pure reducer function for shopping cart.
 * Pure function rule: No side effects, returns a brand new state object.
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Item exists, update quantity immutably
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        return { ...state, items: updatedItems };
      }

      // New item, append immutably
      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1 }],
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const idToRemove = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.id !== idToRemove),
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      // If quantity is 0 or negative, remove the item
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case CART_ACTIONS.APPLY_DISCOUNT: {
      const code = (action.payload || '').trim().toUpperCase();
      let percentage = 0;

      if (code === 'REACT10') percentage = 10;
      else if (code === 'HOOKS20') percentage = 20;
      else if (code === 'DEEPDIVE50') percentage = 50;

      return {
        ...state,
        discountCode: code,
        discountPercentage: percentage,
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
      };
    }

    default:
      console.warn(`[cartReducer] Unrecognized action type: ${action.type}`);
      return state;
  }
}
