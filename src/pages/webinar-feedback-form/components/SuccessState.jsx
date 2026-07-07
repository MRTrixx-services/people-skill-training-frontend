import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessState = ({ onViewRecommendations, onReturnToDashboard }) => {
  const recommendedWebinars = [
    {
      id: 1,
      title: "Advanced JavaScript Patterns",
      instructor: "Sarah Johnson",
      date: "Sep 15, 2024",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "React Performance Optimization",
      instructor: "Mike Chen",
      date: "Sep 20, 2024",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Modern CSS Techniques",
      instructor: "Emily Davis",
      date: "Sep 25, 2024",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-surface rounded-xl shadow-elevation-3 p-8 text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Check" size={32} color="white" />
          </div>
          
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Thank You for Your Feedback!
          </h1>
          
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Your feedback has been submitted successfully. It helps us improve our webinars and provide better learning experiences.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-2 text-success">
              <Icon name="CheckCircle" size={20} />
              <span className="text-sm font-medium">Feedback recorded</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-success">
              <Icon name="Mail" size={20} />
              <span className="text-sm font-medium">Confirmation email sent</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-success">
              <Icon name="Award" size={20} />
              <span className="text-sm font-medium">Participation certificate available</span>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Recommended for You
            </h2>
            
            <div className="grid gap-4 mb-6">
              {recommendedWebinars?.map((webinar) => (
                <div key={webinar?.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted transition-smooth">
                  <div className="w-16 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={webinar?.thumbnail} 
                      alt={webinar?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-text-primary text-sm">
                      {webinar?.title}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {webinar?.instructor} • {webinar?.date}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enroll
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="default" 
                onClick={onViewRecommendations}
                iconName="BookOpen"
                iconPosition="left"
              >
                View All Recommendations
              </Button>
              <Button 
                variant="outline" 
                onClick={onReturnToDashboard}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessState;