import PublicHeader from "components/ui/PublicHeader";
import React from "react";


const MainLayout = ({ children }) => {
  return (
    <>
  <div className="sticky top-0 z-50 bg-background">

       <PublicHeader />
  </div>
  
         <div className="min-h-screen bg-background ">
          
          
          {children}</div>
    </>
  );
};

export default MainLayout;
