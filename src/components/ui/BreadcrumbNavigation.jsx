import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbNavigation = ({ user, customBreadcrumbs = null, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // If custom breadcrumbs are provided, use them
  if (customBreadcrumbs) {
    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
        {customBreadcrumbs?.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            )}
            {crumb?.href ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(crumb?.href)}
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                {crumb?.label}
              </Button>
            ) : (
              <span className="text-foreground font-medium">{crumb?.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Auto-generate breadcrumbs based on current route and user role
  const generateBreadcrumbs = () => {
    const path = location?.pathname;
    const breadcrumbs = [];

    // Always start with dashboard based on user role
    if (user) {
      let dashboardPath = '/attendee-dashboard';
      let dashboardLabel = 'Dashboard';

      switch (user?.role) {
        case 'admin':
          dashboardPath = '/admin-dashboard';
          dashboardLabel = 'Admin Dashboard';
          break;
        case 'instructor':
          dashboardPath = '/instructor-dashboard';
          dashboardLabel = 'Instructor Dashboard';
          break;
        case 'attendee':
        default:
          dashboardPath = '/attendee-dashboard';
          dashboardLabel = 'My Dashboard';
          break;
      }

      // Only add dashboard breadcrumb if we're not currently on it
      if (path !== dashboardPath) {
        breadcrumbs?.push({
          label: dashboardLabel,
          href: dashboardPath
        });
      }
    }

    // Add current page breadcrumb
    switch (path) {
      case '/webinar-details':
        breadcrumbs?.push({
          label: 'Webinar Details',
          href: null // Current page
        });
        break;
      case '/profile':
        breadcrumbs?.push({
          label: 'Profile',
          href: null
        });
        break;
      case '/settings':
        breadcrumbs?.push({
          label: 'Settings',
          href: null
        });
        break;
      default:
        // For dashboard pages, don't show breadcrumbs
        if (path?.includes('dashboard')) {
          return [];
        }
        break;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if no breadcrumbs
  if (breadcrumbs?.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          {crumb?.href ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(crumb?.href)}
              className="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {crumb?.label}
            </Button>
          ) : (
            <span className="text-foreground font-medium">{crumb?.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;