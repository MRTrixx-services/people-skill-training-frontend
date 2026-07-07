import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResourceCard = ({ resource, onDownload, viewMode = 'grid' }) => {
  const getFileIcon = (type) => {
    const icons = {
      pdf: { name: 'FileText', color: 'text-red-500', bg: 'bg-red-50' },
      zip: { name: 'Archive', color: 'text-purple-500', bg: 'bg-purple-50' },
      doc: { name: 'FileText', color: 'text-blue-500', bg: 'bg-blue-50' },
      docx: { name: 'FileText', color: 'text-blue-500', bg: 'bg-blue-50' },
      xls: { name: 'Grid3x3', color: 'text-green-500', bg: 'bg-green-50' },
      xlsx: { name: 'Grid3x3', color: 'text-green-500', bg: 'bg-green-50' },
      ppt: { name: 'Presentation', color: 'text-orange-500', bg: 'bg-orange-50' },
      pptx: { name: 'Presentation', color: 'text-orange-500', bg: 'bg-orange-50' }
    };
    return icons[type.toLowerCase()] || { name: 'File', color: 'text-gray-500', bg: 'bg-gray-50' };
  };

  const fileIcon = getFileIcon(resource.type);

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg ${fileIcon.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon name={fileIcon.name} size={20} className={fileIcon.color} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate mb-1">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                  {resource.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>by {resource.instructor}</span>
                  <span>•</span>
                  <span>{resource.size}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Icon name="Star" size={12} className="text-yellow-500 mr-1" />
                    <span>{resource.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Icon name="Download" size={12} className="mr-1" />
                    <span>{resource.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(resource)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* File Icon */}
        <div className={`w-12 h-12 rounded-lg ${fileIcon.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon name={fileIcon.name} size={24} className={fileIcon.color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
            {resource.title}
          </h3>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {resource.description}
          </p>

          {/* Instructor & Stats */}
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-xs text-muted-foreground">by {resource.instructor}</span>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-yellow-500" />
              <span className="text-xs text-muted-foreground">{resource.rating}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {resource.tags?.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span>{resource.size}</span>
              <div className="flex items-center space-x-1">
                <Icon name="Download" size={12} />
                <span>{resource.downloads.toLocaleString()}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(resource)}
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
