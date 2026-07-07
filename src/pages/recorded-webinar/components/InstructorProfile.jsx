import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InstructorProfile = ({ instructor }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < Math.floor(rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Meet Your Instructor
      </h2>
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={instructor?.avatar}
            alt={instructor?.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {instructor?.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {instructor?.title}
          </p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(instructor?.rating)}
              <span className="text-sm text-muted-foreground ml-1">
                {instructor?.rating} ({instructor?.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {instructor?.bio}
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {instructor?.totalWebinars}
              </div>
              <div className="text-xs text-muted-foreground">Webinars</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {instructor?.totalStudents}
              </div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {instructor?.experience}
              </div>
              <div className="text-xs text-muted-foreground">Years Exp.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Expertise</h4>
        <div className="flex flex-wrap gap-2">
          {instructor?.expertise?.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;