import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceReport = ({ session }) => {
  const attendanceRate = Math.round((session?.attendedCount / session?.enrolledCount) * 100);
  
  const getAttendanceColor = (rate) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{session?.title}</h3>
        <span className="text-sm text-muted-foreground">
          {new Date(session.date)?.toLocaleDateString()}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{session?.enrolledCount}</p>
          <p className="text-sm text-muted-foreground">Enrolled</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto mb-2">
            <Icon name="UserCheck" size={20} className="text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{session?.attendedCount}</p>
          <p className="text-sm text-muted-foreground">Attended</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mx-auto mb-2">
            <Icon name="Clock" size={20} className="text-warning" />
          </div>
          <p className="text-2xl font-bold text-foreground">{session?.avgDuration}m</p>
          <p className="text-sm text-muted-foreground">Avg Duration</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
            <Icon name="TrendingUp" size={20} className="text-accent" />
          </div>
          <p className={`text-2xl font-bold ${getAttendanceColor(attendanceRate)}`}>
            {attendanceRate}%
          </p>
          <p className="text-sm text-muted-foreground">Attendance</p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Participant Details</h4>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {session?.participants?.map((participant, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {participant?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{participant?.name}</p>
                  <p className="text-xs text-muted-foreground">{participant?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{participant?.duration}m</p>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${participant?.attended ? 'bg-success' : 'bg-error'}`} />
                  <span className="text-xs text-muted-foreground">
                    {participant?.attended ? 'Attended' : 'Absent'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;