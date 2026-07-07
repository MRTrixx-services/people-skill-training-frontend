import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const securityFeatures = [
    {
      icon: "Shield",
      title: "SSL Secured",
      description: "256-bit encryption protects your data"
    },
    {
      icon: "CreditCard",
      title: "Secure Payments",
      description: "PCI DSS compliant payment processing"
    },
    {
      icon: "CheckCircle",
      title: "Verified Instructors",
      description: "All instructors are professionally vetted"
    },
    {
      icon: "Award",
      title: "Certified Platform",
      description: "ISO 27001 security certified"
    }
  ];

  const statistics = [
    {
      number: "10,000+",
      label: "Active Learners",
      icon: "Users"
    },
    {
      number: "500+",
      label: "Expert Instructors",
      icon: "GraduationCap"
    },
    {
      number: "1,000+",
      label: "Webinars Hosted",
      icon: "Video"
    },
    {
      number: "95%",
      label: "Satisfaction Rate",
      icon: "ThumbsUp"
    },
    {
      number: "50+",
      label: "Countries Served",
      icon: "Globe"
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: "Headphones"
    }
  ];

  const partnerships = [
    {
      name: "Zoom",
      description: "Official integration partner"
    },
    {
      name: "Microsoft",
      description: "Technology partner"
    },
    {
      name: "Google",
      description: "Cloud infrastructure partner"
    },
    {
      name: "AWS",
      description: "Hosting & security partner"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Security Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your Security is Our Priority
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12">
            Learn with confidence on our secure, certified platform
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures?.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature?.icon} size={24} color="white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature?.title}
                </h3>
                <p className="text-text-secondary">
                  {feature?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 lg:p-12 text-white mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-blue-100">
              Join our growing community of learners and instructors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {statistics?.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name={stat?.icon} size={20} color="white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">
                  {stat?.number}
                </div>
                <div className="text-blue-100 text-sm">
                  {stat?.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Badges */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Trusted Technology Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {partnerships?.map((partner, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-lg border border-border hover-elevate">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Building" size={24} className="text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {partner?.name}
                </h4>
                <p className="text-sm text-text-secondary">
                  {partner?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-text-secondary">
            <div className="flex items-center">
              <Icon name="Lock" size={16} className="mr-2 text-success" />
              <span className="text-sm font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center">
              <Icon name="Shield" size={16} className="mr-2 text-success" />
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center">
              <Icon name="CheckCircle" size={16} className="mr-2 text-success" />
              <span className="text-sm font-medium">SOC 2 Certified</span>
            </div>
            <div className="flex items-center">
              <Icon name="Award" size={16} className="mr-2 text-success" />
              <span className="text-sm font-medium">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;