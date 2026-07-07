import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ContentOversightTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedWebinars, setSelectedWebinars] = useState([]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "live", label: "Live" },
    { value: "completed", label: "Completed" }
  ];

  const webinars = [
    {
      id: 1,
      title: "Advanced React Patterns and Performance Optimization",
      instructor: "Prof. Michael Chen",
      category: "Technology",
      scheduledDate: "2025-09-05",
      scheduledTime: "14:00",
      duration: "2 hours",
      price: 49.99,
      enrollments: 156,
      status: "pending",
      description: `Comprehensive workshop covering advanced React patterns including render props, higher-order components, and custom hooks.\n\nTopics include performance optimization techniques, code splitting, and best practices for large-scale applications.`,
      resources: ["slides.pdf", "code-examples.zip"],
      submittedAt: "2025-08-28"
    },
    {
      id: 2,
      title: "Digital Marketing Strategy for Small Businesses",
      instructor: "Dr. Emily Rodriguez",
      category: "Marketing",
      scheduledDate: "2025-09-08",
      scheduledTime: "16:00",
      duration: "1.5 hours",
      price: 39.99,
      enrollments: 89,
      status: "approved",
      description: `Learn effective digital marketing strategies tailored for small businesses and startups.\n\nCover social media marketing, content strategy, SEO basics, and budget-friendly advertising techniques.`,
      resources: ["marketing-guide.pdf", "templates.zip"],
      submittedAt: "2025-08-25"
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals with Python",
      instructor: "Dr. Sarah Johnson",
      category: "Technology",
      scheduledDate: "2025-09-12",
      scheduledTime: "10:00",
      duration: "3 hours",
      price: 79.99,
      enrollments: 234,
      status: "live",
      description: `Introduction to machine learning concepts using Python and popular libraries like scikit-learn and pandas.\n\nHands-on exercises with real datasets and practical applications.`,
      resources: ["notebook.ipynb", "datasets.zip", "requirements.txt"],
      submittedAt: "2025-08-20"
    },
    {
      id: 4,
      title: "UX/UI Design Principles for Web Applications",
      instructor: "Alex Thompson",
      category: "Design",
      scheduledDate: "2025-09-15",
      scheduledTime: "13:00",
      duration: "2.5 hours",
      price: 59.99,
      enrollments: 67,
      status: "pending",
      description: `Explore fundamental UX/UI design principles and their application in modern web development.\n\nIncludes wireframing, prototyping, user research methods, and design system creation.`,
      resources: ["design-templates.fig", "wireframe-kit.zip"],
      submittedAt: "2025-08-29"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-error/10 text-error';
      case 'live':
        return 'bg-primary/10 text-primary';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'approved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      case 'live':
        return 'Radio';
      case 'completed':
        return 'Check';
      default:
        return 'Circle';
    }
  };

  const handleApproveWebinar = (webinarId) => {
    console.log("Approving webinar:", webinarId);
    // Implementation for approval
  };

  const handleRejectWebinar = (webinarId) => {
    console.log("Rejecting webinar:", webinarId);
    // Implementation for rejection
  };

  const handleBulkAction = (action) => {
    console.log("Bulk action:", action, "for webinars:", selectedWebinars);
    // Implementation for bulk actions
  };

  const toggleWebinarSelection = (webinarId) => {
    setSelectedWebinars(prev => 
      prev?.includes(webinarId) 
        ? prev?.filter(id => id !== webinarId)
        : [...prev, webinarId]
    );
  };

  const filteredWebinars = webinars?.filter(webinar => {
    const matchesSearch = webinar?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         webinar?.instructor?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === "all" || webinar?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search webinars by title or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedWebinars?.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {selectedWebinars?.length} webinar{selectedWebinars?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('approve')}
                iconName="Check"
                iconPosition="left"
              >
                Approve Selected
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('reject')}
                iconName="X"
                iconPosition="left"
              >
                Reject Selected
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Webinars List */}
      <div className="space-y-4">
        {filteredWebinars?.map((webinar) => (
          <div key={webinar?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={selectedWebinars?.includes(webinar?.id)}
                onChange={() => toggleWebinarSelection(webinar?.id)}
                className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-1">{webinar?.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="User" size={14} />
                        <span>{webinar?.instructor}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Tag" size={14} />
                        <span>{webinar?.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{webinar?.scheduledDate} at {webinar?.scheduledTime}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(webinar?.status)}`}>
                      <Icon name={getStatusIcon(webinar?.status)} size={12} className="mr-1" />
                      {webinar?.status?.charAt(0)?.toUpperCase() + webinar?.status?.slice(1)}
                    </span>
                    
                    {webinar?.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveWebinar(webinar?.id)}
                          iconName="Check"
                          iconPosition="left"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejectWebinar(webinar?.id)}
                          iconName="X"
                          iconPosition="left"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {webinar?.description}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">${webinar?.price}</p>
                    <p className="text-xs text-muted-foreground">Price</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">{webinar?.enrollments}</p>
                    <p className="text-xs text-muted-foreground">Enrollments</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">{webinar?.duration}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">{webinar?.resources?.length}</p>
                    <p className="text-xs text-muted-foreground">Resources</p>
                  </div>
                </div>

                {/* Resources */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Attached Resources:</p>
                  <div className="flex flex-wrap gap-2">
                    {webinar?.resources?.map((resource, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        <Icon name="Paperclip" size={12} className="mr-1" />
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Submitted on {webinar?.submittedAt}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Eye" iconPosition="left">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" iconName="MessageSquare" iconPosition="left">
                      Contact Instructor
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredWebinars?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No webinars found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ContentOversightTab;