import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const InstructorApproval = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');

  // Mock admin user
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Admin User",
      email: "admin@peopleskilltraining.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock applications data
  const applications = [
    {
      id: 1,
      name: "Dr. Emily Watson",
      email: "emily.watson@email.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      title: "Data Science Expert",
      experience: "8 years",
      expertise: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
      bio: "PhD in Computer Science with 8+ years experience in data science and machine learning. Previously worked at Google and Microsoft, now consulting for startups.",
      education: "PhD Computer Science - Stanford University",
      certifications: ["Google Cloud ML Engineer", "AWS ML Specialist"],
      linkedinUrl: "https://linkedin.com/in/emilywatson",
      portfolioUrl: "https://emilywatson.dev",
      sampleWork: "https://github.com/emilywatson/ml-projects",
      motivation: "I want to share my knowledge and help others break into the data science field through practical, hands-on learning.",
      applicationDate: "2024-11-25T10:30:00Z",
      status: "pending",
      backgroundCheck: "pending",
      credentialsVerified: true,
      adminNotes: ""
    },
    {
      id: 2,
      name: "James Rodriguez",
      email: "james.r@email.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Full-Stack Developer",
      experience: "6 years",
      expertise: ["React", "Node.js", "PostgreSQL", "AWS"],
      bio: "Full-stack developer with experience building scalable web applications. Passionate about teaching and mentoring junior developers.",
      education: "BS Computer Science - UC Berkeley",
      certifications: ["AWS Solutions Architect", "React Certified Developer"],
      linkedinUrl: "https://linkedin.com/in/jamesrodriguez",
      portfolioUrl: "https://jamesrod.dev",
      sampleWork: "https://github.com/jamesrod/portfolio",
      motivation: "I've been mentoring developers for years and want to reach a broader audience through online webinars.",
      applicationDate: "2024-11-20T14:15:00Z",
      status: "pending",
      backgroundCheck: "completed",
      credentialsVerified: true,
      adminNotes: ""
    },
    {
      id: 3,
      name: "Lisa Chen",
      email: "lisa.chen@email.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      title: "UX Design Leader",
      experience: "10 years",
      expertise: ["UX Design", "Design Systems", "Figma", "User Research"],
      bio: "Senior UX Designer with 10 years experience at top tech companies. Led design teams and created user-centered products used by millions.",
      education: "MFA Design - Art Center College of Design",
      certifications: ["Google UX Design Certificate", "Nielsen Norman Group UX Certification"],
      linkedinUrl: "https://linkedin.com/in/lisachen",
      portfolioUrl: "https://lisachen.design",
      sampleWork: "https://behance.net/lisachen",
      motivation: "Design education needs more practical, real-world examples. I want to bridge the gap between theory and practice.",
      applicationDate: "2024-11-18T09:45:00Z",
      status: "approved",
      backgroundCheck: "completed",
      credentialsVerified: true,
      adminNotes: "Excellent portfolio and references. Approved for immediate start.",
      approvedBy: "Admin User",
      approvedDate: "2024-11-19T11:30:00Z"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCheckStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'failed':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleApproveApplication = (applicationId, notes = '') => {
    console.log('Approving application:', applicationId, 'with notes:', notes);
    setShowModal(false);
    // In real app, this would update the application status
  };

  const handleRejectApplication = (applicationId, notes = '') => {
    console.log('Rejecting application:', applicationId, 'with notes:', notes);
    setShowModal(false);
    // In real app, this would update the application status
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const customBreadcrumbs = [
    { label: 'Admin Dashboard', href: '/admin/dashboard' },
    { label: 'Instructor Approval', href: null }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        userRole="admin"
        currentPath="/admin/instructor-approval"
      />

      <AppHeader
        user={user}
        notifications={[]}
        onLogout={handleLogout}
        onNotificationClick={() => {}}
      />

      <main className={`transition-all duration-300 ${
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } lg:pt-0 pt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation
            user={user}
            customBreadcrumbs={customBreadcrumbs}
            className="mb-6"
          />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Instructor Approval</h1>
            <p className="text-text-secondary">Review and approve instructor applications</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-border">
              <nav className="flex space-x-8">
                {[
                  { id: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
                  { id: 'approved', label: 'Approved', count: applications.filter(a => a.status === 'approved').length },
                  { id: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
                  { id: 'all', label: 'All', count: applications.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      filterStatus === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      filterStatus === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-card border border-border rounded-xl p-6 hover-elevate">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={application.avatar}
                      alt={application.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{application.name}</h3>
                      <p className="text-sm text-muted-foreground">{application.title}</p>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                {/* Basic Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Mail" size={14} />
                    <span>{application.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Briefcase" size={14} />
                    <span>{application.experience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>Applied {formatDate(application.applicationDate)}</span>
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1">
                    {application.expertise.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {application.expertise.length > 4 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{application.expertise.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Credentials</span>
                    <div className="flex items-center space-x-1">
                      <Icon
                        name={application.credentialsVerified ? "CheckCircle" : "XCircle"}
                        size={14}
                        className={application.credentialsVerified ? "text-success" : "text-error"}
                      />
                      <span className={application.credentialsVerified ? "text-success" : "text-error"}>
                        {application.credentialsVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Background Check</span>
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const status = getCheckStatusIcon(application.backgroundCheck);
                        return (
                          <>
                            <Icon name={status.icon} size={14} className={status.color} />
                            <span className={status.color}>
                              {application.backgroundCheck.charAt(0).toUpperCase() + application.backgroundCheck.slice(1)}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewApplication(application)}
                    iconName="Eye"
                    iconPosition="left"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  
                  {application.status === 'pending' && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApproveApplication(application.id)}
                        iconName="Check"
                        className="bg-success hover:bg-success/90"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectApplication(application.id)}
                        iconName="X"
                        className="text-error border-error hover:bg-error hover:text-white"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Icon name="UserCheck" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'pending' 
                  ? 'No pending instructor applications at the moment.'
                  : `No ${filterStatus} applications to display.`}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Application Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                iconName="X"
              />
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="flex items-start space-x-4">
                  <Image
                    src={selectedApplication.avatar}
                    alt={selectedApplication.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{selectedApplication.name}</h3>
                    <p className="text-muted-foreground">{selectedApplication.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.email}</p>
                    <div className="mt-2">{getStatusBadge(selectedApplication.status)}</div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Professional Bio</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedApplication.bio}</p>
                </div>

                {/* Experience & Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Experience</h4>
                    <p className="text-muted-foreground">{selectedApplication.experience} in the field</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Education</h4>
                    <p className="text-muted-foreground">{selectedApplication.education}</p>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Technical Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {selectedApplication.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="Award" size={14} className="text-success" />
                        <span className="text-muted-foreground">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Portfolio & References</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Globe" size={14} className="text-muted-foreground" />
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedApplication.portfolioUrl}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Linkedin" size={14} className="text-muted-foreground" />
                      <a
                        href={selectedApplication.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedApplication.linkedinUrl}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Code" size={14} className="text-muted-foreground" />
                      <a
                        href={selectedApplication.sampleWork}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Sample Work
                      </a>
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Teaching Motivation</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedApplication.motivation}</p>
                </div>

                {/* Verification Status */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Verification Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-foreground">Credentials Verified</span>
                      <Icon
                        name={selectedApplication.credentialsVerified ? "CheckCircle" : "XCircle"}
                        size={16}
                        className={selectedApplication.credentialsVerified ? "text-success" : "text-error"}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm text-foreground">Background Check</span>
                      {(() => {
                        const status = getCheckStatusIcon(selectedApplication.backgroundCheck);
                        return <Icon name={status.icon} size={16} className={status.color} />;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Admin Notes</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Add notes about this application..."
                    defaultValue={selectedApplication.adminNotes}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-border flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              
              {selectedApplication.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectApplication(selectedApplication.id)}
                    className="text-error border-error hover:bg-error hover:text-white"
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleApproveApplication(selectedApplication.id)}
                    className="bg-success hover:bg-success/90"
                  >
                    Approve Application
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorApproval;
