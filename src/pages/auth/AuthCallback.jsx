// pages/AuthCallback.jsx
"use client";
import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleOAuthCallback, getRedirectPath } = useAuth();
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const provider = urlParams.get('provider') || 'zoom'; // Default to zoom

      if (error) {
        showToast(`Authentication failed: ${error}`, 'error');
        navigate('/login');
        return;
      }

      if (!code) {
        showToast('No authorization code received', 'error');
        navigate('/login');
        return;
      }

      try {
        const result = await handleOAuthCallback({
          provider,
          code,
          state,
          redirect_uri: `${window.location.origin}/auth/callback`,
        });

        if (result.success) {
          showToast(`Welcome ${result.user.first_name || result.user.name}!`, 'success');
          const redirectPath = getRedirectPath(result.user.role);
          navigate(redirectPath, { replace: true });
        } else {
          showToast(result.error || 'Authentication failed', 'error');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        showToast('Authentication failed. Please try again.', 'error');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, handleOAuthCallback, getRedirectPath, showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600">Completing authentication...</p>
        <p className="text-sm text-gray-500">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
};

export default AuthCallback;
