import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  isCollapsed = false, 
  isOpen = false, 
  onToggle = () => {},
  onNavigate = () => {},
  connectionStatus = 'connected'
}) => {
  const [activeItem, setActiveItem] = useState('/executive-overview-dashboard');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Update last updated time every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      id: 'executive-overview',
      label: 'Executive Overview',
      path: '/executive-overview-dashboard',
      icon: 'BarChart3',
      description: 'Strategic dashboard with C-level insights and high-level KPIs'
    },
    {
      id: 'operations-center',
      label: 'Operations Center',
      path: '/real-time-operations-dashboard',
      icon: 'Activity',
      description: 'Real-time monitoring for system health and operational response'
    }
  ];

  const handleItemClick = (item) => {
    setActiveItem(item?.path);
    onNavigate(item?.path);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'connecting':
        return 'Loader2';
      case 'disconnected':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-border z-50
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-60'}
        lg:fixed
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={20} color="white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    LMS Analytics
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Dashboard Hub
                  </p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden lg:flex"
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems?.map((item) => (
              <div key={item?.id} className="relative group">
                <Button
                  variant={activeItem === item?.path ? "default" : "ghost"}
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full justify-start h-12 transition-micro
                    ${isCollapsed ? 'px-3' : 'px-4'}
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={isCollapsed ? '' : 'mr-3'} 
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">
                      {item?.label}
                    </span>
                  )}
                </Button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="
                    absolute left-full top-0 ml-2 px-3 py-2 
                    bg-popover text-popover-foreground text-sm rounded-md
                    shadow-elevation-2 opacity-0 group-hover:opacity-100
                    transition-opacity duration-200 pointer-events-none
                    whitespace-nowrap z-50
                  ">
                    <div className="font-medium">{item?.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item?.description}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Status Bar */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="space-y-3">
                {/* Connection Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getConnectionStatusIcon()} 
                      size={14} 
                      className={`${getConnectionStatusColor()} ${
                        connectionStatus === 'connecting' ? 'animate-spin' : ''
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {connectionStatus === 'connected' ? 'Live Data' : 
                       connectionStatus === 'connecting'? 'Connecting...' : 'Offline'}
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                </div>

                {/* Last Updated */}
                <div className="text-xs text-muted-foreground">
                  Updated: {lastUpdated?.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>

                {/* Data Freshness Indicator */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-1">
                    <div className="bg-success h-1 rounded-full w-4/5 transition-all duration-1000" />
                  </div>
                  <span className="text-xs text-muted-foreground">Fresh</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Icon 
                  name={getConnectionStatusIcon()} 
                  size={16} 
                  className={`${getConnectionStatusColor()} ${
                    connectionStatus === 'connecting' ? 'animate-spin' : ''
                  }`}
                />
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;