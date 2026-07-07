import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SessionHeader from './components/SessionHeader';
import StarRating from './components/StarRating';
import NPSSlider from './components/NPSSlider';
import MultipleChoiceQuestion from './components/MultipleChoiceQuestion';
import CommentBox from './components/CommentBox';
import ProgressIndicator from './components/ProgressIndicator';
import SuccessState from './components/SuccessState';

const WebinarFeedbackForm = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock session data
  const sessionData = {
    title: "Advanced React Patterns & Performance Optimization",
    instructor: "Sarah Johnson",
    date: "August 30, 2024",
    duration: "2 hours"
  };

  // Form state
  const [formData, setFormData] = useState({
    overallRating: null,
    contentQuality: null,
    instructorRating: null,
    technicalQuality: null,
    pacing: null,
    relevance: null,
    npsScore: null,
    overallComments: '',
    contentComments: '',
    instructorComments: '',
    additionalComments: ''
  });

  const [errors, setErrors] = useState({});

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem('webinar-feedback-draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading saved feedback:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('webinar-feedback-draft', JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, hasUnsavedChanges]);

  // Question options
  const technicalQualityOptions = [
    { value: 'excellent', label: 'Excellent', description: 'No technical issues, crystal clear audio/video' },
    { value: 'good', label: 'Good', description: 'Minor issues that didn\'t affect learning' },
    { value: 'fair', label: 'Fair', description: 'Some issues but manageable' },
    { value: 'poor', label: 'Poor', description: 'Significant technical problems' }
  ];

  const pacingOptions = [
    { value: 'too-fast', label: 'Too Fast', description: 'Hard to keep up with the content' },
    { value: 'just-right', label: 'Just Right', description: 'Perfect pace for learning' },
    { value: 'too-slow', label: 'Too Slow', description: 'Could have covered more material' }
  ];

  const relevanceOptions = [
    { value: 'highly-relevant', label: 'Highly Relevant', description: 'Directly applicable to my work/goals' },
    { value: 'somewhat-relevant', label: 'Somewhat Relevant', description: 'Some useful takeaways' },
    { value: 'not-relevant', label: 'Not Relevant', description: 'Didn\'t match my expectations' }
  ];

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.overallRating) newErrors.overallRating = 'Overall rating is required';
    if (!formData?.contentQuality) newErrors.contentQuality = 'Content quality rating is required';
    if (!formData?.instructorRating) newErrors.instructorRating = 'Instructor rating is required';
    if (!formData?.technicalQuality) newErrors.technicalQuality = 'Please select technical quality';
    if (!formData?.pacing) newErrors.pacing = 'Please select pacing feedback';
    if (!formData?.relevance) newErrors.relevance = 'Please select relevance rating';
    if (formData?.npsScore === null) newErrors.npsScore = 'NPS score is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const getCompletedSections = () => {
    let completed = 0;
    if (formData?.overallRating) completed++;
    if (formData?.contentQuality) completed++;
    if (formData?.instructorRating) completed++;
    if (formData?.technicalQuality && formData?.pacing && formData?.relevance) completed++;
    if (formData?.npsScore !== null) completed++;
    return completed;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.text-error');
      if (firstError) {
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved draft
      localStorage.removeItem('webinar-feedback-draft');
      setHasUnsavedChanges(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Handle error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      navigate('/attendee-recordings-library');
    }
  };

  const handleConfirmCancel = () => {
    localStorage.removeItem('webinar-feedback-draft');
    navigate('/attendee-recordings-library');
  };

  const handleViewRecommendations = () => {
    navigate('/attendee-recordings-library');
  };

  const handleReturnToDashboard = () => {
    navigate('/attendee-recordings-library');
  };

  if (isSubmitted) {
    return (
      <SuccessState 
        onViewRecommendations={handleViewRecommendations}
        onReturnToDashboard={handleReturnToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SessionHeader sessionData={sessionData} />
      <ProgressIndicator 
        completedSections={getCompletedSections()} 
        totalSections={5} 
      />
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overall Experience */}
          <div className="bg-surface rounded-xl shadow-elevation-1 p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Overall Experience
            </h2>
            
            <StarRating
              label="How would you rate your overall experience?"
              description="Consider all aspects of the webinar"
              value={formData?.overallRating}
              onChange={(value) => handleInputChange('overallRating', value)}
              required
              error={errors?.overallRating}
            />

            <div className="mt-6">
              <CommentBox
                label="What did you like most about this webinar?"
                placeholder="Share your thoughts about the overall experience..."
                value={formData?.overallComments}
                onChange={(value) => handleInputChange('overallComments', value)}
                maxLength={300}
              />
            </div>
          </div>

          {/* Content Quality */}
          <div className="bg-surface rounded-xl shadow-elevation-1 p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Content Quality
            </h2>
            
            <StarRating
              label="How would you rate the content quality?"
              description="Accuracy, depth, and usefulness of the material"
              value={formData?.contentQuality}
              onChange={(value) => handleInputChange('contentQuality', value)}
              required
              error={errors?.contentQuality}
            />

            <div className="mt-6">
              <CommentBox
                label="Any specific feedback about the content?"
                placeholder="What topics were most valuable? What could be improved?"
                value={formData?.contentComments}
                onChange={(value) => handleInputChange('contentComments', value)}
                maxLength={300}
              />
            </div>
          </div>

          {/* Instructor Performance */}
          <div className="bg-surface rounded-xl shadow-elevation-1 p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Instructor Performance
            </h2>
            
            <StarRating
              label="How would you rate the instructor?"
              description="Teaching style, clarity, and engagement"
              value={formData?.instructorRating}
              onChange={(value) => handleInputChange('instructorRating', value)}
              required
              error={errors?.instructorRating}
            />

            <div className="mt-6">
              <CommentBox
                label="Feedback for the instructor"
                placeholder="What did the instructor do well? Any suggestions for improvement?"
                value={formData?.instructorComments}
                onChange={(value) => handleInputChange('instructorComments', value)}
                maxLength={300}
              />
            </div>
          </div>

          {/* Technical & Delivery */}
          <div className="bg-surface rounded-xl shadow-elevation-1 p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Technical Quality & Delivery
            </h2>
            
            <div className="space-y-6">
              <MultipleChoiceQuestion
                question="How was the technical quality?"
                options={technicalQualityOptions}
                value={formData?.technicalQuality}
                onChange={(value) => handleInputChange('technicalQuality', value)}
                required
                error={errors?.technicalQuality}
              />

              <MultipleChoiceQuestion
                question="How was the pacing of the webinar?"
                options={pacingOptions}
                value={formData?.pacing}
                onChange={(value) => handleInputChange('pacing', value)}
                required
                error={errors?.pacing}
              />

              <MultipleChoiceQuestion
                question="How relevant was the content to your needs?"
                options={relevanceOptions}
                value={formData?.relevance}
                onChange={(value) => handleInputChange('relevance', value)}
                required
                error={errors?.relevance}
              />
            </div>
          </div>

          {/* Net Promoter Score */}
          <div className="bg-surface rounded-xl shadow-elevation-1 p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Recommendation
            </h2>
            
            <NPSSlider
              value={formData?.npsScore}
              onChange={(value) => handleInputChange('npsScore', value)}
              error={errors?.npsScore}
            />
          </div>

          {/* Additional Comments */}
          <div className="bg-surface rounded-xl shadow-elevation-1 p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Additional Feedback
            </h2>
            
            <CommentBox
              label="Any other comments or suggestions?"
              placeholder="Share any additional thoughts, suggestions for future topics, or general feedback..."
              value={formData?.additionalComments}
              onChange={(value) => handleInputChange('additionalComments', value)}
              maxLength={500}
            />
          </div>

          {/* Submit Actions */}
          <div className="bg-surface rounded-xl shadow-elevation-1 p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                loading={isSubmitting}
                disabled={getCompletedSections() < 5}
                iconName="Send"
                iconPosition="left"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
            
            {getCompletedSections() < 5 && (
              <p className="text-sm text-text-secondary mt-3 text-center">
                Please complete all required sections to submit your feedback
              </p>
            )}
          </div>
        </form>
      </div>
      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl shadow-elevation-3 p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning" />
              <h3 className="text-lg font-semibold text-text-primary">
                Unsaved Changes
              </h3>
            </div>
            <p className="text-text-secondary mb-6">
              You have unsaved changes. Are you sure you want to leave? Your progress will be lost.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUnsavedWarning(false)}
              >
                Stay
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
              >
                Leave Anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebinarFeedbackForm;