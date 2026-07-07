import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import {  useAuth } from 'contexts/AuthContext';
import axios from 'axios';
import axiosInstance from 'config/axiosInstance';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.get(`/payments/`);

      const payments = response.data.results || response.data;

      const transformedOrders = payments.map((payment) => {
        return {
          id: payment.transaction_id,
          paymentId: payment.id,
           invoiceNumber: payment.invoice_number, // ✅ Add this
    invoiceDisplayNumber: payment.invoice_display_number, // ✅ Add this
   
          date: payment.created_at,
          completedAt: payment.completed_at,
          status: payment.status,
          total: parseFloat(payment.amount),
          currency: payment.currency,
          items: payment.payment_webinars.map((pw, index) => ({
            id: pw.webinar_id,
            uniqueId: `${pw.webinar_id}_${pw.access_type}_${index}`,
            title: pw.webinar_title,
            type: pw.access_type,
            instructor: 'Instructor',
            price: parseFloat(pw.amount),
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
            createdAt: pw.created_at
          })),
          paymentMethod: getPaymentMethodLabel(payment.payment_method),
          gatewayPaymentId: payment.gateway_payment_id,
          userEmail: payment.user_email,
        };
      });

      setOrders(transformedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'razorpay': 'Razorpay',
      'paypal': 'PayPal',
      'stripe': 'Stripe',
      'cashfree': 'Cashfree',
      'payu': 'PayU'
    };
    return labels[method] || method;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: 'CheckCircle',
      pending: 'Clock',
      failed: 'XCircle',
      refunded: 'RefreshCw',
      cancelled: 'XCircle'
    };
    return icons[status] || 'AlertCircle';
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'failed', label: 'Failed', count: orders.filter(o => o.status === 'failed').length },
    { value: 'refunded', label: 'Refunded', count: orders.filter(o => o.status === 'refunded').length }
  ];

  const formatPrice = (amount, currency = 'USD') => {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'CAD': 'C$',
      'AUD': 'A$'
    };
    return `${symbols[currency] || '$'}${parseFloat(amount).toFixed(2)}`;
  };

  const handleDownloadReceipt = async (orderId, paymentId) => {
    if (!paymentId) {
      alert('Payment information not available');
      return;
    }

    try {
      setDownloadingInvoice(paymentId);
      
      const response = await axiosInstance.get(
        `/payments/${paymentId}/invoice/`,
        { 
       
          responseType: 'blob'
        }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again or contact support.');
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const getAccessTypeLabel = (accessType) => {
    const labels = {
      'liveOne': 'Live - Single Attendee',
      'liveGroup': 'Live - Multi Attendees',
      'recordedOne': 'Recorded - Single Attendee',
      'recordedGroup': 'Recorded - Multi Attendees',
      'comboOne': 'Combo - Single Attendee',
      'comboGroup': 'Combo - Multi Attendees',
      'live': 'Live Session',
      'recorded': 'Recorded',
      'combo': 'Live + Recorded'
    };
    return labels[accessType] || 'Standard Access';
  };
const handleCompletePendingPayment = (order) => {
  console.log('♻️ Resuming pending payment:', order.id);
  console.log('📦 Order details:', order);
  
  // ✅ IMPORTANT: Format items to match backend expectation
  const items = order.items.map(item => ({
    // For display in checkout
    id: item.id,
    cartId: `${item.id}_${item.type}_resume`,
    webinarId: item.id, // Webinar ID
    title: item.title,
    instructor: item.instructor,
    image: item.image,
    price: parseFloat(item.price),
    webinarType: item.type.includes('live') ? 'live' : item.type.includes('recorded') ? 'recorded' : 'combo',
    accessType: getAccessTypeLabel(item.type),
    itemType: item.type, // This is the access_type (e.g., 'recorded_single')
    type: item.type,
    description: getAccessTypeLabel(item.type),
    userAuthenticated: true,
    userId: user?.id
  }));
  
  navigate('/checkout', {
    state: {
      // ✅ Critical flags
      resumePayment: true,
      existingPaymentId: order.paymentId,
      existingTransactionId: order.id,
      
      // ✅ Order details for display
      orderDetails: {
        transactionId: order.id,
        paymentId: order.paymentId,
        amount: order.total,
        currency: order.currency,
        items: items, // Use formatted items
        paymentMethod: order.paymentMethod
      },
      
      // ✅ Also set items for CheckoutPage (backward compatibility)
      items: items,
      summary: {
        subtotal: order.total,
        total: order.total,
        itemCount: items.length,
        currency: order.currency
      }
    }
  });
};

  // const handleCompletePendingPayment = (order) => {
  //   const cartItems = order.items.map(item => ({
  //     cartId: `${item.id}_${item.type}_${Date.now()}`,
  //     id: item.id,
  //     webinarId: item.id,
  //     title: item.title,
  //     instructor: item.instructor,
  //     image: item.image,
  //     price: item.price,
  //     webinarType: item.type.includes('live') ? 'live' : 'recorded',
  //     accessType: item.type,
  //     description: getAccessTypeLabel(item.type),
  //     itemType: item.type,
  //     userAuthenticated: true,
  //     userId: user?.id
  //   }));
 
  //   const summary = {
  //     subtotal: order.total,
  //     discount: 0,
  //     tax: 0,
  //     total: order.total,
  //     itemCount: order.items.length,
  //   };

  //  console.log('♻️ Resuming pending payment:', order.id);
  
  // navigate('/checkout', {
  //   state: {
  //     // ✅ Pass existing payment information
  //     existingPaymentId: order.paymentId,
  //     existingTransactionId: order.id,
  //     resumePayment: true, // ✅ Flag to indicate resuming
      
  //     // Include order details for display
  //     orderDetails: {
  //       transactionId: order.id,
  //       paymentId: order.paymentId,
  //       amount: order.total,
  //       currency: order.currency,
  //       items: order.items,
  //       paymentMethod: order.paymentMethod
  //     }
  //   }
  // });
  // };

  const handleRequestRefund = (order) => {
    navigate('/refund-request', {
      state: {
        orderId: order.id,
        paymentId: order.paymentId,
        amount: order.total,
        currency: order.currency,
        items: order.items,
        transactionId: order.id,
        paymentMethod: order.paymentMethod
      }
    });
  };

  // ✅ Navigate based on order status
  // const handleViewDetails = (order) => {
  //   // Navigate to different pages based on status
  //   if (order.status === 'completed') {
  //     navigate('/checkout/payment-success', {
  //       state: {
  //         orderId: order.paymentId,
  //         transactionId: order.id,
  //         paymentId: order.paymentId,
  //         amount: order.total,
  //         currency: order.currency,
  //         items: order.items,
  //         paymentMethod: order.paymentMethod,
  //         completedAt: order.completedAt
  //       }
  //     });
  //   } else if (order.status === 'failed') {
  //     navigate('/checkout/payment-failed', {
  //       state: {
  //         orderId: order.paymentId,
  //         transactionId: order.id,
  //         paymentId: order.paymentId,
  //         amount: order.total,
  //         currency: order.currency,
  //         items: order.items,
  //         reason: 'Payment processing failed'
  //       }
  //     });
  //   } else if (order.status === 'pending') {
  //     navigate('/checkout/payment-failed', {
  //       state: {
  //         orderId: order.paymentId,
  //         transactionId: order.id,
  //         paymentId: order.paymentId,
  //         amount: order.total,
  //         currency: order.currency,
  //         items: order.items,
  //         reason: 'Payment is pending completion'
  //       }
  //     });
  //   } else if (order.status === 'refunded') {
  //     navigate('/refund-request', {
  //       state: {
  //         orderId: order.id,
  //         paymentId: order.paymentId,
  //         amount: order.total,
  //         currency: order.currency,
  //         items: order.items,
  //         transactionId: order.id,
  //         status: 'refunded'
  //       }
  //     });
  //   } else {
  //     // Default: navigate to order details
  //     navigate(`/order-details/${order.paymentId}`, {
  //       state: {
  //         paymentId: order.paymentId,
  //         transactionId: order.id
  //       }
  //     });
  //   }
  // };
const handleViewDetails = (order) => {
  const invoiceNumber = order.invoiceNumber || `PENDING-${order.paymentId}`;
  
  if (order.status === 'completed') {
    navigate(`/checkout/payment-success/${invoiceNumber}`, {
      state: {
        orderId: order.paymentId,
        transactionId: order.id,
        invoiceNumber: invoiceNumber,
        paymentId: order.paymentId,
        amount: order.total,
        currency: order.currency,
        items: order.items,
        paymentMethod: order.paymentMethod,
        completedAt: order.completedAt
      }
    });
  } else if (order.status === 'failed' || order.status === 'pending') {
    navigate(`/checkout/payment-failed/${invoiceNumber}`, {
      state: {
        orderId: order.paymentId,
        transactionId: order.id,
        invoiceNumber: invoiceNumber,
        paymentId: order.paymentId,
        amount: order.total,
        currency: order.currency,
        items: order.items,
        reason: order.status === 'failed' ? 'Payment processing failed' : 'Payment is pending completion'
      }
    });
  } else if (order.status === 'refunded') {
    navigate('/refund-request', {
      state: {
        orderId: order.id,
        paymentId: order.paymentId,
        invoiceNumber: invoiceNumber,
        amount: order.total,
        currency: order.currency,
        items: order.items,
        transactionId: order.id,
        status: 'refunded'
      }
    });
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage your webinar purchases
              </p>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back, {user.first_name || user.name}
                </p>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate('/webinars/live')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Browse Webinars
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/cart')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                View Cart
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or webinar name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      filter === option.value
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Package" size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'You haven\'t made any purchases yet. Start exploring our webinars!'
                    }
                  </p>
                  <Button
                    onClick={() => navigate('/browse-webinars')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Icon name="Search" size={16} className="mr-2" />
                    Browse Webinars
                  </Button>
                </div>
              </motion.div>
            ) : (
              filteredOrders.map((order, index) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  index={index}
                  onViewDetails={() => handleViewDetails(order)}
                  onDownloadReceipt={() => handleDownloadReceipt(order.id, order.paymentId)}
                  onRequestRefund={() => handleRequestRefund(order)}
                  onCompletePayment={() => handleCompletePendingPayment(order)}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  downloadingInvoice={downloadingInvoice}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ 
  order, 
  index, 
  onViewDetails, 
  onDownloadReceipt, 
  onRequestRefund,
  onCompletePayment,
  formatPrice,
  getStatusColor,
  getStatusIcon,
  downloadingInvoice
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccessTypeLabel = (accessType) => {
    const labels = {
      'live_single': 'Live Session',
      'live_group': 'Live Group',
      'recorded_single': 'Recorded',
      'recorded_group': 'Recorded Group',
      'combo_single': 'Live + Recorded',
      'combo_group': 'Combo Group',
      'live': 'Live Session',
      'recorded': 'Recorded',
      'combo': 'Live + Recorded'
    };
    return labels[accessType] || 'Standard Access';
  };

  const isDownloading = downloadingInvoice === order.paymentId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.date)}
            </p>
            {order.completedAt && (
              <p className="text-xs text-gray-500">
                Completed: {formatDate(order.completedAt)}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              <Icon name={getStatusIcon(order.status)} size={14} className="mr-2" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(order.total, order.currency)}
              </p>
              <p className="text-xs text-gray-500">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.uniqueId} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {getAccessTypeLabel(item.type)}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(item.price, order.currency)}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-700"
          >
            <Icon name="Eye" size={16} className="mr-2" />
            View Details
          </Button>
          
          {order.status === 'completed' && (
            <>
              <Button
                onClick={onDownloadReceipt}
                variant="outline"
                className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-700"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Icon name="Download" size={16} className="mr-2" />
                    Download Invoice
                  </>
                )}
              </Button>
              {/* <Button
                onClick={onRequestRefund}
                variant="outline"
                className="flex-1 border-yellow-200 text-yellow-600 hover:bg-yellow-700"
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Request Refund
              </Button> */}
            </>
          )}
          
          {order.status === 'pending' && (
            <Button
              onClick={onCompletePayment} 
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Icon name="Clock" size={16} className="mr-2" />
              Complete Payment
            </Button>
          )}

          {order.status === 'failed' && (
            <Button
              onClick={onCompletePayment}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Retry Payment
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyOrders;
