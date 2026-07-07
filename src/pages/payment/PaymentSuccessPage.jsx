import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import { useAuth } from 'contexts/AuthContext';
import axiosInstance from 'config/axiosInstance';

const PaymentSuccessPage = () => {
const navigate = useNavigate();
  const location = useLocation();
  const { invoice_number } = useParams();
  const { user } = useAuth();

  const [orderDetails, setOrderDetails] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
console.log('Invoice Number from params:', invoice_number);
console.log('Order Details from state:', orderDetails);
  useEffect(() => {
    if (!orderDetails && invoice_number) {
      fetchPaymentDetailsByInvoiceNumber(invoice_number);
    } else {
      setTimeout(() => setEmailSent(true), 2000);
    }
  }, [invoice_number, orderDetails]);

  const fetchPaymentDetailsByInvoiceNumber = async (invNum) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/payments/${invNum}/`);
      const paymentData = response.data;

      const webinarDetails = paymentData.payment_webinars.map(pw => ({
        id: pw.webinar_id,
        title: pw.webinar_title,
        instructor: 'Instructor',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
        price: pw.amount,
        accessType: pw.access_type,
        createdAt: pw.created_at,
      }));

      setOrderDetails({
        transactionId: paymentData.transaction_id,
        orderId: paymentData.id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.payment_method,
        status: paymentData.status,
        purchaseDate: paymentData.created_at,
        completedAt: paymentData.completed_at,
        webinars: webinarDetails,
        userEmail: paymentData.user_email,
        invoiceNumber: paymentData.invoice_number || `PENDING-${paymentData.id}`
      });

      setLoading(false);
      setTimeout(() => setEmailSent(true), 2000);
    } catch (err) {
      setError('Failed to load payment details. Please check your orders page.');
      setLoading(false);
      console.error('Fetch payment error:', err);
    }
  };

  const handleAddToCalendar = (webinar) => {
    const title = encodeURIComponent(webinar.title);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const handleDownloadReceipt = async () => {
    if (!orderDetails?.orderId) {
      alert('Order information not available');
      return;
    }
    try {
      setDownloadingInvoice(true);
      const response = await axiosInstance.get(
        `/payments/${orderDetails.orderId}/invoice/`,
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${orderDetails.transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again or contact support.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatPrice = (amount, currency = 'USD') => {
    const symbols = {
      USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$'
    };
    return `${symbols[currency] || '$'}${parseFloat(amount).toFixed(2)}`;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      razorpay: 'Razorpay', paypal: 'PayPal', stripe: 'Stripe',
      cashfree: 'Cashfree', payu: 'PayU'
    };
    return labels[method] || method;
  };

  const getAccessTypeLabel = (accessType) => {
    const labels = {
      liveOne: 'Live Access - Single Attendee',
      liveGroup: 'Live Access - Group',
      recordedOne: 'Recorded Access - Single Attendee',
      recordedGroup: 'Recorded Access - Group',
      comboOne: 'Combo - Single Attendee (Live + Recorded)',
      comboGroup: 'Combo - Group (Live + Recorded)',
      live: 'Live Access',
      recorded: 'Recorded Access',
      combo: 'Live + Recorded'
    };
    return labels[accessType] || 'Standard Access';
  };
const groupWebinarsByTitle = (webinars = []) => {
  if (!Array.isArray(webinars) || webinars.length === 0) {
    return [];
  }
  
  const grouped = {};
  webinars.forEach(webinar => {
    if (!grouped[webinar.id]) {
      grouped[webinar.id] = {
        ...webinar,
        accessTypes: [webinar.accessType],
        totalPrice: parseFloat(webinar.price)
      };
    } else {
      grouped[webinar.id].accessTypes.push(webinar.accessType);
      grouped[webinar.id].totalPrice += parseFloat(webinar.price);
    }
  });
  return Object.values(grouped);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 animate-pulse">
            <Icon name="Clock" size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
            <Icon name="XCircle" size={32} className="text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Payment</h2>
          <p className="text-muted-foreground mb-6">{error || 'Payment information not found'}</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/attendee/orders')} variant="default">View My Orders</Button>
            <Button onClick={() => navigate('/browse-webinars')} variant="outline">Browse Webinars</Button>
          </div>
        </div>
      </div>
    );
  }

 const groupedWebinars = groupWebinarsByTitle(orderDetails.webinars || orderDetails.items || []);

  return (
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <main className="pt-14 md:pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center animate-pulse">
              <Icon name="Check" size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Payment Successful!</h1>
<p className="text-xl text-muted-foreground mb-2">
  Thank you for your purchase, {user?.full_name || user?.first_name || 'there'}!
</p>
<p className="text-sm text-muted-foreground">
  Invoice Number: <span className="font-mono font-medium">{orderDetails.invoiceNumber || invoice_number}</span>
</p>
<p className="text-sm text-muted-foreground">
  Transaction ID: <span className="font-mono font-medium">{orderDetails.transactionId}</span>
</p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Order Details</h2>
              
              {/* List all enrolled webinars */}
              <div className="space-y-4">
                {groupedWebinars.map((webinar, index) => (
                  <div key={`${webinar.id}-${index}`} className="flex space-x-4 pb-4 border-b border-border last:border-0">
                    <Image
                      src={webinar.thumbnail}
                      alt={webinar.title}
                      className="w-24 h-18 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {webinar.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-1">
                        Instructor: {webinar.instructor}
                      </p>
                      {webinar.accessTypes.map((accessType, idx) => (
                        <p key={idx} className="text-muted-foreground text-sm mb-1">
                          • {getAccessTypeLabel(accessType)}
                        </p>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-foreground">
                        {formatPrice(webinar.totalPrice, orderDetails.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-foreground">#{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purchase Date:</span>
                  <span className="text-foreground">{formatDate(orderDetails.completedAt || orderDetails.purchaseDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="text-foreground">{getPaymentMethodLabel(orderDetails.paymentMethod)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                  <span className="text-foreground">Total Amount:</span>
                  <span className="text-primary">{formatPrice(orderDetails.amount, orderDetails.currency)}</span>
                </div>
              </div>
            </div>

            {/* Access Instructions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Your Access</h2>
              
              <div className="space-y-4">
              {(orderDetails.webinars || orderDetails.items || []).some(w => w.accessType?.includes('live') || w.accessType?.includes('combo')) && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Icon name="Calendar" size={20} className="text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-primary mb-1">Live Webinar Access</h3>
                        <p className="text-foreground text-sm">
                          You'll receive joining instructions 24 hours before each scheduled webinar
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(orderDetails.webinars || orderDetails.items || []).some(w => w.accessType?.includes('recorded') || w.accessType?.includes('combo')) && (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Icon name="Play" size={20} className="text-success mt-0.5" />
                      <div>
                        <h3 className="font-medium text-success mb-1">Recording Access</h3>
                        <p className="text-foreground text-sm">
                          Access recordings from your dashboard after each session (6 months access)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border border-border rounded-lg">
                    <Icon name="Mail" size={20} className="text-primary mb-2" />
                    <h4 className="font-medium text-foreground mb-1">Email Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      Check your email for purchase confirmation and access details
                    </p>
                  </div>

                  <div className="p-4 border border-border cursor-pointer rounded-lg" onClick={() => navigate('/attendee')}>
                    <Icon name="BookOpen" size={20} className="text-primary mb-2" />
                    <h4 className="font-medium text-foreground mb-1">My Enrollments</h4>
                    <p className="text-sm text-muted-foreground">
                      View all your enrolled webinars in your dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Sidebar */}
          <div className="space-y-6">
            {/* Email Confirmation */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Email Confirmation</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                {emailSent ? (
                  <>
                    <Icon name="CheckCircle" size={20} className="text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Confirmation sent!</p>
                      <p className="text-xs text-muted-foreground">Check {orderDetails.userEmail || user?.email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Icon name="Clock" size={20} className="text-warning animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Sending confirmation...</p>
                      <p className="text-xs text-muted-foreground">To {orderDetails.userEmail || user?.email}</p>
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={handleDownloadReceipt}
                iconName={downloadingInvoice ? "Loader2" : "Download"}
                iconPosition="left"
                className="w-full"
                disabled={downloadingInvoice}
              >
                {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handleAddToCalendar(groupedWebinars[0])}
                  iconName="Calendar"
                  iconPosition="left"
                  className="w-full"
                >
                  Add to Calendar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/attendee/orders')}
                  iconName="Package"
                  iconPosition="left"
                  className="w-full"
                >
                  View My Orders
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/webinars/live')}
                  iconName="Search"
                  iconPosition="left"
                  className="w-full"
                >
                  Browse More Webinars
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">support@PeopleSkillTraining.com</span>
                </div>
                
                {/* <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Mon-Fri, 9AM-6PM EST</span>
                </div> */}
              </div>

              <Button
                variant="outline"
                onClick={() => navigate('/contact')}
                iconName="HelpCircle"
                iconPosition="left"
                className="w-full mt-4"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Continue Learning CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Continue Your Learning Journey!</h2>
            <p className="text-blue-100 mb-6">
              Discover more webinars and expand your knowledge with our expert instructors
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/webinars/live')}
              iconName="ArrowRight"
              iconPosition="right"
              className="bg-white text-primary hover:bg-blue-50"
            >
              Explore More Webinars
            </Button>
          </div>
        </div>
      </div>  </main>
    </div>
  );
};

export default PaymentSuccessPage;
