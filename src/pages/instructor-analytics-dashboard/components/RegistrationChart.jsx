import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RegistrationChart = ({ data, loading = false }) => {
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
    { date: '2024-08-01', registrations: 12, completions: 8 },
    { date: '2024-08-05', registrations: 18, completions: 15 },
    { date: '2024-08-10', registrations: 25, completions: 20 },
    { date: '2024-08-15', registrations: 32, completions: 28 },
    { date: '2024-08-20', registrations: 28, completions: 24 },
    { date: '2024-08-25', registrations: 35, completions: 30 },
    { date: '2024-08-30', registrations: 42, completions: 38 }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-text-primary mb-2">
            {formatDate(label)}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-sm text-text-secondary capitalize">
                {entry?.dataKey}:
              </span>
              <span className="text-sm font-medium text-text-primary">
                {entry?.value}
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
          <h3 className="text-lg font-semibold text-text-primary">Registration Timeline</h3>
          <p className="text-sm text-text-secondary">Daily registrations and completions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Registrations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-text-secondary">Completions</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="registrations" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="completions" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegistrationChart;