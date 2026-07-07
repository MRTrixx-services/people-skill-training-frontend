import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';
import { useAuth } from 'contexts/AuthContext';
import axios from 'axios';
import axiosInstance from 'config/axiosInstance';

const RefundRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getAuthHeaders } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const fileInputRef = useRef(null);

  // Get order data from navigation state
  const orderData = location.state || {};

  // Form state
  const [refundForm, setRefundForm] = useState({
    reason: '',
    otherReason: '',
    comments: '',
    refundAmount: orderData.amount || 0
  });

  useEffect(() => {
    if (orderData.paymentId) {
      fetchTransactionDetails();
    } else {
      // If no order data, redirect back
      navigate('/orders');
    }
  }, [orderData.paymentId]);

  const fetchTransactionDetails = async () => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.get(
        `/payments/${orderData.paymentId}/`,
       
      );

      const payment = response.data;

      // Calculate eligibility
      const purchaseDate = new Date(payment.created_at);
      const today = new Date();
      const daysSincePurchase = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = 30 - daysSincePurchase;

      setTransactionDetails({
        id: payment.transaction_id,
        paymentId: payment.id,
        purchaseDate: payment.created_at,
        items: payment.payment_webinars.map(pw => ({
          id: pw.webinar_id,
          title: pw.webinar_title,
          instructor: 'Instructor',
          thumbnail: pw.cover_image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=180&fit=crop',
          type: pw.access_type,
          price: parseFloat(pw.amount)
        })),
        totalAmount: parseFloat(payment.amount),
        currency: payment.currency,
        paymentMethod: getPaymentMethodLabel(payment.payment_method),
        gatewayPaymentId: payment.gateway_payment_id,
        status: payment.status,
        eligibility: {
          eligible: payment.status === 'completed' && daysRemaining > 0,
          reason: daysRemaining > 0 
            ? 'Within 30-day refund window' 
            : 'Refund period has expired',
          daysRemaining: Math.max(0, daysRemaining)
        }
      });

      setRefundForm(prev => ({
        ...prev,
        refundAmount: parseFloat(payment.amount)
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      setLoading(false);
      navigate('/orders');
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

  const refundReasons = [
   { value: 'event_cancelled', label: 'Event cancelled by organizer' },
  { value: 'prior_notice_absence', label: 'Unable to attend (notified 48 hours in advance)' },
  { value: 'duplicate_payment', label: 'Duplicate payment made by mistake' },
  { value: 'wrong_registration', label: 'Registered for the wrong event' },
   { value: 'other', label: 'Other (please specify)' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleInputChange = (field, value) => {
    setRefundForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmitRefund = async () => {
    if (!refundForm.reason) {
      alert('Please select a reason for the refund');
      return;
    }

    if (refundForm.reason === 'other' && !refundForm.otherReason.trim()) {
      alert('Please specify the reason for refund');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('payment', transactionDetails.paymentId);
      formData.append('reason', refundForm.reason === 'other' ? refundForm.otherReason : refundForm.reason);
      formData.append('refund_amount', refundForm.refundAmount);
      
      if (refundForm.comments) {
        formData.append('additional_notes', refundForm.comments);
      }

      // Append files if any
      uploadedFiles.forEach((fileObj, index) => {
        formData.append(`supporting_documents`, fileObj.file);
      });

      const response = await axiosInstance.post(
        `/payments/refund-requests/`,
        formData,
        {
          headers: {
            // ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Refund request submitted:', response.data);

      setIsSubmitting(false);
      
      // Navigate to success page
      navigate('/checkout/payment-success', {
        state: {
          orderId: transactionDetails.paymentId,
          transactionId: transactionDetails.id,
          refundRequested: true,
          refundAmount: refundForm.refundAmount,
          message: 'Refund request submitted successfully'
        }
      });
    } catch (error) {
      console.error('Error submitting refund request:', error);
      setIsSubmitting(false);
      
      const errorMessage = error.response?.data?.detail 
        || error.response?.data?.message 
        || 'Failed to submit refund request. Please try again.';
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Loading transaction details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transactionDetails || !transactionDetails.eligibility.eligible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <main className="pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <Icon name="XCircle" size={32} className="text-red-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Not Available</h1>
              <p className="text-gray-600 mb-2">
                This transaction is not eligible for a refund.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {transactionDetails?.eligibility.reason || 'Refund period has expired or order is not completed.'}
              </p>
              
              <Button
                variant="default"
                onClick={() => navigate('/orders')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Orders
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <main className="pb-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Refund</h1>
            <p className="text-gray-600">Submit a refund request for your purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Refund Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Refund Request Form */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Refund Request Form</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Refund <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={refundForm.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a reason...</option>
                      {refundReasons.map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {refundForm.reason === 'other' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Please specify <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={refundForm.otherReason}
                        onChange={(e) => handleInputChange('otherReason', e.target.value)}
                        placeholder="Please provide details about your refund reason"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Amount
                    </label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Full Refund</span>
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(transactionDetails.totalAmount, transactionDetails.currency)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Amount will be refunded to your original payment method
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      value={refundForm.comments}
                      onChange={(e) => handleInputChange('comments', e.target.value)}
                      placeholder="Please provide any additional details that might help us process your refund request..."
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {refundForm.comments.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Documents */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Supporting Documents</h2>
                
                <div className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon name="Upload" size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Upload supporting documents
                    </p>
                    <p className="text-xs text-gray-500">
                      Screenshots, receipts, or other relevant files (Max 10MB each)
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon name="File" size={16} className="text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRefund}
                  disabled={!refundForm.reason || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={16} className="mr-2" />
                      Submit Refund Request
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Transaction Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                
                <div className="space-y-4 mb-4">
                  {transactionDetails.items.map((item, index) => (
                    <div key={index} className="flex space-x-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">{item.instructor}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-gray-900 text-xs">{transactionDetails.id.slice(0, 12)}...</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="text-gray-900">{formatDate(transactionDetails.purchaseDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900">{transactionDetails.paymentMethod}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(transactionDetails.totalAmount, transactionDetails.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Refund Eligibility */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Eligibility</h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="CheckCircle" size={16} className="text-green-600" />
                  <span className="text-green-600 font-medium">Eligible for refund</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {transactionDetails.eligibility.reason}
                </p>

                {transactionDetails.eligibility.daysRemaining > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-600">
                        {transactionDetails.eligibility.daysRemaining} days remaining
                      </span>
                    </div>
                    <p className="text-xs text-yellow-600/80 mt-1">
                      To submit a refund request under our 30-day policy
                    </p>
                  </div>
                )}
              </div>

              {/* Refund Policy */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Policy</h3>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <Icon name="Check" size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Full refund within 30 days of purchase</span>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Icon name="Check" size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Refunds processed within 5-7 business days</span>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Icon name="Check" size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Refund to original payment method</span>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Icon name="Info" size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Processing fees may apply for partial refunds</span>
                  </div>
                </div>
              </div>

              {/* Process Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Request Submitted</h4>
                      <p className="text-xs text-gray-600">
                        You'll receive an email confirmation with your request ID
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-600">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Review Process</h4>
                      <p className="text-xs text-gray-600">
                        Our team will review your request within 2-3 business days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-gray-600">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Refund Processed</h4>
                      <p className="text-xs text-gray-600">
                        Approved refunds are processed within 5-7 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RefundRequestPage;
