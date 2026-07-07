import React from 'react';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const EnrollmentFunnel = () => {
  const funnelData = [
    { name: 'Website Visitors', value: 45000, color: '#3B82F6', percentage: 100 },
    { name: 'Course Page Views', value: 18000, color: '#2563EB', percentage: 40 },
    { name: 'Trial Signups', value: 9000, color: '#1D4ED8', percentage: 20 },
    { name: 'Course Enrollments', value: 4500, color: '#1E40AF', percentage: 10 },
    { name: 'Course Completions', value: 3150, color: '#1E3A8A', percentage: 7 }
  ];

  const conversionRates = [
    { from: 'Visitors', to: 'Page Views', rate: 40.0 },
    { from: 'Page Views', to: 'Signups', rate: 50.0 },
    { from: 'Signups', to: 'Enrollments', rate: 50.0 },
    { from: 'Enrollments', to: 'Completions', rate: 70.0 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            {data?.value?.toLocaleString()} users ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User Acquisition Funnel</h3>
          <p className="text-sm text-muted-foreground">Journey from visitor to course completion</p>
        </div>
        <Icon name="Filter" size={20} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Visualization */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {funnelData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Conversion Rates</h4>
          
          {conversionRates?.map((conversion, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  {conversion?.from} → {conversion?.to}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {conversion?.rate}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${conversion?.rate}%` }}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Conversion</span>
                <span className="font-semibold text-foreground">7.0%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Time to Convert</span>
                <span className="font-semibold text-foreground">3.2 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Drop-off Rate</span>
                <span className="font-semibold text-error">30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stage Details */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {funnelData?.map((stage, index) => (
            <div key={index} className="text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: stage?.color }} />
              <p className="text-xs text-muted-foreground mb-1">{stage?.name}</p>
              <p className="text-sm font-semibold text-foreground">{stage?.value?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentFunnel;