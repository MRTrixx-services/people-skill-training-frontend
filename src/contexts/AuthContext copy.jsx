import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOGOUT_START: 'LOGOUT_START',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to check existing session
  isLoggingOut: false, 
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        error: action.payload.error
      };
    case AUTH_ACTIONS.LOGOUT_START:
      return {
        ...state,
        isLoggingOut: true
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        error: null,
        isLoading: false,
        isLoggingOut: false
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isLoading: false
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// API Base URL
export const API_BASE_URL = 'http://103.194.228.141:8000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Axios interceptor for automatic token handling
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh token
          const refreshTokenValue = localStorage.getItem('refreshToken');
          if (refreshTokenValue) {
            try {
              const refreshResponse = await axios.post('/auth/token/refresh/', {
                refresh: refreshTokenValue
              });

              const { access } = refreshResponse.data;
              
              // Update stored token
              localStorage.setItem('authToken', access);
              
              // Update axios headers
              originalRequest.headers.Authorization = `Bearer ${access}`;
              
              // Update state with new token
              dispatch({
                type: AUTH_ACTIONS.SET_USER,
                payload: { 
                  user: state.user, 
                  token: access,
                  refreshToken: refreshTokenValue
                }
              });

              // Retry original request
              return axios(originalRequest);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // Force logout if refresh fails
              logout({ skipApiCall: true });
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token available - force logout
            logout({ skipApiCall: true });
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [state.user]);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const token = localStorage.getItem('authToken');
      const refreshTokenValue = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          
          // Check if token is expired
          if (!isTokenExpired(token)) {
            dispatch({
              type: AUTH_ACTIONS.SET_USER,
              payload: { 
                user, 
                token,
                refreshToken: refreshTokenValue
              }
            });
          } else {
            // Token expired, try to refresh if refresh token exists
            if (refreshTokenValue) {
              refreshToken();
            } else {
              // No refresh token, clear everything
              logout({ skipApiCall: true });
            }
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          logout({ skipApiCall: true });
        }
      } else {
        // No stored session
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    checkExistingSession();
  }, []);

  // Login function with enhanced error handling for backend detail messages
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await axios.post('/auth/login/', {
        email: credentials.email,
        password: credentials.password
      });

      const { user: userData, access, refresh } = response.data;

      if (!userData || !access) {
        throw new Error('Invalid response from server');
      }

      // Check if user is verified (using is_verified from your API response)
      if (userData.is_verified === false) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: 'Please verify your email address before logging in.' }
      });
      return {
        success: false,
        error: 'Please verify your email address before logging in.',
        requiresVerification: true,
        email: userData.email,
        access: access // Include access token for resend verification API
      };
    }
      // Check if instructor account is approved (if applicable)
      if (userData.role === 'instructor' && userData.status && userData.status !== 'active') {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: 'Your instructor account is still under review. Please wait for approval.' }
        });
        return {
          success: false,
          error: 'Your instructor account is still under review. Please wait for approval.',
          requiresApproval: true,
            email: userData.email,
        access: access
        };
      }

      // Store tokens and user data
      localStorage.setItem('authToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Remember me functionality
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { 
          user: userData, 
          token: access,
          refreshToken: refresh
        }
      });

      return { 
        success: true, 
        user: userData,
        message: 'Login successful!'
      };

    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        // First priority: Use the exact detail message from backend if available
        if (data?.detail) {
          errorMessage = data.detail;
        }
        // Second priority: Use message field if available
        else if (data?.message) {
          errorMessage = data.message;
        }
        // Third priority: Use error field if available
        else if (data?.error) {
          errorMessage = data.error;
        }
        // Fourth priority: Use non_field_errors array if available
        else if (data?.non_field_errors && Array.isArray(data.non_field_errors)) {
          errorMessage = data.non_field_errors[0];
        }
        // Fifth priority: Use specific field errors (email, password, etc.)
        else if (data?.email && Array.isArray(data.email)) {
          errorMessage = data.email[0];
        }
        else if (data?.password && Array.isArray(data.password)) {
          errorMessage = data.password[0];
        }
        // Fallback to status-based messages
        else {
          switch (status) {
            case 400:
              errorMessage = 'Invalid email or password.';
              break;
            case 401:
              errorMessage = 'Invalid email or password.';
              break;
            case 403:
              errorMessage = 'Account is not active. Please contact support.';
              break;
            case 422:
              errorMessage = 'Please verify your email address first.';
              break;
            case 429:
              errorMessage = 'Too many login attempts. Please try again later.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = 'Login failed. Please try again.';
          }
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage }
      });

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  // Logout function with API integration
  const logout = async (options = {}) => {
    // Start logout loading state if needed
    if (options.showLoading) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT_START });
    }

    try {
      // Call logout API endpoint if not skipping
      if (!options.skipApiCall) {
        const token = localStorage.getItem('authToken');
        const refreshTokenValue = localStorage.getItem('refreshToken');
        
        if (token && refreshTokenValue) {
          try {
            await axios.post('/auth/logout/', {
              refresh: refreshTokenValue
            }, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (apiError) {
            console.warn('Logout API call failed:', apiError);
            // Continue with local logout even if API call fails
          }
        }
      }

      // Clear all authentication data from localStorage
      const keysToRemove = [
        'authToken',
        'refreshToken',
        'userData', 
        'rememberMe',
        'userPreferences',
        'sessionData',
        'tempData'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];

      // Dispatch logout action
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      // Optional callback
      if (options.onSuccess) {
        options.onSuccess();
      }

      console.log('User successfully logged out');
      return { success: true };

    } catch (error) {
      console.error('Error during logout:', error);
      
      // Force logout even if there's an error
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      if (options.onError) {
        options.onError(error);
      }
      
      return { success: false, error: error.message };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Get redirect path based on role
  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/instructor';
      case 'attendee':
      default:
        return '/attendee';
    }
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    return state.user?.role === requiredRole;
  };

  // Check if JWT token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired (with 30 second buffer)
      return payload.exp < (currentTime + 30);
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      return logout({ skipApiCall: true });
    }

    try {
      const response = await axios.post('/auth/token/refresh/', {
        refresh: refreshTokenValue
      });

      const { access } = response.data;
      
      if (access) {
        // Store new access token
        localStorage.setItem('authToken', access);
        
        // Update state with new token
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { 
            user: state.user, 
            token: access,
            refreshToken: refreshTokenValue
          }
        });

        return { success: true };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return logout({ skipApiCall: true });
    }
  };

  // Auto-logout on token expiry (check every 5 minutes)
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('authToken');
      if (state.isAuthenticated && token && isTokenExpired(token)) {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (refreshTokenValue) {
          refreshToken();
        } else {
          logout({ 
            skipApiCall: true,
            onSuccess: () => {
              console.log('Session expired. Please login again.');
            }
          });
        }
      }
    };

    // Check immediately and then every 5 minutes
    if (state.isAuthenticated) {
      checkTokenExpiry();
      const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  // Context value
  const value = {
    // State
    ...state,
    // Actions
    login,
    logout,
    clearError,
    refreshToken,
    // Utilities
    getRedirectPath,
    hasRole,
    isTokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
