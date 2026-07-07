import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import AuthenticatedNavigation from '../../components/ui/AuthenticatedNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const MyWebinars = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedWebinars, setSelectedWebinars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const itemsPerPageOptions = [
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateFilterOptions = [
    { value: '', label: 'All Dates' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'past', label: 'Past' }
  ];

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Dr. Michael Chen",
      email: "michael.chen@email.com",
      role: "instructor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock webinar data
  const webinars = [
    {
      id: 1,
      title: "Advanced React Patterns and Performance Optimization",
      date: "2024-12-15T14:00:00Z",
      status: "scheduled",
      enrolled: 47,
      maxCapacity: 50,
      revenue: 4183.50,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=60&fit=crop",
      category: "Web Development"
    },
    {
      id: 2,
      title: "JavaScript ES2024 New Features",
      date: "2024-12-18T13:00:00Z",
      status: "scheduled",
      enrolled: 32,
      maxCapacity: 40,
      revenue: 2559.68,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=100&h=60&fit=crop",
      category: "Programming"
    },
    {
      id: 3,
      title: "Node.js Performance Optimization",
      date: "2024-11-28T15:00:00Z",
      status: "completed",
      enrolled: 35,
      maxCapacity: 35,
      revenue: 2799.65,
      thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=100&h=60&fit=crop",
      category: "Backend Development"
    },
    {
      id: 4,
      title: "Building Scalable APIs with Express.js",
      date: "2024-11-25T16:00:00Z",
      status: "completed",
      enrolled: 28,
      maxCapacity: 30,
      revenue: 2239.72,
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=60&fit=crop",
      category: "Backend Development"
    },
    {
      id: 5,
      title: "Modern CSS Techniques and Best Practices",
      date: "2024-12-01T12:00:00Z",
      status: "draft",
      enrolled: 0,
      maxCapacity: 45,
      revenue: 0,
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=60&fit=crop",
      category: "Web Development"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      live: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const labels = {
      draft: 'Draft',
      scheduled: 'Scheduled',
      live: 'Live',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
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

  // Filter and sort webinars
  const filteredWebinars = webinars.filter(webinar => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || webinar.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const webinarDate = new Date(webinar.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'upcoming':
          matchesDate = webinarDate > now;
          break;
        case 'this-week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = webinarDate >= weekStart && webinarDate <= weekEnd;
          break;
        case 'this-month':
          matchesDate = webinarDate.getMonth() === now.getMonth() && 
                       webinarDate.getFullYear() === now.getFullYear();
          break;
        case 'past':
          matchesDate = webinarDate < now;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedWebinars = filteredWebinars.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'enrolled':
        aValue = a.enrolled;
        bValue = b.enrolled;
        break;
      case 'revenue':
        aValue = a.revenue;
        bValue = b.revenue;
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
  const totalPages = Math.ceil(sortedWebinars.length / parseInt(itemsPerPage));
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
  const paginatedWebinars = sortedWebinars.slice(startIndex, startIndex + parseInt(itemsPerPage));

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectWebinar = (webinarId) => {
    setSelectedWebinars(prev => 
      prev.includes(webinarId) 
        ? prev.filter(id => id !== webinarId)
        : [...prev, webinarId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWebinars.length === paginatedWebinars.length) {
      setSelectedWebinars([]);
    } else {
      setSelectedWebinars(paginatedWebinars.map(w => w.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedWebinars.length > 0) {
      const confirmed = window.confirm(`Are you sure you want to delete ${selectedWebinars.length} webinar(s)?`);
      if (confirmed) {
        console.log('Deleting webinars:', selectedWebinars);
        setSelectedWebinars([]);
      }
    }
  };

  const handleBulkDuplicate = () => {
    if (selectedWebinars.length > 0) {
      console.log('Duplicating webinars:', selectedWebinars);
      setSelectedWebinars([]);
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
   
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Webinars</h1>
            <p className="text-text-secondary">Manage all your webinars in one place</p>
          </div>

          {/* Action Bar */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="default"
                  onClick={() => navigate('/instructor/create')}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create New Webinar
                </Button>
                
                {selectedWebinars.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleBulkDuplicate}
                      iconName="Copy"
                      iconPosition="left"
                      size="sm"
                    >
                      Duplicate ({selectedWebinars.length})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleBulkDelete}
                      iconName="Trash2"
                      iconPosition="left"
                      size="sm"
                      className="text-error border-error hover:bg-error hover:text-white"
                    >
                      Delete ({selectedWebinars.length})
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Input
                  type="text"
                  placeholder="Search webinars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-36 md:w-40 lg:w-56"
                />
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="w-full sm:w-36 md:w-40"
                />
                <Select
                  options={dateFilterOptions}
                  value={dateFilter}
                  onChange={setDateFilter}
                  className="w-full sm:w-36 md:w-40"
                />
              </div>
            </div>
          </div>

          {/* Webinars Table */} <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2 space-y-8">
            <div className="bg-white  border border-gray-200 rounded-lg shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {filteredWebinars.length} webinar(s)
              </h3>
              <Select
                options={itemsPerPageOptions}
                value={itemsPerPage}
                onChange={setItemsPerPage}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

   
            <div className="overflow-x-auto">
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedWebinars.length === paginatedWebinars.length && paginatedWebinars.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('title')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          <span>Title</span>
                          {sortBy === 'title' && (
                            <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('date')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          <span>Date & Time</span>
                          {sortBy === 'date' && (
                            <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('enrolled')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          <span>Enrolled</span>
                          {sortBy === 'enrolled' && (
                            <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('revenue')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                          <span>Revenue</span>
                          {sortBy === 'revenue' && (
                            <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={12} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedWebinars.map((webinar) => (
                      <tr key={webinar.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedWebinars.includes(webinar.id)}
                            onChange={() => handleSelectWebinar(webinar.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={webinar.thumbnail}
                                alt={webinar.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {webinar.title}
                              </div>
                              <div className="text-xs text-gray-500">{webinar.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(webinar.date)}</div>
                          <div className="text-xs text-gray-500">{formatTime(webinar.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(webinar.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {webinar.enrolled}/{webinar.maxCapacity}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{ width: `${(webinar.enrolled / webinar.maxCapacity) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${webinar.revenue.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/instructor/edit-webinar/${webinar.id}`)}
                              iconName="Edit"
                                 title="Edit Webinar"
                            />
                              <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(`/instructor/webinar-resources/${webinar.id}`)}
      iconName="Upload"
      title="Upload Resources"
    />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/instructor/webinar-analytics/${webinar.id}`)}
                              iconName="BarChart3"
                               title="View Analytics"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/webinar-details/${webinar.id}`)}
                              iconName="Eye"
                                  title="View Public Page"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const confirmed = window.confirm('Are you sure you want to delete this webinar?');
                                if (confirmed) {
                                  console.log('Deleting webinar:', webinar.id);
                                }
                              }}
                              iconName="Trash2"
                                title="Delete Webinar"
                              className="text-red-600 hover:bg-red-100"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block lg:hidden">
                <div className="space-y-4 p-4">
                  {paginatedWebinars.map((webinar) => (
                    <div key={webinar.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedWebinars.includes(webinar.id)}
                          onChange={() => handleSelectWebinar(webinar.id)}
                          className="mt-1 rounded border-gray-300"
                        />
                        <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={webinar.thumbnail}
                            alt={webinar.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {webinar.title}
                          </h4>
                          <p className="text-xs text-gray-500">{webinar.category}</p>
                        </div>
                        {getStatusBadge(webinar.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <div className="font-medium text-gray-900">{formatDate(webinar.date)}</div>
                          <div className="text-xs text-gray-500">{formatTime(webinar.date)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Revenue:</span>
                          <div className="font-medium text-gray-900">${webinar.revenue.toFixed(2)}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Enrolled:</span>
                          <span className="font-medium text-gray-900">
                            {webinar.enrolled}/{webinar.maxCapacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(webinar.enrolled / webinar.maxCapacity) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/edit-webinar/${webinar.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/webinar-analytics/${webinar.id}`)}
                        >
                          Analytics
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/webinar-details/${webinar.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const confirmed = window.confirm('Are you sure you want to delete this webinar?');
                            if (confirmed) {
                              console.log('Deleting webinar:', webinar.id);
                            }
                          }}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700 text-center sm:text-left">
                  Showing {startIndex + 1} to {Math.min(startIndex + parseInt(itemsPerPage), sortedWebinars.length)} of {sortedWebinars.length} results
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                  />
                  <span className="text-sm text-gray-900 px-2">
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
            </div>
          )}

          {/* Empty State */}
          {filteredWebinars.length === 0 && (
            <div className="text-center py-12 px-4">
              <Icon name="Video" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No webinars found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter || dateFilter
                  ? 'Try adjusting your search and filters.'
                  : 'Start by creating your first webinar.'}
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/instructor/create')}
                iconName="Plus"
                iconPosition="left"
              >
                Create Your First Webinar
              </Button>
            </div>
          )}
    </div>
        </div>
      
         </div>
    </div>
  );
};

export default MyWebinars;
