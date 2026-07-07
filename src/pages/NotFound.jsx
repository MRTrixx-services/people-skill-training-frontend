import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Popular pages for quick navigation[5]
  const popularPages = [
    { title: 'Browse Live Webinars', href: '/webinars/live', icon: 'Search' },
    { title: 'Browse Recorded Webinars', href: '/webinars/recorded', icon: 'Search' },
    
       { title: 'Contact Support', href: '/support', icon: 'MessageSquare' },
    { title: 'About Us', href: '/about', icon: 'Info' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleReportBrokenLink = () => {
    navigate('/support/report-issue', {
      state: {
        issue: 'broken_link',
        url: window.location.href,
        referrer: document.referrer
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with basic navigation */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-primary hover:text-primary/80"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Video" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">PeopleSkillTraining</span>
            </button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              iconName="Home"
              iconPosition="left"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full text-center">
          {/* Error Display following best practices[1][5] */}
          <div className="mb-12">
            {/* Large 404 illustration */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-6">
                <span className="text-6xl font-bold text-primary">404</span>
              </div>
            </div>

            {/* Friendly error message[1][9] */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The page you're looking for seems to have gone on a learning adventure of its own. 
              Let's help you find what you need!
            </p>

            {/* Friendly illustration placeholder */}
            <div className="inline-flex items-center justify-center w-64 h-48 bg-muted rounded-xl mb-8">
              <div className="text-center">
                <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">Exploring new territories...</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Navigation Help[1][5] */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Find What You're Looking For</h2>
                
                {/* Search bar */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="flex space-x-3">
                    <Input
                      type="text"
                      placeholder="Search webinars, instructors, topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      iconName="Search"
                      iconPosition="left"
                    >
                      Search
                    </Button>
                  </div>
                </form>

                {/* Popular pages links[5] */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Popular Pages</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {popularPages.map((page, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(page.href)}
                        className="flex items-center space-x-3 p-3 text-left bg-card border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <Icon name={page.icon} size={16} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">{page.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="default"
                  onClick={() => navigate('/')}
                  iconName="Home"
                  iconPosition="left"
                  className="flex-1"
                >
                  Go to Homepage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="flex-1"
                >
                  Go Back
                </Button>
              </div>
            </div>

            {/* Support Options[1][5] */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Need More Help?</h2>
                
                <div className="space-y-4">
                  {/* Contact support */}
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="HelpCircle" size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Our support team is here to help you find what you need
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/support')}
                          iconName="MessageSquare"
                          iconPosition="left"
                          size="sm"
                        >
                          Get Help
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Report broken link */}
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="AlertTriangle" size={24} className="text-warning" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">Report Broken Link</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Help us improve by reporting this broken link
                        </p>
                        <Button
                          variant="outline"
                          onClick={handleReportBrokenLink}
                          iconName="Flag"
                          iconPosition="left"
                          size="sm"
                        >
                          Report Issue
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Site map access */}
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Map" size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">Explore Site Map</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Browse our complete site structure
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => navigate('/sitemap')}
                          iconName="ExternalLink"
                          iconPosition="left"
                          size="sm"
                        >
                          View Site Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Encouraging message with brand personality[5] */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary to-blue-700 rounded-xl text-white">
            <h2 className="text-2xl font-bold mb-4">Keep Learning & Growing!</h2>
            <p className="text-blue-100 mb-6">
              While you're here, why not explore our featured webinars or discover new learning opportunities?
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/browse-webinars')}
              iconName="Search"
              iconPosition="left"
              className="bg-white text-primary hover:bg-blue-50"
            >
              Discover Webinars
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span>© 2025 PeopleSkillTraining. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
