import React from 'react';
import Icon from '../../../components/AppIcon';

const TopCourses = () => {
  const topCourses = [
    {
      id: 1,
      title: 'Advanced React Development',
      instructor: 'Sarah Johnson',
      enrollments: 2450,
      revenue: 147000,
      rating: 4.9,
      category: 'Web Development',
      trend: 'up',
      trendValue: '+15.2%'
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Michael Chen',
      enrollments: 1890,
      revenue: 132300,
      rating: 4.8,
      category: 'Data Science',
      trend: 'up',
      trendValue: '+22.1%'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      instructor: 'Emma Rodriguez',
      enrollments: 1650,
      revenue: 82500,
      rating: 4.7,
      category: 'Marketing',
      trend: 'up',
      trendValue: '+8.7%'
    },
    {
      id: 4,
      title: 'Python for Data Analysis',
      instructor: 'James Wilson',
      enrollments: 1420,
      revenue: 99400,
      rating: 4.8,
      category: 'Programming',
      trend: 'down',
      trendValue: '-3.2%'
    },
    {
      id: 5,
      title: 'UX/UI Design Principles',
      instructor: 'Lisa Anderson',
      enrollments: 1280,
      revenue: 76800,
      rating: 4.6,
      category: 'Design',
      trend: 'up',
      trendValue: '+12.4%'
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': 'Code',
      'Data Science': 'BarChart3',
      'Marketing': 'Megaphone',
      'Programming': 'Terminal',
      'Design': 'Palette'
    };
    return icons?.[category] || 'BookOpen';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Performing Courses</h3>
          <p className="text-sm text-muted-foreground">Ranked by revenue and enrollment</p>
        </div>
        <Icon name="Award" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {topCourses?.map((course, index) => (
          <div key={course?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-micro">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <span className="text-sm font-bold text-primary">#{index + 1}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {course?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    by {course?.instructor}
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-1">
                      <Icon name={getCategoryIcon(course?.category)} size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{course?.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={12} className="text-warning fill-current" />
                      <span className="text-xs text-muted-foreground">{course?.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getTrendIcon(course?.trend)} 
                      size={14} 
                      className={getTrendColor(course?.trend)} 
                    />
                    <span className={`text-xs font-medium ${getTrendColor(course?.trend)}`}>
                      {course?.trendValue}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    ${course?.revenue?.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {course?.enrollments?.toLocaleString()} enrolled
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Courses</span>
            <p className="font-semibold text-foreground">247</p>
          </div>
          <div>
            <span className="text-muted-foreground">Avg. Rating</span>
            <p className="font-semibold text-foreground">4.7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCourses;