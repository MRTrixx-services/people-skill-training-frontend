import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const WebinarFeedback = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams();
  const [user, setUser] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    overallRating: 0,
    contentQuality: 0,
    instructorRating: 0,
    comments: '',
    wouldRecommend: null,
    favoriteAspect: '',
    improvement: ''
  });

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      role: "attendee",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock webinar data
  const webinar = {
    id: webinarId,
    title: "Advanced React Patterns and Performance Optimization",
    instructor: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Senior React Developer & Technical Lead"
    },
    date: "December 15, 2024",
    time: "2:00 PM EST",
    duration: "2 hours",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    attendanceConfirmed: true
  };

  const StarRating = ({ rating, onRatingChange, size = 24, readonly = false }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
            className={`transition-colors ${!readonly ? 'hover:scale-110' : ''} focus:outline-none`}
          >
            <Icon
              name="Star"
              size={size}
              className={`${
                star <= (hover || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } transition-colors duration-150`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleInputChange = (field, value) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Submitting feedback:', feedback);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/attendee-dashboard' },
    { label: 'My Enrollments', href: '/my-enrollments' },
    { label: 'Webinar Feedback', href: null }
  ];

  const isFormValid = () => {
    return feedback.overallRating > 0 && 
           feedback.contentQuality > 0 && 
           feedback.instructorRating > 0 &&
           feedback.wouldRecommend !== null;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          user={user}
          notifications={[]}
          onLogout={handleLogout}
          onNotificationClick={() => {}}
        />
        
        <main className="pt-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">Thank You for Your Feedback!</h1>
              <p className="text-muted-foreground mb-6">
                Your feedback helps us improve our webinars and helps other learners make informed decisions.
              </p>

              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">You rated this webinar:</p>
                <div className="flex items-center justify-center space-x-2">
                  <StarRating rating={feedback.overallRating} readonly size={20} />
                  <span className="text-lg font-semibold text-foreground">
                    {feedback.overallRating}/5
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="default"
                  onClick={() => navigate('/my-enrollments')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to My Enrollments
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/browse-webinars')}
                  iconName="Search"
                  iconPosition="left"
                >
                  Browse More Webinars
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={user}
        notifications={[]}
        onLogout={handleLogout}
        onNotificationClick={() => {}}
      />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Experience</h1>
            <p className="text-text-secondary">Your feedback helps us improve our webinars and helps other learners</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Rate Your Experience</h2>
                  
                  {/* Overall Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Overall Rating <span className="text-error">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <StarRating 
                        rating={feedback.overallRating} 
                        onRatingChange={(rating) => handleInputChange('overallRating', rating)} 
                      />
                      <span className="text-sm text-muted-foreground">
                        {feedback.overallRating > 0 && `${feedback.overallRating}/5`}
                      </span>
                    </div>
                  </div>

                  {/* Content Quality */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Content Quality <span className="text-error">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <StarRating 
                        rating={feedback.contentQuality} 
                        onRatingChange={(rating) => handleInputChange('contentQuality', rating)} 
                      />
                      <span className="text-sm text-muted-foreground">
                        {feedback.contentQuality > 0 && `${feedback.contentQuality}/5`}
                      </span>
                    </div>
                  </div>

                  {/* Instructor Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Instructor Performance <span className="text-error">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <StarRating 
                        rating={feedback.instructorRating} 
                        onRatingChange={(rating) => handleInputChange('instructorRating', rating)} 
                      />
                      <span className="text-sm text-muted-foreground">
                        {feedback.instructorRating > 0 && `${feedback.instructorRating}/5`}
                      </span>
                    </div>
                  </div>

                  {/* Would Recommend */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Would you recommend this webinar to others? <span className="text-error">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('wouldRecommend', true)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                          feedback.wouldRecommend === true
                            ? 'border-success bg-success/10 text-success'
                            : 'border-border hover:border-success hover:bg-success/5'
                        }`}
                      >
                        <Icon name="ThumbsUp" size={16} />
                        <span>Yes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('wouldRecommend', false)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                          feedback.wouldRecommend === false
                            ? 'border-error bg-error/10 text-error'
                            : 'border-border hover:border-error hover:bg-error/5'
                        }`}
                      >
                        <Icon name="ThumbsDown" size={16} />
                        <span>No</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Additional Feedback</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Comments & Review
                      </label>
                      <textarea
                        value={feedback.comments}
                        onChange={(e) => handleInputChange('comments', e.target.value)}
                        placeholder="Share your thoughts about the webinar content, presentation style, or overall experience..."
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>

                    <Input
                      label="What was your favorite aspect?"
                      type="text"
                      placeholder="e.g., practical examples, Q&A session, instructor expertise..."
                      value={feedback.favoriteAspect}
                      onChange={(e) => handleInputChange('favoriteAspect', e.target.value)}
                    />

                    <Input
                      label="What could be improved?"
                      type="text"
                      placeholder="e.g., more interactive elements, better audio quality, more time for Q&A..."
                      value={feedback.improvement}
                      onChange={(e) => handleInputChange('improvement', e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={!isFormValid() || isSubmitting}
                    loading={isSubmitting}
                    iconName="Send"
                    iconPosition="right"
                  >
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Webinar Summary */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Webinar Summary</h3>
                
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                  <Image
                    src={webinar.thumbnail}
                    alt={webinar.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{webinar.title}</h4>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Image
                    src={webinar.instructor.avatar}
                    alt={webinar.instructor.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{webinar.instructor.name}</p>
                    <p className="text-xs text-muted-foreground">{webinar.instructor.title}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{webinar.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{webinar.time} • {webinar.duration}</span>
                  </div>
                </div>

                {webinar.attendanceConfirmed && (
                  <div className="mt-4 flex items-center space-x-2 p-2 bg-success/10 border border-success/20 rounded-lg">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span className="text-xs text-success font-medium">Attendance Confirmed</span>
                  </div>
                )}
              </div>

              {/* Feedback Impact */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                  <Icon name="Heart" size={16} className="mr-2 text-accent" />
                  Your Feedback Matters
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Helps instructors improve their content</li>
                  <li>• Guides other learners in their choices</li>
                  <li>• Shapes our platform's future features</li>
                  <li>• Contributes to the learning community</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebinarFeedback;
