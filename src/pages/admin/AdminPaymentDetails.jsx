import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from 'contexts/AuthContext';
import axiosInstance from 'config/axiosInstance';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const AdminPaymentDetails = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchPaymentDetails();
  }, [paymentId, isAuthenticated, user]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/payments/admin/payments/${paymentId}/`
      );

      const paymentData = response.data;
      console.log('Admin payment data received:', paymentData);

      setPaymentDetails(paymentData);
      setResendEmail(paymentData.user_email || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      setError('Failed to load payment details. Please try again.');
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloadingInvoice(true);
      
      // ✅ This is the correct admin endpoint
      const response = await axiosInstance.get(
        `/payments/admin/payments/${paymentId}/invoice/`,
        { responseType: 'blob' }
      );
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${paymentDetails.invoice_display_number || paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert('Invoice downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const handleResendInvoice = async () => {
    if (!resendEmail || !resendEmail.trim()) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setSendingInvoice(true);
      
      const response = await axiosInstance.post(
        `/payments/admin/payments/${paymentId}/resend-invoice/`,
        { 
          email: resendEmail.trim()
        }
      );
      
      alert(`Invoice sent successfully to ${resendEmail}`);
      setShowResendModal(false);
      
    } catch (error) {
      console.error('Error resending invoice:', error);
      alert('Failed to resend invoice. Please try again or contact support.');
    } finally {
      setSendingInvoice(false);
    }
  };

  const handleViewWebinar = (webinar) => {
    const baseState = {
      webinar: webinar,
      fromAdmin: true
    };

    // Determine webinar type from access_type
    const isRecorded = webinar.access_type?.toLowerCase().includes('recorded');
    
    if (isRecorded) {
      navigate(`/recorded-webinar/${webinar.webinar_code}`, {
        state: baseState
      });
    } else {
      navigate(`/live-webinar/${webinar.webinar_code}`, {
        state: baseState
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      pending: 'bg-amber-100 text-amber-800 border border-amber-300',
      failed: 'bg-rose-100 text-rose-800 border border-rose-300',
      refunded: 'bg-slate-100 text-slate-800 border border-slate-300'
    };

    const labels = {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      refunded: 'Refunded'
    };

    return (
      <span className={`inline-flex items-center px-4 py-1.5 text-sm font-semibold rounded-full ${styles[status] || styles.pending}`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${status === 'completed' ? 'bg-emerald-600' : status === 'failed' ? 'bg-rose-600' : status === 'refunded' ? 'bg-slate-600' : 'bg-amber-600'}`}></span>
        {labels[status] || status}
      </span>
    );
  };

  const getAccessTypeLabel = (accessType) => {
    const labels = {
      'liveOne': 'Live - Single',
      'liveGroup': 'Live - Group',
      'recordedOne': 'Recorded - Single',
      'recordedGroup': 'Recorded - Group',
      'comboOne': 'Combo - Single',
      'comboGroup': 'Combo - Group',
      'live': 'Live Access',
      'recorded': 'Recorded Access',
      'combo': 'Live + Recorded'
    };
    return labels[accessType] || accessType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6 animate-pulse">
              <Icon name="Clock" size={40} className="text-blue-600" />
            </div>
            <p className="text-lg text-gray-700 font-medium">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl shadow-lg mb-6">
              <Icon name="XCircle" size={40} className="text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Error Loading Payment</h2>
            <p className="text-gray-600 mb-8 text-lg">{error || 'Payment information not found'}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/admin/payments')} variant="default" className="px-6 py-3">
                Back to Payments
              </Button>
              <Button onClick={fetchPaymentDetails} variant="outline" className="px-6 py-3">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/payments')}
                iconName="ArrowLeft"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 mt-1"
              >
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-gray-600 font-mono text-sm bg-gray-100 px-3 py-1 rounded-md">
                    {paymentDetails.transaction_id}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatDate(paymentDetails.created_at)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(paymentDetails.status)}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-xl text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Payment Summary</h2>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Icon name="DollarSign" size={28} className="text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-blue-100 text-sm mb-2">Total Amount</p>
                  <p className="text-4xl font-bold">
                    {formatPrice(paymentDetails.amount, paymentDetails.currency)}
                  </p>
                  <p className="text-blue-200 text-sm mt-2">
                    {paymentDetails.currency}
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Payment Method</p>
                    <p className="text-white font-semibold text-lg">
                      {getPaymentMethodLabel(paymentDetails.payment_method)}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Invoice Number</p>
                    <p className="text-white font-mono font-semibold">
                      {paymentDetails.invoice_display_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                  <Icon name="CreditCard" size={24} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Transaction Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transaction ID</label>
                    <p className="text-base font-mono text-gray-900 mt-1">{paymentDetails.transaction_id}</p>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gateway Payment ID</label>
                    <p className="text-base font-mono text-gray-900 mt-1 break-all">
                      {paymentDetails.gateway_payment_id || 'N/A'}
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gateway Order ID</label>
                    <p className="text-base font-mono text-gray-900 mt-1 break-all">
                      {paymentDetails.gateway_order_id || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="border-l-4 border-amber-500 pl-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created Date</label>
                    <p className="text-base text-gray-900 mt-1">{formatDate(paymentDetails.created_at)}</p>
                  </div>
                  <div className="border-l-4 border-teal-500 pl-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed Date</label>
                    <p className="text-base text-gray-900 mt-1">
                      {paymentDetails.completed_at ? formatDate(paymentDetails.completed_at) : 'N/A'}
                    </p>
                  </div>
                  <div className="border-l-4 border-rose-500 pl-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</label>
                    <p className="text-base text-gray-900 mt-1">{formatDate(paymentDetails.updated_at)}</p>
                  </div>
                </div>
              </div>

              {paymentDetails.failure_reason && (
                <div className="mt-8 p-5 bg-rose-50 border-l-4 border-rose-500 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={24} className="text-rose-600 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-900 block mb-1">Failure Reason</span>
                      <p className="text-rose-700">{paymentDetails.failure_reason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                  <Icon name="User" size={24} className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer Name</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {paymentDetails.user_name || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                    <p className="text-base text-gray-900 mt-1 break-all">
                      {paymentDetails.user_email}
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Platform</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {paymentDetails.platform_info?.name || 'Default Platform'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-lg">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Platform ID</label>
                    <p className="text-base font-mono text-gray-900 mt-1">
                      {paymentDetails.platform_info?.platform_id || 'default'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* Webinar Details */}
<div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-md">
  <div className="flex items-center mb-6">
    <div className="bg-purple-100 rounded-lg p-2 mr-3">
      <Icon name="Video" size={24} className="text-purple-600" />
    </div>
    <h2 className="text-2xl font-bold text-gray-900">Purchased Webinars</h2>
  </div>
  
  <div className="space-y-4">
    {paymentDetails.payment_webinars?.map((webinar, index) => (
      <div 
        key={index} 
        className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
      >
        <div className="flex gap-5">
          <div className="w-24 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <Icon name="Video" size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {webinar.webinar_title}
            </h3>
            <div className="flex flex-wrap gap-3 text-sm mb-3">
              {/* ✅ Display Webinar Code */}
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-mono font-semibold">
                <Icon name="Hash" size={14} className="mr-1" />
                {webinar.webinar_code || webinar.webinar_id}
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                <Icon name="Tag" size={14} className="mr-1" />
                {getAccessTypeLabel(webinar.access_type)}
              </span>
              {webinar.webinar_type && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                  {webinar.webinar_type === 'live' ? '🔴 Live' : '📹 Recorded'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Purchased on {formatDate(webinar.created_at)}
            </p>
            {webinar.scheduled_date && (
              <p className="text-xs text-gray-600 mt-1">
                <Icon name="Calendar" size={12} className="inline mr-1" />
                {new Date(webinar.scheduled_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
          <div className="text-right flex flex-col justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(webinar.amount, paymentDetails.currency)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewWebinar(webinar)}
              iconName="ExternalLink"
              iconPosition="right"
              className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Webinar
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Invoice Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md sticky top-8">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 rounded-lg p-2 mr-3">
                  <Icon name="FileText" size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Invoice Actions</h3>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="default"
                  onClick={handleDownloadInvoice}
                  iconName={downloadingInvoice ? "Loader2" : "Download"}
                  iconPosition="left"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all py-3"
                  disabled={downloadingInvoice}
                >
                  {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowResendModal(true)}
                  iconName={sendingInvoice ? "Loader2" : "Send"}
                  iconPosition="left"
                  className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all py-3 font-semibold"
                  disabled={sendingInvoice}
                >
                  Resend Invoice
                </Button>
              </div>

              {/* Invoice Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Invoice Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {paymentDetails.invoice_display_number}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-gray-900">
                      {formatPrice(paymentDetails.amount, paymentDetails.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Recipient:</span>
                    <span className="text-gray-900 truncate ml-2 max-w-[60%]" title={paymentDetails.user_email}>
                      {paymentDetails.user_email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Resend Invoice Modal */}
      {showResendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Icon name="Send" size={24} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Resend Invoice</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Enter the email address where you want to send the invoice. The invoice will be sent as a PDF attachment.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Original recipient: {paymentDetails.user_email}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResendModal(false);
                    setResendEmail(paymentDetails.user_email);
                  }}
                  className="flex-1 py-3"
                  disabled={sendingInvoice}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleResendInvoice}
                  iconName={sendingInvoice ? "Loader2" : "Send"}
                  iconPosition="left"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3"
                  disabled={sendingInvoice || !resendEmail.trim()}
                >
                  {sendingInvoice ? 'Sending...' : 'Send Invoice'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentDetails;