import React from 'react';
import Icon from '../../../components/AppIcon';

const GeographicDistribution = () => {
  const geographicData = [
    { country: 'United States', users: 12450, percentage: 35.2, flag: '🇺🇸', growth: '+12.3%' },
    { country: 'India', users: 8920, percentage: 25.1, flag: '🇮🇳', growth: '+18.7%' },
    { country: 'United Kingdom', users: 4680, percentage: 13.2, flag: '🇬🇧', growth: '+8.4%' },
    { country: 'Canada', users: 3210, percentage: 9.1, flag: '🇨🇦', growth: '+15.2%' },
    { country: 'Australia', users: 2890, percentage: 8.2, flag: '🇦🇺', growth: '+11.6%' },
    { country: 'Germany', users: 1950, percentage: 5.5, flag: '🇩🇪', growth: '+6.8%' },
    { country: 'Others', users: 1100, percentage: 3.7, flag: '🌍', growth: '+9.2%' }
  ];

  const getBarWidth = (percentage) => `${Math.max(percentage, 2)}%`;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Geographic Distribution</h3>
          <p className="text-sm text-muted-foreground">User base by country</p>
        </div>
        <Icon name="Globe" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {geographicData?.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item?.flag}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{item?.country}</p>
                  <p className="text-xs text-muted-foreground">
                    {item?.users?.toLocaleString()} users
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{item?.percentage}%</p>
                <p className="text-xs text-success">{item?.growth}</p>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: getBarWidth(item?.percentage) }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Active Users</span>
          <span className="font-semibold text-foreground">35,200</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Countries Served</span>
          <span className="font-semibold text-foreground">47</span>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistribution;