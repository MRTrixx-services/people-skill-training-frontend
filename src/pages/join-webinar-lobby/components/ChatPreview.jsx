import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ChatPreview = () => {
  const [messages, setMessages] = useState([]);
  const [attendeeCount, setAttendeeCount] = useState(23);

  const mockMessages = [
    {
      id: 1,
      sender: "WebinarBot",
      avatar: null,
      content: "Welcome to the webinar lobby! The session will begin shortly.",
      timestamp: new Date(Date.now() - 300000),
      isSystem: true
    },
    {
      id: 2,
      sender: "Dr. Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      content: "Hello everyone! I\'m excited to share advanced React patterns with you today. Please make sure your audio and video are working properly.",
      timestamp: new Date(Date.now() - 240000),
      isInstructor: true
    },
    {
      id: 3,
      sender: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      content: "Looking forward to this session! Thanks for hosting Dr. Johnson.",
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 4,
      sender: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      content: "Can\'t wait to learn about performance optimization techniques!",
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: 5,
      sender: "WebinarBot",
      avatar: null,
      content: "Reminder: Please mute your microphones when not speaking to avoid background noise.",
      timestamp: new Date(Date.now() - 60000),
      isSystem: true
    }
  ];

  useEffect(() => {
    // Simulate loading messages
    const loadMessages = () => {
      setMessages(mockMessages);
    };

    // Simulate attendee count updates
    const updateAttendeeCount = () => {
      setAttendeeCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    };

    loadMessages();
    const countInterval = setInterval(updateAttendeeCount, 10000);

    return () => clearInterval(countInterval);
  }, []);

  const formatTime = (timestamp) => {
    return timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBadgeColor = (message) => {
    if (message?.isSystem) return "bg-muted text-text-secondary";
    if (message?.isInstructor) return "bg-primary text-primary-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-elevation-2 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Lobby Chat</h2>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Users" size={16} />
          <span>{attendeeCount} attendees</span>
        </div>
      </div>
      {/* Messages Container */}
      <div className="h-80 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages?.map((message) => (
          <div key={message?.id} className="flex space-x-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message?.avatar ? (
                <Image
                  src={message?.avatar}
                  alt={message?.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Icon 
                    name={message?.isSystem ? "Bot" : "User"} 
                    size={16} 
                    className="text-text-secondary" 
                  />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-text-primary text-sm">
                  {message?.sender}
                </span>
                {(message?.isInstructor || message?.isSystem) && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(message)}`}>
                    {message?.isInstructor ? 'Instructor' : 'System'}
                  </span>
                )}
                <span className="text-xs text-text-secondary">
                  {formatTime(message?.timestamp)}
                </span>
              </div>
              <p className="text-sm text-text-primary leading-relaxed">
                {message?.content}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Chat Input (Disabled in Lobby) */}
      <div className="relative">
        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg opacity-60">
          <Icon name="MessageCircle" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary flex-1">
            Chat will be enabled once the webinar starts
          </span>
          <Icon name="Lock" size={16} className="text-text-secondary" />
        </div>
      </div>
      {/* Chat Guidelines */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-text-secondary mt-0.5" />
          <div className="text-xs text-text-secondary">
            <p className="font-medium mb-1">Chat Guidelines:</p>
            <ul className="space-y-1">
              <li>• Keep messages relevant to the topic</li>
              <li>• Be respectful to all participants</li>
              <li>• Use Q&A feature for questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;