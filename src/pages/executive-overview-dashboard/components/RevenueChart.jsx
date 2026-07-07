import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';

const RevenueChart = () => {
  const [viewMode, setViewMode] = useState('monthly');
  
  const monthlyData = [
    { period: 'Jan 2024', revenue: 125000, users: 2400, growth: 12.5 },
    { period: 'Feb 2024', revenue: 138000, users: 2680, growth: 10.4 },
    { period: 'Mar 2024', revenue: 152000, users: 2950, growth: 10.1 },
    { period: 'Apr 2024', revenue: 145000, users: 3100, growth: 5.1 },
    { period: 'May 2024', revenue: 168000, users: 3350, growth: 15.9 },
    { period: 'Jun 2024', revenue: 182000, users: 3600, growth: 8.3 },
    { period: 'Jul 2024', revenue: 195000, users: 3850, growth: 7.1 },
    { period: 'Aug 2024', revenue: 210000, users: 4100, growth: 7.7 }
  ];

  const quarterlyData = [
    { period: 'Q1 2023', revenue: 380000, users: 7200, growth: 15.2 },
    { period: 'Q2 2023', revenue: 425000, users: 8100, growth: 11.8 },
    { period: 'Q3 2023', revenue: 465000, users: 8900, growth: 9.4 },
    { period: 'Q4 2023', revenue: 520000, users: 9800, growth: 11.8 },
    { period: 'Q1 2024', revenue: 415000, users: 8030, growth: 9.2 },
    { period: 'Q2 2024', revenue: 495000, users: 10050, growth: 16.5 }
  ];

  const currentData = viewMode === 'monthly' ? monthlyData : quarterlyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">
                {entry?.name === 'Revenue' ? `$${entry?.value?.toLocaleString()}` : 
                 entry?.name === 'Active Users' ? entry?.value?.toLocaleString() :
                 `${entry?.value}%`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue & User Growth</h3>
          <p className="text-sm text-muted-foreground">Combined revenue trends with user acquisition metrics</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={viewMode === 'quarterly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('quarterly')}
          >
            Quarterly
          </Button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000)?.toFixed(1)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              name="Revenue"
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="users" 
              name="Active Users"
              stroke="var(--color-accent)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;