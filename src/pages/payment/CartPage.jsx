import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import { useCart } from 'contexts/CartContext';
import { useAuth } from 'contexts/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Use cart context instead of local state
  const { items, total, itemCount, removeFromCart, clearCart } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Calculate totals using cart context values
  const cartSummary = useMemo(() => {
    const subtotal = total;
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount_percent / 100) : 0;
    // const tax = (subtotal - discount) * 0.08; // 8% tax
    const finalTotal = subtotal - discount;

    return {
      subtotal,
      discount,
      // tax,
      total: finalTotal,
      itemCount
    };
  }, [total, itemCount, appliedCoupon]);

  // Remove item from cart using context method
  const handleRemoveItem = async (cartId) => {
    try {
      removeFromCart(cartId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Apply coupon code
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      
      // Mock coupon validation - replace with actual API call
      setTimeout(() => {
        const validCoupons = {
          'SAVE20': { code: 'SAVE20', discount_percent: 20, description: '20% off your order' },
          'NEWUSER': { code: 'NEWUSER', discount_percent: 15, description: '15% off for new users' },
          'STUDENT': { code: 'STUDENT', discount_percent: 25, description: '25% student discount' }
        };

        if (validCoupons[couponCode.toUpperCase()]) {
          setAppliedCoupon(validCoupons[couponCode.toUpperCase()]);
          setCouponCode('');
        } else {
          alert('Invalid coupon code');
        }
        setCouponLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponLoading(false);
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Enhanced Proceed to checkout with authentication check
  const proceedToCheckout = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Save current page and checkout intent in sessionStorage
      const returnUrl = location.pathname + location.search;
      const checkoutData = {
        items,
        coupon: appliedCoupon,
        summary: cartSummary,
        returnUrl,
        timestamp: Date.now()
      };
      
      // Store checkout data and return URL in sessionStorage
      sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));
      sessionStorage.setItem('authReturnUrl', '/cart');
      sessionStorage.setItem('authAction', 'checkout');
      sessionStorage.setItem('redirectMessage', 'Please sign in to complete your checkout');
      
      // Navigate to login with return URL
      navigate('/login', { 
        state: { 
          from: location,
          message: 'Please sign in to complete your checkout',
          action: 'checkout'
        } 
      });
      return;
    }

    // User is authenticated, proceed with checkout
    setCheckoutLoading(true);
    
    // Prepare checkout data
    const checkoutData = {
      items,
      coupon: appliedCoupon,
      summary: cartSummary,
      user: user
    };

    // Navigate to checkout page with data
    setTimeout(() => {
      navigate('/checkout', { state: checkoutData });
    }, 1500);
  };

  // Empty cart state - check if no items in cart context
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-16"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-8 sm:p-12 max-w-sm sm:max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Icon name="ShoppingCart" size={window.innerWidth < 640 ? 24 : 32} className="text-indigo-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Looks like you haven't added any webinars to your cart yet. 
                Browse our courses and find something you love!
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/webinars/live')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 text-sm sm:text-base"
                >
                  <Icon name="Radio" size={16} className="mr-2" />
                  Browse Live Webinars
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/webinars/recorded')}
                  className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 py-3 text-sm sm:text-base"
                >
                  <Icon name="Play" size={16} className="mr-2" />
                  Browse Recorded Webinars
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 flex items-center justify-center sm:justify-start">
                <Icon name="ShoppingBag" size={16} className="mr-2 text-indigo-500" />
                {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'webinar' : 'webinars'} ready for checkout
              </p>
            </div>
            <div className="flex flex-col xs:flex-row items-center space-y-2 xs:space-y-0 xs:space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full xs:w-auto flex items-center justify-center border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm sm:text-base px-4 py-2"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Continue Shopping
              </Button>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full xs:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 text-sm sm:text-base px-4 py-2"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-green-800">
                  🎉 Great Choices! Your Learning Journey Awaits
                </h4>
                <p className="text-xs sm:text-sm text-green-700 mt-1">
                  You're about to unlock {cartSummary.itemCount} amazing webinar{cartSummary.itemCount !== 1 ? 's' : ' '} 
                  that will boost your skills and career prospects.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Authentication Notice */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-medium text-blue-800">
                    Sign In Required for Checkout
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
                    You'll need to sign in or create an account to complete your purchase. Don't worry, your cart will be saved!
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    // Save current state and redirect to login
                    const returnUrl = location.pathname + location.search;
                    const checkoutData = {
                      items,
                      coupon: appliedCoupon,
                      summary: cartSummary,
                      returnUrl,
                      timestamp: Date.now()
                    };
                    
                    sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));
                    sessionStorage.setItem('authReturnUrl', '/cart');
                    sessionStorage.setItem('authAction', 'checkout');
                    
                    navigate('/login', { 
                      state: { 
                        from: location,
                        message: 'Sign in to complete your checkout',
                        action: 'checkout'
                      } 
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mobile-First Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Enhanced Cart Items - Mobile Responsive */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                  <Icon name="BookOpen" size={18} className="mr-2 text-indigo-600" />
                  Your Learning Cart ({cartSummary.itemCount})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <CartItem
                      key={item.cartId}
                      item={item}
                      index={index}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Enhanced Order Summary - Mobile Optimized with Medium Device Layout */}
          <div className="lg:col-span-1">
            {/* Mobile Layout (single column) */}
            <div className="block md:hidden lg:block lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              {/* Main Summary Card */}
              <motion.div
                initial={{ opacity: 0, x: 0, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                className="bg-white rounded-xl shadow-xl border border-white/50 p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Icon name="Calculator" size={18} className="mr-2 text-indigo-600" />
                  Order Summary
                </h2>

                {/* Coupon Code Section - Mobile Optimized */}
                {/* <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <label className=" text-xs sm:text-sm font-medium text-blue-800 mb-2 sm:mb-3 flex items-center">
                    <Icon name="Tag" size={14} className="mr-2" />
                    Have a Coupon Code?
                  </label>
                  <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code here"
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={couponLoading || appliedCoupon}
                    />
                    <Button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim() || appliedCoupon}
                      size="sm"
                      className="w-full xs:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 text-sm"
                    >
                      {couponLoading ? (
                        <Icon name="Loader2" size={14} className="animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>

                  {appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 sm:mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Icon name="CheckCircle" size={16} className="text-green-600" />
                            <span className="text-sm font-semibold text-green-800">
                              {appliedCoupon.code} Applied!
                            </span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            {appliedCoupon.description}
                          </p>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-800 transition-colors p-1"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div> */}

                {/* Price Breakdown - Mobile Optimized */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
             

                  {appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center py-2 text-green-600"
                    >
                      <span className="text-sm sm:text-base flex items-center">
                        <Icon name="Tag" size={14} className="mr-2" />
                        <span className="truncate">Discount ({appliedCoupon.discount_percent}%)</span>
                      </span>
                      <span className="font-semibold text-sm sm:text-base">-${cartSummary.discount.toFixed(2)}</span>
                    </motion.div>
                  )}

                 

                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600 flex items-center">
                      <Icon name="ShoppingBag" size={14} className="mr-2" />
                      <span className="truncate">Total ({cartSummary.itemCount} items)</span>
                    </span>
                     <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${cartSummary.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Checkout Button - Mobile Optimized */}
                <Button
                  onClick={proceedToCheckout}
                  disabled={checkoutLoading || items.length === 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {checkoutLoading ? (
                    <div className="flex items-center justify-center">
                      <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="flex items-center justify-center">
                      <Icon name="LogIn" size={20} className="mr-2" />
                      Sign In to Checkout
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Icon name="CreditCard" size={20} className="mr-2" />
                      Secure Checkout
                    </div>
                  )}
                </Button>

                {/* Security & Trust Badges - Mobile Optimized */}
                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500">
                    <Icon name="Shield" size={16} className="mr-2 text-green-500" />
                    256-bit SSL Secure Checkout
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-gray-400">
                    <div className="flex items-center">
                      <Icon name="Lock" size={12} className="mr-1" />
                      Secure
                    </div>
                    <div className="flex items-center">
                      <Icon name="RefreshCw" size={12} className="mr-1" />
                      100% Money Back Guarantee
                    </div>
                    <div className="flex items-center">
                      <Icon name="Headphones" size={12} className="mr-1" />
                      24/7 Support
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Learning Benefits Card - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white"
              >
                <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center">
                  <Icon name="Star" size={18} className="mr-2" />
                  What You Get
                </h3>
                
                <div className="space-y-2 sm:space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Icon name="PlayCircle" size={16} className="text-yellow-300 flex-shrink-0" />
                    <span>Instant access to all content</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Download" size={16} className="text-yellow-300 flex-shrink-0" />
                    <span>Downloadable resources</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Medium Device Layout (md only - side by side) */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-6">
                {/* Order Summary - Left */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-xl border border-white/50 p-4"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Icon name="Calculator" size={18} className="mr-2 text-indigo-600" />
                    Order Summary
                  </h2>

                  {/* Coupon Code Section */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <label className=" text-xs font-medium text-blue-800 mb-2 flex items-center">
                      <Icon name="Tag" size={14} className="mr-2" />
                      Coupon Code
                    </label>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled={couponLoading || appliedCoupon}
                      />
                      <Button
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim() || appliedCoupon}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      >
                        {couponLoading ? (
                          <Icon name="Loader2" size={14} className="animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>

                    {/* Applied Coupon Display */}
                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Icon name="CheckCircle" size={16} className="text-green-600" />
                              <span className="text-sm font-semibold text-green-800">
                                {appliedCoupon.code} Applied!
                              </span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              {appliedCoupon.description}
                            </p>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="text-green-600 hover:text-green-800 transition-colors p-1"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-4">
                  

                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-between items-center py-1 text-green-600"
                      >
                        <span className="text-sm flex items-center">
                          <Icon name="Tag" size={12} className="mr-1" />
                          <span>Discount ({appliedCoupon.discount_percent}%)</span>
                        </span>
                        <span className="font-semibold text-sm">-${cartSummary.discount.toFixed(2)}</span>
                      </motion.div>
                    )}

                

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                       <span className="text-sm sm:text-base text-gray-600 flex items-center">
                      <Icon name="ShoppingBag" size={14} className="mr-2" />
                      <span className="truncate">Total ({cartSummary.itemCount} items)</span>
                    </span>
                       <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ${cartSummary.total.toFixed(2)}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={proceedToCheckout}
                    disabled={checkoutLoading || items.length === 0}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {checkoutLoading ? (
                      <div className="flex items-center justify-center">
                        <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                        Processing...
                      </div>
                    ) : !isAuthenticated ? (
                      <div className="flex items-center justify-center">
                        <Icon name="LogIn" size={16} className="mr-2" />
                        Sign In to Checkout
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Icon name="CreditCard" size={16} className="mr-2" />
                        Secure Checkout
                      </div>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center text-xs text-gray-500">
                      <Icon name="Shield" size={14} className="mr-1 text-green-500" />
                      SSL Secure
                    </div>
                  </div>
                </motion.div>

                {/* What You Get - Right */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white h-fit"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Icon name="Star" size={18} className="mr-2" />
                    What You Get
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Icon name="PlayCircle" size={16} className="text-yellow-300 flex-shrink-0" />
                      <span>Instant access to all content</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Download" size={16} className="text-yellow-300 flex-shrink-0" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Headphones" size={16} className="text-yellow-300 flex-shrink-0" />
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="RefreshCw" size={16} className="text-yellow-300 flex-shrink-0" />
                      <span>100% Money Back Guarantee</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Cart Item Component with Better Large Screen Layout
const CartItem = ({ item, index, onRemove }) => {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(item.cartId);
    } finally {
      setRemoving(false);
    }
  };

  const handleViewDetails = () => {
    // Navigate to webinar details page based on type
    if (item.webinarType === 'recorded') {
      navigate(`/recorded-webinar/${item.id}`);
    } else {
      navigate(`/live-webinar/${item.id}`);
    }
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  
  const getWebinarTypeInfo = (type) => {
    const types = {
      'live': { 
        label: 'Live Session', 
        color: 'bg-red-100 text-red-600 border-red-200',
        icon: 'Radio'
      },
      'recorded': { 
        label: 'On-Demand', 
        color: 'bg-blue-100 text-blue-600 border-blue-200',
        icon: 'Play'
      },
      'combo': { 
        label: 'Live + Recorded', 
        color: 'bg-purple-100 text-purple-600 border-purple-200',
        icon: 'Zap'
      }
    };
    return types[type] || types['recorded'];
  };

  const webinarType = getWebinarTypeInfo(item.webinarType || 'recorded');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300, height: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-3 sm:p-4 lg:p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
    >
      {/* Mobile Layout (Below md) */}
      <div className="block md:hidden">
        <div className="flex space-x-3 sm:space-x-4">
          {/* Mobile Image */}
          <div 
            className="flex-shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-lg sm:rounded-xl overflow-hidden shadow-md relative cursor-pointer group" 
            onClick={handleViewDetails}
          >
            <Image
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Icon name="Eye" size={16} className="text-white" />
            </div>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 min-w-0">
            <h3 
              className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-tight mb-2"
              onClick={handleViewDetails}
            >
              {item.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <Icon name="User" size={12} className="text-indigo-500" />
                <span className="truncate max-w-24 sm:max-w-none">{item.instructor}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} className="text-green-500" />
                <span>{item.duration || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${webinarType.color}`}>
                <Icon name={webinarType.icon} size={10} className="mr-1 inline" />
                {webinarType.label}
              </span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold">
                {item.accessType}
              </span>
            </div>
          </div>

          {/* Mobile Price */}
          <div className="flex flex-col items-end justify-start">
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {formatPrice(item.price)}
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 mt-4 pt-4 border-t border-gray-100">
          <motion.button
            onClick={handleViewDetails}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex-1 xs:flex-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon name="Eye" size={14} />
            <span>View Details</span>
          </motion.button>
          
          <motion.button
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50 px-4 py-2.5 rounded-lg border border-red-200 flex-1 xs:flex-none"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {removing ? (
              <Icon name="Loader2" size={14} className="animate-spin" />
            ) : (
              <Icon name="Trash2" size={14} />
            )}
            <span>{removing ? 'Removing...' : 'Remove'}</span>
          </motion.button>
        </div>
      </div>

      {/* Desktop/Tablet Layout (md and above) */}
      <div className="hidden md:block">
        <div className="flex items-start space-x-4 lg:space-x-6">
          {/* Desktop Image */}
          <div 
            className="flex-shrink-0 w-28 h-20 lg:w-32 lg:h-24 rounded-xl overflow-hidden shadow-md relative cursor-pointer group" 
            onClick={handleViewDetails}
          >
            <Image
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Icon name="Eye" size={20} className="text-white" />
            </div>
          </div>

          {/* Desktop Content */}
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-tight mb-3"
              onClick={handleViewDetails}
            >
              {item.title}
            </h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="User" size={14} className="text-indigo-500" />
                <span>{item.instructor}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} className="text-green-500" />
                <span>{item.duration || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${webinarType.color}`}>
                <Icon name={webinarType.icon} size={12} className="mr-1 inline" />
                {webinarType.label}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold">
                {item.accessType}
              </span>
            </div>
          </div>

          {/* Desktop Right Column - Price + Actions */}
          <div className="flex flex-col items-end space-y-4 min-w-[160px]">
            {/* Price at the top */}
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                {formatPrice(item.price)}
              </div>
            </div>

            {/* Action buttons directly below price - no extra space */}
            <div className="flex flex-col gap-2 w-full">
              <motion.button
                onClick={handleViewDetails}
                className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon name="Eye" size={14} />
                <span>View Details</span>
              </motion.button>
              
              <motion.button
                onClick={handleRemove}
                disabled={removing}
                className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50 px-4 py-2.5 rounded-lg border border-red-200 w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {removing ? (
                  <Icon name="Loader2" size={14} className="animate-spin" />
                ) : (
                  <Icon name="Trash2" size={14} />
                )}
                <span>{removing ? 'Removing...' : 'Remove'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
