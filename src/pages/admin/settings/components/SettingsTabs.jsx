import React from 'react';
import Icon from '../../../../components/AppIcon';
import { TABS } from '../constants/settingsConfig';

const SettingsTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <nav className="space-y-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsTabs;
