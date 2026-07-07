import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AttendanceBreakdown = ({ data, loading = false }) => {
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
    { name: 'Attended Full Session', value: 65, color: 'var(--color-success)' },
    { name: 'Partial Attendance', value: 20, color: 'var(--color-warning)' },
    { name: 'Registered No Show', value: 10, color: 'var(--color-error)' },
    { name: 'Late Joiners', value: 5, color: 'var(--color-secondary)' }
  ];

  const COLORS = mockData?.map(entry => entry?.color);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-text-primary">{data?.name}</p>
          <p className="text-sm text-text-secondary">
            {data?.value}% ({Math.round(data?.value * 2.5)} attendees)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry?.color }}
            ></div>
            <span className="text-sm text-text-secondary">{entry?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Attendance Breakdown</h3>
        <p className="text-sm text-text-secondary">Session participation analysis</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {mockData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-success">85%</p>
          <p className="text-sm text-text-secondary">Overall Attendance</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">4.2</p>
          <p className="text-sm text-text-secondary">Avg Session Rating</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceBreakdown;