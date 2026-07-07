import React from 'react';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-4 text-center ">
      {/* <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <a 
          href="/terms" 
          className="hover:text-foreground transition-colors duration-150"
        >
          Terms of Service
        </a>
        <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
        <a 
          href="/privacy" 
          className="hover:text-foreground transition-colors duration-150"
        >
          Privacy Policy
        </a>
        <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
        <a 
          href="/support" 
          className="hover:text-foreground transition-colors duration-150"
        >
          Support
        </a>
      </div> */}
      
      <p className="text-xs text-muted-foreground">
        © {currentYear} PeopleSkillTraining. All rights reserved.
      </p>
    </div>
  );
};

export default LoginFooter;