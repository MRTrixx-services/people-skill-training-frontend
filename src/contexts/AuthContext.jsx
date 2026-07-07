import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance, { API_BASE_URL } from '../config/axiosInstance';

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  UPDATE_TOKEN: 'UPDATE_TOKEN',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  tokenExpiry: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return { ...state, isLoading: true, error: null };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        tokenExpiry: action.payload.tokenExpiry,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload.error
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        tokenExpiry: action.payload.tokenExpiry,
        isLoading: false
      };
    
    case AUTH_ACTIONS.UPDATE_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        tokenExpiry: action.payload.tokenExpiry
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // CART/CHECKOUT FUNCTIONS
  // ============================================

  // Check if there's a pending checkout
  const hasPendingCheckout = () => {
    const pendingCheckout = sessionStorage.getItem('pendingCheckout');
    return !!pendingCheckout;
  };

  // Get pending checkout data
  const getPendingCheckout = () => {
    try {
      const pendingCheckout = sessionStorage.getItem('pendingCheckout');
      return pendingCheckout ? JSON.parse(pendingCheckout) : null;
    } catch (error) {
      console.error('Error parsing pending checkout:', error);
      return null;
    }
  };

  // Clear pending checkout
  const clearPendingCheckout = () => {
    sessionStorage.removeItem('pendingCheckout');
  };

  // Save pending checkout
  const savePendingCheckout = (checkoutData) => {
    try {
      sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));
    } catch (error) {
      console.error('Error saving pending checkout:', error);
    }
  };

  // ============================================
  // TOKEN FUNCTIONS
  // ============================================

  // Get token expiry
  const getTokenExpiry = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const tokenExpiry = getTokenExpiry(token);
          
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: { user, token, refreshToken, tokenExpiry }
          });
        } catch (error) {
          console.error('Error restoring session:', error);
          logout({ skipApiCall: true });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkSession();
  }, []);

  // ============================================
  // NAVIGATION HELPERS
  // ============================================

  // Get redirect path based on user role
  const getRedirectPath = (role) => {
    const paths = {
      admin: '/admin',
      instructor: '/attendee',
      attendee: '/attendee',
    };
    return paths[role] || paths.attendee;
  };

  // Handle successful authentication with cart checkout flow
  const handleSuccessfulAuth = (user) => {
    // Check for pending checkout
    if (hasPendingCheckout()) {
      const checkoutData = getPendingCheckout();
      console.log('Pending checkout found:', checkoutData);
      
      // Navigate to cart/checkout page
      navigate('/cart', { 
        replace: true,
        state: { 
          fromLogin: true,
          message: 'Please complete your checkout'
        }
      });
      
      return;
    }

    // Check for intended destination
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }

    // Default role-based navigation
    const redirectPath = getRedirectPath(user.role);
    navigate(redirectPath, { replace: true });
  };

  // ============================================
  // AUTHENTICATION FUNCTIONS
  // ============================================

  // Login function
  const login = async (credentials) => {
  dispatch({ type: AUTH_ACTIONS.LOGIN_START });

  try {
    const response = await axiosInstance.post('/auth/login/', credentials);
    const { user, access, refresh } = response.data;

    if (!user || !access) {
      throw new Error('Invalid response from server');
    }

    // ✅ Check verification status
    if (user.is_verified === false) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: 'Please verify your email first.' }
      });
      return {
        success: false,
        error: 'Please verify your email first.',
        requiresVerification: true,
        email: credentials.email,
        user: user // Send user data for potential resend functionality
      };
    }

    // ✅ Check instructor approval status (if applicable)
    if (user.role === 'instructor' && user.is_approved === false) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: 'Your instructor account is pending approval.' }
      });
      return {
        success: false,
        error: 'Your instructor account is pending approval.',
        requiresApproval: true,
        user: user
      };
    }

    // ✅ Store auth data
    const tokenExpiry = getTokenExpiry(access);
    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('userData', JSON.stringify(user));

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user, token: access, refreshToken: refresh, tokenExpiry }
    });

    // ✅ Handle navigation (including cart checkout flow)
    handleSuccessfulAuth(user);

    return { success: true, user, autoRedirected: true };

  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed. Please try again.';
    if (error.response?.data) {
      errorMessage = error.response.data.detail || error.response.data.error || errorMessage;
    }

    dispatch({
      type: AUTH_ACTIONS.LOGIN_FAILURE,
      payload: { error: errorMessage }
    });

    return { success: false, error: errorMessage };
  }
};

  // Register function
  // Register function
const register = async (data) => {
  dispatch({ type: AUTH_ACTIONS.LOGIN_START });

  try {
    const response = await axiosInstance.post('/auth/register/', data);
    const { 
      user, 
      tokens, 
      requires_verification, 
      success,
      message,
      platform_message 
    } = response.data;

    // ✅ CASE 1: Auto-verified (no email verification required)
    if (success && user && tokens?.access && !requires_verification) {
      const tokenExpiry = getTokenExpiry(tokens.access);
      
      // Store auth data
      localStorage.setItem('authToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('userData', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { 
          user, 
          token: tokens.access, 
          refreshToken: tokens.refresh, 
          tokenExpiry 
        }
      });

      // Handle navigation (including cart checkout flow)
      handleSuccessfulAuth(user);

      return { 
        success: true, 
        user,
        requiresVerification: false,
        message: platform_message || message,
        autoRedirected: true // Flag to indicate auth context handled redirect
      };
    } 
    // ✅ CASE 2: Email verification required
    else if (success && requires_verification) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: null } // Clear any errors
      });

      return {
        success: true,
        requiresVerification: true,
        user: user, // May contain partial user data
        message: platform_message || message || 'Please verify your email.'
      };
    }
    // ✅ CASE 3: Unexpected response structure
    else {
      throw new Error('Invalid registration response');
    }

  } catch (error) {
    console.error('Register error:', error);
    
    // Extract Django REST Framework validation errors
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Handle field-specific validation errors (like {"email": ["error message"]})
      if (typeof errorData === 'object' && !errorData.detail && !errorData.error) {
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) => {
            // Format field name (convert snake_case to Title Case)
            const fieldName = field
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            // Extract message from array or use as-is
            const message = Array.isArray(messages) ? messages[0] : messages;
            return `${fieldName}: ${message}`;
          })
          .join('. ');
        
        errorMessage = errorMessages;
      } 
      // Handle detail-based errors
      else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
      // Handle generic error field
      else if (errorData.error) {
        errorMessage = errorData.error;
      }
      // Fallback: try to extract any error message
      else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    }

    dispatch({
      type: AUTH_ACTIONS.LOGIN_FAILURE,
      payload: { error: errorMessage }
    });

    return { success: false, error: errorMessage };
  }
};

  // Logout function
  const logout = async (options = {}) => {
    try {
      if (!options.skipApiCall) {
        const token = state.token || localStorage.getItem('authToken');
        const refreshToken = state.refreshToken || localStorage.getItem('refreshToken');
        
        if (token && refreshToken) {
          await axiosInstance.post('/auth/logout/', { refresh: refreshToken });
        }
      }

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear(); // Also clear pending checkout
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      navigate('/login', { replace: true });

      return { success: true };

    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      navigate('/login', { replace: true });
      return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    // State
    ...state,
    
    // Auth functions
    login,
    register,
    logout,
    clearError,
    
    // Cart/Checkout functions
    hasPendingCheckout,
    getPendingCheckout,
    clearPendingCheckout,
    savePendingCheckout,
    
    // Navigation helpers
    getRedirectPath,
    handleSuccessfulAuth,
    
    // API utilities
    axiosInstance,
    API_BASE_URL,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
