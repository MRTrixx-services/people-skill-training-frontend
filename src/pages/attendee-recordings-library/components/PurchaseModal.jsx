import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PurchaseModal = ({ isOpen, onClose, recording, onPurchaseComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    billingAddress: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'apple', label: 'Apple Pay' },
    { value: 'google', label: 'Google Pay' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      if (!formData?.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData?.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData?.cvv) newErrors.cvv = 'CVV is required';
      if (!formData?.cardName) newErrors.cardName = 'Cardholder name is required';
    }

    if (!formData?.email) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePurchase = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPurchaseComplete(recording);
      onClose();
    }, 2000);
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price?.toFixed(2)}`;
  };

  const calculateTotal = () => {
    const subtotal = recording?.price || 0;
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + tax;
  };

  if (!isOpen || !recording) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Complete Purchase</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Course Details */}
          <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <Image
                  src={recording?.thumbnail}
                  alt={recording?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2">{recording?.title}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="User" size={16} className="text-text-secondary" />
                  <span className="text-text-secondary text-sm">{recording?.instructor}</span>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="Clock" size={16} className="text-text-secondary" />
                  <span className="text-text-secondary text-sm">
                    {Math.floor(recording?.duration / 60)}h {recording?.duration % 60}m
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Course Price</span>
                  <span className="text-text-primary">{formatPrice(recording?.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tax (8%)</span>
                  <span className="text-text-primary">${(recording?.price * 0.08)?.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-text-primary">Total</span>
                  <span className="text-text-primary">${calculateTotal()?.toFixed(2)}</span>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h4 className="font-medium text-text-primary mb-2">What's included:</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Lifetime access to recording</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span>Mobile and desktop access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Payment Method */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Payment Method</h4>
                <Select
                  options={paymentMethods}
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData?.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
                    error={errors?.cardNumber}
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      type="text"
                      placeholder="MM/YY"
                      value={formData?.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                      error={errors?.expiryDate}
                      required
                    />
                    <Input
                      label="CVV"
                      type="text"
                      placeholder="123"
                      value={formData?.cvv}
                      onChange={(e) => handleInputChange('cvv', e?.target?.value)}
                      error={errors?.cvv}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Cardholder Name"
                    type="text"
                    placeholder="John Doe"
                    value={formData?.cardName}
                    onChange={(e) => handleInputChange('cardName', e?.target?.value)}
                    error={errors?.cardName}
                    required
                  />
                </div>
              )}

              {/* Alternative Payment Methods */}
              {paymentMethod !== 'card' && (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Icon name="CreditCard" size={48} className="text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary">
                    You will be redirected to {paymentMethods?.find(p => p?.value === paymentMethod)?.label} to complete your payment.
                  </p>
                </div>
              )}

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                description="Receipt will be sent to this email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
              />

              {/* Security Notice */}
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Shield" size={16} className="text-success mt-0.5" />
                  <div>
                    <p className="text-sm text-success font-medium">Secure Payment</p>
                    <p className="text-xs text-success/80">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                variant="default"
                size="lg"
                fullWidth
                onClick={handlePurchase}
                loading={isProcessing}
                iconName="Lock"
                iconPosition="left"
                iconSize={16}
              >
                {isProcessing ? 'Processing...' : `Complete Purchase - $${calculateTotal()?.toFixed(2)}`}
              </Button>

              {/* Terms */}
              <p className="text-xs text-text-secondary text-center">
                By completing this purchase, you agree to our{' '}
                <button className="text-primary hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button className="text-primary hover:underline">Privacy Policy</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;