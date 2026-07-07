// components/SocialLogin.jsx
"use client";
import React, { useContext, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';

const SocialLogin = () => {
  const { socialLogin } = useAuth();
  const { showToast } = useContext(ToastContext);
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    
    try {
      // This will redirect to your Django OAuth endpoint
      const result = await socialLogin(provider);
      
      if (!result.success) {
        showToast(result.error || 'Social login failed', 'error');
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      showToast('An unexpected error occurred during login', 'error');
    } finally {
      setLoadingProvider(null);
    }
  };

  const socialProviders = [
    {
      name: 'zoom',
      displayName: 'Zoom',
      color: '#2D8CFF',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.08 2.7-.08 2.7s-.81-.04-1.44-.04c-.63 0-1.44.04-1.44.04s.07-1.12-.08-2.7c-.16-1.69-.41-2.7-.41-2.7s.81.04 1.93.04c1.12 0 1.93-.04 1.93-.04s-.25 1.01-.41 2.7zM12 8.2c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm0 7.6c-2.9 0-5.25-2.35-5.25-5.25S9.1 5.3 12 5.3s5.25 2.35 5.25 5.25S14.9 15.8 12 15.8z"/>
        </svg>
      )
    },
    {
      name: 'google',
      displayName: 'Google',
      color: '#4285f4',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )
    },
    // Add other providers as needed
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {socialProviders.map((provider) => (
          <button
            key={provider.name}
            onClick={() => handleSocialLogin(provider.name)}
            disabled={loadingProvider === provider.name}
            className={`
              group relative w-full flex justify-center items-center px-4 py-3 
              border border-gray-300 rounded-lg text-sm font-medium 
              text-gray-700 bg-white hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transition-all duration-200 hover:shadow-md
              ${loadingProvider === provider.name ? 'opacity-75 cursor-not-allowed' : ''}
            `}
            style={{ 
              borderColor: loadingProvider === provider.name ? provider.color : '',
              color: loadingProvider === provider.name ? provider.color : ''
            }}
          >
            {loadingProvider === provider.name ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2" 
                   style={{ borderColor: provider.color }}>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div style={{ color: provider.color }}>
                  {provider.icon}
                </div>
                <span>Continue with {provider.displayName}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;
