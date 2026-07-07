import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from 'components/ui/AppHeader';
import AuthenticatedNavigation from 'components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from 'components/ui/BreadcrumbNavigation';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Select from 'components/ui/Select';

const FeedbackAnalytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedInstructor, setSelectedInstructor] = useState('');

  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@peopleskilltraining.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock feedback data based on research insights
  const satisfactionScores = {
    overall: 4.3,
    thisMonth: 4.4,
    lastMonth: 4.1,
    trend: '+7.3%',
    totalResponses: 1847,
    responseRate: 68.2
  };

  const ratingDistribution = [
    { rating: 5, count: 823, percentage: 44.6 },
    { rating: 4, count: 645, percentage: 34.9 },
    { rating: 3, count: 267, percentage: 14.5 },
    { rating: 2, count: 87, percentage: 4.7 },
    { rating: 1, count: 25, percentage: 1.4 }
  ];

  const instructorOptions = [
    { value: '', label: 'All Instructors' },
    { value: '1', label: 'Dr. Michael Chen' },
    { value: '2', label: 'Emily Rodriguez' },
    { value: '3', label: 'Sarah Johnson' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  // Mock feedback themes data
  const feedbackThemes = {
    positive: [
      { theme: 'Clear Explanations', count: 342, sentiment: 0.89 },
      { theme: 'Practical Examples', count: 298, sentiment: 0.86 },
      { theme: 'Engaging Presentation', count: 267, sentiment: 0.84 },
      { theme: 'Comprehensive Content', count: 234, sentiment: 0.82 },
      { theme: 'Good Q&A Session', count: 189, sentiment: 0.78 }
    ],
    negative: [
      { theme: 'Too Fast Paced', count: 78, sentiment: -0.65 },
      { theme: 'Technical Issues', count: 67, sentiment: -0.72 },
      { theme: 'Limited Time', count: 54, sentiment: -0.58 },
      { theme: 'Difficult to Follow', count: 43, sentiment: -0.61 },
      { theme: 'Audio Quality', count: 32, sentiment: -0.69 }
    ]
  };

  // Mock action items data
  const actionItems = {
    lowRatedSessions: [
      {
        id: 1,
        title: 'CSS Grid Advanced Techniques',
        instructor: 'Sarah Johnson',
        date: '2024-11-28',
        rating: 3.2,
        responses: 45,
        issues: ['Too advanced', 'Poor audio', 'Rushed presentation'],
        priority: 'high'
      },
      {
        id: 2,
        title: 'Python Data Structures',
        instructor: 'Mark Wilson',
        date: '2024-11-25',
        rating: 3.4,
        responses: 67,
        issues: ['Unclear examples', 'Technical difficulties'],
        priority: 'medium'
      }
    ],
    improvements: [
      {
        category: 'Technical',
        recommendation: 'Improve audio quality for all webinars',
        impact: 'High',
        effort: 'Medium',
        affectedSessions: 23
      },
      {
        category: 'Content',
        recommendation: 'Provide more beginner-friendly explanations',
        impact: 'Medium',
        effort: 'Low',
        affectedSessions: 15
      },
      {
        category: 'Engagement',
        recommendation: 'Add more interactive polls and Q&A time',
        impact: 'High',
        effort: 'Low',
        affectedSessions: 18
      }
    ],
    successStories: [
      {
        title: 'Advanced React Patterns',
        instructor: 'Dr. Michael Chen',
        rating: 4.8,
        responses: 89,
        highlights: ['Excellent real-world examples', 'Perfect pacing', 'Great interaction'],
        attendanceRate: 94.2
      },
      {
        title: 'JavaScript Performance',
        instructor: 'Emily Rodriguez',
        rating: 4.7,
        responses: 72,
        highlights: ['Clear explanations', 'Practical tips', 'Good follow-up'],
        attendanceRate: 91.8
      }
    ]
  };

  // Mock sentiment analysis over time
  const sentimentTrends = [
    { month: 'Jul', positive: 78.5, neutral: 15.2, negative: 6.3 },
    { month: 'Aug', positive: 80.1, neutral: 14.8, negative: 5.1 },
    { month: 'Sep', positive: 82.3, neutral: 13.7, negative: 4.0 },
    { month: 'Oct', positive: 79.8, neutral: 16.1, negative: 4.1 },
    { month: 'Nov', positive: 83.2, neutral: 12.9, negative: 3.9 },
    { month: 'Dec', positive: 85.1, neutral: 11.4, negative: 3.5 }
  ];

  // Common feedback words for word cloud simulation
  const commonWords = [
    { word: 'excellent', frequency: 245, sentiment: 'positive' },
    { word: 'clear', frequency: 198, sentiment: 'positive' },
    { word: 'helpful', frequency: 176, sentiment: 'positive' },
    { word: 'informative', frequency: 154, sentiment: 'positive' },
    { word: 'engaging', frequency: 134, sentiment: 'positive' },
    { word: 'practical', frequency: 123, sentiment: 'positive' },
    { word: 'confusing', frequency: 87, sentiment: 'negative' },
    { word: 'fast', frequency: 76, sentiment: 'negative' },
    { word: 'technical', frequency: 65, sentiment: 'neutral' },
    { word: 'difficult', frequency: 54, sentiment: 'negative' }
  ];

  const handleExportReport = () => {
    console.log('Exporting feedback analytics...');
    alert('Feedback analytics report exported successfully!');
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const customBreadcrumbs = [
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Feedback Analytics', href: null }
  ];

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.7) return 'text-success';
    if (sentiment > 0.3) return 'text-warning';
    return 'text-error';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 text-error border-error/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole="admin"
        currentPath="/admin/feedback-analytics"
      />

      <AppHeader
        user={user}
        notifications={[]}
        onLogout={handleLogout}
        onNotificationClick={() => {}}
      />

      <main className={`transition-all duration-300 ${
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } lg:pt-0 pt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Feedback Analytics</h1>
                <p className="text-text-secondary">Sentiment and satisfaction analysis</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  options={timeRangeOptions}
                  value={timeRange}
                  onChange={setTimeRange}
                  className="w-40"
                />
                <Select
                  options={instructorOptions}
                  value={selectedInstructor}
                  onChange={setSelectedInstructor}
                  className="w-48"
                />
                <Button
                  variant="default"
                  onClick={handleExportReport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Satisfaction Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                  <p className="text-3xl font-bold text-foreground">{satisfactionScores.overall}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Star" size={24} className="text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Icon name="TrendingUp" size={14} className="text-success mr-1" />
                <span className="text-success">{satisfactionScores.trend}</span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold text-foreground">{satisfactionScores.thisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-success" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                +0.3 from last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Responses</p>
                  <p className="text-3xl font-bold text-foreground">{satisfactionScores.totalResponses.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {satisfactionScores.responseRate}% response rate
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                  <p className="text-3xl font-bold text-foreground">85.1%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="ThumbsUp" size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-success">
                +2.8% improvement
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Rating Distribution */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Rating Distribution</h2>
                
                <div className="space-y-4">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.rating} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm font-medium text-foreground">{rating.rating}</span>
                        <Icon name="Star" size={14} className="text-warning" />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            rating.rating >= 4 ? 'bg-success' : 
                            rating.rating >= 3 ? 'bg-warning' : 'bg-error'
                          }`}
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <div className="text-right w-20">
                        <div className="text-sm font-medium text-foreground">{rating.count}</div>
                        <div className="text-xs text-muted-foreground">{rating.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Themes */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Feedback Themes</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Positive Themes */}
                  <div>
                    <h3 className="text-lg font-medium text-success mb-4">
                      <Icon name="ThumbsUp" size={16} className="inline mr-2" />
                      Most Appreciated
                    </h3>
                    <div className="space-y-3">
                      {feedbackThemes.positive.map((theme, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-foreground">{theme.theme}</span>
                            <div className="text-xs text-muted-foreground">
                              {theme.count} mentions • {Math.round(theme.sentiment * 100)}% positive
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${getSentimentColor(theme.sentiment)}`}>
                            +{Math.round(theme.sentiment * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Negative Themes */}
                  <div>
                    <h3 className="text-lg font-medium text-error mb-4">
                      <Icon name="ThumbsDown" size={16} className="inline mr-2" />
                      Areas for Improvement
                    </h3>
                    <div className="space-y-3">
                      {feedbackThemes.negative.map((theme, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-foreground">{theme.theme}</span>
                            <div className="text-xs text-muted-foreground">
                              {theme.count} mentions • {Math.round(Math.abs(theme.sentiment) * 100)}% negative
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${getSentimentColor(theme.sentiment)}`}>
                            {Math.round(theme.sentiment * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment Trends */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Sentiment Trends Over Time</h2>
                
                <div className="space-y-4">
                  {sentimentTrends.map((trend, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="w-12 text-sm font-medium text-foreground">{trend.month}</span>
                      <div className="flex-1 flex bg-muted rounded-full h-4">
                        <div 
                          className="bg-success rounded-l-full flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${trend.positive}%` }}
                        >
                          {trend.positive > 15 ? `${trend.positive}%` : ''}
                        </div>
                        <div 
                          className="bg-warning flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${trend.neutral}%` }}
                        >
                          {trend.neutral > 10 ? `${trend.neutral}%` : ''}
                        </div>
                        <div 
                          className="bg-error rounded-r-full flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${trend.negative}%` }}
                        >
                          {trend.negative > 5 ? `${trend.negative}%` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-muted-foreground">Positive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span className="text-muted-foreground">Neutral</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-error rounded-full"></div>
                    <span className="text-muted-foreground">Negative</span>
                  </div>
                </div>
              </div>

              {/* Action Items - Low Rated Sessions */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Sessions Requiring Attention</h2>
                
                <div className="space-y-4">
                  {actionItems.lowRatedSessions.map((session) => (
                    <div key={session.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-foreground">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {session.instructor} • {session.date} • {session.responses} responses
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(session.priority)}`}>
                            {session.priority} priority
                          </span>
                          <div className="text-right">
                            <div className="text-lg font-bold text-error">{session.rating}</div>
                            <Icon name="Star" size={14} className="text-error" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Main Issues:</p>
                        <div className="flex flex-wrap gap-2">
                          {session.issues.map((issue, index) => (
                            <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Word Cloud Simulation */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Common Feedback Words</h3>
                
                <div className="flex flex-wrap gap-2">
                  {commonWords.map((word, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        word.sentiment === 'positive' ? 'bg-success/10 text-success' :
                        word.sentiment === 'negative' ? 'bg-error/10 text-error' :
                        'bg-muted text-muted-foreground'
                      }`}
                      style={{ fontSize: `${Math.min(word.frequency / 20 + 10, 16)}px` }}
                    >
                      {word.word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Improvement Recommendations */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Improvement Recommendations</h3>
                
                <div className="space-y-4">
                  {actionItems.improvements.map((improvement, index) => (
                    <div key={index} className="border border-border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-foreground">{improvement.category}</span>
                        <div className="flex space-x-1">
                          <span className={`px-2 py-1 rounded text-xs ${
                            improvement.impact === 'High' ? 'bg-error/10 text-error' :
                            improvement.impact === 'Medium' ? 'bg-warning/10 text-warning' :
                            'bg-success/10 text-success'
                          }`}>
                            {improvement.impact}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {improvement.recommendation}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Effort: {improvement.effort} • {improvement.affectedSessions} sessions affected
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Stories */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  <Icon name="Award" size={16} className="inline mr-2 text-warning" />
                  Success Stories
                </h3>
                
                <div className="space-y-4">
                  {actionItems.successStories.map((story, index) => (
                    <div key={index} className="border border-success/20 bg-success/5 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{story.title}</h4>
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={14} className="text-warning" />
                          <span className="text-sm font-bold text-foreground">{story.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{story.instructor}</p>
                      
                      <div className="space-y-1 mb-2">
                        {story.highlights.slice(0, 2).map((highlight, idx) => (
                          <p key={idx} className="text-xs text-success">
                            <Icon name="Check" size={10} className="inline mr-1" />
                            {highlight}
                          </p>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {story.responses} responses • {story.attendanceRate}% attendance
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedbackAnalytics;
