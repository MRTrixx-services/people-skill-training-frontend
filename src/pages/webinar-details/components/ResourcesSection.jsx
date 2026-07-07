import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResourcesSection = ({ resources, isEnrolled }) => {
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'FileText';
      case 'ppt': case'pptx':
        return 'Presentation';
      case 'doc': case'docx':
        return 'FileText';
      default:
        return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleDownload = (resource) => {
    if (!isEnrolled) {
      alert('Please enroll in the webinar to access resources');
      return;
    }
    
    // Simulate download
    const link = document.createElement('a');
    link.href = resource?.url;
    link.download = resource?.name;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  if (!resources || resources?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Session Resources
        </h2>
        <span className="text-sm text-muted-foreground">
          {resources?.length} file{resources?.length !== 1 ? 's' : ''}
        </span>
      </div>
      {!isEnrolled && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lock" size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-warning mb-1">
                Enrollment Required
              </h3>
              <p className="text-sm text-warning/80">
                Please enroll in this webinar to access downloadable resources.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {resources?.map((resource, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon
                  name={getFileIcon(resource?.type)}
                  size={20}
                  className="text-primary"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {resource?.name}
                </h3>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span className="uppercase">{resource?.type}</span>
                  <span>•</span>
                  <span>{formatFileSize(resource?.size)}</span>
                  {resource?.description && (
                    <>
                      <span>•</span>
                      <span>{resource?.description}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant={isEnrolled ? "outline" : "ghost"}
              size="sm"
              onClick={() => handleDownload(resource)}
              disabled={!isEnrolled}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Download
            </Button>
          </div>
        ))}
      </div>
      {isEnrolled && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-success">
              All resources are available for download
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesSection;