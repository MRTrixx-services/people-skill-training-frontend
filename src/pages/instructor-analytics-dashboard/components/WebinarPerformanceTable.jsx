import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WebinarPerformanceTable = ({ data, loading = false }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mockData = data || [
    {
      id: 1,
      title: "Advanced React Patterns",
      date: "2024-08-25",
      registrations: 45,
      attendance: 38,
      attendanceRate: 84,
      completionRate: 89,
      avgRating: 4.6,
      revenue: 1350,
      status: "completed"
    },
    {
      id: 2,
      title: "JavaScript ES2024 Features",
      date: "2024-08-20",
      registrations: 32,
      attendance: 28,
      attendanceRate: 88,
      completionRate: 92,
      avgRating: 4.8,
      revenue: 960,
      status: "completed"
    },
    {
      id: 3,
      title: "Node.js Performance Optimization",
      date: "2024-08-15",
      registrations: 28,
      attendance: 22,
      attendanceRate: 79,
      completionRate: 86,
      avgRating: 4.4,
      revenue: 840,
      status: "completed"
    },
    {
      id: 4,
      title: "Database Design Fundamentals",
      date: "2024-08-10",
      registrations: 38,
      attendance: 35,
      attendanceRate: 92,
      completionRate: 94,
      avgRating: 4.7,
      revenue: 1140,
      status: "completed"
    },
    {
      id: 5,
      title: "API Security Best Practices",
      date: "2024-08-05",
      registrations: 25,
      attendance: 20,
      attendanceRate: 80,
      completionRate: 85,
      avgRating: 4.3,
      revenue: 750,
      status: "completed"
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...mockData]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedData = sortedData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 4.0) return 'text-warning';
    return 'text-error';
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 85) return 'text-success';
    if (rate >= 70) return 'text-warning';
    return 'text-error';
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-muted transition-smooth"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-text-secondary'}`} 
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`-mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-text-secondary'}`} 
          />
        </div>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)]?.map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Webinar Performance</h3>
            <p className="text-sm text-text-secondary">Individual session metrics and analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left" iconSize={16}>
              Export CSV
            </Button>
            <Button variant="outline" size="sm" iconName="FileText" iconPosition="left" iconSize={16}>
              PDF Report
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <SortableHeader field="title">Webinar Title</SortableHeader>
              <SortableHeader field="date">Date</SortableHeader>
              <SortableHeader field="registrations">Registrations</SortableHeader>
              <SortableHeader field="attendanceRate">Attendance Rate</SortableHeader>
              <SortableHeader field="completionRate">Completion Rate</SortableHeader>
              <SortableHeader field="avgRating">Avg Rating</SortableHeader>
              <SortableHeader field="revenue">Revenue</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {paginatedData?.map((webinar) => (
              <tr key={webinar?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {webinar?.title}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {webinar?.attendance}/{webinar?.registrations} attended
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {formatDate(webinar?.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                  {webinar?.registrations}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getAttendanceColor(webinar?.attendanceRate)}`}>
                    {webinar?.attendanceRate}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getAttendanceColor(webinar?.completionRate)}`}>
                    {webinar?.completionRate}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className={getRatingColor(webinar?.avgRating)} />
                    <span className={`text-sm font-medium ${getRatingColor(webinar?.avgRating)}`}>
                      {webinar?.avgRating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                  {formatCurrency(webinar?.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Eye" iconSize={14}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="BarChart3" iconSize={14}>
                      Analytics
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData?.length)} of {sortedData?.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
                iconSize={16}
              >
                Previous
              </Button>
              <span className="text-sm text-text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconSize={16}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebinarPerformanceTable;