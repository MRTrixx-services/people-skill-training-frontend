import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemHealthChart = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedMetrics, setSelectedMetrics] = useState(['cpu', 'memory', 'response']);

  const mockData = [
    { time: '15:00', cpu: 45, memory: 62, response: 120, errors: 2 },
    { time: '15:05', cpu: 52, memory: 58, response: 135, errors: 1 },
    { time: '15:10', cpu: 48, memory: 65, response: 142, errors: 3 },
    { time: '15:15', cpu: 67, memory: 71, response: 158, errors: 5 },
    { time: '15:20', cpu: 73, memory: 68, response: 165, errors: 4 },
    { time: '15:25', cpu: 69, memory: 72, response: 152, errors: 2 },
    { time: '15:30', cpu: 58, memory: 66, response: 138, errors: 1 },
    { time: '15:35', cpu: 61, memory: 69, response: 145, errors: 3 },
    { time: '15:40', cpu: 55, memory: 63, response: 128, errors: 2 },
    { time: '15:45', cpu: 49, memory: 61, response: 122, errors: 1 },
    { time: '15:50', cpu: 53, memory: 64, response: 131, errors: 2 },
    { time: '15:55', cpu: 47, memory: 59, response: 118, errors: 1 }
  ];

  const metrics = [
    { key: 'cpu', label: 'CPU Usage', color: '#2563EB', unit: '%', threshold: 80 },
    { key: 'memory', label: 'Memory Usage', color: '#10B981', unit: '%', threshold: 85 },
    { key: 'response', label: 'Response Time', color: '#F59E0B', unit: 'ms', threshold: 200 },
    { key: 'errors', label: 'Error Rate', color: '#DC2626', unit: '/min', threshold: 10 }
  ];

  const timeRanges = [
    { value: '15m', label: '15 min' },
    { value: '1h', label: '1 hour' },
    { value: '6h', label: '6 hours' },
    { value: '24h', label: '24 hours' }
  ];

  const toggleMetric = (metricKey) => {
    setSelectedMetrics(prev => 
      prev?.includes(metricKey) 
        ? prev?.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry) => {
            const metric = metrics?.find(m => m?.key === entry?.dataKey);
            return (
              <div key={entry?.dataKey} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry?.color }}
                  />
                  <span className="text-sm text-muted-foreground">{metric?.label}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {entry?.value}{metric?.unit}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">System Performance</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {timeRanges?.map((range) => (
              <button
                key={range?.value}
                onClick={() => setTimeRange(range?.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-micro ${
                  timeRange === range?.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>
          
          <Button variant="ghost" size="icon">
            <Icon name="Download" size={16} />
          </Button>
        </div>
      </div>
      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) => (
          <button
            key={metric?.key}
            onClick={() => toggleMetric(metric?.key)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg border transition-micro
              ${selectedMetrics?.includes(metric?.key)
                ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: metric?.color }}
            />
            <span className="text-sm font-medium">{metric?.label}</span>
          </button>
        ))}
      </div>
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Threshold Lines */}
            {selectedMetrics?.map((metricKey) => {
              const metric = metrics?.find(m => m?.key === metricKey);
              return (
                <ReferenceLine
                  key={`threshold-${metricKey}`}
                  y={metric?.threshold}
                  stroke={metric?.color}
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                />
              );
            })}
            
            {/* Data Lines */}
            {selectedMetrics?.map((metricKey) => {
              const metric = metrics?.find(m => m?.key === metricKey);
              return (
                <Line
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  stroke={metric?.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: metric?.color, strokeWidth: 2 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend with Current Values */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
        {metrics?.map((metric) => {
          const currentValue = mockData?.[mockData?.length - 1]?.[metric?.key];
          const isAboveThreshold = currentValue > metric?.threshold;
          
          return (
            <div key={metric?.key} className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: metric?.color }}
              />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {currentValue}{metric?.unit}
                </div>
                <div className={`text-xs ${
                  isAboveThreshold ? 'text-error' : 'text-muted-foreground'
                }`}>
                  {metric?.label}
                </div>
              </div>
              {isAboveThreshold && (
                <Icon name="AlertTriangle" size={14} className="text-error" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemHealthChart;