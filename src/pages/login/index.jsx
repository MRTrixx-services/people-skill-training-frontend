"use client";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';
import DemoCredentials from './components/DemoCredentials';
import { TypewriterEffectSmooth } from 'components/ui/typewriter-effect';
import { useAuth } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';
import SocialLogin from '../auth/SocialLogin';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    login, 
    isAuthenticated, 
    user, 
    clearError, 
    error,
    hasPendingCheckout,
    getPendingCheckout 
  } = useAuth();
  const { showToast } = useContext(ToastContext);
  
  // ✅ Use useRef instead of useState to prevent re-renders
  const hasShownWelcomeToast = useRef(false);

  // Check for messages from registration, email verification, or cart checkout
  useEffect(() => {
    const state = location.state;
    const redirectMessage = sessionStorage.getItem('redirectMessage');
    
    const messageToShow = state?.message || redirectMessage;
    
    if (messageToShow) {
      const messageType = state?.action === 'checkout' ? 'info' : 'info';
      showToast(messageToShow, messageType);
      
      navigate(location.pathname, { replace: true, state: {} });
      if (redirectMessage) {
        sessionStorage.removeItem('redirectMessage');
      }
    }
  }, [location.state, showToast, navigate, location.pathname]);

  // ✅ FIXED: Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !hasShownWelcomeToast.current) {
      showToast(`Welcome back, ${user.first_name || user.name}!`, 'success');
      hasShownWelcomeToast.current = true; // ✅ No re-render
    }
  }, [isAuthenticated, user, showToast]); // ✅ Removed hasShownWelcomeToast from deps

  // Clear any existing errors when component mounts
  // useEffect(() => {
  //   clearError();
  // }, [clearError]);

  // Show auth context errors via toast
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      clearError();
    }
  }, [error, showToast, clearError]);

  const handleLogin = async (formData) => {
  try {
    const result = await login(formData);
    
    if (result.success) {
      showToast(`Welcome back, ${result.user.first_name || result.user.name}!`, 'success');
      // Navigation already handled by handleSuccessfulAuth
    } else {
      if (result.requiresVerification) {
        showToast(
          'Please verify your email address first. Check your inbox for a verification link.',
          'warning',
          7000
        );
        
        // Optional: Redirect to resend verification page
        setTimeout(() => {
          navigate('/verify-email', {
            state: { 
              email: result.user?.email || formData.email,
              message: 'Please verify your email address to continue.',
              from: location.state?.from,
              action: location.state?.action
            }
          });
        }, 2000);
      } else if (result.requiresApproval) {
        showToast(
          'Your instructor account is under review. You will be notified once approved.',
          'info',
          6000
        );
      } else {
        showToast(result.error || 'Login failed. Please try again.', 'error');
      }
    }
  } catch (error) {
    console.error('Login form error:', error);
    showToast('An unexpected error occurred. Please try again.', 'error');
  }
};


  const handleSelectDemoCredentials = async (email, password) => {
    showToast('Using demo credentials...', 'info', 2000);
    await handleLogin({ email, password, rememberMe: false });
  };

  // Show loading state while checking authentication
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">
            {hasPendingCheckout() ? 'Redirecting to your cart...' : 'Redirecting to your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-rose-600/10 rounded-full blur-2xl animate-bounce"></div>
      
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-14 md:pt-16 lg:pt-24">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Enhanced Branding & Typewriter */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              {/* Cart Checkout Notice */}
              {hasPendingCheckout() && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Continue Your Purchase</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        You have items waiting in your cart. Sign in to complete your checkout securely.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Typewriter Effect */}
              <div className="space-y-4">
                <p className="text-xl font-bold text-blue-500">
                  {hasPendingCheckout() 
                    ? "Complete your learning journey - sign in to checkout" 
                    : "Your journey to professional excellence starts here"
                  }
                </p>
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Live Webinars */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                  Live Webinars
                </h3>
                <p className="text-sm text-gray-600">Real-time interactive sessions with expert Q&A and networking</p>
              </div>

              {/* Recorded Sessions */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 2v12a2 2 0 002 2h6a2 2 0 002-2V6H7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 9.172a4 4 0 00-5.656 0M9.172 14.828a4 4 0 005.656 0M12 12h.01" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Recorded Library
                </h3>
                <p className="text-sm text-gray-600">Access 2000+ sessions anytime, learn at your own pace</p>
              </div>

              {/* Flexible Learning */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Flexible Learning</h3>
                <p className="text-sm text-gray-600">Pause, rewind, and repeat - learn on your schedule</p>
              </div>

              {/* Expert Community */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Expert Network</h3>
                <p className="text-sm text-gray-600">Connect with 500+ industry professionals</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
              <LoginHeader />
              
              {/* Show cart notice on mobile */}
              {hasPendingCheckout() && (
                <div className="block lg:hidden bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Cart Waiting</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Sign in to complete your checkout
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <LoginForm onLogin={handleLogin} />
              
              <LoginFooter />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
