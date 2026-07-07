import React from 'react';
import Icon from '../../../components/AppIcon';

const OverviewCard = ({ title, value, subtitle, icon, trend, trendValue, color = "primary" }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
          iconBg: 'bg-gradient-to-r from-indigo-500 to-blue-600',
          icon: 'text-white',
          border: 'border-indigo-200',
          text: 'text-indigo-700',
          valueBg: 'bg-indigo-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-green-100',
          iconBg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          icon: 'text-white',
          border: 'border-green-200',
          text: 'text-green-700',
          valueBg: 'bg-green-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
          iconBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
          icon: 'text-white',
          border: 'border-amber-200',
          text: 'text-amber-700',
          valueBg: 'bg-amber-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-red-100',
          iconBg: 'bg-gradient-to-r from-red-500 to-rose-600',
          icon: 'text-white',
          border: 'border-red-200',
          text: 'text-red-700',
          valueBg: 'bg-red-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
          iconBg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
          icon: 'text-white',
          border: 'border-cyan-200',
          text: 'text-cyan-700',
          valueBg: 'bg-cyan-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
          iconBg: 'bg-gradient-to-r from-purple-500 to-violet-600',
          icon: 'text-white',
          border: 'border-purple-200',
          text: 'text-purple-700',
          valueBg: 'bg-purple-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
          iconBg: 'bg-gradient-to-r from-pink-500 to-rose-600',
          icon: 'text-white',
          border: 'border-pink-200',
          text: 'text-pink-700',
          valueBg: 'bg-pink-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'teal':
        return {
          bg: 'bg-gradient-to-br from-teal-50 to-teal-100',
          iconBg: 'bg-gradient-to-r from-teal-500 to-emerald-600',
          icon: 'text-white',
          border: 'border-teal-200',
          text: 'text-teal-700',
          valueBg: 'bg-teal-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'orange':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
          iconBg: 'bg-gradient-to-r from-orange-500 to-red-600',
          icon: 'text-white',
          border: 'border-orange-200',
          text: 'text-orange-700',
          valueBg: 'bg-orange-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      case 'neutral':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          iconBg: 'bg-gradient-to-r from-gray-500 to-slate-600',
          icon: 'text-white',
          border: 'border-gray-200',
          text: 'text-gray-700',
          valueBg: 'bg-gray-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
          iconBg: 'bg-gradient-to-r from-indigo-500 to-blue-600',
          icon: 'text-white',
          border: 'border-indigo-200',
          text: 'text-indigo-700',
          valueBg: 'bg-indigo-50',
          trendUp: 'text-green-600',
          trendDown: 'text-red-600'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`${colorClasses.bg} border ${colorClasses.border} rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses.iconBg} flex items-center justify-center shadow-md`}>
          <Icon name={icon} size={22} className={colorClasses.icon} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
              size={12} 
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className={`text-2xl sm:text-3xl font-bold ${colorClasses.text} mb-1`}>
          {value}
        </p>
        <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
          {title}
        </p>
        <p className="text-xs sm:text-sm text-gray-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default OverviewCard;
