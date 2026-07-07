import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import SuccessMessage from './components/SuccessMessage';
import { useAuth } from 'contexts/AuthContext';
import { ToastContext } from 'contexts/ToastContext';


const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, hasPendingCheckout, getPendingCheckout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const { showToast } = useContext(ToastContext);


  // Check for cart checkout flow messages
  React.useEffect(() => {
    const state = location.state;
    const redirectMessage = sessionStorage.getItem('redirectMessage');
    
    const messageToShow = state?.message || redirectMessage;
    
    if (messageToShow) {
      showToast(messageToShow, 'info');
      
      // Clear the state and sessionStorage
      navigate(location.pathname, { replace: true, state: {} });
      if (redirectMessage) {
        sessionStorage.removeItem('redirectMessage');
      }
    }
  }, [location.state, showToast, navigate, location.pathname]);


  // Show pending checkout message if applicable
  React.useEffect(() => {
    if (hasPendingCheckout()) {
      const checkoutData = getPendingCheckout();
      if (checkoutData && checkoutData.items?.length > 0) {
        showToast(
          `You have ${checkoutData.items.length} item(s) waiting in your cart. Create an account to complete your checkout.`, 
          'info', 
          6000
        );
      }
    }
  }, [hasPendingCheckout, getPendingCheckout, showToast]);


  const handleRegistration = async (formData) => {
  setIsLoading(true);

  try {
    // Use the enhanced register function from AuthContext
    const result = await register({
      email: formData.email,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.role,
      company: formData.company,
      ...(formData.phone && { phone: formData.phone }),
    });

    if (result.success) {
      // Create user object for success message
      const newUser = {
        id: result.user?.id || Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        company: formData.company,
        status: formData.role === 'instructor' ? 'pending' : (result.requiresVerification ? 'inactive' : 'active'),
        createdAt: new Date().toISOString(),
        emailVerified: !result.requiresVerification,
      };

      setRegisteredUser(newUser);
      setRequiresVerification(result.requiresVerification);

      // ✅ CASE 1: Email verification required
      if (result.requiresVerification) {
        setRegistrationSuccess(true);
        
        // Show appropriate success messages based on role and cart status
        if (hasPendingCheckout()) {
          if (formData.role === 'attendee') {
            showToast(
              'Account created! Please verify your email and then sign in to complete your checkout.', 
              'success', 
              5000
            );
          } else if (formData.role === 'instructor') {
            showToast(
              'Account created! Please verify your email. Your items will be waiting after account approval.', 
              'success', 
              5000
            );
          }
        } else {
          if (formData.role === 'attendee') {
            showToast(
              'Registration successful! Please check your email to verify your account.', 
              'success', 
              5000
            );
          } else if (formData.role === 'instructor') {
            showToast(
              'Registration successful! Please verify your email. Your instructor account will be reviewed after verification.', 
              'success', 
              5000
            );
          }
        }

        // Redirect to login with verification message after delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Please verify your email and then sign in to continue.',
              email: formData.email,
              // Preserve cart checkout flow
              from: location.state?.from,
              action: location.state?.action
            }
          });
        }, 4000);
      } 
      // ✅ CASE 2: Auto-verified (no email verification required)
      else {
        // User is already verified and logged in via handleSuccessfulAuth
        showToast(
          `Welcome ${newUser.firstName}! Your account is ready.`, 
          'success', 
          3000
        );
        
        // AuthContext's handleSuccessfulAuth has already handled navigation
        // No manual redirect needed since autoRedirected: true
        // User will automatically be taken to:
        // - /cart/checkout (if hasPendingCheckout)
        // - /instructor/dashboard (if instructor role)
        // - /dashboard (default for attendees)
      }
    } else {
      // Registration failed
      showToast(result.error || 'Registration failed. Please try again.', 'error');
    }

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error cases
    if (error.response?.data?.email) {
      showToast(`Email error: ${error.response.data.email[0]}`, 'error');
    } else if (error.response?.data?.error) {
      showToast(error.response.data.error, 'error');
    } else {
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="absolute -top-4 -right-4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-rose-600/10 rounded-full blur-2xl animate-bounce"></div>
       
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-14 md:pt-16 lg:pt-24">
        <div className="w-full max-w-3xl items-center">
         
          {/* Registration Card */}
          <div className="bg-card border border-border rounded-2xl shadow-card p-8">
            {!registrationSuccess ? (
              <div className="space-y-8">
                <RegistrationHeader />

                {/* Cart Checkout Notice */}
                {hasPendingCheckout() && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Complete Your Purchase</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Create your account to securely checkout your selected webinars.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-border" />
                <RegistrationForm 
                  onSubmit={handleRegistration}
                  loading={isLoading}
                />
                
                {/* Sign In Link with Cart Flow Preservation */}
                <div className="text-center border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button 
                      onClick={() => navigate('/login', { 
                        state: { 
                          from: location.state?.from,
                          message: hasPendingCheckout() ? 'Sign in to complete your checkout' : location.state?.message,
                          action: location.state?.action 
                        } 
                      })}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // ✅ Show success message only for verification-required flow
              <SuccessMessage 
                userRole={registeredUser?.role}
                userEmail={registeredUser?.email}
                userName={registeredUser?.name}
                showVerificationMessage={requiresVerification}
                hasPendingCheckout={hasPendingCheckout()}
                autoRedirectSeconds={4}
              />
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PeopleSkillTraining. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <button 
                onClick={() => window.open('/terms-conditions', '_blank')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => window.open('/privacy-policy', '_blank')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => window.open('/contact', '_blank')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        
        </div>
      </main>
    </div>
  );
};


export default Register;
