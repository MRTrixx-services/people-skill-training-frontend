import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';

const RecordingAccessDetail = () => {
  const navigate = useNavigate();
  const { recordingId } = useParams();
  const location = useLocation();
  const { recording: initialRecording, backUrl } = location.state || {};
  
  const [recording, setRecording] = useState(initialRecording);
  const [webinarRecordings, setWebinarRecordings] = useState([]);
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Changed to array for multiple selection
  const [newUserAccessType, setNewUserAccessType] = useState('view');
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [activeTab, setActiveTab] = useState('access');
  const [showUserSegmentModal, setShowUserSegmentModal] = useState(false);
  const [selectedUserForSegments, setSelectedUserForSegments] = useState(null);
  const [userSegmentAccess, setUserSegmentAccess] = useState({});
  const [modalCurrentPage, setModalCurrentPage] = useState(1);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  
  // View users modal states
  const [showViewUsersModal, setShowViewUsersModal] = useState(false);
  const [selectedRecordingForUsers, setSelectedRecordingForUsers] = useState(null);

  const accessTypeOptions = [
    { value: 'view', label: 'View Only - Can watch recording' },
    { value: 'download', label: 'View & Download - Can watch and download' },
    { value: 'admin', label: 'Full Access - Can edit, share, and manage' }
  ];

  const accessLevelOptions = [
    { value: 'public', label: 'Public - Anyone with link can access' },
    { value: 'restricted', label: 'Restricted - Only authorized users' },
    { value: 'private', label: 'Private - No external access' }
  ];

  // Mock internal application users
  const internalUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@university.edu',
      role: 'student',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      role: 'student',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@university.edu',
      role: 'ta',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@university.edu',
      role: 'student',
      department: 'Computer Engineering',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@university.edu',
      role: 'instructor',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 6,
      name: 'Lisa Taylor',
      email: 'lisa.taylor@university.edu',
      role: 'student',
      department: 'Information Systems',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 7,
      name: 'Robert Davis',
      email: 'robert.davis@university.edu',
      role: 'student',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    },
    {
      id: 8,
      name: 'Anna Wilson',
      email: 'anna.wilson@university.edu',
      role: 'student',
      department: 'Information Technology',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      status: 'active'
    }
  ];

  // Mock webinar data
  useEffect(() => {
    if (recording) {
      const mockWebinarRecordings = [
        {
          id: 'rec_001',
          meetingId: 'mtg_12345',
          webinarId: 'webinar_001',
          title: 'Advanced React Patterns - Introduction',
          segmentNumber: 1,
          segmentTitle: 'Introduction & Overview',
          startTime: '2024-12-15T14:00:00Z',
          duration: 1800,
          status: 'available',
          recordingType: 'segment',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop',
          accessLevel: 'restricted',
          authorizedUsers: [
            {
              id: 1,
              email: 'john.smith@university.edu',
              name: 'John Smith',
              role: 'student',
              accessType: 'view',
              addedDate: '2024-12-15T15:00:00Z',
              lastAccessed: '2024-12-16T10:30:00Z'
            },
            {
              id: 2,
              email: 'sarah.johnson@university.edu',
              name: 'Sarah Johnson',
              role: 'student',
              accessType: 'download',
              addedDate: '2024-12-15T15:00:00Z',
              lastAccessed: null
            }
          ]
        },
        {
          id: 'rec_002',
          meetingId: 'mtg_12345',
          webinarId: 'webinar_001',
          title: 'Advanced React Patterns - Main Session',
          segmentNumber: 2,
          segmentTitle: 'Advanced Hooks Deep Dive',
          startTime: '2024-12-15T14:30:00Z',
          duration: 3600,
          status: 'available',
          recordingType: 'segment',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop',
          accessLevel: 'restricted',
          authorizedUsers: [
            {
              id: 1,
              email: 'john.smith@university.edu',
              name: 'John Smith',
              role: 'student',
              accessType: 'view',
              addedDate: '2024-12-15T15:00:00Z',
              lastAccessed: '2024-12-16T10:30:00Z'
            },
            {
              id: 3,
              email: 'mike.wilson@university.edu',
              name: 'Mike Wilson',
              role: 'ta',
              accessType: 'admin',
              addedDate: '2024-12-15T15:00:00Z',
              lastAccessed: '2024-12-17T09:15:00Z'
            }
          ]
        },
        {
          id: 'rec_003',
          meetingId: 'mtg_12345',
          webinarId: 'webinar_001',
          title: 'Advanced React Patterns - Q&A',
          segmentNumber: 3,
          segmentTitle: 'Q&A and Discussion',
          startTime: '2024-12-15T15:30:00Z',
          duration: 1800,
          status: 'available',
          recordingType: 'segment',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop',
          accessLevel: 'public',
          authorizedUsers: []
        }
      ];
      
      setWebinarRecordings(mockWebinarRecordings);
      setSelectedRecordings([recording.id]);
    }
  }, [recording]);

  // Get filtered internal users (not already having access)
  const getAvailableUsers = () => {
    const existingUserEmails = new Set();
    webinarRecordings.forEach(rec => {
      rec.authorizedUsers.forEach(user => {
        existingUserEmails.add(user.email);
      });
    });

    return internalUsers.filter(user => 
      !existingUserEmails.has(user.email) &&
      (user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
       user.department.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );
  };

  // Get all unique users with their segment access for Access Overview
  const getAllUsersWithSegmentAccess = () => {
    const usersMap = new Map();
    
    webinarRecordings.forEach(rec => {
      rec.authorizedUsers.forEach(user => {
        if (!usersMap.has(user.email)) {
          usersMap.set(user.email, {
            ...user,
            segmentAccess: new Map()
          });
        }
        const userObj = usersMap.get(user.email);
        userObj.segmentAccess.set(rec.id, {
          segmentNumber: rec.segmentNumber,
          segmentTitle: rec.segmentTitle,
          accessType: user.accessType,
          hasAccess: true,
          isPublic: false
        });
      });

      // Add public access for all users who don't have explicit access
      if (rec.accessLevel === 'public') {
        internalUsers.forEach(user => {
          if (!usersMap.has(user.email)) {
            usersMap.set(user.email, {
              ...user,
              segmentAccess: new Map()
            });
          }
          const userObj = usersMap.get(user.email);
          if (!userObj.segmentAccess.has(rec.id)) {
            userObj.segmentAccess.set(rec.id, {
              segmentNumber: rec.segmentNumber,
              segmentTitle: rec.segmentTitle,
              accessType: 'public',
              hasAccess: true,
              isPublic: true
            });
          }
        });
      }
    });
    
    return Array.from(usersMap.values());
  };

  // Handle multiple user selection
  const handleUserSelection = (userId) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    const availableUsers = getAvailableUsers();
    if (selectedUserIds.length === availableUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(availableUsers.map(user => user.id));
    }
  };

  // Add multiple users to selected segments
  const handleAddUsersToSegments = () => {
    if (selectedUserIds.length === 0) {
      alert('Please select at least one user');
      return;
    }

    if (selectedSegments.length === 0) {
      alert('Please select at least one segment');
      return;
    }

    setIsAddingUser(true);
    
    const selectedUsers = internalUsers.filter(u => selectedUserIds.includes(u.id));
    
    // Add users to selected segments
    setWebinarRecordings(prev => prev.map(rec => {
      if (selectedSegments.includes(rec.id)) {
        const newUsers = selectedUsers
          .filter(user => !rec.authorizedUsers.find(u => u.email === user.email))
          .map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            accessType: newUserAccessType,
            addedDate: new Date().toISOString(),
            lastAccessed: null
          }));
        
        return {
          ...rec,
          authorizedUsers: [...rec.authorizedUsers, ...newUsers]
        };
      }
      return rec;
    }));

    // Update current recording if it was selected
    if (selectedSegments.includes(recording.id)) {
      setRecording(prev => {
        const newUsers = selectedUsers
          .filter(user => !prev.authorizedUsers.find(u => u.email === user.email))
          .map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            accessType: newUserAccessType,
            addedDate: new Date().toISOString(),
            lastAccessed: null
          }));
        
        return {
          ...prev,
          authorizedUsers: [...prev.authorizedUsers, ...newUsers]
        };
      });
    }

    const segmentNames = webinarRecordings
      .filter(rec => selectedSegments.includes(rec.id))
      .map(rec => `Segment ${rec.segmentNumber}`)
      .join(', ');

    alert(`Access granted to ${selectedUsers.length} user(s) for ${segmentNames} with ${newUserAccessType} permissions`);
    
    setSelectedUserIds([]);
    setNewUserAccessType('view');
    setSelectedSegments([]);
    setShowAddUserForm(false);
    setIsAddingUser(false);
  };

  // View users from specific recording
  const handleViewRecordingUsers = (recording) => {
    setSelectedRecordingForUsers(recording);
    setShowViewUsersModal(true);
  };

  // Delete selected segments
  const handleDeleteSegments = () => {
    if (selectedRecordings.length === 0) {
      alert('Please select segments to delete');
      return;
    }

    const segmentTitles = webinarRecordings
      .filter(rec => selectedRecordings.includes(rec.id))
      .map(rec => `Segment ${rec.segmentNumber}: ${rec.segmentTitle}`)
      .join('\n- ');

    const confirmDelete = confirm(
      `Are you sure you want to permanently delete the following segments?\n\n- ${segmentTitles}\n\nThis action cannot be undone and will remove access for all users.`
    );

    if (confirmDelete) {
      const updatedRecordings = webinarRecordings.filter(rec => !selectedRecordings.includes(rec.id));
      const reorderedRecordings = updatedRecordings.map((rec, index) => ({
        ...rec,
        segmentNumber: index + 1
      }));

      setWebinarRecordings(reorderedRecordings);
      setSelectedRecordings([]);

      if (selectedRecordings.includes(recording.id)) {
        if (reorderedRecordings.length > 0) {
          setRecording(reorderedRecordings[0]);
          setActiveTab('access');
        } else {
          alert('All segments deleted. Returning to recordings list.');
          navigate(backUrl || '/instructor/recording-management');
          return;
        }
      }

      alert(`${selectedRecordings.length} segment(s) deleted successfully`);
    }
  };

  // Handle segment access for user in current recording
  const handleManageUserSegmentAccess = (user) => {
    const userAccess = {};
    webinarRecordings.forEach(rec => {
      const userInSegment = rec.authorizedUsers.find(u => u.email === user.email);
      userAccess[rec.id] = {
        hasAccess: !!userInSegment || rec.accessLevel === 'public',
        accessType: userInSegment?.accessType || (rec.accessLevel === 'public' ? 'public' : null),
        isPublic: rec.accessLevel === 'public'
      };
    });

    setSelectedUserForSegments(user);
    setUserSegmentAccess(userAccess);
    setShowUserSegmentModal(true);
  };

  // Update user's segment access
  const handleUpdateUserSegmentAccess = (segmentId, hasAccess, accessType = 'view') => {
    setUserSegmentAccess(prev => ({
      ...prev,
      [segmentId]: {
        ...prev[segmentId],
        hasAccess,
        accessType: hasAccess ? accessType : null
      }
    }));
  };

  // Save user's segment access changes
  const handleSaveUserSegmentAccess = () => {
    if (!selectedUserForSegments) return;

    const userEmail = selectedUserForSegments.email;
    
    setWebinarRecordings(prev => prev.map(rec => {
      const segmentAccess = userSegmentAccess[rec.id];
      const currentUser = rec.authorizedUsers.find(u => u.email === userEmail);
      
      if (segmentAccess?.hasAccess && !segmentAccess.isPublic) {
        if (currentUser) {
          return {
            ...rec,
            authorizedUsers: rec.authorizedUsers.map(u => 
              u.email === userEmail 
                ? { ...u, accessType: segmentAccess.accessType }
                : u
            )
          };
        } else {
          return {
            ...rec,
            authorizedUsers: [...rec.authorizedUsers, {
              ...selectedUserForSegments,
              accessType: segmentAccess.accessType
            }]
          };
        }
      } else {
        return {
          ...rec,
          authorizedUsers: rec.authorizedUsers.filter(u => u.email !== userEmail)
        };
      }
    }));

    const currentSegmentAccess = userSegmentAccess[recording.id];
    if (currentSegmentAccess?.hasAccess && !currentSegmentAccess.isPublic) {
      setRecording(prev => {
        const currentUser = prev.authorizedUsers.find(u => u.email === userEmail);
        if (currentUser) {
          return {
            ...prev,
            authorizedUsers: prev.authorizedUsers.map(u => 
              u.email === userEmail 
                ? { ...u, accessType: currentSegmentAccess.accessType }
                : u
            )
          };
        } else {
          return {
            ...prev,
            authorizedUsers: [...prev.authorizedUsers, {
              ...selectedUserForSegments,
              accessType: currentSegmentAccess.accessType
            }]
          };
        }
      });
    } else {
      setRecording(prev => ({
        ...prev,
        authorizedUsers: prev.authorizedUsers.filter(u => u.email !== userEmail)
      }));
    }

    setShowUserSegmentModal(false);
    setSelectedUserForSegments(null);
    setUserSegmentAccess({});
    
    alert(`Segment access updated for ${selectedUserForSegments.name}`);
  };

  // Helper functions
  const getAccessTypeLabel = (accessType) => {
    if (!accessType || accessType === 'public') return accessType === 'public' ? 'Public' : 'No Access';
    const option = accessTypeOptions.find(opt => opt.value === accessType);
    return option ? option.label.split(' - ')[0] : accessType;
  };

  const getAccessTypeColor = (accessType) => {
    const colors = {
      view: 'bg-blue-100 text-blue-800',
      download: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
      public: 'bg-emerald-100 text-emerald-800'
    };
    return colors[accessType] || 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelBadge = (accessLevel) => {
    const styles = {
      public: 'bg-blue-100 text-blue-800 border-blue-200',
      restricted: 'bg-orange-100 text-orange-800 border-orange-200',
      private: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      public: 'Globe',
      restricted: 'Users',
      private: 'Lock'
    };

    return (
      <div className="flex items-center space-x-1">
        <Icon name={icons[accessLevel]} size={12} />
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[accessLevel]}`}>
          {accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
        </span>
      </div>
    );
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const handleSelectRecording = (recordingId) => {
    setSelectedRecordings(prev => 
      prev.includes(recordingId) 
        ? prev.filter(id => id !== recordingId)
        : [...prev, recordingId]
    );
  };

  const handleSelectAllRecordings = () => {
    if (selectedRecordings.length === webinarRecordings.length) {
      setSelectedRecordings([]);
    } else {
      setSelectedRecordings(webinarRecordings.map(r => r.id));
    }
  };

  // Pagination logic
  const filteredAllUsers = getAllUsersWithSegmentAccess().filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAllUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredAllUsers.slice(startIndex, startIndex + usersPerPage);

  if (!recording) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Recording not found</h2>
          <p className="text-muted-foreground mb-4">The recording you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(backUrl || '/instructor/recording-management')}>
            Back to Recordings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 xl:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(backUrl || '/instructor/recording-management')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Recordings
            </Button>
          </div>
          
          <div className="flex items-start space-x-6">
            <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={recording.thumbnail}
                alt={recording.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{recording.title}</h1>
              <p className="text-muted-foreground mb-4">{recording.topic || recording.segmentTitle}</p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(recording.startTime).toLocaleDateString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(recording.duration)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {recording.participants} participants
                </span>
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  Segment {recording.segmentNumber} of {webinarRecordings.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {['all', 'access'].map((tab) => {
              const labels = {
                all: 'All Webinar Recordings',
                access: 'Access Overview'
              };
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {activeTab === 'all' ? 'Segment Management' : 'User Management'}
              </h3>
              
              {activeTab === 'all' ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Selected: {selectedRecordings.length} of {webinarRecordings.length} segments
                  </div>
                  
                  {selectedRecordings.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleDeleteSegments}
                      iconName="Trash2"
                      iconPosition="left"
                      className="w-full text-error border-error hover:bg-error hover:text-white"
                    >
                      Delete Selected ({selectedRecordings.length})
                    </Button>
                  )}
                  
                  <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                    <p className="mb-2">⚠️ Deleting segments will:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Permanently remove recordings</li>
                      <li>Remove access for all users</li>
                      <li>Reorder remaining segments</li>
                      <li>Cannot be undone</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    iconName="UserPlus"
                    iconPosition="left"
                    className="w-full"
                  >
                    Add Users to Segments
                  </Button>

                  {showAddUserForm && (
                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Search Users
                        </label>
                        <Input
                          type="text"
                          placeholder="Search by name, email, or department..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          iconName="Search"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-foreground">
                            Select Users ({selectedUserIds.length} selected)
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSelectAllUsers}
                            className="text-xs"
                          >
                            {selectedUserIds.length === getAvailableUsers().length ? 'Deselect All' : 'Select All'}
                          </Button>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-2 border border-border rounded-lg p-2">
                          {getAvailableUsers().map((user) => (
                            <label key={user.id} className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                              selectedUserIds.includes(user.id) ? 'bg-primary/10' : 'hover:bg-muted'
                            }`}>
                              <input
                                type="checkbox"
                                checked={selectedUserIds.includes(user.id)}
                                onChange={() => handleUserSelection(user.id)}
                                className="rounded border-border"
                              />
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                <p className="text-xs text-muted-foreground">{user.role} • {user.department}</p>
                              </div>
                            </label>
                          ))}
                          {getAvailableUsers().length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No available users found
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Select
                        options={accessTypeOptions}
                        value={newUserAccessType}
                        onChange={setNewUserAccessType}
                        label="Access Type"
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Grant Access to Segments:
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {webinarRecordings.map((rec) => (
                            <label key={rec.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedSegments.includes(rec.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSegments(prev => [...prev, rec.id]);
                                  } else {
                                    setSelectedSegments(prev => prev.filter(id => id !== rec.id));
                                  }
                                }}
                                className="rounded border-border"
                              />
                              <span className="text-sm text-foreground">
                                Segment {rec.segmentNumber}: {rec.segmentTitle}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          onClick={handleAddUsersToSegments}
                          loading={isAddingUser}
                          className="flex-1"
                        >
                          Add {selectedUserIds.length} User(s)
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setShowAddUserForm(false);
                            setSelectedUserIds([]);
                            setNewUserAccessType('view');
                            setSelectedSegments([]);
                            setUserSearchTerm('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Total Users: {getAllUsersWithSegmentAccess().length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Available Users: {getAvailableUsers().length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'all' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    All Webinar Recordings ({webinarRecordings.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllRecordings}
                      iconName="CheckSquare"
                    >
                      {selectedRecordings.length === webinarRecordings.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {webinarRecordings.map((rec) => (
                    <div key={rec.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      selectedRecordings.includes(rec.id) ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedRecordings.includes(rec.id)}
                          onChange={() => handleSelectRecording(rec.id)}
                          className="rounded border-border"
                        />
                        <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={rec.thumbnail}
                            alt={rec.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            Segment {rec.segmentNumber}: {rec.segmentTitle}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDuration(rec.duration)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getAccessLevelBadge(rec.accessLevel)}
                            <span className="text-xs text-muted-foreground">
                              {rec.authorizedUsers.length} authorized users
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRecordingUsers(rec)}
                          iconName="Eye"
                        >
                          View Users
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Delete Segment ${rec.segmentNumber}: ${rec.segmentTitle}? This action cannot be undone.`)) {
                              setSelectedRecordings([rec.id]);
                              handleDeleteSegments();
                            }
                          }}
                          iconName="Trash2"
                          className="text-error hover:bg-error hover:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Access Overview - All Users ({filteredAllUsers.length})
                  </h3>
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="w-64"
                    iconName="Search"
                  />
                </div>

                <div className="space-y-4">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <div key={user.email} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">{user.role} • {user.department}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Access to {user.segmentAccess.size} of {webinarRecordings.length} segments
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManageUserSegmentAccess(user)}
                              iconName="Settings"
                            >
                              Manage Access
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {webinarRecordings.map((rec) => {
                            const segmentAccess = user.segmentAccess.get(rec.id);
                            const hasAccess = segmentAccess?.hasAccess || false;
                            const isPublic = segmentAccess?.isPublic || rec.accessLevel === 'public';
                            
                            return (
                              <div
                                key={rec.id}
                                className={`p-3 rounded-lg border transition-colors ${
                                  hasAccess 
                                    ? isPublic 
                                      ? 'border-emerald-200 bg-emerald-50'
                                      : 'border-green-200 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-foreground">
                                    Segment {rec.segmentNumber}
                                  </span>
                                  <Icon 
                                    name={hasAccess ? "CheckCircle" : "Circle"} 
                                    size={16} 
                                    color={hasAccess ? "#10B981" : "#9CA3AF"}
                                  />
                                </div>
                                
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {rec.segmentTitle}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  {hasAccess && (
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      isPublic 
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : getAccessTypeColor(segmentAccess?.accessType)
                                    }`}>
                                      {isPublic ? 'Public' : getAccessTypeLabel(segmentAccess?.accessType)}
                                    </span>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {formatDuration(rec.duration)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'No users match your search.' : 'No users have access to any segments yet.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredAllUsers.length)} of {filteredAllUsers.length} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        iconName="ChevronLeft"
                      />
                      <span className="text-sm text-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        iconName="ChevronRight"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* View Recording Users Modal */}
{showViewUsersModal && selectedRecordingForUsers && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Users with Access - Segment {selectedRecordingForUsers.segmentNumber}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowViewUsersModal(false);
            setSelectedRecordingForUsers(null);
            setModalCurrentPage(1); // Reset modal pagination
          }}
          iconName="X"
        />
      </div>

      <div className="mb-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
            <Image
              src={selectedRecordingForUsers.thumbnail}
              alt={selectedRecordingForUsers.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-foreground">{selectedRecordingForUsers.segmentTitle}</p>
            <p className="text-sm text-muted-foreground">{formatDuration(selectedRecordingForUsers.duration)}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getAccessLevelBadge(selectedRecordingForUsers.accessLevel)}
              <span className="text-xs text-muted-foreground">
                {selectedRecordingForUsers.authorizedUsers.length} users
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {(() => {
          const modalUsersPerPage = 2;
          const modalTotalPages = Math.ceil(selectedRecordingForUsers.authorizedUsers.length / modalUsersPerPage);
          const modalStartIndex = (modalCurrentPage - 1) * modalUsersPerPage;
          const modalPaginatedUsers = selectedRecordingForUsers.authorizedUsers.slice(
            modalStartIndex, 
            modalStartIndex + modalUsersPerPage
          );

          return (
            <>
              {modalPaginatedUsers.length > 0 ? (
                modalPaginatedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Added {new Date(user.addedDate).toLocaleDateString()}
                          {user.lastAccessed && ` • Last accessed ${new Date(user.lastAccessed).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getAccessTypeColor(user.accessType)}`}>
                        {getAccessTypeLabel(user.accessType)}
                      </span>
                      {/* Delete user from this recording */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Remove ${user.name} from this recording?`)) {
                            // Update the recording's authorized users
                            setWebinarRecordings(prev => prev.map(rec => 
                              rec.id === selectedRecordingForUsers.id 
                                ? { ...rec, authorizedUsers: rec.authorizedUsers.filter(u => u.id !== user.id) }
                                : rec
                            ));

                            // Update current recording if it matches
                            if (selectedRecordingForUsers.id === recording.id) {
                              setRecording(prev => ({
                                ...prev,
                                authorizedUsers: prev.authorizedUsers.filter(u => u.id !== user.id)
                              }));
                            }

                            // Update selected recording for users to reflect changes in modal
                            setSelectedRecordingForUsers(prev => ({
                              ...prev,
                              authorizedUsers: prev.authorizedUsers.filter(u => u.id !== user.id)
                            }));

                            // Adjust pagination if needed
                            const remainingUsers = selectedRecordingForUsers.authorizedUsers.length - 1;
                            const newTotalPages = Math.ceil(remainingUsers / modalUsersPerPage);
                            if (modalCurrentPage > newTotalPages && newTotalPages > 0) {
                              setModalCurrentPage(newTotalPages);
                            }

                            alert(`${user.name} removed from this recording`);
                          }
                        }}
                        iconName="Trash2"
                        className="text-error hover:bg-error hover:text-white"
                        title={`Remove ${user.name}`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {selectedRecordingForUsers.accessLevel === 'public' 
                      ? 'This recording has public access - all users can view it'
                      : 'No users have specific access to this recording'
                    }
                  </p>
                </div>
              )}

              {/* Modal Pagination */}
              {modalTotalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {modalStartIndex + 1} to {Math.min(modalStartIndex + modalUsersPerPage, selectedRecordingForUsers.authorizedUsers.length)} of {selectedRecordingForUsers.authorizedUsers.length} users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModalCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={modalCurrentPage === 1}
                      iconName="ChevronLeft"
                    />
                    <span className="text-sm text-foreground">
                      {modalCurrentPage} / {modalTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModalCurrentPage(prev => Math.min(prev + 1, modalTotalPages))}
                      disabled={modalCurrentPage === modalTotalPages}
                      iconName="ChevronRight"
                    />
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t border-border">
        <Button
          variant="default"
          onClick={() => {
            setShowViewUsersModal(false);
            setSelectedRecordingForUsers(null);
            setModalCurrentPage(1);
          }}
        >
          Close
        </Button>
      </div>
    </div>
  </div>
)}

        {/* User Segment Access Modal */}
        {showUserSegmentModal && selectedUserForSegments && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Manage Segment Access - {selectedUserForSegments.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowUserSegmentModal(false);
                    setSelectedUserForSegments(null);
                    setUserSegmentAccess({});
                  }}
                  iconName="X"
                />
              </div>

              <div className="space-y-4">
                {webinarRecordings.map((rec) => {
                  const segmentAccess = userSegmentAccess[rec.id] || {};
                  const isPublic = segmentAccess.isPublic;
                  
                  return (
                    <div key={rec.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={rec.thumbnail}
                            alt={rec.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Segment {rec.segmentNumber}: {rec.segmentTitle}
                          </p>
                          <p className="text-sm text-muted-foreground">{formatDuration(rec.duration)}</p>
                          {isPublic && (
                            <span className="text-xs text-emerald-600">Public Access Available</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {!isPublic && (
                          <>
                            <input
                              type="checkbox"
                              checked={segmentAccess.hasAccess || false}
                              onChange={(e) => handleUpdateUserSegmentAccess(rec.id, e.target.checked, 'view')}
                              className="rounded border-border"
                            />
                            <Select
                              options={accessTypeOptions.map(opt => ({ value: opt.value, label: opt.label.split(' - ')[0] }))}
                              value={segmentAccess.accessType || 'view'}
                              onChange={(accessType) => handleUpdateUserSegmentAccess(rec.id, true, accessType)}
                              disabled={!segmentAccess.hasAccess}
                              className="w-32"
                            />
                          </>
                        )}
                        {isPublic && (
                          <span className="text-sm text-emerald-600">Public Access</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowUserSegmentModal(false);
                    setSelectedUserForSegments(null);
                    setUserSegmentAccess({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveUserSegmentAccess}
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingAccessDetail;
