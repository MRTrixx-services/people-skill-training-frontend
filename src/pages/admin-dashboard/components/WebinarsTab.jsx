import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WebinarsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "live", label: "Live Sessions" },
    { value: "recorded", label: "Recorded Sessions" }
  ];

  const webinars = [
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "Prof. Michael Chen",
      type: "live",
      status: "scheduled",
      date: "2025-09-15",
      time: "14:00",
      duration: "2 hours",
      enrolled: 156,
      maxCapacity: 200,
      revenue: 7800,
      rating: 4.8
    },
    {
      id: 2,
      title: "Digital Marketing Mastery",
      instructor: "Dr. Emily Rodriguez",
      type: "recorded",
      status: "completed",
      date: "2025-09-10",
      views: 890,
      revenue: 12450,
      rating: 4.9
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      instructor: "Dr. Sarah Johnson",
      type: "live",
      status: "live",
      date: "2025-09-12",
      time: "10:00",
      duration: "3 hours",
      enrolled: 234,
      maxCapacity: 250,
      revenue: 18720,
      rating: 4.7
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    return type === 'live' 
      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Webinar Management</h3>
          <p className="text-gray-600">Manage live and recorded sessions</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl"
          iconName="Plus"
        >
          Create Webinar
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search webinars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filter by type"
          />
        </div>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {webinars?.map((webinar) => (
          <div key={webinar?.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className={`${getTypeColor(webinar?.type)} p-4`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-90">
                  {webinar?.type === 'live' ? 'Live Session' : 'Recorded Session'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(webinar?.status)}`}>
                  {webinar?.status?.charAt(0)?.toUpperCase() + webinar?.status?.slice(1)}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mt-2">{webinar?.title}</h4>
              <p className="text-white opacity-80 text-sm">{webinar?.instructor}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-center text-sm text-gray-600">
                  <Icon name="Calendar" size={16} className="mr-2" />
                  <span>{webinar?.date}</span>
                  {webinar?.time && (
                    <>
                      <span className="mx-2">•</span>
                      <Icon name="Clock" size={16} className="mr-1" />
                      <span>{webinar?.time}</span>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {webinar?.type === 'live' ? webinar?.enrolled : webinar?.views}
                    </p>
                    <p className="text-xs text-gray-600">
                      {webinar?.type === 'live' ? 'Enrolled' : 'Views'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">${webinar?.revenue?.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Revenue</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="Star" size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 ml-1">{webinar?.rating}</span>
                  </div>
                  {webinar?.duration && (
                    <span className="text-sm text-gray-600">{webinar?.duration}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" iconName="Eye">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" iconName="Edit">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" iconName="MoreHorizontal" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebinarsTab;
