import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionHeader = ({ sessionData }) => {
  return (
    <div className="bg-surface border-b border-border p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Check" size={24} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                <Icon name="CheckCircle" size={12} className="mr-1" />
                Completed
              </span>
            </div>
            <h1 className="text-xl font-semibold text-text-primary mb-1">
              {sessionData?.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-text-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} />
                <span>{sessionData?.instructor}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                <Icon name="Calendar" size={16} />
                <span>{sessionData?.date}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                <Icon name="Clock" size={16} />
                <span>{sessionData?.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;