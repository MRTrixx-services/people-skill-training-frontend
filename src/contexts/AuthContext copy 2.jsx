import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOGOUT_START: 'LOGOUT_START',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_TOKEN: 'UPDATE_TOKEN',
  SET_LOADING: 'SET_LOADING',
  SOCIAL_LOGIN_START: 'SOCIAL_LOGIN_START',
  SOCIAL_LOGIN_SUCCESS: 'SOCIAL_LOGIN_SUCCESS',
  SOCIAL_LOGIN_FAILURE: 'SOCIAL_LOGIN_FAILURE',
  UPDATE_SOCIAL_ACCOUNTS: 'UPDATE_SOCIAL_ACCOUNTS',
};

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  isLoggingOut: false,
  error: null,
  tokenExpiry: null,
  lastActivity: null,
  socialAccounts: [],
  availableProviders: [],
  isSocialLoading: false,
};

// Enhanced reducer
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
        tokenExpiry: action.payload.tokenExpiry,
        socialAccounts: action.payload.socialAccounts || [],
        lastActivity: Date.now(),
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
        tokenExpiry: null,
        socialAccounts: [],
        error: action.payload.error
      };
    
    case AUTH_ACTIONS.SOCIAL_LOGIN_START:
      return {
        ...state,
        isSocialLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        isSocialLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        tokenExpiry: action.payload.tokenExpiry,
        socialAccounts: action.payload.socialAccounts || [],
        lastActivity: Date.now(),
        error: null
      };
    
    case AUTH_ACTIONS.SOCIAL_LOGIN_FAILURE:
      return {
        ...state,
        isSocialLoading: false,
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
        tokenExpiry: null,
        lastActivity: null,
        socialAccounts: [],
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
        tokenExpiry: action.payload.tokenExpiry,
        socialAccounts: action.payload.socialAccounts || state.socialAccounts,
        lastActivity: Date.now(),
        isLoading: false
      };
    
    case AUTH_ACTIONS.UPDATE_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        tokenExpiry: action.payload.tokenExpiry,
        lastActivity: Date.now()
      };
    
    case AUTH_ACTIONS.UPDATE_SOCIAL_ACCOUNTS:
      return {
        ...state,
        socialAccounts: action.payload.socialAccounts
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading
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
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const protocolAndHostname = protocol + "//" + hostname;

// export const API_BASE_URL = 'http://103.194.228.141:8002/api';
// export const API_BASE_URL = `https://www.peopleskilltraining.com/api`
export const API_BASE_URL = `${protocolAndHostname}/api`

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 15000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced token expiration calculation
  const getTokenExpiry = (token) => {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (error) {
      console.error('Error parsing token expiry:', error);
      return null;
    }
  };

  // Enhanced axios interceptor
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = state.token || localStorage.getItem('authToken');
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

          const refreshTokenValue = state.refreshToken || localStorage.getItem('refreshToken');
          if (refreshTokenValue) {
            try {
              const refreshResponse = await axios.post('/auth/refresh/', {
                refresh: refreshTokenValue
              });

              const { access } = refreshResponse.data;
              const tokenExpiry = getTokenExpiry(access);
              
              localStorage.setItem('authToken', access);
              
              dispatch({
                type: AUTH_ACTIONS.UPDATE_TOKEN,
                payload: { 
                  token: access,
                  tokenExpiry
                }
              });
              
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return axios(originalRequest);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              logout({ skipApiCall: true });
              return Promise.reject(refreshError);
            }
          } else {
            logout({ skipApiCall: true });
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [state.token, state.refreshToken]);

  // Enhanced session checking on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading: true } });
      
      const token = localStorage.getItem('authToken');
      const refreshTokenValue = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('userData');
      const socialAccountsData = localStorage.getItem('socialAccounts');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          const socialAccounts = socialAccountsData ? JSON.parse(socialAccountsData) : [];
          const tokenExpiry = getTokenExpiry(token);
          
          if (!isTokenExpired(token)) {
            dispatch({
              type: AUTH_ACTIONS.SET_USER,
              payload: { 
                user, 
                token,
                refreshToken: refreshTokenValue,
                tokenExpiry,
                socialAccounts
              }
            });
            
            // Fetch latest social accounts
            await fetchUserSocialAccounts();
          } else {
            if (refreshTokenValue) {
              await refreshToken();
            } else {
              await logout({ skipApiCall: true });
            }
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          await logout({ skipApiCall: true });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    checkExistingSession();
  }, []);

  // Fetch user's connected social accounts
  const fetchUserSocialAccounts = async () => {
    if (!state.isAuthenticated) return;

    try {
      const response = await axios.get('/oauth/accounts/');
      const socialAccounts = response.data;
      
      localStorage.setItem('socialAccounts', JSON.stringify(socialAccounts));
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_SOCIAL_ACCOUNTS,
        payload: { socialAccounts }
      });
      
      return socialAccounts;
    } catch (error) {
      console.error('Error fetching user social accounts:', error);
      return [];
    }
  };

  // NEW: Handle successful authentication with cart checkout flow
  const handleSuccessfulAuth = (userData, token, refreshToken = null, options = {}) => {
    try {
      // Set user data and authentication state
      const tokenExpiry = getTokenExpiry(token);
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { 
          user: userData, 
          token,
          refreshToken,
          tokenExpiry,
          socialAccounts: options.socialAccounts || []
        }
      });

      // Handle cart checkout flow
      const pendingCheckout = sessionStorage.getItem('pendingCheckout');
      const authReturnUrl = sessionStorage.getItem('authReturnUrl');
      const authAction = sessionStorage.getItem('authAction');
      
      if (pendingCheckout && authAction === 'checkout') {
        // Clear stored authentication flow data
        sessionStorage.removeItem('pendingCheckout');
        sessionStorage.removeItem('authReturnUrl');
        sessionStorage.removeItem('authAction');
        sessionStorage.removeItem('redirectMessage');
        
        // Navigate back to cart to continue checkout
        setTimeout(() => {
          if (authReturnUrl === '/cart') {
            navigate('/cart');
          } else {
            // Parse and restore checkout data, then go to checkout
            try {
              const checkoutData = JSON.parse(pendingCheckout);
              navigate('/checkout', { state: checkoutData });
            } catch (error) {
              console.error('Error parsing checkout data:', error);
              navigate('/cart');
            }
          }
        }, 100);
        
        return;
      }
      
      // Handle other return URLs
      if (authReturnUrl) {
        sessionStorage.removeItem('authReturnUrl');
        setTimeout(() => {
          navigate(authReturnUrl);
        }, 100);
        return;
      }
      
      // Handle location state return flow
      if (location.state?.from) {
        const returnPath = location.state.from.pathname + (location.state.from.search || '');
        setTimeout(() => {
          navigate(returnPath, { replace: true });
        }, 100);
        return;
      }
      
      // Default navigation based on user role
      const redirectPath = getRedirectPath(userData.role);
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Error in handleSuccessfulAuth:', error);
      // Fallback to default navigation
      const redirectPath = getRedirectPath(userData?.role);
      navigate(redirectPath, { replace: true });
    }
  };

  // Enhanced login function with cart checkout flow support
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

      // Check verification and approval status
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
          access: access
        };
      }

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

      // Store remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Fetch social accounts
      const socialAccounts = [];
      try {
        // This will be handled after successful auth
        await fetchUserSocialAccounts();
      } catch (error) {
        console.warn('Could not fetch social accounts:', error);
      }

      // Use the enhanced auth handler that manages cart flow
      handleSuccessfulAuth(userData, access, refresh, { socialAccounts });

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
        
        if (data?.detail) {
          errorMessage = data.detail;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (data?.non_field_errors && Array.isArray(data.non_field_errors)) {
          errorMessage = data.non_field_errors[0];
        } else if (data?.email && Array.isArray(data.email)) {
          errorMessage = data.email[0];
        } else if (data?.password && Array.isArray(data.password)) {
          errorMessage = data.password[0];
        } else {
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

  // NEW: Register function with cart checkout flow support
  const register = async (registrationData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await axios.post('/auth/register/', registrationData);
      
      const { user: userData, access, refresh, message } = response.data;

      if (userData && access) {
        // Use the enhanced auth handler that manages cart flow
        handleSuccessfulAuth(userData, access, refresh);
        
        return { 
          success: true, 
          user: userData,
          message: message || 'Registration successful!'
        };
      } else {
        // Registration successful but no auto-login (verification required)
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        
        return {
          success: true,
          requiresVerification: true,
          email: registrationData.email,
          message: message || 'Registration successful! Please check your email to verify your account.'
        };
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (data.detail) errorMessage = data.detail;
        else if (data.message) errorMessage = data.message;
        else if (data.email) errorMessage = Array.isArray(data.email) ? data.email[0] : data.email;
        else if (data.password1) errorMessage = Array.isArray(data.password1) ? data.password1[0] : data.password1;
        else if (data.non_field_errors) errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
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

  // Social login function with cart checkout flow support
  const socialLogin = async (provider) => {
    dispatch({ type: AUTH_ACTIONS.SOCIAL_LOGIN_START });

    try {
      // Get authorization URL from backend
      const authResponse = await axios.post('/oauth/authorize/', {
        provider: provider,
        redirect_uri: `${window.location.origin}/auth/callback`,
      });

      if (!authResponse.data.authorization_url) {
        throw new Error('Failed to get authorization URL');
      }

      // Store provider info and cart flow data for callback handling
      localStorage.setItem('oauthProvider', provider);
      localStorage.setItem('oauthRedirectUri', `${window.location.origin}/auth/callback`);
      
      // Preserve cart checkout flow data during OAuth
      const pendingCheckout = sessionStorage.getItem('pendingCheckout');
      const authReturnUrl = sessionStorage.getItem('authReturnUrl');
      const authAction = sessionStorage.getItem('authAction');
      
      if (pendingCheckout || authReturnUrl || authAction) {
        localStorage.setItem('oauthPendingCheckout', pendingCheckout || '');
        localStorage.setItem('oauthAuthReturnUrl', authReturnUrl || '');
        localStorage.setItem('oauthAuthAction', authAction || '');
      }

      // Redirect to OAuth provider
      window.location.href = authResponse.data.authorization_url;

      return { success: true };
    } catch (error) {
      console.error('Social login error:', error);
      
      let errorMessage = 'Social login failed. Please try again.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({
        type: AUTH_ACTIONS.SOCIAL_LOGIN_FAILURE,
        payload: { error: errorMessage }
      });

      return { success: false, error: errorMessage };
    }
  };

  // Handle OAuth callback with cart checkout flow support
  const handleOAuthCallback = async (callbackData) => {
    dispatch({ type: AUTH_ACTIONS.SOCIAL_LOGIN_START });

    try {
      const response = await axios.post('/oauth/callback/', {
        provider: callbackData.provider,
        code: callbackData.code,
        state: callbackData.state,
        redirect_uri: callbackData.redirect_uri,
      });

      const { user: userData, access_token, refresh_token, social_account, is_new_user } = response.data;

      if (!userData || !access_token) {
        throw new Error('Invalid response from server');
      }

      // Clean up OAuth flow data
      localStorage.removeItem('oauthProvider');
      localStorage.removeItem('oauthRedirectUri');
      
      // Restore cart checkout flow data
      const oauthPendingCheckout = localStorage.getItem('oauthPendingCheckout');
      const oauthAuthReturnUrl = localStorage.getItem('oauthAuthReturnUrl');
      const oauthAuthAction = localStorage.getItem('oauthAuthAction');
      
      if (oauthPendingCheckout || oauthAuthReturnUrl || oauthAuthAction) {
        if (oauthPendingCheckout) sessionStorage.setItem('pendingCheckout', oauthPendingCheckout);
        if (oauthAuthReturnUrl) sessionStorage.setItem('authReturnUrl', oauthAuthReturnUrl);
        if (oauthAuthAction) sessionStorage.setItem('authAction', oauthAuthAction);
        
        // Clean up OAuth-specific storage
        localStorage.removeItem('oauthPendingCheckout');
        localStorage.removeItem('oauthAuthReturnUrl');
        localStorage.removeItem('oauthAuthAction');
      }

      // Fetch all social accounts
      const socialAccounts = [];
      try {
        await fetchUserSocialAccounts();
      } catch (error) {
        console.warn('Could not fetch social accounts:', error);
      }

      // Use the enhanced auth handler that manages cart flow
      handleSuccessfulAuth(userData, access_token, refresh_token, { socialAccounts });

      return { 
        success: true, 
        user: userData,
        isNewUser: is_new_user,
        socialAccount: social_account
      };

    } catch (error) {
      console.error('OAuth callback error:', error);
      
      let errorMessage = 'OAuth authentication failed';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({
        type: AUTH_ACTIONS.SOCIAL_LOGIN_FAILURE,
        payload: { error: errorMessage }
      });

      return { success: false, error: errorMessage };
    }
  };

  // Disconnect social account
  const disconnectSocialAccount = async (accountId) => {
    try {
      await axios.post(`/oauth/accounts/${accountId}/disconnect/`);
      
      // Refresh social accounts list
      await fetchUserSocialAccounts();
      
      return { success: true };
    } catch (error) {
      console.error('Error disconnecting social account:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to disconnect account' 
      };
    }
  };

  // Set primary social account
  const setPrimarySocialAccount = async (accountId) => {
    try {
      await axios.post(`/oauth/accounts/${accountId}/set-primary/`);
      
      // Refresh social accounts list
      await fetchUserSocialAccounts();
      
      return { success: true };
    } catch (error) {
      console.error('Error setting primary social account:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to set primary account' 
      };
    }
  };

  // Enhanced logout function
  const logout = async (options = {}) => {
    if (options.showLoading) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT_START });
    }

    try {
      if (!options.skipApiCall) {
        const token = state.token || localStorage.getItem('authToken');
        const refreshTokenValue = state.refreshToken || localStorage.getItem('refreshToken');
        
        if (token && refreshTokenValue) {
          try {
            await axios.post('/auth/logout/', {
              refresh: refreshTokenValue
            }, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (apiError) {
            console.warn('Logout API call failed:', apiError);
          }
        }
      }

      // Enhanced cleanup - preserve cart but clear auth flow data
      const keysToRemove = [
        'authToken',
        'refreshToken',
        'userData', 
        'rememberMe',
        'userPreferences',
        'sessionData',
        'tempData',
        'socialAccounts',
        'oauthProvider',
        'oauthRedirectUri',
        'oauthPendingCheckout',
        'oauthAuthReturnUrl',
        'oauthAuthAction',
        'zoomConnectionStatus',
        'webinarDrafts'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear auth-related session storage but preserve cart checkout flow
      const pendingCheckout = sessionStorage.getItem('pendingCheckout');
      const authReturnUrl = sessionStorage.getItem('authReturnUrl');
      const authAction = sessionStorage.getItem('authAction');
      const redirectMessage = sessionStorage.getItem('redirectMessage');
      
      sessionStorage.clear();
      
      // Restore cart checkout flow data if it existed
      if (pendingCheckout) sessionStorage.setItem('pendingCheckout', pendingCheckout);
      if (authReturnUrl) sessionStorage.setItem('authReturnUrl', authReturnUrl);
      if (authAction) sessionStorage.setItem('authAction', authAction);
      if (redirectMessage) sessionStorage.setItem('redirectMessage', redirectMessage);

      delete axios.defaults.headers.common['Authorization'];

      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      if (options.onSuccess) {
        options.onSuccess();
      }

      return { success: true };

    } catch (error) {
      console.error('Error during logout:', error);
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

  // Enhanced redirect path function
  // const getRedirectPath = (role) => {
  //   const basePaths = {
  //     admin: '/admin',
  //     instructor: '/instructor', 
  //     attendee: '/attendee',
  //   };

  //   return basePaths[role] || basePaths.attendee;
  // };
// In AuthContext.js, update this function:
const getRedirectPath = (role) => {
  const basePaths = {
    admin: '/admin',
    instructor: '/attendee/orders', // Temporarily redirect instructors to orders page
    attendee: '/attendee/orders',   // Redirect attendees to their orders page
  };

  return basePaths[role] || basePaths.attendee;
};

  // Enhanced role checking
  const hasRole = (requiredRole) => {
    return state.user?.role === requiredRole;
  };

  // Enhanced token expiry checking
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < (currentTime + 30);
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Enhanced refresh token function
  const refreshToken = async () => {
    const refreshTokenValue = state.refreshToken || localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      return logout({ skipApiCall: true });
    }

    try {
      const response = await axios.post('/auth/refresh/', {
        refresh: refreshTokenValue
      });

      const { access } = response.data;
      
      if (access) {
        const tokenExpiry = getTokenExpiry(access);
        localStorage.setItem('authToken', access);
        
        dispatch({
          type: AUTH_ACTIONS.UPDATE_TOKEN,
          payload: { 
            token: access,
            tokenExpiry
          }
        });

        return { success: true, token: access };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return logout({ skipApiCall: true });
    }
  };

  // Enhanced activity tracking
  const updateActivity = () => {
    if (state.isAuthenticated) {
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          tokenExpiry: state.tokenExpiry,
          socialAccounts: state.socialAccounts
        }
      });
    }
  };

  // Token expiry monitoring
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = state.token || localStorage.getItem('authToken');
      if (state.isAuthenticated && token && isTokenExpired(token)) {
        const refreshTokenValue = state.refreshToken || localStorage.getItem('refreshToken');
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

    if (state.isAuthenticated) {
      checkTokenExpiry();
      const interval = setInterval(checkTokenExpiry, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, state.token]);

  // User activity tracking
  useEffect(() => {
    if (state.isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const updateLastActivity = () => updateActivity();

      events.forEach(event => {
        document.addEventListener(event, updateLastActivity, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateLastActivity, true);
        });
      };
    }
  }, [state.isAuthenticated]);

  // Enhanced context value with cart checkout flow support
  const value = {
    // State
    ...state,
    
    // Enhanced authentication actions
    login,
    register, // NEW: Register with cart flow support
    logout,
    clearError,
    refreshToken,
    updateActivity,
    handleSuccessfulAuth, // NEW: Enhanced auth handler with cart flow
    
    // Social login methods
    socialLogin,
    handleOAuthCallback,
    disconnectSocialAccount,
    setPrimarySocialAccount,
    fetchUserSocialAccounts,
    
    // Utilities
    getRedirectPath,
    hasRole,
    isTokenExpired,
    getTokenExpiry,
    
    // Helper methods
    isTokenValid: () => state.token && !isTokenExpired(state.token),
    getAuthHeaders: () => ({
      'Authorization': `Bearer ${state.token || localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    }),
    
    // Zoom-specific helpers
    canAccessZoom: () => state.isAuthenticated && ['instructor', 'admin'].includes(state.user?.role),
    getZoomAccount: () => state.socialAccounts?.find(account => account.provider?.name === 'zoom'),
    getUserDisplayName: () => state.user ? `${state.user.first_name} ${state.user.last_name}`.trim() || state.user.email : null,
    
    // Social account utilities
    getSocialAccount: (provider) => state.socialAccounts?.find(account => account.provider?.name === provider),
    hasSocialAccount: (provider) => state.socialAccounts?.some(account => account.provider?.name === provider),
    getPrimarySocialAccount: () => state.socialAccounts?.find(account => account.is_primary),
    getConnectedProviders: () => state.socialAccounts?.map(account => account.provider?.name) || [],
    
    // NEW: Cart checkout flow utilities
    hasPendingCheckout: () => !!sessionStorage.getItem('pendingCheckout'),
    getPendingCheckout: () => {
      try {
        const data = sessionStorage.getItem('pendingCheckout');
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    },
    clearPendingCheckout: () => {
      sessionStorage.removeItem('pendingCheckout');
      sessionStorage.removeItem('authReturnUrl');
      sessionStorage.removeItem('authAction');
      sessionStorage.removeItem('redirectMessage');
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Enhanced custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
