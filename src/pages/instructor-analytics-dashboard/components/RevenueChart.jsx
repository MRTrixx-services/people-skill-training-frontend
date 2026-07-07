import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const mockData = data || [
    { month: 'Jan', revenue: 2400, sessions: 8 },
    { month: 'Feb', revenue: 3200, sessions: 12 },
    { month: 'Mar', revenue: 2800, sessions: 10 },
    { month: 'Apr', revenue: 4100, sessions: 15 },
    { month: 'May', revenue: 3600, sessions: 13 },
    { month: 'Jun', revenue: 4800, sessions: 18 },
    { month: 'Jul', revenue: 5200, sessions: 20 },
    { month: 'Aug', revenue: 4900, sessions: 19 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-text-primary mb-2">{label} 2024</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-text-secondary">Revenue:</span>
              <span className="text-sm font-medium text-success">
                {formatCurrency(payload?.[0]?.value)}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-text-secondary">Sessions:</span>
              <span className="text-sm font-medium text-text-primary">
                {payload?.[0]?.payload?.sessions}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Revenue Analysis</h3>
          <p className="text-sm text-text-secondary">Monthly earnings breakdown</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Total Revenue</p>
          <p className="text-xl font-bold text-success">
            {formatCurrency(mockData?.reduce((sum, item) => sum + item?.revenue, 0))}
          </p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="var(--color-success)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(mockData?.[mockData?.length - 1]?.revenue || 0)}
          </p>
          <p className="text-sm text-text-secondary">This Month</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(mockData?.reduce((sum, item) => sum + item?.revenue, 0) / mockData?.length)}
          </p>
          <p className="text-sm text-text-secondary">Avg Monthly</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">+23%</p>
          <p className="text-sm text-text-secondary">Growth Rate</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;