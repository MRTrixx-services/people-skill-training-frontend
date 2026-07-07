import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';

const PurchasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Get purchase details from navigation state or default values
  const purchaseData = location.state || {
    webinar: {
      id: 1,
      title: "Excel Meets AI - Using ChatGPT with Excel",
      instructor: {
        name: "Mike Thomas",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        expertise: "IT Trainer & Microsoft Office Expert"
      },
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80",
      duration: "90 Minutes",
      originalDate: "Friday, September 26, 2025"
    },
    selectedOption: "Individual Access",
    price: 199,
    total: 199
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    country: 'India'
  });

  const [formErrors, setFormErrors] = useState({});

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    try {
      // This would typically call your backend API to create order
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: purchaseData.total * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: `webinar_${purchaseData.webinar.id}_${Date.now()}`,
          webinarId: purchaseData.webinar.id,
          customerInfo: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      // For demo purposes, return mock order
      return {
        id: `order_${Date.now()}`,
        amount: purchaseData.total * 100,
        currency: 'INR'
      };
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (order) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your Razorpay key
      amount: order.amount,
      currency: order.currency,
      name: 'PeopleSkillTrainingCorp',
      description: `${purchaseData.webinar.title} - ${purchaseData.selectedOption}`,
      image: 'https://your-logo-url.com/logo (4).png', // Add your company logo
      order_id: order.id,
      handler: async function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        
        try {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerInfo: formData,
              webinarInfo: purchaseData
            }),
          });

          if (verifyResponse.ok) {
            // Navigate to success page
            navigate('/purchase-success', {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                webinar: purchaseData.webinar,
                customerInfo: formData,
                amount: purchaseData.total
              }
            });
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment completed but verification failed. Please contact support.');
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        webinar_id: purchaseData.webinar.id,
        webinar_title: purchaseData.webinar.title,
        access_type: purchaseData.selectedOption
      },
      theme: {
        color: '#7C3AED' // Purple theme to match your design
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
          console.log('Payment modal closed');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      setLoading(false);
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
    });

    rzp.open();
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const order = await createRazorpayOrder();
      setOrderDetails(order);

      // Open Razorpay checkout
      await handleRazorpayPayment(order);
    } catch (error) {
      console.error('Purchase error:', error);
      setLoading(false);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-14 md:pt-16 lg:pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h1>
                <p className="text-gray-600 mt-1">Secure checkout powered by Razorpay</p>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-green-600" />
                <span className="text-sm text-green-600 font-medium">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter first name"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter last name"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="flex items-center space-x-3 p-3 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="w-4 h-4 rounded-full bg-purple-600 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Razorpay</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Powered by</span>
                        <span className="font-bold text-blue-600">Razorpay</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Credit/Debit Cards, Net Banking, UPI, Wallets & more
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Icon name="Shield" size={16} className="text-green-600 mr-2" />
                    <span className="text-sm text-green-700 font-medium">256-bit SSL Encrypted</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Your payment information is secure and protected
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6">
                  {/* Webinar Details */}
                  <div className="flex items-start space-x-4 mb-6">
                    <Image
                      src={purchaseData.webinar.thumbnail}
                      alt={purchaseData.webinar.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">
                        {purchaseData.webinar.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        by {purchaseData.webinar.instructor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Duration: {purchaseData.webinar.duration}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{purchaseData.selectedOption}</span>
                      <span className="text-sm font-medium">₹{purchaseData.price}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">GST (18%)</span>
                      <span className="text-sm font-medium">₹{Math.round(purchaseData.price * 0.18)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-gray-900">
                          ₹{purchaseData.total + Math.round(purchaseData.price * 0.18)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <Button
                    onClick={handlePurchase}
                    disabled={loading}
                    className={`w-full mt-6 py-3 px-4 rounded-md font-semibold transition-colors duration-200 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <Icon name="CreditCard" size={20} className="inline mr-2" />
                        Pay ₹{purchaseData.total + Math.round(purchaseData.price * 0.18)}
                      </>
                    )}
                  </Button>

                  {/* Security Note */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      By completing your purchase you agree to our{' '}
                      <button className="text-purple-600 hover:underline">Terms of Service</button>
                    </p>
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-gray-50 p-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">What's included:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-green-600 mr-2" />
                      Full recorded webinar access
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-green-600 mr-2" />
                      Downloadable resources
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-green-600 mr-2" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-green-600 mr-2" />
                      6 months access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchasePage;
