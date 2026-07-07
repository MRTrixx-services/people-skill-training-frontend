import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const pendingInstructors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@email.com",
      expertise: "Data Science & Machine Learning",
      experience: "8 years",
      qualifications: "PhD in Computer Science, Stanford University",
      submittedAt: "2025-08-28",
      documents: ["CV.pdf", "Certificates.pdf"],
      status: "pending"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@email.com",
      expertise: "Web Development & React",
      experience: "12 years",
      qualifications: "MS in Software Engineering, MIT",
      submittedAt: "2025-08-27",
      documents: ["Resume.pdf", "Portfolio.pdf"],
      status: "pending"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      expertise: "Digital Marketing & Analytics",
      experience: "6 years",
      qualifications: "MBA Marketing, Harvard Business School",
      submittedAt: "2025-08-26",
      documents: ["CV.pdf", "Certifications.pdf"],
      status: "pending"
    }
  ];

  const recentUsers = [
    {
      id: 4,
      name: "John Smith",
      email: "john.smith@email.com",
      role: "attendee",
      joinedAt: "2025-08-29",
      status: "active",
      lastActive: "2 hours ago"
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      role: "attendee",
      joinedAt: "2025-08-28",
      status: "active",
      lastActive: "1 day ago"
    },
    {
      id: 6,
      name: "David Brown",
      email: "david.brown@email.com",
      role: "instructor",
      joinedAt: "2025-08-25",
      status: "active",
      lastActive: "3 hours ago"
    }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending Approval" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  const handleApproveInstructor = (instructorId) => {
    console.log("Approving instructor:", instructorId);
    // Implementation for approval
  };

  const handleRejectInstructor = (instructorId) => {
    console.log("Rejecting instructor:", instructorId);
    // Implementation for rejection
  };

  const handleBulkAction = (action) => {
    console.log("Bulk action:", action, "for users:", selectedUsers);
    // Implementation for bulk actions
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredInstructors = pendingInstructors?.filter(instructor => 
    instructor?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    instructor?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search users by name or email..."
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
      {/* Pending Instructor Approvals */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pending Instructor Approvals</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredInstructors?.length} applications awaiting review
              </p>
            </div>
            {selectedUsers?.length > 0 && (
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
            )}
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredInstructors?.map((instructor) => (
            <div key={instructor?.id} className="p-6">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedUsers?.includes(instructor?.id)}
                  onChange={() => toggleUserSelection(instructor?.id)}
                  className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-base font-medium text-foreground">{instructor?.name}</h4>
                      <p className="text-sm text-muted-foreground">{instructor?.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveInstructor(instructor?.id)}
                        iconName="Check"
                        iconPosition="left"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectInstructor(instructor?.id)}
                        iconName="X"
                        iconPosition="left"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Expertise:</span>
                      <span className="text-muted-foreground ml-2">{instructor?.expertise}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Experience:</span>
                      <span className="text-muted-foreground ml-2">{instructor?.experience}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-foreground">Qualifications:</span>
                      <span className="text-muted-foreground ml-2">{instructor?.qualifications}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Submitted: {instructor?.submittedAt}</span>
                      <div className="flex items-center space-x-2">
                        <Icon name="Paperclip" size={14} />
                        <span>{instructor?.documents?.length} documents</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" iconName="Eye" iconPosition="left">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Users */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Users</h3>
          <p className="text-sm text-muted-foreground mt-1">Latest user registrations and activity</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-muted/50">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'instructor' ?'bg-primary/10 text-primary' :'bg-secondary/10 text-secondary'
                    }`}>
                      {user?.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user?.joinedAt}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user?.status === 'active' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                    }`}>
                      {user?.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user?.lastActive}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTab;