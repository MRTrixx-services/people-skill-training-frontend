import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
         <img 
      src="/assets/logo (4).png" 
      alt="Logo" 
      className="h-16 w-auto object-contain"
    />
        {/* <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="GraduationCap" size={32} color="white" />
        </div> */}
      </div>
      
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Welcome Back
      </h1>
      
      <p className="text-muted-foreground text-lg">
        Sign in to your PeopleSkillTraining account
      </p>
      
      {/* <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Icon name="Shield" size={16} className="text-success" />
        <span>Secure SSL Connection</span>
      </div> */}
    </div>
  );
};

export default LoginHeader;