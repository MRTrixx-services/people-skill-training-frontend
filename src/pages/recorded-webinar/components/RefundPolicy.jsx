import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from 'components/AppIcon';
function RefundPolicy() {
const navigate = useNavigate();
    const MoneyBackGuarantee = ({  }) => {

        return (
 <div className="flex items-center justify-center space-x-1 text-xs text-gray-300 relative">
  <Icon name="Shield" size={13} className="text-green-400 font-bold" />
  <div 
    className="relative cursor-help group"
  >
    <span className="hover:text-green-400 font-bold text-md transition-colors duration-200">
  Refund / Cancellation policy
    </span>
    
    {/* CSS-only tooltip that stays visible */}
    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-80 bg-gray-900 border border-gray-600 rounded-lg p-4 shadow-xl z-50 transition-all duration-200">
      {/* Tooltip Arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={14} className="text-green-400" />
          <h4 className="font-semibold text-white text-sm">Refund Policy</h4>
        </div>
        
        {/* One-liner summary */}
        {/* <p className="text-gray-300 text-xs leading-relaxed">
          <strong className="text-green-400">5 working day refund policy</strong> - Get a full refund if you're not satisfied with your purchase within 5 working days.
        </p> */}
        
        {/* Key points */}
        <div className="space-y-1">
          {/* <div className="flex items-start space-x-2">
            <Icon name="Check" size={10} className="text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-300">Full refund within 5 working days</span>
          </div> */}
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={10} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-300">No refunds after 5 working day period</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="RefreshCw" size={10} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-300">Subscription cancellation available anytime</span>
          </div>
        </div>
        
        {/* More info link */}
        <div className="pt-2 border-t border-gray-700">
          <button 
            onClick={() => navigate('/refund-cancellation-policy')}
            className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
          >
            <Icon name="ExternalLink" size={10} />
            <span>View Full Refund Policy</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

  return (
   <div className="w-full lg:w-[25%] flex flex-col items-center justify-center">
      {/* Money-Back Guarantee Image - Centered */}
      <div className="flex flex-col items-center justify-center">
        <img 
          src="/assets/images/money-back-100.png" 
          alt="100% Money Back Guarantee" 
          className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 object-contain" 
        />
      </div>
      
      {/* Refund Text - Centered Below Image */}
      <div className="mt-4 w-full flex justify-center">
        <MoneyBackGuarantee navigate={navigate} />
      </div>
    </div>
  );
}

export default RefundPolicy;