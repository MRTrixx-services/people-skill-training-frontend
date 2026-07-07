import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('public');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Enhanced profile form data with all attendee fields
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profilePhoto: null,
    location: '',
    timezone: '',
    interests: [],
    learningGoals: '',
    socialLinks: {
      website: '',
      linkedin: '',
      twitter: '',
      github: ''
    },
    contactPreferences: {
      showEmail: false,
      allowDirectMessages: true,
      showPhone: false,
      allowNewsletters: true
    },
    // Attendee-specific stats
    statistics: {
      totalEnrollments: 12,
      completedWebinars: 8,
      totalHoursLearned: 42,
      certificatesEarned: 5,
      averageRating: 4.6,
      memberSince: 'January 2024'
    }
  });

  // Security form data
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: {
      webinarReminders: true,
      newWebinarAlerts: true,
      paymentConfirmations: true,
      weeklyDigest: false,
      promotionalEmails: false
    },
    smsNotifications: {
      webinarReminders: true,
      paymentAlerts: true,
      securityAlerts: true
    },
    pushNotifications: {
      webinarStarting: true,
      newMessages: true,
      systemUpdates: false
    }
  });

  // App preferences
  const [preferences, setPreferences] = useState({
   
    language: 'en',
    timezone: 'America/New_York',
    emailFrequency: 'immediate',
    autoJoinWebinars: false,
    showProfilePublicly: true
  });

  // Mock user data with enhanced attendee information
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      bio: "Passionate learner and technology enthusiast. Always looking to expand my knowledge through webinars and online courses. Currently focusing on data science and machine learning.",
      role: "attendee",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      memberSince: "January 2024"
    };
    
    setUser(mockUser);
    
    const mockProfileData = {
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      bio: mockUser.bio,
      profilePhoto: { preview: mockUser.avatar, name: 'current-avatar.jpg' },
      location: "San Francisco, CA, USA",
      timezone: "Pacific Standard Time (PST)",
      interests: ["Data Science", "Machine Learning", "Web Development", "Python", "React", "AI"],
      learningGoals: "I want to become proficient in machine learning and data analysis to advance my career in tech.",
      socialLinks: {
        website: "https://sarahjohnson.dev",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahj_dev",
        github: "https://github.com/sarahjohnson"
      },
      contactPreferences: {
        showEmail: false,
        allowDirectMessages: true,
        showPhone: false,
        allowNewsletters: true
      },
      statistics: {
        totalEnrollments: 12,
        completedWebinars: 8,
        totalHoursLearned: 42,
        certificatesEarned: 5,
        averageRating: 4.6,
        memberSince: mockUser.memberSince
      }
    };
    
    setProfileData(mockProfileData);
    setOriginalData({ ...mockProfileData });
  }, []);

  const tabs = [
    { id: 'public', label: 'Public Profile', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (profileData.bio && profileData.bio.length < 20) {
      newErrors.bio = 'Bio should be at least 20 characters';
    }
    
    // Validate social links format
    const urlPattern = /^https?:\/\/.+/;
    Object.entries(profileData.socialLinks).forEach(([key, value]) => {
      if (value && !urlPattern.test(value)) {
        newErrors[`socialLinks.${key}`] = 'Please enter a valid URL starting with http:// or https://';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced input change handler
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const keys = field.split('.');
      setProfileData(prev => {
        const updated = { ...prev };
        let current = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInterestsChange = (interests) => {
    const skillsArray = interests.split(',').map(item => item.trim()).filter(Boolean);
    setProfileData(prev => ({ ...prev, interests: skillsArray }));
  };

  const handleSecurityInputChange = (field, value) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNotificationChange = (category, setting, value) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  // Photo upload handling
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePhoto: 'Image must be smaller than 5MB' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profilePhoto', {
          file: file,
          preview: e.target.result,
          name: file.name
        });
        setErrors(prev => ({ ...prev, profilePhoto: undefined }));
      };
      reader.readAsDataURL(file);
    } else {
      setErrors(prev => ({ ...prev, profilePhoto: 'Please upload a valid image file' }));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removePhoto = () => {
    handleInputChange('profilePhoto', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Updated save handler
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving profile data:', profileData);
      setOriginalData({ ...profileData });
      setIsEditing(false);
      setActiveTab('public');
      setSuccessMessage('Profile updated successfully!');
      
      // Update user state
      if (user) {
        setUser(prev => ({
          ...prev,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio
        }));
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
    setActiveTab('public');
    setErrors({});
    setSuccessMessage('');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setActiveTab('public');
  };

  const hasChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalData);
  };

  // Render public profile view
  const renderPublicProfile = () => (
    <div className="space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
            {profileData.profilePhoto ? (
              <Image
                src={profileData.profilePhoto.preview}
                alt={profileData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="User" size={48} className="text-white/50" />
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
            <p className="text-xl text-blue-100 mb-2">Learning Enthusiast</p>
            <p className="text-blue-200 mb-4">{profileData.location} • {profileData.timezone}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {profileData.interests.slice(0, 6).map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
            
            <div className="flex justify-center md:justify-start space-x-4">
              {profileData.socialLinks.website && (
                <a
                  href={profileData.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Icon name="Globe" size={20} />
                </a>
              )}
              {profileData.socialLinks.linkedin && (
                <a
                  href={profileData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Icon name="Linkedin" size={20} />
                </a>
              )}
              {profileData.socialLinks.twitter && (
                <a
                  href={profileData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Icon name="Twitter" size={20} />
                </a>
              )}
              {profileData.socialLinks.github && (
                <a
                  href={profileData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Icon name="Github" size={20} />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData.statistics.averageRating}</div>
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={16}
                    className={i < Math.floor(profileData.statistics.averageRating) ? "text-yellow-300 fill-current" : "text-white/30"}
                  />
                ))}
              </div>
              <div className="text-xs text-blue-200">Avg Rating</div>
            </div>
            <Button
              variant="secondary"
              onClick={handleEditClick}
              iconName="Edit"
              iconPosition="left"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.totalEnrollments}</div>
          <div className="text-sm text-muted-foreground">Enrollments</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.completedWebinars}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.totalHoursLearned}</div>
          <div className="text-sm text-muted-foreground">Hours Learned</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.certificatesEarned}</div>
          <div className="text-sm text-muted-foreground">Certificates</div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">{profileData.bio}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">Member Since</h4>
            <p className="text-muted-foreground">{profileData.statistics.memberSince}</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Learning Goals</h4>
            <p className="text-muted-foreground">{profileData.learningGoals}</p>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Heart" size={20} className="mr-2" />
          Learning Interests
        </h3>
        <div className="flex flex-wrap gap-3">
          {profileData.interests.map((interest, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Render edit form
  const renderEditForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Edit Profile</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            iconName="X"
            iconPosition="left"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
            disabled={isSubmitting || !hasChanges()}
            className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.general && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
          {errors.general}
        </div>
      )}

      {/* Photo Upload */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-4">Profile Photo</h4>
        
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {profileData.profilePhoto ? (
              <Image
                src={profileData.profilePhoto.preview}
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="User" size={32} className="text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : errors.profilePhoto 
                  ? 'border-error'
                  : 'border-border hover:border-primary'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <Icon name="Upload" size={24} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-foreground">Drop photo here or click to browse</p>
                <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
              </div>
            </div>
            
            {errors.profilePhoto && (
              <p className="text-error text-xs mt-1">{errors.profilePhoto}</p>
            )}
            
            {profileData.profilePhoto && (
              <Button
                variant="outline"
                size="sm"
                onClick={removePhoto}
                iconName="Trash2"
                iconPosition="left"
                className="mt-2"
              >
                Remove Photo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-4">Basic Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Full Name *"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
            />
          </div>
          
          <Input
            label="Email Address *"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
          />
          
          <Input
            label="Location"
            value={profileData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, State, Country"
          />
          
          <Input
            label="Timezone"
            value={profileData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            placeholder="e.g., Pacific Standard Time"
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself and your learning journey..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.bio ? 'border-error' : 'border-border'
              }`}
            />
            {errors.bio && (
              <p className="text-error text-xs mt-1">{errors.bio}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {profileData.bio.length}/500 characters (minimum 20)
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Learning Interests
            </label>
            <Input
              value={profileData.interests.join(', ')}
              onChange={(e) => handleInterestsChange(e.target.value)}
              placeholder="Data Science, Web Development, Python..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate interests with commas
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Learning Goals
            </label>
            <textarea
              value={profileData.learningGoals}
              onChange={(e) => handleInputChange('learningGoals', e.target.value)}
              placeholder="What do you want to achieve through learning?"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-4">Social Links</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            value={profileData.socialLinks.website}
            onChange={(e) => handleInputChange('socialLinks.website', e.target.value)}
            placeholder="https://yourwebsite.com"
            error={errors['socialLinks.website']}
          />
          
          <Input
            label="LinkedIn"
            value={profileData.socialLinks.linkedin}
            onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            error={errors['socialLinks.linkedin']}
          />
          
          <Input
            label="Twitter"
            value={profileData.socialLinks.twitter}
            onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
            placeholder="https://twitter.com/username"
            error={errors['socialLinks.twitter']}
          />
          
          <Input
            label="GitHub"
            value={profileData.socialLinks.github}
            onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
            placeholder="https://github.com/username"
            error={errors['socialLinks.github']}
          />
        </div>
      </div>

      {/* Contact Preferences */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-4">Contact Preferences</h4>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={profileData.contactPreferences.showEmail}
              onChange={(e) => handleInputChange('contactPreferences.showEmail', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Show email publicly</p>
              <p className="text-xs text-muted-foreground">
                Allow other users to see your email address on your profile
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={profileData.contactPreferences.showPhone}
              onChange={(e) => handleInputChange('contactPreferences.showPhone', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Show phone publicly</p>
              <p className="text-xs text-muted-foreground">
                Allow other users to see your phone number on your profile
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={profileData.contactPreferences.allowDirectMessages}
              onChange={(e) => handleInputChange('contactPreferences.allowDirectMessages', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Allow direct messages</p>
              <p className="text-xs text-muted-foreground">
                Let other users send you private messages through the platform
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={profileData.contactPreferences.allowNewsletters}
              onChange={(e) => handleInputChange('contactPreferences.allowNewsletters', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Allow newsletters</p>
              <p className="text-xs text-muted-foreground">
                Receive newsletters and updates about new learning opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const validateSecurityForm = () => {
    const newErrors = {};
    
    if (securityData.newPassword && !securityData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (securityData.newPassword && securityData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSecuritySave = async () => {
    if (!validateSecurityForm()) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Security data:', securityData);
      setSecurityData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccessMessage('Security settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      setErrors({ general: 'Failed to update security settings. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSecurityTab = () => (
     <div className="bg-card border border-border rounded-lg p-6">
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your password and security preferences
        </p>
      </div>

      <div className="max-w-md space-y-4">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={securityData.currentPassword}
          onChange={(e) => handleSecurityInputChange('currentPassword', e.target.value)}
          error={errors.currentPassword}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={securityData.newPassword}
          onChange={(e) => handleSecurityInputChange('newPassword', e.target.value)}
          error={errors.newPassword}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={securityData.confirmPassword}
          onChange={(e) => handleSecurityInputChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />
      </div>

      <div className="border-t border-border pt-6">
        <h4 className="text-md font-semibold text-foreground mb-4">Two-Factor Authentication</h4>
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={securityData.twoFactorEnabled}
            onChange={(e) => handleSecurityInputChange('twoFactorEnabled', e.target.checked)}
          />
          <div>
            <p className="text-sm font-medium text-foreground">Enable Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add an extra layer of security to your account by requiring a verification code from your phone
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border">
        <Button
          variant="default"
          onClick={handleSecuritySave}
          loading={isSubmitting}
          iconName="Shield"
          iconPosition="left"
        >
          Update Security Settings
        </Button>
      </div>
    </div></div>
  );

  const renderNotificationsTab = () => (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose how and when you want to be notified
        </p>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Mail" size={18} className="mr-2" />
            Email Notifications
          </h4>
          <div className="space-y-3">
            {Object.entries(notifications.emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-start space-x-3">
                <Checkbox
                  checked={value}
                  onChange={(e) => handleNotificationChange('emailNotifications', key, e.target.checked)}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {key === 'webinarReminders' && 'Webinar Reminders'}
                    {key === 'newWebinarAlerts' && 'New Webinar Alerts'}
                    {key === 'paymentConfirmations' && 'Payment Confirmations'}
                    {key === 'weeklyDigest' && 'Weekly Digest'}
                    {key === 'promotionalEmails' && 'Promotional Emails'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {key === 'webinarReminders' && 'Get reminded before your scheduled webinars'}
                    {key === 'newWebinarAlerts' && 'Be notified when new webinars are available'}
                    {key === 'paymentConfirmations' && 'Receive confirmation for successful payments'}
                    {key === 'weeklyDigest' && 'Weekly summary of platform activity'}
                    {key === 'promotionalEmails' && 'Special offers and promotional content'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
            <Icon name="MessageSquare" size={18} className="mr-2" />
            SMS Notifications
          </h4>
          <div className="space-y-3">
            {Object.entries(notifications.smsNotifications).map(([key, value]) => (
              <div key={key} className="flex items-start space-x-3">
                <Checkbox
                  checked={value}
                  onChange={(e) => handleNotificationChange('smsNotifications', key, e.target.checked)}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {key === 'webinarReminders' && 'Webinar Reminders'}
                    {key === 'paymentAlerts' && 'Payment Alerts'}
                    {key === 'securityAlerts' && 'Security Alerts'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {key === 'webinarReminders' && 'SMS reminders 30 minutes before webinars'}
                    {key === 'paymentAlerts' && 'SMS confirmation for payments and refunds'}
                    {key === 'securityAlerts' && 'Important security notifications'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Smartphone" size={18} className="mr-2" />
            Push Notifications
          </h4>
          <div className="space-y-3">
            {Object.entries(notifications.pushNotifications).map(([key, value]) => (
              <div key={key} className="flex items-start space-x-3">
                <Checkbox
                  checked={value}
                  onChange={(e) => handleNotificationChange('pushNotifications', key, e.target.checked)}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {key === 'webinarStarting' && 'Webinar Starting'}
                    {key === 'newMessages' && 'New Messages'}
                    {key === 'systemUpdates' && 'System Updates'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {key === 'webinarStarting' && 'Get notified when your webinar is about to start'}
                    {key === 'newMessages' && 'Notifications for new chat messages'}
                    {key === 'systemUpdates' && 'Important platform updates and maintenance'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border">
        <Button
          variant="default"
          onClick={() => {
            setSuccessMessage('Notification settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
          loading={isSubmitting}
          iconName="Bell"
          iconPosition="left"
        >
          Save Notification Settings
        </Button>
      </div>
    </div></div>
  );

  const renderPreferencesTab = () => (
      <div className="bg-card border border-border rounded-lg p-6">
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">App Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Customize your app experience and behavior
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/New_York">Pacific Time (PT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Frequency</label>
            <select
              value={preferences.emailFrequency}
              onChange={(e) => handlePreferenceChange('emailFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={preferences.autoJoinWebinars}
              onChange={(e) => handlePreferenceChange('autoJoinWebinars', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Auto-join webinars</p>
              <p className="text-xs text-muted-foreground">
                Automatically join webinars when they start (requires browser permission)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              checked={preferences.showProfilePublicly}
              onChange={(e) => handlePreferenceChange('showProfilePublicly', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Show profile publicly</p>
              <p className="text-xs text-muted-foreground">
                Allow other users to see your profile information and learning activity
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border">
        <Button
          variant="default"
          onClick={() => {
            setSuccessMessage('Preferences saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
          loading={isSubmitting}
          iconName="Settings"
          iconPosition="left"
        >
          Save Preferences
        </Button>
      </div>
    </div></div>
  );

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/attendee-dashboard' },
    { label: 'Profile Settings', href: null }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation
          user={user}
          customBreadcrumbs={customBreadcrumbs}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-text-secondary">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id !== 'public') {
                        setIsEditing(false);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'public' && (
              isEditing ? renderEditForm() : renderPublicProfile()
            )}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
