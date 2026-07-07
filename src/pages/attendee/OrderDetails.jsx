import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock order details - replace with actual API call
    const mockOrder = {
      id: orderId,
      date: '2025-01-15',
      status: 'completed',
      total: 299.99,
      subtotal: 299.98,
      tax: 24.00,
      discount: 0.00,
      items: [
        {
          id: 1,
          title: 'Advanced React Development Masterclass',
          type: 'live',
          instructor: 'John Smith',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
          duration: '3 hours',
          scheduledDate: '2025-02-01T10:00:00Z'
        },
        {
          id: 2,
          title: 'Python for Data Science - Complete Course',
          type: 'recorded',
          instructor: 'Sarah Johnson',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
          duration: '8 hours',
          accessGranted: true
        }
      ],
      paymentMethod: 'Credit Card ending in 4242',
      billingAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA'
      },
      orderTimeline: [
        { status: 'Order Placed', date: '2025-01-15T10:00:00Z', completed: true },
        { status: 'Payment Confirmed', date: '2025-01-15T10:05:00Z', completed: true },
        { status: 'Processing', date: '2025-01-15T10:10:00Z', completed: true },
        { status: 'Completed', date: '2025-01-15T10:15:00Z', completed: true }
      ]
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Icon name="Package" size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/attendee/orders')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/attendee/orders')}
                className="mb-4 text-gray-600 hover:text-gray-900"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Orders
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              <Icon name="CheckCircle" size={16} className="mr-2" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-24 h-18 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        by {item.instructor} • {item.duration}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'live' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          <Icon name={item.type === 'live' ? 'Radio' : 'Play'} size={12} className="mr-1" />
                          {item.type === 'live' ? 'Live Session' : 'Recorded'}
                        </span>
                        
                        {item.type === 'live' && item.scheduledDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(item.scheduledDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                        
                        {item.type === 'recorded' && item.accessGranted && (
                          <span className="inline-flex items-center text-xs text-green-600">
                            <Icon name="CheckCircle" size={12} className="mr-1" />
                            Access Granted
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      
                      {item.type === 'live' ? (
                        <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                          <Icon name="Video" size={14} className="mr-1" />
                          Join Live
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="mt-2">
                          <Icon name="Play" size={14} className="mr-1" />
                          Watch Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.orderTimeline.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Icon 
                          name={step.completed ? "CheckCircle" : "Circle"} 
                          size={16} 
                          className={step.completed ? 'text-green-600' : 'text-gray-400'} 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(step.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment & Billing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Payment & Billing</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Method</p>
                  <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Billing Address</p>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>{order.billingAddress.name}</p>
                    <p>{order.billingAddress.address}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                onClick={() => console.log('Download receipt')}
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Icon name="Download" size={16} className="mr-2" />
                Download Receipt
              </Button>
              
              <Button
                onClick={() => console.log('Contact support')}
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Contact Support
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
