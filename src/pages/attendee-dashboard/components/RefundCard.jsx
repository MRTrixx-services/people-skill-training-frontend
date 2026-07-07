import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RefundCard = ({ refund, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'cancelled':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'rejected':
        return 'XCircle';
      case 'cancelled':
        return 'Slash';
      default:
        return 'AlertCircle';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-2">{refund.webinarTitle}</h3>
          <div className="space-y-1 text-sm text-slate-600">
            <p>Requested: {formatDate(refund.requestDate)}</p>
            <p>Reason: {refund.reason}</p>
            {refund.processedDate && (
              <p>Processed: {formatDate(refund.processedDate)}</p>
            )}
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(refund.status)}`}>
          <Icon name={getStatusIcon(refund.status)} size={14} />
          <span className="text-xs font-medium uppercase">{refund.status}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <div className="text-2xl font-bold text-slate-800">
            ${Math.abs(refund.amount).toFixed(2)}
          </div>
          <div className="text-xs text-slate-500">
            {refund.refundMethod || 'Account Credit'}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails?.(refund)}
          className="border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          View Details
        </Button>
      </div>
      
      {refund.estimatedCompletion && refund.status === 'pending' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <Icon name="Info" size={16} className="inline mr-2" />
            Expected completion: {formatDate(refund.estimatedCompletion)}
          </p>
        </div>
      )}
    </div>
  );
};

export default RefundCard;
