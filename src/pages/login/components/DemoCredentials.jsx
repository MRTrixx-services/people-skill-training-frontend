import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DemoCredentials = ({ onSelectCredentials }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const demoAccounts = [
    {
      role: 'admin',
      email: 'admin@eduzoom.com',
      password: 'admin123',
      name: 'System Administrator',
      description: 'Full system access with user management'
    },
    {
      role: 'instructor',
      email: 'instructor@eduzoom.com',
      password: 'instructor123',
      name: 'Course Instructor',
      description: 'Create webinars and manage sessions'
    },
    {
      role: 'attendee',
      email: 'student@eduzoom.com',
      password: 'student123',
      name: 'Student User',
      description: 'Join webinars and access recordings'
    }
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return 'Shield';
      case 'instructor':
        return 'Users';
      case 'attendee':
        return 'User';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50';
      case 'instructor':
        return 'text-blue-600 bg-blue-50';
      case 'attendee':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="mt-6 border border-border rounded-lg bg-muted/30">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors duration-150 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon name="TestTube" size={20} className="text-accent" />
          <div>
            <p className="font-medium text-foreground">Demo Credentials</p>
            <p className="text-sm text-muted-foreground">Try different user roles</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-3">
          {demoAccounts?.map((account) => (
            <div
              key={account?.role}
              className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow duration-150"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(account?.role)}`}>
                  <Icon name={getRoleIcon(account?.role)} size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground capitalize">{account?.role}</p>
                  <p className="text-sm text-muted-foreground">{account?.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {account?.email} / {account?.password}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectCredentials(account?.email, account?.password)}
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
              >
                Use
              </Button>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                These are demo accounts for testing purposes. In production, use your actual credentials.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCredentials;