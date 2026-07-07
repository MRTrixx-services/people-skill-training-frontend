import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegistrationHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
        >
            <img 
                src="/assets/logo (4).png" 
                alt="Logo" 
                className="h-16 w-auto object-contain"
              />
          {/* <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="GraduationCap" size={28} color="white" />
          </div> */}
         
        </button>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Join thousands of learners and instructors in our comprehensive educational platform. Start your learning journey today.
        </p>
      </div>

      {/* Features Highlight */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Video" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground text-sm">Live Webinars</h3>
            <p className="text-xs text-muted-foreground">Interactive sessions</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={20} className="text-success" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground text-sm">Rich Content</h3>
            <p className="text-xs text-muted-foreground">Comprehensive materials</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Award" size={20} className="text-accent" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-foreground text-sm">Certificates</h3>
            <p className="text-xs text-muted-foreground">Track progress</p>
          </div>
        </div>
      </div> */}

      {/* Back to Login */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          iconName="ArrowLeft"
          iconPosition="left"
          className="text-muted-foreground hover:text-foreground"
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
};

export default RegistrationHeader;