// contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      // ✅ Check for existing item using cartId or combination of webinarId and itemType
      const existingItem = state.items.find(
        item => item.cartId === action.payload.cartId || 
        (item.webinarId === action.payload.webinarId && item.itemType === action.payload.itemType)
      );
      
      if (existingItem) {
        console.log('⚠️ Item already exists in cart:', existingItem.cartId);
        return state; // Don't add duplicate items
      }

      const newItems = [...state.items, action.payload];
      const newTotal = newItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      
      console.log('✅ Added to cart:', action.payload.cartId, `Total: $${newTotal.toFixed(2)}`);
      
      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItems.length
      };
    }

    case 'REMOVE_FROM_CART': {
      const removedItem = state.items.find(item => item.cartId === action.payload);
      const filteredItems = state.items.filter(item => item.cartId !== action.payload);
      const updatedTotal = filteredItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      
      console.log('🗑️ Removed from cart:', action.payload);
      
      return {
        ...state,
        items: filteredItems,
        total: updatedTotal,
        itemCount: filteredItems.length
      };
    }

    case 'CLEAR_CART':
      console.log('🧹 Clearing cart');
      return {
        ...initialState,
        isOpen: state.isOpen // Preserve cart open state
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload
      };

    case 'LOAD_CART': {
      const loadedTotal = action.payload.items?.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) || 0;
      console.log('📦 Loaded cart from storage:', action.payload.items?.length || 0, 'items');
      
      return {
        ...state,
        items: action.payload.items || [],
        total: loadedTotal,
        itemCount: action.payload.items?.length || 0
      };
    }

    // ✅ NEW: Update cart items (useful for resuming pending orders)
    case 'SET_CART_ITEMS': {
      const newTotal = action.payload.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      
      return {
        ...state,
        items: action.payload,
        total: newTotal,
        itemCount: action.payload.length
      };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('webinarCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          // ✅ Validate each item before loading
          const validItems = parsedCart.items.filter(item => 
            item.webinarId && item.title && item.price !== undefined
          );
          
          if (validItems.length > 0) {
            dispatch({ 
              type: 'LOAD_CART', 
              payload: {
                items: validItems,
                itemCount: validItems.length
              }
            });
          } else {
            console.warn('⚠️ Cart had invalid items, clearing...');
            localStorage.removeItem('webinarCart');
          }
        }
      } catch (error) {
        console.error('❌ Error loading cart from localStorage:', error);
        localStorage.removeItem('webinarCart'); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      try {
        localStorage.setItem('webinarCart', JSON.stringify({
          items: state.items,
          total: state.total,
          itemCount: state.itemCount,
          lastUpdated: new Date().toISOString()
        }));
      } catch (error) {
        console.error('❌ Error saving cart to localStorage:', error);
      }
    } else {
      localStorage.removeItem('webinarCart');
    }
  }, [state.items, state.total, state.itemCount]);

  // ✅ Enhanced addToCart with better error handling
  const addToCart = async (webinarOrItem, selectedOption = null) => {
    try {
      let cartItem;

      // New signature: addToCart(cartItemObject)
      if (typeof webinarOrItem === 'object' && webinarOrItem.cartId) {
        cartItem = webinarOrItem;
      }
      // Old signature: addToCart(webinar, selectedOption)
      else if (webinarOrItem && selectedOption) {
        const webinar = webinarOrItem;
        
        // Validate webinar pricing
        if (!webinar.pricing?.recorded) {
          console.error('❌ Missing pricing information:', webinar);
          throw new Error('Webinar pricing information is missing');
        }

        cartItem = {
          cartId: `${webinar.id || webinar.webinarId}_${selectedOption}_${Date.now()}`,
          id: webinar.id,
          webinarId: webinar.webinarId,
          title: webinar.title,
          type: selectedOption,
          itemType: selectedOption === 'single' ? 'recorded_single' : 'recorded_group',
          price: parseFloat(
            selectedOption === 'single' 
              ? webinar.pricing.recorded.oneParticipant 
              : webinar.pricing.recorded.groupAttendees
          ),
          image: webinar.videoThumbnail || webinar.preview || '',
          instructor: webinar.instructor?.name || 'Unknown Instructor',
          duration: webinar.duration,
          webinarType: webinar.webinar_type || 'recorded',
          accessType: selectedOption === 'single' 
            ? 'Recorded - Single Attendee' 
            : 'Recorded - Multi Attendees',
          description: selectedOption === 'single' 
            ? '6 months access to recorded webinar' 
            : 'Unlimited team access to recorded webinar',
          userAuthenticated: true,
          addedAt: new Date().toISOString()
        };
      }
      // Handle case where item is passed directly but without cartId
      else if (typeof webinarOrItem === 'object') {
        cartItem = {
          ...webinarOrItem,
          cartId: webinarOrItem.cartId || `${webinarOrItem.webinarId}_${webinarOrItem.itemType}_${Date.now()}`,
          price: parseFloat(webinarOrItem.price),
          addedAt: new Date().toISOString()
        };
      }
      else {
        throw new Error('Invalid parameters passed to addToCart');
      }

      // ✅ Validate required fields
      const requiredFields = ['webinarId', 'title', 'price', 'cartId'];
      const missingFields = requiredFields.filter(field => !cartItem[field]);
      
      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields, cartItem);
        throw new Error(`Missing required cart item fields: ${missingFields.join(', ')}`);
      }

      // ✅ Validate price is a number
      if (isNaN(cartItem.price) || cartItem.price <= 0) {
        throw new Error('Invalid price value');
      }

      console.log('➕ Adding item to cart:', {
        cartId: cartItem.cartId,
        title: cartItem.title,
        price: `$${cartItem.price.toFixed(2)}`
      });
      
      dispatch({ type: 'ADD_TO_CART', payload: cartItem });
      
      return Promise.resolve(cartItem);
    } catch (error) {
      console.error('❌ Error adding item to cart:', error);
      return Promise.reject(error);
    }
  };

  const removeFromCart = (cartId) => {
    if (!cartId) {
      console.error('❌ Cannot remove item: cartId is required');
      return;
    }
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (isOpen) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen });
  };

  // ✅ NEW: Set cart items directly (useful for resuming pending orders)
  const setCartItems = (items) => {
    if (!Array.isArray(items)) {
      console.error('❌ setCartItems requires an array');
      return;
    }
    
    // Validate items
    const validItems = items.filter(item => 
      item.webinarId && item.title && item.price !== undefined
    );
    
    if (validItems.length !== items.length) {
      console.warn(`⚠️ Filtered out ${items.length - validItems.length} invalid items`);
    }
    
    dispatch({ type: 'SET_CART_ITEMS', payload: validItems });
  };

  // Get cart item by webinar and type
  const getCartItem = (webinarId, itemType) => {
    return state.items.find(item => 
      item.webinarId === webinarId && item.itemType === itemType
    );
  };

  // Check if item exists in cart
  const isInCart = (webinarId, itemType) => {
    return state.items.some(item => 
      item.webinarId === webinarId && item.itemType === itemType
    );
  };

  // ✅ NEW: Get cart summary for checkout
  const getCartSummary = () => {
    return {
      items: state.items,
      subtotal: state.total,
      tax: 0, // Calculate tax if needed
      discount: 0, // Apply discount if needed
      total: state.total,
      itemCount: state.itemCount
    };
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      clearCart,
      toggleCart,
      setCartOpen,
      setCartItems, // ✅ NEW
      getCartItem,
      isInCart,
      getCartSummary // ✅ NEW
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
