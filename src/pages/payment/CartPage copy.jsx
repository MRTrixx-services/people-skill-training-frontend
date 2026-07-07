import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
// import { API_BASE_URL } from 'contexts/AuthContext';
import axios from 'axios';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Mock cart data - Replace with actual API call
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        
        // Simulate API call - Replace with your actual cart endpoint
        // const response = await axios.get(`${API_BASE_URL}/cart/`);
        
        // Mock data for demonstration
        setTimeout(() => {
          setCartItems([
            {
              id: 1,
              webinar: {
                id: 1,
                webinar_id: 'WEB25001',
                title: 'The Complete React Developer Course with Redux, Hooks, and GraphQL',
                instructor: {
                  name: 'Sarah Chen',
                  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
                },
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                webinar_type: 'recorded',
                duration: '32.5 hours',
                level: 'Intermediate',
                rating: 4.8,
                total_reviews: 8945,
                original_price: 149.99,
                discounted_price: 89.99
              },
              price_type: 'recorded_single',
              price: 89.99,
              added_at: '2025-09-27T10:30:00Z'
            },
            {
              id: 2,
              webinar: {
                id: 2,
                webinar_id: 'WEB25002',
                title: 'Advanced CSS and Sass: Flexbox, Grid, Animations and More!',
                instructor: {
                  name: 'Emma Watson',
                  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
                },
                image: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                webinar_type: 'live',
                duration: '2 hours',
                scheduled_date: '2025-10-05T15:00:00Z',
                level: 'Advanced',
                rating: 4.9,
                total_reviews: 12456,
                original_price: 99.99,
                discounted_price: 69.99
              },
              price_type: 'live_single',
              price: 69.99,
              added_at: '2025-09-27T09:15:00Z'
            },
            {
              id: 3,
              webinar: {
                id: 3,
                webinar_id: 'WEB25003',
                title: 'Machine Learning A-Z™: Hands-On Python & R In Data Science',
                instructor: {
                  name: 'Dr. Emily Watson',
                  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
                },
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                webinar_type: 'combo',
                duration: '44 hours + Live Session',
                scheduled_date: '2025-10-12T14:00:00Z',
                level: 'Beginner',
                rating: 4.8,
                total_reviews: 18976,
                original_price: 199.99,
                discounted_price: 129.99
              },
              price_type: 'combo_single',
              price: 129.99,
              added_at: '2025-09-26T16:45:00Z'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate totals
  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount_percent / 100) : 0;
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal - discount + tax;

    return {
      subtotal,
      discount,
      tax,
      total,
      itemCount: cartItems.length
    };
  }, [cartItems, appliedCoupon]);

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      // API call to remove item
      // await axios.delete(`${API_BASE_URL}/cart/${itemId}/`);
      
      // Update local state
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Apply coupon code
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      
      // API call to validate coupon
      // const response = await axios.post(`${API_BASE_URL}/coupons/validate/`, { code: couponCode });
      
      // Mock coupon validation
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

  // Proceed to checkout
  const proceedToCheckout = () => {
    setCheckoutLoading(true);
    
    // Prepare checkout data
    const checkoutData = {
      items: cartItems,
      coupon: appliedCoupon,
      summary: cartSummary
    };

    // Navigate to checkout page with data
    setTimeout(() => {
      navigate('/checkout', { state: checkoutData });
    }, 1500);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
              <Icon name="ShoppingCart" size={64} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any webinars to your cart yet. 
                Browse our courses and find something you love!
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/live-webinars')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Browse Live Webinars
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/recorded-webinars')}
                  className="w-full"
                >
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Continue Shopping
            </Button>
          </div>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white shadow-sm rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
              </div>

              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      index={index}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white shadow-sm rounded-lg p-6 sticky top-24"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={couponLoading || appliedCoupon}
                  />
                  <Button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim() || appliedCoupon}
                    size="sm"
                  >
                    {couponLoading ? (
                      <Icon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>

                {/* Applied Coupon */}
                {appliedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {appliedCoupon.code} Applied!
                        </p>
                        <p className="text-xs text-green-600">
                          {appliedCoupon.description}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartSummary.itemCount} items)</span>
                  <span>${cartSummary.subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.discount_percent}%)</span>
                    <span>-${cartSummary.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${cartSummary.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${cartSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={proceedToCheckout}
                disabled={checkoutLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              >
                {checkoutLoading ? (
                  <div className="flex items-center justify-center">
                    <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Proceed to Checkout
                  </div>
                )}
              </Button>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                <Icon name="Shield" size={16} className="mr-1" />
                Secure checkout with SSL encryption
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, index, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.id);
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  
  const getWebinarTypeLabel = (type) => {
    const labels = {
      'live': 'Live Session',
      'recorded': 'Recorded Content',
      'combo': 'Live + Recorded'
    };
    return labels[type] || type;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="Star" size={12} className="text-yellow-500 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="Star" size={12} className="text-yellow-500 fill-current opacity-50" />);
    }
    
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start space-x-4">
        {/* Webinar Image */}
        <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden">
          <Image
            src={item.webinar.image}
            alt={item.webinar.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Webinar Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-purple-600 cursor-pointer transition-colors">
                {item.webinar.title}
              </h3>
              
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <Icon name="User" size={12} className="mr-1" />
                <span className="mr-3">{item.webinar.instructor.name}</span>
                
                {item.webinar.webinar_type === 'live' && item.webinar.scheduled_date && (
                  <>
                    <Icon name="Calendar" size={12} className="mr-1" />
                    <span>
                      {new Date(item.webinar.scheduled_date).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>

              {/* Webinar Meta */}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Icon name="Clock" size={12} className="mr-1" />
                  {item.webinar.duration}
                </span>
                <span className="flex items-center">
                  <Icon name="BarChart" size={12} className="mr-1" />
                  {item.webinar.level}
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {getWebinarTypeLabel(item.webinar.webinar_type)}
                </span>
              </div>

              {/* Rating */}
              <div className="mt-2 flex items-center space-x-1">
                <div className="flex items-center">
                  {renderStars(item.webinar.rating)}
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {item.webinar.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({item.webinar.total_reviews.toLocaleString()})
                </span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end">
              <div className="text-right mb-2">
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(item.price)}
                </div>
                {item.webinar.original_price > item.price && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(item.webinar.original_price)}
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemove}
                disabled={removing}
                className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {removing ? (
                  <Icon name="Loader2" size={16} className="animate-spin mr-1" />
                ) : (
                  <Icon name="Trash2" size={16} className="mr-1" />
                )}
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
