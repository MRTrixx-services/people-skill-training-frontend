import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';

const RecordingManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
    { value: 'archived', label: 'Archived' }
  ];

  const dateFilterOptions = [
    { value: '', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const itemsPerPageOptions = [
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' }
  ];

  // Enhanced recording data with access control
  const recordings = [
    {
      id: 'rec_001',
      meetingId: 'mtg_12345',
      title: 'Advanced React Patterns and Performance Optimization',
      hostName: 'Dr. Michael Chen',
      startTime: '2024-12-15T14:00:00Z',
      duration: 7200,
      status: 'available',
      fileSize: 1048576000,
      recordingCount: 3,
      participants: 47,
      downloadUrl: 'https://zoom.us/rec/download/xyz123',
      playUrl: 'https://zoom.us/rec/play/xyz123',
      shareUrl: 'https://zoom.us/rec/share/xyz123',
      isPasswordProtected: true,
      transcriptAvailable: true,
      chatFileAvailable: true,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop',
      topic: 'Web Development Masterclass',
      accessLevel: 'restricted', // public, restricted, private
      authorizedUsers: [
        {
          id: 1,
          email: 'john.smith@university.edu',
          name: 'John Smith',
          role: 'student',
          accessType: 'view', // view, download, admin
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
      ],
      totalViews: 47,
      totalDownloads: 12
    },
    {
      id: 'rec_002',
      meetingId: 'mtg_12346',
      title: 'JavaScript ES2024 New Features',
      hostName: 'Dr. Michael Chen',
      startTime: '2024-12-18T13:00:00Z',
      duration: 5400,
      status: 'processing',
      fileSize: 0,
      recordingCount: 0,
      participants: 32,
      downloadUrl: null,
      playUrl: null,
      shareUrl: null,
      isPasswordProtected: false,
      transcriptAvailable: false,
      chatFileAvailable: false,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=100&h=60&fit=crop',
      topic: 'JavaScript Advanced Concepts',
      accessLevel: 'public',
      authorizedUsers: [],
      totalViews: 0,
      totalDownloads: 0
    },
    {
      id: 'rec_003',
      meetingId: 'mtg_12347',
      title: 'Node.js Performance Optimization',
      hostName: 'Dr. Michael Chen',
      startTime: '2024-11-28T15:00:00Z',
      duration: 6300,
      status: 'available',
      fileSize: 892743680,
      recordingCount: 2,
      participants: 35,
      downloadUrl: 'https://zoom.us/rec/download/abc456',
      playUrl: 'https://zoom.us/rec/play/abc456',
      shareUrl: 'https://zoom.us/rec/share/abc456',
      isPasswordProtected: false,
      transcriptAvailable: true,
      chatFileAvailable: false,
      thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=100&h=60&fit=crop',
      topic: 'Backend Development',
      accessLevel: 'private',
      authorizedUsers: [
        {
          id: 4,
          email: 'admin@university.edu',
          name: 'Dr. Michael Chen',
          role: 'instructor',
          accessType: 'admin',
          addedDate: '2024-11-28T15:00:00Z',
          lastAccessed: '2024-12-01T14:20:00Z'
        }
      ],
      totalViews: 35,
      totalDownloads: 8
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const icons = {
      available: 'CheckCircle',
      processing: 'Clock',
      failed: 'XCircle',
      archived: 'Archive'
    };

    return (
      <div className="flex items-center space-x-2">
        <Icon name={icons[status]} size={14} color={status === 'available' ? '#10B981' : status === 'processing' ? '#F59E0B' : '#EF4444'} />
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  const getAccessBadge = (accessLevel) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Filter and sort recordings
  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || recording.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const recordingDate = new Date(recording.startTime);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = recordingDate.toDateString() === now.toDateString();
          break;
        case 'this-week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = recordingDate >= weekStart && recordingDate <= weekEnd;
          break;
        case 'this-month':
          matchesDate = recordingDate.getMonth() === now.getMonth() && 
                       recordingDate.getFullYear() === now.getFullYear();
          break;
        case 'last-month':
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          matchesDate = recordingDate.getMonth() === lastMonth.getMonth() && 
                       recordingDate.getFullYear() === lastMonth.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedRecordings = filteredRecordings.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.startTime);
        bValue = new Date(b.startTime);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'duration':
        aValue = a.duration;
        bValue = b.duration;
        break;
      case 'size':
        aValue = a.fileSize;
        bValue = b.fileSize;
        break;
      case 'participants':
        aValue = a.participants;
        bValue = b.participants;
        break;
      case 'access':
        aValue = a.authorizedUsers.length;
        bValue = b.authorizedUsers.length;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedRecordings.length / parseInt(itemsPerPage));
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
  const paginatedRecordings = sortedRecordings.slice(startIndex, startIndex + parseInt(itemsPerPage));

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectRecording = (recordingId) => {
    setSelectedRecordings(prev => 
      prev.includes(recordingId) 
        ? prev.filter(id => id !== recordingId)
        : [...prev, recordingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecordings.length === paginatedRecordings.length) {
      setSelectedRecordings([]);
    } else {
      setSelectedRecordings(paginatedRecordings.map(r => r.id));
    }
  };

  const handleManageAccess = (recording) => {
    // Navigate to recording access management page
    navigate(`/instructor/recording-management/${recording.id}`, {
      state: {
        recording: recording,
        backUrl: '/instructor/recording-management'
      }
    });
  };

  const handlePlayRecording = (recording) => {
    if (recording.playUrl) {
      window.open(recording.playUrl, '_blank');
    }
  };

  const getTotalStorage = () => {
    return recordings.reduce((total, recording) => total + recording.fileSize, 0);
  };

  const getAvailableRecordings = () => {
    return recordings.filter(r => r.status === 'available').length;
  };

  const getTotalAuthorizedUsers = () => {
    return recordings.reduce((total, recording) => total + recording.authorizedUsers.length, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Container for 4K displays */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 xl:py-12">
        {/* Header Section */}
        <div className="mb-8 xl:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-2">
                Recording Access Management
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg xl:text-xl">
                Manage access permissions for your Zoom cloud recordings
              </p>
            </div>
            
            {/* Access Summary */}
            <div className="mt-6 lg:mt-0">
              <div className="bg-card border border-border rounded-lg p-4 xl:p-6">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl xl:text-3xl font-bold text-primary">{getAvailableRecordings()}</p>
                    <p className="text-xs xl:text-sm text-muted-foreground">Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl xl:text-3xl font-bold text-foreground">{getTotalAuthorizedUsers()}</p>
                    <p className="text-xs xl:text-sm text-muted-foreground">Authorized Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl xl:text-3xl font-bold text-foreground">{formatFileSize(getTotalStorage())}</p>
                    <p className="text-xs xl:text-sm text-muted-foreground">Total Storage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 xl:p-8 mb-6 xl:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 xl:gap-6">
            <div className="flex flex-col sm:flex-row gap-4 xl:gap-6">
              {selectedRecordings.length > 0 && (
                <div className="flex gap-2 xl:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Bulk access management
                      navigate('/instructor/bulk-access-management', {
                        state: { selectedRecordings }
                      });
                    }}
                    iconName="UserPlus"
                    iconPosition="left"
                    size="sm"
                    className="xl:text-base"
                  >
                    Manage Access ({selectedRecordings.length})
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 xl:gap-6 w-full lg:w-auto">
              <Input
                type="text"
                placeholder="Search recordings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 lg:w-64 xl:w-72 xl:text-base"
                iconName="Search"
              />
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full sm:w-36 xl:w-40 xl:text-base"
              />
              <Select
                options={dateFilterOptions}
                value={dateFilter}
                onChange={setDateFilter}
                className="w-full sm:w-36 xl:w-40 xl:text-base"
              />
            </div>
          </div>
        </div>

        {/* Recordings Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 xl:px-8 py-4 xl:py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg xl:text-xl font-semibold text-foreground">
                {filteredRecordings.length} recording(s)
              </h3>
              <Select
                options={itemsPerPageOptions}
                value={itemsPerPage}
                onChange={setItemsPerPage}
                className="xl:text-base"
              />
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRecordings.length === paginatedRecordings.length && paginatedRecordings.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left whitespace-nowrap min-w-[300px]">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center space-x-1 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                    >
                      <span>Recording</span>
                      {sortBy === 'title' && (
                        <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left whitespace-nowrap min-w-[120px]">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center space-x-1 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                    >
                      <span>Date & Time</span>
                      {sortBy === 'date' && (
                        <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left whitespace-nowrap min-w-[100px]">
                    <button
                      onClick={() => handleSort('duration')}
                      className="flex items-center space-x-1 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                    >
                      <span>Duration</span>
                      {sortBy === 'duration' && (
                        <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                    Access Level
                  </th>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left whitespace-nowrap min-w-[120px]">
                    <button
                      onClick={() => handleSort('access')}
                      className="flex items-center space-x-1 text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground"
                    >
                      <span>Authorized Users</span>
                      {sortBy === 'access' && (
                        <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left whitespace-nowrap min-w-[100px]">
                    Usage Stats
                  </th>
                  <th className="px-6 xl:px-8 py-3 xl:py-4 text-left text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap min-w-[180px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedRecordings.map((recording) => (
                  <tr key={recording.id} className="hover:bg-muted/50">
                    <td className="px-6 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRecordings.includes(recording.id)}
                        onChange={() => handleSelectRecording(recording.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-6">
                      <div className="flex items-center space-x-3 min-w-[300px]">
                        <div className="w-16 h-10 xl:w-20 xl:h-12 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={recording.thumbnail}
                            alt={recording.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm xl:text-base font-medium text-foreground line-clamp-2">
                            {recording.title}
                          </div>
                          <div className="text-xs xl:text-sm text-muted-foreground mt-1">
                            {recording.topic}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                      <div className="text-sm xl:text-base text-foreground">{formatDate(recording.startTime)}</div>
                      <div className="text-xs xl:text-sm text-muted-foreground">{formatTime(recording.startTime)}</div>
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                      <div className="text-sm xl:text-base text-foreground">
                        {formatDuration(recording.duration)}
                      </div>
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                      {getAccessBadge(recording.accessLevel)}
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                      <div className="text-sm xl:text-base text-foreground">
                        {recording.authorizedUsers.length} users
                      </div>
                      {recording.authorizedUsers.length > 0 && (
                        <div className="flex -space-x-1 mt-1">
                          {recording.authorizedUsers.slice(0, 3).map((user, index) => (
                            <div
                              key={user.id}
                              className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs border-2 border-background"
                              title={user.name}
                            >
                              {user.name.charAt(0)}
                            </div>
                          ))}
                          {recording.authorizedUsers.length > 3 && (
                            <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs border-2 border-background">
                              +{recording.authorizedUsers.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                      <div className="text-sm xl:text-base text-foreground">
                        {recording.totalViews} views
                      </div>
                      <div className="text-xs xl:text-sm text-muted-foreground">
                        {recording.totalDownloads} downloads
                      </div>
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleManageAccess(recording)}
                          iconName="UserCog"
                          title="Manage access"
                          className="xl:text-base"
                        >
                          Manage Access
                        </Button>
                        {recording.status === 'available' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayRecording(recording)}
                            iconName="Play"
                            title="Play recording"
                            className="xl:text-base"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/webinar-details/${recording.meetingId}`)}
                          iconName="Eye"
                          title="View details"
                          className="xl:text-base"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 xl:px-8 py-4 xl:py-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm xl:text-base text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + parseInt(itemsPerPage), sortedRecordings.length)} of {sortedRecordings.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                    className="xl:text-base"
                  />
                  <span className="text-sm xl:text-base text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    iconName="ChevronRight"
                    className="xl:text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredRecordings.length === 0 && (
            <div className="text-center py-16 xl:py-24">
              <Icon name="Video" size={64} className="mx-auto mb-6 xl:mb-8 text-muted-foreground opacity-50 xl:w-20 xl:h-20" />
              <h3 className="text-lg xl:text-2xl font-medium text-foreground mb-4">
                No recordings found
              </h3>
              <p className="text-muted-foreground mb-6 xl:text-lg">
                {searchTerm || statusFilter || dateFilter
                  ? 'Try adjusting your search and filters.'
                  : 'Your Zoom cloud recordings will appear here.'}
              </p>
              <Button
                variant="default"
                onClick={() => window.location.reload()}
                iconName="RefreshCw"
                iconPosition="left"
                className="xl:text-lg xl:px-8 xl:py-4"
              >
                Refresh Recordings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingManagement;
