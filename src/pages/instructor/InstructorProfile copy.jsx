import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';

const InstructorProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('public');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [phoneVerificationStep, setPhoneVerificationStep] = useState('initial');
  const [phoneNumber, setPhoneNumber] = useState('');
  const fileInputRef = useRef(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [earnings, setEarnings] = useState({
    totalEarnings: 24500.75,
    availableBalance: 18320.50,
    pendingAmount: 2180.25,
    thisMonthEarnings: 4850.00
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [showAddBankForm, setShowAddBankForm] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'savings',
    accountHolderName: ''
  });

  const [uploadedDocuments, setUploadedDocuments] = useState({
      identity: {
        files: [],
        submitted: false,
        canSubmit: false
      },
      professional: {
        files: [],
        submitted: false,
        canSubmit: false
      },
      address: {
        files: [],
        submitted: false,
        canSubmit: false
      }
    });
  const [verificationData, setVerificationData] = useState({
      email: {
        status: 'verified',
        verifiedAt: '2024-11-01T10:30:00Z',
        method: 'email_link'
      },
      phone: {
        status: 'not_started',
        verifiedAt: null,
        method: 'sms_otp',
        phoneNumber: '',
        codeResent: false,
        attempts: 0
      },
      identity: {
        status: 'not_started', // 'not_started', 'under_review', 'verified', 'rejected'
        verifiedAt: null,
        submittedAt: null,
        rejectedAt: null,
        documents: [],
        reviewNotes: null,
        rejectionRemarks: null,
        canResubmit: false,
        resubmissionCount: 0
      },
      professional: {
        status: 'not_started',
        verifiedAt: null,
        submittedAt: null,
        rejectedAt: null,
        documents: [],
        certifications: [],
        reviewNotes: null,
        rejectionRemarks: null,
        canResubmit: false,
        resubmissionCount: 0
      },
      address: {
        status: 'not_started',
        verifiedAt: null,
        submittedAt: null,
        rejectedAt: null,
        documents: [],
        reviewNotes: null,
        rejectionRemarks: null,
        canResubmit: false,
        resubmissionCount: 0
      }
    });
  // Enhanced profile form data with additional fields
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    bio: '',
    expertise: [],
    experience: '',
    education: '',
    certifications: [],
    socialLinks: {
      website: '',
      linkedin: '',
      twitter: '',
      github: '',
      youtube: '',
      medium: ''
    },
    contactPreferences: {
      showEmail: false,
      allowDirectMessages: true,
      allowBookingRequests: true,
      showPhone: false
    },
    profilePhoto: null,
    // Additional insights and statistics
    statistics: {
      totalStudents: 1247,
      totalWebinars: 35,
      averageRating: 4.8,
      totalHoursTaught: 128,
      completionRate: 92,
      responseRate: 98
    },
    // Professional details
    location: '',
    timezone: '',
    languages: [],
    hourlyRate: '',
    availability: {
      monday: { available: true, hours: '9:00 AM - 5:00 PM' },
      tuesday: { available: true, hours: '9:00 AM - 5:00 PM' },
      wednesday: { available: true, hours: '9:00 AM - 5:00 PM' },
      thursday: { available: true, hours: '9:00 AM - 5:00 PM' },
      friday: { available: true, hours: '9:00 AM - 5:00 PM' },
      saturday: { available: false, hours: '' },
      sunday: { available: false, hours: '' }
    },
    // Verification status
    verification: {
      emailVerified: true,
      phoneVerified: false,
      identityVerified: true,
      professionalVerified: false
    }
  });

  // Mock user data with enhanced information
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Dr. Michael Chen",
      email: "michael.chen@email.com",
      role: "instructor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      joinDate: "2023-01-15",
      lastActive: "2024-12-05T10:30:00Z"
    };
    setUser(mockUser);

    // Enhanced mock profile data
    const mockProfileData = {
      name: "Dr. Michael Chen",
      title: "Senior React Developer & Technical Lead",
      bio: "Passionate software engineer with over 8 years of experience in building scalable web applications. I specialize in React, Node.js, and modern JavaScript technologies. I love sharing knowledge and helping others grow in their development careers through practical, hands-on learning experiences.",
      expertise: ["React", "JavaScript", "Node.js", "TypeScript", "GraphQL", "AWS", "Python", "Docker"],
      experience: "8+ years",
      education: "Ph.D. in Computer Science - Stanford University",
      certifications: [
        "AWS Certified Solutions Architect",
        "Google Cloud Professional Developer",
        "Certified Kubernetes Administrator",
        "MongoDB Certified Developer"
      ],
      socialLinks: {
        website: "https://michaelchen.dev",
        linkedin: "https://linkedin.com/in/michaelchen",
        twitter: "https://twitter.com/michaelchen_dev",
        github: "https://github.com/michaelchen",
        youtube: "https://youtube.com/c/michaelchen",
        medium: "https://medium.com/@michaelchen"
      },
      contactPreferences: {
        showEmail: false,
        allowDirectMessages: true,
        allowBookingRequests: true,
        showPhone: false
      },
      profilePhoto: {
        preview: mockUser.avatar,
        name: 'current-profile.jpg'
      },
      location: "San Francisco, CA, USA",
      timezone: "Pacific Standard Time (PST)",
      languages: ["English", "Mandarin", "Spanish"],
      hourlyRate: "$75",
      statistics: {
        totalStudents: 1247,
        totalWebinars: 35,
        averageRating: 4.8,
        totalHoursTaught: 128,
        completionRate: 92,
        responseRate: 98
      },
      availability: {
        monday: { available: true, hours: '9:00 AM - 5:00 PM' },
        tuesday: { available: true, hours: '9:00 AM - 5:00 PM' },
        wednesday: { available: true, hours: '9:00 AM - 5:00 PM' },
        thursday: { available: true, hours: '9:00 AM - 5:00 PM' },
        friday: { available: true, hours: '9:00 AM - 5:00 PM' },
        saturday: { available: false, hours: '' },
        sunday: { available: false, hours: '' }
      },
      verification: {
        emailVerified: true,
        phoneVerified: false,
        identityVerified: true,
        professionalVerified: false
      }
    };
    
    setProfileData(mockProfileData);
    setOriginalData({ ...mockProfileData });
    const mockBankAccounts = [
      {
        id: '1',
        bankName: 'Chase Bank',
        accountNumber: '****4521',
        accountType: 'checking',
        accountHolderName: 'Michael Chen',
        isDefault: true,
        isVerified: true,
        addedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        bankName: 'Wells Fargo',
        accountNumber: '****7892',
        accountType: 'savings',
        accountHolderName: 'Michael Chen',
        isDefault: false,
        isVerified: false,
        addedAt: '2024-11-20T14:30:00Z'
      }
    ];
    setBankAccounts(mockBankAccounts);
    setSelectedAccount(mockBankAccounts[0]);

    const mockPayoutHistory = [
      {
        id: '1',
        amount: 2450.00,
        status: 'completed',
        requestedAt: '2024-12-01T10:00:00Z',
        processedAt: '2024-12-03T15:30:00Z',
        bankAccount: 'Chase Bank ****4521',
        transactionId: 'TXN_12345',
        description: 'November earnings payout'
      },
      {
        id: '2',
        amount: 1850.50,
        status: 'processing',
        requestedAt: '2024-11-28T09:15:00Z',
        processedAt: null,
        bankAccount: 'Chase Bank ****4521',
        transactionId: 'TXN_12346',
        description: 'Weekly earnings payout'
      },
      {
        id: '3',
        amount: 3200.75,
        status: 'failed',
        requestedAt: '2024-11-25T16:20:00Z',
        processedAt: '2024-11-26T10:10:00Z',
        bankAccount: 'Wells Fargo ****7892',
        transactionId: 'TXN_12347',
        description: 'October earnings payout',
        failureReason: 'Invalid account details'
      },
      {
        id: '4',
        amount: 980.25,
        status: 'completed',
        requestedAt: '2024-11-20T12:00:00Z',
        processedAt: '2024-11-22T11:45:00Z',
        bankAccount: 'Chase Bank ****4521',
        transactionId: 'TXN_12348',
        description: 'Mid-month earnings payout'
      }
    ];
    setPayoutHistory(mockPayoutHistory);
  }, []);

const allProfileViewsData = [
    // 90 days of data (showing last 30 for brevity, but include 90 days total)
    { date: '2025-06-08', views: 25, uniqueVisitors: 18, profileClicks: 4 },
    { date: '2025-06-09', views: 32, uniqueVisitors: 24, profileClicks: 6 },
    { date: '2025-06-10', views: 28, uniqueVisitors: 21, profileClicks: 5 },
    // ... (add more historical data for 90 days)
    { date: '2025-08-07', views: 45, uniqueVisitors: 32, profileClicks: 8 },
    { date: '2025-08-08', views: 52, uniqueVisitors: 41, profileClicks: 12 },
    { date: '2025-08-09', views: 38, uniqueVisitors: 28, profileClicks: 6 },
    { date: '2025-08-10', views: 67, uniqueVisitors: 55, profileClicks: 15 },
    { date: '2025-08-11', views: 78, uniqueVisitors: 62, profileClicks: 18 },
    { date: '2025-08-12', views: 85, uniqueVisitors: 71, profileClicks: 22 },
    { date: '2025-08-13', views: 92, uniqueVisitors: 78, profileClicks: 25 },
    { date: '2025-08-14', views: 76, uniqueVisitors: 65, profileClicks: 19 },
    { date: '2025-08-15', views: 89, uniqueVisitors: 74, profileClicks: 21 },
    { date: '2025-08-16', views: 95, uniqueVisitors: 82, profileClicks: 28 },
    { date: '2025-08-17', views: 103, uniqueVisitors: 89, profileClicks: 32 },
    { date: '2025-08-18', views: 87, uniqueVisitors: 71, profileClicks: 24 },
    { date: '2025-08-19', views: 94, uniqueVisitors: 79, profileClicks: 27 },
    { date: '2025-08-20', views: 108, uniqueVisitors: 91, profileClicks: 35 },
    { date: '2025-08-21', views: 115, uniqueVisitors: 98, profileClicks: 38 },
    { date: '2025-08-22', views: 98, uniqueVisitors: 84, profileClicks: 29 },
    { date: '2025-08-23', views: 112, uniqueVisitors: 95, profileClicks: 36 },
    { date: '2025-08-24', views: 125, uniqueVisitors: 107, profileClicks: 42 },
    { date: '2025-08-25', views: 118, uniqueVisitors: 101, profileClicks: 39 },
    { date: '2025-08-26', views: 134, uniqueVisitors: 115, profileClicks: 45 },
    { date: '2025-08-27', views: 142, uniqueVisitors: 122, profileClicks: 48 },
    { date: '2025-08-28', views: 128, uniqueVisitors: 109, profileClicks: 41 },
    { date: '2025-08-29', views: 156, uniqueVisitors: 134, profileClicks: 52 },
    { date: '2025-08-30', views: 195, uniqueVisitors: 138, profileClicks: 63 },
    { date: '2025-08-31', views: 210, uniqueVisitors: 145, profileClicks: 68 },
    { date: '2025-09-01', views: 220, uniqueVisitors: 150, profileClicks: 70 },
    { date: '2025-09-02', views: 225, uniqueVisitors: 155, profileClicks: 72 },
    { date: '2025-09-03', views: 230, uniqueVisitors: 160, profileClicks: 74 },
    { date: '2025-09-04', views: 240, uniqueVisitors: 165, profileClicks: 76 },
    { date: '2025-09-05', views: 250, uniqueVisitors: 170, profileClicks: 78 }
  ];

  // Function to filter data based on selected timeframe
  const getFilteredData = (timeframe) => {
    const today = new Date('2025-09-06'); // Current date
    let daysBack;
    
    switch(timeframe) {
      case '7d':
        daysBack = 7;
        break;
      case '30d':
        daysBack = 30;
        break;
      case '90d':
        daysBack = 90;
        break;
      default:
        daysBack = 30;
    }
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysBack);
    
    return allProfileViewsData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });
  };

  // Function to calculate metrics based on timeframe
  const getMetricsForTimeframe = (timeframe) => {
    const data = getFilteredData(timeframe);
    
    if (data.length === 0) return { growth: 0, change: '+0%' };
    
    const totalViews = data.reduce((sum, item) => sum + item.views, 0);
    const avgViews = totalViews / data.length;
    
    // Calculate growth based on first half vs second half of period
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint);
    const secondHalf = data.slice(midPoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.views, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.views, 0) / secondHalf.length;
    
    const growth = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    return {
      totalViews,
      avgViews: Math.round(avgViews),
      growth: Math.round(growth),
      change: growth >= 0 ? `+${Math.round(growth)}%` : `${Math.round(growth)}%`,
      isPositive: growth >= 0
    };
  };
  // Updated tabs array - removed 'settings' tab
  const tabs = [
    { id: 'public', label: 'Public Profile', icon: 'User' },
    { id: 'analytics', label: 'Profile Analytics', icon: 'BarChart3' },
    { id: 'verification', label: 'Verification', icon: 'Shield' },
    { id: 'earnings', label: 'Earnings & Payouts', icon: 'DollarSign' },
    { id: 'bank-accounts', label: 'Bank Accounts', icon: 'CreditCard' }
 
  ];
  const getOverallProgress = () => {
    const total = Object.keys(verificationData).length;
    const verified = Object.values(verificationData).filter(v => v.status === 'verified').length;
    return Math.round((verified / total) * 100);
  };

  const getVerifiedCount = () => {
    return Object.values(verificationData).filter(v => v.status === 'verified').length;
  };

  const getPendingCount = () => {
    return Object.values(verificationData).filter(v => 
      v.status === 'under_review' || v.status === 'pending'
    ).length;
  };

  
  const getRemainingCount = () => {
    return Object.values(verificationData).filter(v => v.status === 'not_started').length;
  };

  const getVerificationBadge = (status) => {
    const styles = {
      verified: 'bg-green-100 text-green-800 border-green-200',
      under_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      not_started: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      verified: 'Verified',
      under_review: 'Under Review',
      pending: 'Pending',
      rejected: 'Rejected',
      not_started: 'Not Started'
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  // Phone verification handlers
  const handleStartPhoneVerification = () => {
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }

    console.log('Starting phone verification...');
    setPhoneVerificationStep('code_sent');
    setPhoneTimer(60);
    
    const timer = setInterval(() => {
      setPhoneTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setVerificationData(prev => ({
      ...prev,
      phone: { 
        ...prev.phone, 
        status: 'pending',
        phoneNumber: phoneNumber
      }
    }));
    
    setTimeout(() => {
      alert('Verification code sent to your phone!');
    }, 1000);
  };

  const handleResendCode = () => {
    if (phoneTimer === 0) {
      handleStartPhoneVerification();
    }
  };

  const handleVerifyPhoneCode = () => {
    if (phoneCode.length === 6) {
      setVerificationData(prev => ({
        ...prev,
        phone: { 
          ...prev.phone, 
          status: 'verified', 
          verifiedAt: new Date().toISOString() 
        }
      }));
      setPhoneCode('');
      setPhoneVerificationStep('verified');
      alert('Phone verified successfully!');
    } else {
      alert('Please enter a valid 6-digit code');
    }
  };

  // Document upload handlers
  const handleDocumentUpload = (type, files) => {
    console.log(`Uploading ${type} documents:`, files);
    
    const newFiles = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      category: '',
      uploadedAt: new Date().toISOString(),
      isResubmission: verificationData[type].status === 'rejected'
    }));

    setUploadedDocuments(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        files: [...prev[type].files, ...newFiles]
      }
    }));
  };

  // Update document category
  const updateDocumentCategory = (type, fileId, category) => {
    setUploadedDocuments(prev => {
      const updatedFiles = prev[type].files.map(file =>
        file.id === fileId ? { ...file, category } : file
      );
      
      const selectedFiles = updatedFiles.filter(file => file.category);
      const minRequired = type === 'identity' ? 2 : type === 'professional' ? 4 : 1;
      
      return {
        ...prev,
        [type]: {
          ...prev[type],
          files: updatedFiles,
          canSubmit: selectedFiles.length >= minRequired
        }
      };
    });
  };

  // Remove document
  const removeDocument = (type, fileId) => {
    setUploadedDocuments(prev => {
      const updatedFiles = prev[type].files.filter(file => file.id !== fileId);
      const selectedFiles = updatedFiles.filter(file => file.category);
      const minRequired = type === 'identity' ? 2 : type === 'professional' ? 4 : 1;
      
      const removedFile = prev[type].files.find(file => file.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      
      return {
        ...prev,
        [type]: {
          ...prev[type],
          files: updatedFiles,
          canSubmit: selectedFiles.length >= minRequired
        }
      };
    });
  };

  // Submit documents for verification
// Submit documents for verification
const submitDocumentsForVerification = (type) => {
  const documents = uploadedDocuments[type];
  const selectedFiles = documents.files.filter(file => file.category);
  
  if (!documents.canSubmit) {
    const minRequired = type === 'identity' ? 2 : type === 'professional' ? 4 : 1;
    alert(`Please select categories for at least ${minRequired} documents before submitting.`);
    return;
  }

  const isResubmission = verificationData[type].status === 'rejected';
  const currentDate = new Date().toISOString();

  // Update verification state
  setVerificationData(prev => ({
    ...prev,
    [type]: {
      ...prev[type],
      status: 'under_review',
      documents: selectedFiles.map(file => ({
        ...file,
        status: 'under_review',
        submittedAt: currentDate,
        verifiedAt: null, // Reset these fields
        rejectedAt: null,
        isResubmission: isResubmission
      })),
      submittedAt: currentDate,
      rejectionRemarks: isResubmission ? prev[type].rejectionRemarks : null,
      canResubmit: false,
      resubmissionCount: isResubmission ? prev[type].resubmissionCount + 1 : 0,
      // Clear previous verification/rejection dates when resubmitting
      verifiedAt: null,
      rejectedAt: null
    }
  }));

  // Mark as submitted
  setUploadedDocuments(prev => ({
    ...prev,
    [type]: {
      ...prev[type],
      submitted: true
    }
  }));

  const message = isResubmission 
    ? `${selectedFiles.length} document(s) resubmitted for verification!`
    : `${selectedFiles.length} document(s) submitted for verification!`;
  
  alert(`${message} Review typically takes 2-5 business days.`);
};

  // Mock admin actions for testing (remove in production)
  // Mock admin actions for testing (remove in production)
const simulateAdminAction = (type, action, remarks = '') => {
  setVerificationData(prev => ({
    ...prev,
    [type]: {
      ...prev[type],
      status: action,
      verifiedAt: action === 'verified' ? new Date().toISOString() : prev[type].verifiedAt,
      rejectedAt: action === 'rejected' ? new Date().toISOString() : prev[type].rejectedAt,
      rejectionRemarks: action === 'rejected' ? remarks : prev[type].rejectionRemarks,
      canResubmit: action === 'rejected',
      // UPDATE: Also update the documents array with proper dates
      documents: prev[type].documents.map(doc => ({
        ...doc,
        verifiedAt: action === 'verified' ? new Date().toISOString() : doc.verifiedAt,
        rejectedAt: action === 'rejected' ? new Date().toISOString() : doc.rejectedAt,
        status: action === 'verified' ? 'verified' : action === 'rejected' ? 'rejected' : doc.status
      }))
    }
  }));

  // If rejected, allow new uploads
  if (action === 'rejected') {
    setUploadedDocuments(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        submitted: false,
        files: []
      }
    }));
  }
};


  // Email verification handler
  const handleEmailVerification = () => {
    console.log('Sending email verification...');
    setVerificationData(prev => ({
      ...prev,
      email: { ...prev.email, status: 'pending' }
    }));
    setTimeout(() => {
      alert('Verification email sent! Please check your inbox.');
    }, 1000);
  };
// Add this helper function to detect file types and get appropriate icons
const getFileTypeInfo = (document) => {
  const type = document.type || '';
  const extension = document.name?.split('.').pop()?.toLowerCase() || '';
  
  const fileTypes = {
    // Images
    image: {
      types: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      icon: 'Image',
      color: 'text-green-500',
      canPreview: true
    },
    // PDFs
    pdf: {
      types: ['application/pdf'],
      extensions: ['pdf'],
      icon: 'FileText',
      color: 'text-red-500',
      canPreview: true
    },
    // Word Documents
    word: {
      types: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ],
      extensions: ['doc', 'docx'],
      icon: 'FileText',
      color: 'text-blue-500',
      canPreview: true
    },
    // Excel Spreadsheets
    excel: {
      types: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ],
      extensions: ['xls', 'xlsx'],
      icon: 'Grid3x3',
      color: 'text-green-600',
      canPreview: true
    },
    // PowerPoint Presentations
    powerpoint: {
      types: [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint'
      ],
      extensions: ['ppt', 'pptx'],
      icon: 'Presentation',
      color: 'text-orange-500',
      canPreview: true
    },
    // Text Files
    text: {
      types: ['text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json'],
      extensions: ['txt', 'html', 'css', 'js', 'json', 'xml'],
      icon: 'FileText',
      color: 'text-gray-500',
      canPreview: true
    },
    // Archive Files
    archive: {
      types: ['application/zip', 'application/rar', 'application/7z'],
      extensions: ['zip', 'rar', '7z'],
      icon: 'Archive',
      color: 'text-purple-500',
      canPreview: false
    },
    // Other Files
    other: {
      types: [],
      extensions: [],
      icon: 'File',
      color: 'text-gray-400',
      canPreview: false
    }
  };

  for (const [key, config] of Object.entries(fileTypes)) {
    if (config.types.includes(type) || config.extensions.includes(extension)) {
      return { ...config, category: key };
    }
  }

  return { ...fileTypes.other, category: 'other' };
};

  // Document upload component
  const DocumentUpload = ({ type, onUpload, maxFiles = 5, acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'] }) => {
    const [uploadDragActive, setUploadDragActive] = useState(false);
    const uploadInputRef = useRef(null);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setUploadDragActive(true);
      } else if (e.type === 'dragleave') {
        setUploadDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setUploadDragActive(false);
      
      if (e.dataTransfer.files) {
        const files = Array.from(e.dataTransfer.files).filter(file => 
          acceptedTypes.includes(file.type)
        );
        if (files.length > 0) {
          onUpload(type, files.slice(0, maxFiles));
        }
      }
    };

    const handleFileInputChange = (e) => {
      if (e.target.files) {
        const files = Array.from(e.target.files).filter(file => 
          acceptedTypes.includes(file.type)
        );
        if (files.length > 0) {
          onUpload(type, files.slice(0, maxFiles));
        }
      }
    };

    return (
      <div className="space-y-3">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            uploadDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={uploadInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center">
            <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground mb-1">
              Drop documents here or click to browse
            </h4>
            <p className="text-xs text-muted-foreground">
              Maximum {maxFiles} files • JPG, PNG, PDF up to 10MB each
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => uploadInputRef.current?.click()}
          iconName="FolderOpen"
          iconPosition="left"
          className="w-full"
        >
          Choose Files
        </Button>
      </div>
    );
  };

  const DocumentPreview = ({ 
    type, 
    documents, 
    onCategoryChange, 
    onRemove, 
    categories, 
    submitted, 
    showActions = true,
    verificationStatus = 'not_started' 
  }) => {
    const [viewingDocument, setViewingDocument] = useState(null);
    
    if (documents.length === 0) return null;

    const selectedCount = documents.filter(doc => doc.category).length;
    const minRequired = type === 'identity' ? 2 : type === 'professional' ? 4 : 1;
    const remaining = Math.max(minRequired - selectedCount, 0);
    const canSubmit = selectedCount >= minRequired;
    const showReadyMessage = selectedCount > 0;
    const isResubmission = verificationStatus === 'rejected';

    // Determine title based on verification status
    const getDocumentsTitle = () => {
      switch (verificationStatus) {
        case 'verified':
          return `Verified Documents (${documents.length})`;
        case 'under_review':
          return `Documents Under Review (${documents.length})`;
        case 'rejected':
          return `Previously Rejected Documents (${documents.length})`;
        default:
          return isResubmission ? `Resubmission Documents (${documents.length})` : `Documents (${documents.length})`;
      }
    };

    // Determine background color based on verification status
    const getDocumentBgClass = () => {
      switch (verificationStatus) {
        case 'verified':
          return 'bg-green-50 border-green-200';
        case 'under_review':
          return 'bg-yellow-50 border-yellow-200';
        case 'rejected':
          return 'bg-red-50 border-red-200';
        default:
          return 'bg-muted border-border';
      }
    };

    return (
      <>
        <div className="space-y-4 mt-4">
          <h5 className="text-sm font-medium text-foreground">
            {getDocumentsTitle()}
          </h5>
          
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className={`flex items-start space-x-4 p-4 border rounded-lg ${getDocumentBgClass()}`}>
                {/* Always show clickable preview thumbnail */}
                <div 
                  className="w-16 h-16 flex-shrink-0 border rounded-lg overflow-hidden bg-background cursor-pointer hover:opacity-75 transition-opacity relative group"
                  onClick={() => setViewingDocument(doc)}
                  title="Click to view document"
                >
                  {doc.preview && getFileTypeInfo(doc).category === 'image' ? (
                    <img
                      src={doc.preview}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon 
                        name={getFileTypeInfo(doc).icon} 
                        size={24} 
                        className={getFileTypeInfo(doc).color} 
                      />
                    </div>
                  )}
                  
                  {/* Preview indicator overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="Eye" size={16} className="text-white" />
                    </div>
                  </div>
                  
                  {/* File type badge */}
                  <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {doc.name?.split('.').pop()?.toUpperCase()}
                  </div>
                </div>

                {/* Document details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <button
                          onClick={() => setViewingDocument(doc)}
                          className="p-1 rounded transition-colors hover:bg-gray-200"
                          title="View document"
                        >
                          <Icon 
                            name="Eye" 
                            size={14} 
                            className="text-blue-500 hover:text-blue-700 transition-colors" 
                          />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.type}
                        {doc.isResubmission && <span className="ml-2 text-blue-600 font-medium">• RESUBMISSION</span>}
                        {verificationStatus === 'verified' && <span className="ml-2 text-green-600 font-medium">• VERIFIED</span>}
                        {verificationStatus === 'under_review' && <span className="ml-2 text-yellow-600 font-medium">• UNDER REVIEW</span>}
                        {verificationStatus === 'rejected' && <span className="ml-2 text-red-600 font-medium">• REJECTED</span>}
                      </p>
                   
{doc.rejectedAt && verificationStatus === 'rejected' && (
  <p className="text-xs text-red-600">
    Rejected: {formatDate(doc.rejectedAt)}
  </p>
)} 
{((!doc.rejectedAt && doc.verifiedAt) || verificationStatus === 'verified') && (
  <p className="text-xs text-green-600">
    Verified: {formatDate(doc.verifiedAt)}
  </p>
)}
{(verificationStatus === 'under_review' || (!doc.rejectedAt && !doc.verifiedAt && doc.submittedAt) )&& (
  <p className="text-xs text-muted-foreground">
    Submitted: {formatDate(doc.submittedAt)}
  </p>
)}

                      {doc.category && (
                        <p className="text-xs text-muted-foreground">
                          Category: {categories.find(cat => cat.value === doc.category)?.label}
                        </p>
                      )}
                    </div>
                    
                    {/* Status badge */}
                    <div className="ml-2">
                      {verificationStatus === 'verified' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          VERIFIED
                        </span>
                      )}
                      {verificationStatus === 'under_review' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          UNDER REVIEW
                        </span>
                      )}
                      {verificationStatus === 'rejected' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          REJECTED
                        </span>
                      )}
                    </div>
                    
                    {/* Remove button - only show for new uploads */}
                    {!submitted && showActions && verificationStatus === 'not_started' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(doc.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    )}
                  </div>
                  
                  {/* Category selection - only show for new uploads */}
                  {showActions && verificationStatus === 'not_started' && (
                    <div className="mt-2">
                      <select
                        value={doc.category || ''}
                        onChange={(e) => onCategoryChange && onCategoryChange(doc.id, e.target.value)}
                        disabled={submitted}
                        className="w-full px-3 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      
                      {!doc.category && !submitted && (
                        <p className="text-xs text-red-600 mt-1 font-semibold">Please select category</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submission status - only show for new uploads */}
          {showActions && !submitted && verificationStatus === 'not_started' && (
            <div className="mt-4 p-4 border rounded-lg bg-background">
              {showReadyMessage ? (
                <div className="mb-2">
                  <p className="text-sm font-semibold text-green-600">
                    ✓ Ready to {isResubmission ? 'Resubmit' : 'Submit'}
                  </p>
                </div>
              ) : (
                <div className="mb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Select categories for your documents to prepare for {isResubmission ? 'resubmission' : 'submission'}
                  </p>
                </div>
              )}
              
              {remaining > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-amber-600">
                    You need to select {remaining} more document{remaining !== 1 ? 's' : ''} (minimum {minRequired} required)
                  </p>
                </div>
              )}
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Documents with categories: {selectedCount}/{minRequired}</span>
                  <span>{Math.round((selectedCount / minRequired) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      canSubmit ? 'bg-green-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min((selectedCount / minRequired) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <Button
                variant={canSubmit ? "default" : "outline"}
                onClick={() => submitDocumentsForVerification(type)}
                disabled={!canSubmit}
                iconName="Send"
                iconPosition="left"
                className={`w-full ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {canSubmit 
                  ? `${isResubmission ? 'Resubmit' : 'Submit'} for Verification` 
                  : `Need ${remaining} more document${remaining !== 1 ? 's' : ''}`
                }
              </Button>
            </div>
          )}
        </div>

        {/* Document Viewer Modal - Always available */}
        <DocumentViewer
          document={viewingDocument}
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      </>
    );
  };

  // Categories for different document types
  const documentCategories = {
    identity: [
      { value: 'drivers_license', label: "Driver's License" },
      { value: 'passport', label: 'Passport' },
      { value: 'national_id', label: 'National ID' }
    ],
    professional: [
      { value: 'educational_certificate', label: 'Educational Certificate' },
      { value: 'professional_certification', label: 'Professional Certification' },
      { value: 'training_certificate', label: 'Training Certificate' },
      { value: 'work_experience', label: 'Work Experience' }
    ],
    address: [
      { value: 'utility_bill', label: 'Utility Bill' },
      { value: 'bank_statement', label: 'Bank Statement' },
      { value: 'lease_agreement', label: 'Lease Agreement' },
      { value: 'government_mail', label: 'Government Correspondence' }
    ]
  };
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.title.trim()) {
      newErrors.title = 'Professional title is required';
    }
    
    if (!profileData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (profileData.bio.length < 50) {
      newErrors.bio = 'Bio should be at least 50 characters';
    }
    
    if (profileData.expertise.length === 0) {
      newErrors.expertise = 'At least one skill is required';
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

  const handleExpertiseChange = (expertise) => {
    const skills = expertise.split(',').map(item => item.trim()).filter(Boolean);
    setProfileData(prev => ({ ...prev, expertise: skills }));
    if (errors.expertise) {
      setErrors(prev => ({ ...prev, expertise: undefined }));
    }
  };

  const handleLanguagesChange = (languages) => {
    const langArray = languages.split(',').map(item => item.trim()).filter(Boolean);
    setProfileData(prev => ({ ...prev, languages: langArray }));
  };

  const handleCertificationChange = (certifications) => {
    const certArray = certifications.split('\n').filter(Boolean);
    setProfileData(prev => ({ ...prev, certifications: certArray }));
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

  // Updated save handler - returns to public view
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving profile data:', profileData);
      setOriginalData({ ...profileData });
      setIsEditing(false); // Exit edit mode
      setActiveTab('public'); // Return to public tab
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Updated cancel handler
  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
    setActiveTab('public'); // Return to public tab
    setErrors({});
    setSuccessMessage('');
  };

  // Updated edit handler - switches to edit mode
  const handleEditClick = () => {
    setIsEditing(true);
    setActiveTab('public'); // Ensure we're on public tab
  };

  const hasChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalData);
  };
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Analytics/Statistics rendering
  const getOptimizedData = (timeframe) => {
    const rawData = getFilteredData(timeframe);
    
    // Optimize data points based on timeframe
    switch(timeframe) {
      case '7d':
        return rawData; // Show all points for 7 days
      case '30d':
        return reduceDataPoints(rawData, 15); // Show every 2nd day approximately
      case '90d':
        return reduceDataPoints(rawData, 18); // Show weekly points approximately
      default:
        return rawData;
    }
  };
  const reduceDataPoints = (data, maxPoints) => {
    if (data.length <= maxPoints) return data;
    
    const step = Math.ceil(data.length / maxPoints);
    const filtered = data.filter((_, index) => index % step === 0);
    
    // Always include the last data point
    if (filtered[filtered.length - 1] !== data[data.length - 1]) {
      filtered.push(data[data.length - 1]);
    }
    
    return filtered;
  };

// Then modify your renderAnalytics function like this:
  const renderAnalytics = () => {
    // Get filtered data based on selected timeframe
    const profileViewsData = getOptimizedData(selectedTimeframe);
    const allData = getFilteredData(selectedTimeframe); // Keep all data for metrics
    const metrics = getMetricsForTimeframe(selectedTimeframe);


    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (selectedTimeframe === '90d') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (selectedTimeframe === '30d') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      }
    };

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 border border-border rounded-lg shadow-lg">
            <p className="font-medium">{new Date(label).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${entry.value.toLocaleString()}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    // Dynamic title based on timeframe
    const getTimeframeLabel = () => {
      switch(selectedTimeframe) {
        case '7d': return 'Last 7 Days';
        case '30d': return 'Last 30 Days';
        case '90d': return 'Last 90 Days';
        default: return 'Last 30 Days';
      }
    };

    return (
      <div className="space-y-6">
        {/* Performance Overview Cards */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Profile Performance</h3>
            <div className="flex space-x-2">
              {['7d', '30d', '90d'].map((period) => (
                <Button
                  key={period}
                  variant={selectedTimeframe === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Users" size={24} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{profileData.statistics.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
              <div className={`text-xs mt-1 ${metrics.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.change} this period
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Video" size={24} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{profileData.statistics.totalWebinars}</div>
              <div className="text-sm text-muted-foreground">Webinars Conducted</div>
              <div className="text-xs text-green-600 mt-1">
                +{selectedTimeframe === '7d' ? '1' : selectedTimeframe === '30d' ? '3' : '8'} this period
              </div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Star" size={24} className="text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{profileData.statistics.averageRating}/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
              <div className="text-xs text-green-600 mt-1">
                +{selectedTimeframe === '7d' ? '0.1' : selectedTimeframe === '30d' ? '0.2' : '0.4'} this period
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Clock" size={24} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{metrics.avgViews}</div>
              <div className="text-sm text-muted-foreground">Avg Daily Views</div>
              <div className={`text-xs mt-1 ${metrics.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.change} this period
              </div>
            </div>
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="CheckCircle" size={24} className="text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-indigo-600">{profileData.statistics.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <div className="text-xs text-green-600 mt-1">
                +{selectedTimeframe === '7d' ? '1' : selectedTimeframe === '30d' ? '2' : '5'}% this period
              </div>
            </div>
            
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="MessageSquare" size={24} className="text-pink-600" />
              </div>
              <div className="text-2xl font-bold text-pink-600">{profileData.statistics.responseRate}%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
              <div className="text-xs text-red-600 mt-1">
                -{selectedTimeframe === '7d' ? '0.5' : selectedTimeframe === '30d' ? '1' : '2'}% this period
              </div>
            </div>
          </div>
        </div>

        {/* Profile Views and Engagement Chart */}
            {/* Improved Profile Views and Engagement Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              Profile Views & Engagement ({getTimeframeLabel()})
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Total Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Unique Visitors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Profile Clicks</span>
              </div>
            </div>
          </div>
          
          {profileViewsData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profileViewsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#666"
                    interval={0} // Show all ticks since we've already reduced data
                    angle={selectedTimeframe === '90d' ? -45 : 0}
                    textAnchor={selectedTimeframe === '90d' ? 'end' : 'middle'}
                    height={selectedTimeframe === '90d' ? 80 : 60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {/* Use non-stacked areas to avoid overlap confusion */}
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Total Views"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uniqueVisitors" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name="Unique Visitors"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profileClicks" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    fillOpacity={0.3}
                    name="Profile Clicks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No data available for selected period</p>
              </div>
            </div>
          )}

          {/* Enhanced Summary Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {allData.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {Math.round(allData.reduce((sum, item) => sum + item.views, 0) / allData.length || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Daily Average</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${metrics.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.change}
              </div>
              <div className="text-xs text-muted-foreground">Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{allData.length || 0}</div>
              <div className="text-xs text-muted-foreground">Days Tracked</div>
            </div>
          </div>

          {/* Data Quality Indicator */}
          <div className="mt-4 text-xs text-muted-foreground text-center">
            {profileViewsData.length !== allData.length && (
              <p>Showing {profileViewsData.length} of {allData.length} data points for clarity</p>
            )}
          </div>
        </div>

      </div>
    );
  };

  // Verification status rendering
   const renderVerification = () => (
    <div className="space-y-6">
      {/* Verification Progress Overview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Account Verification Progress</h3>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Overall Completion</span>
            <span>{getOverallProgress()}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getOverallProgress()}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">{getVerifiedCount()}</div>
            <div className="text-xs text-green-700">Verified</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-lg font-bold text-yellow-600">{getPendingCount()}</div>
            <div className="text-xs text-yellow-700">Under Review</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-gray-600">{getRemainingCount()}</div>
            <div className="text-xs text-gray-700">Not Started</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Benefits of Complete Verification</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Increased trust and credibility with students</li>
            <li>• Higher visibility in search results</li>
            <li>• Access to premium features and higher earnings potential</li>
            <li>• Reduced account limitations and restrictions</li>
          </ul>
        </div>
      </div>

      {/* Email Verification */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationData.email.status === 'verified' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Icon 
                name={verificationData.email.status === 'verified' ? "CheckCircle" : "Mail"} 
                size={20} 
                className={verificationData.email.status === 'verified' ? "text-green-600" : "text-gray-600"}
              />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Email Verification</h4>
              <p className="text-xs text-muted-foreground">Verify your email address for account security</p>
            </div>
          </div>
          {getVerificationBadge(verificationData.email.status)}
        </div>

        {verificationData.email.status === 'verified' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-green-800">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm">Email verified on {formatDate(verificationData.email.verifiedAt)}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We'll send a verification link to your email address. Click the link to complete verification.
            </p>
            <Button variant="default" size="sm" onClick={handleEmailVerification}>
              Send Verification Email
            </Button>
          </div>
        )}
      </div>

      {/* Phone Verification */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationData.phone.status === 'verified' ? 'bg-green-100' : 
              phoneVerificationStep === 'code_sent' ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              <Icon 
                name="Phone" 
                size={20} 
                className={
                  verificationData.phone.status === 'verified' ? "text-green-600" : 
                  phoneVerificationStep === 'code_sent' ? "text-yellow-600" : "text-gray-600"
                }
              />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Phone Verification</h4>
              <p className="text-xs text-muted-foreground">Verify your phone number via SMS</p>
            </div>
          </div>
          {getVerificationBadge(verificationData.phone.status)}
        </div>

        {verificationData.phone.status === 'verified' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-green-800">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm">Phone verified on {formatDate(verificationData.phone.verifiedAt)}</span>
            </div>
          </div>
        ) : phoneVerificationStep === 'initial' ? (
          <div className="space-y-3">
            <Input
              type="tel"
              placeholder="Enter your phone number"
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button variant="default" size="sm" onClick={handleStartPhoneVerification}>
              Start Verification
            </Button>
          </div>
        ) : phoneVerificationStep === 'code_sent' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-yellow-800">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
              {phoneTimer > 0 && (
                <div className="flex items-center space-x-1 text-yellow-600">
                  <Icon name="Clock" size={14} />
                  <span className="text-sm font-mono">
                    {Math.floor(phoneTimer / 60)}:{(phoneTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter code"
                className="w-32 font-mono text-center tracking-wider"
                maxLength={6}
                value={phoneCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhoneCode(value);
                }}
              />
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleVerifyPhoneCode}
                disabled={phoneCode.length !== 6}
              >
                Verify
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResendCode}
                disabled={phoneTimer > 0}
              >
                {phoneTimer > 0 ? `Resend (${phoneTimer}s)` : 'Resend Code'}
              </Button>
            </div>
            
            <p className="text-xs text-yellow-700">
              Didn't receive the code? Check your spam folder or try resending after the timer expires.
            </p>
          </div>
        ) : null}
      </div>

      {/* Enhanced Identity Document Verification with All Three Scenarios */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationData.identity.status === 'verified' ? 'bg-green-100' : 
              verificationData.identity.status === 'under_review' ? 'bg-yellow-100' : 
              verificationData.identity.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Icon 
                name="CreditCard" 
                size={20} 
                className={
                  verificationData.identity.status === 'verified' ? "text-green-600" : 
                  verificationData.identity.status === 'under_review' ? "text-yellow-600" : 
                  verificationData.identity.status === 'rejected' ? "text-red-600" : "text-gray-600"
                }
              />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Identity Verification</h4>
              <p className="text-xs text-muted-foreground">Upload government-issued ID documents (minimum 2)</p>
            </div>
          </div>
          {getVerificationBadge(verificationData.identity.status)}
        </div>

        {/* SCENARIO 1: VERIFIED */}
        {verificationData.identity.status === 'verified' ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-800">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm">Identity verified on {formatDate(verificationData.identity.verifiedAt)}</span>
              </div>
            </div>
             <DocumentPreview
              type="identity"
              documents={verificationData.identity.documents}
              onCategoryChange={null}
              onRemove={null}
              categories={documentCategories.identity}
              submitted={true}
              showActions={false}
              verificationStatus="verified"
            />
            {/* <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Verified Documents</h5>
              {verificationData.identity.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {documentCategories.identity.find(cat => cat.value === doc.category)?.label} • Verified {formatDate(doc.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        
        /* SCENARIO 2: UNDER REVIEW */
        ) : verificationData.identity.status === 'under_review' ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                <Icon name="Clock" size={16} />
                <span className="text-sm font-medium">Under Review</span>
              </div>
              <p className="text-sm text-yellow-800">
                Your documents are being reviewed by our team. This typically takes 1-3 business days.
                {verificationData.identity.resubmissionCount > 0 && (
                  <span className="block mt-1 font-medium">
                    Resubmission #{verificationData.identity.resubmissionCount} - Thank you for the updated documents.
                  </span>
                )}
              </p>
            </div>
                
                 <DocumentPreview
              type="identity"
              documents={verificationData.identity.documents}
              onCategoryChange={null}
              onRemove={null}
              categories={documentCategories.identity}
              submitted={true}
              showActions={false}
              verificationStatus="under_review"
            />
            {/* <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Submitted Documents</h5>
              {verificationData.identity.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {doc.name}
                        {doc.isResubmission && <span className="ml-2 text-blue-600 text-xs">[RESUBMITTED]</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {documentCategories.identity.find(cat => cat.value === doc.category)?.label} • Submitted {formatDate(doc.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    UNDER REVIEW
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        
        /* SCENARIO 3: REJECTED WITH RESUBMISSION */
        ) : verificationData.identity.status === 'rejected' ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <Icon name="XCircle" size={16} />
                <span className="text-sm font-medium">Document Rejected</span>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Your identity documents were rejected on {formatDate(verificationData.identity.rejectedAt)}.
                Please review the remarks below and resubmit corrected documents.
              </p>
              
              {verificationData.identity.rejectionRemarks && (
                <div className="bg-red-100 border border-red-300 rounded p-3 mb-3">
                  <h6 className="text-xs font-semibold text-red-900 mb-1">Admin Remarks:</h6>
                  <p className="text-sm text-red-800">{verificationData.identity.rejectionRemarks}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-red-700">
                <Icon name="RefreshCw" size={14} />
                <span className="text-xs">You can upload new documents below to resubmit for verification.</span>
              </div>
            </div>

            {/* Show previously rejected documents */}
            {verificationData.identity.documents.length > 0 && (
               <DocumentPreview
                type="identity"
                documents={verificationData.identity.documents}
                onCategoryChange={null}
                onRemove={null}
                categories={documentCategories.identity}
                submitted={true}
                showActions={false}
                verificationStatus="rejected"
              />
              // <div className="space-y-2">
              //   <h6 className="text-xs font-medium text-muted-foreground">Previously Rejected Documents:</h6>
              //   {verificationData.identity.documents.map((doc) => (
              //     <div key={doc.id} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
              //       <div className="flex items-center space-x-2">
              //         <Icon name="XCircle" size={12} className="text-red-500" />
              //         <span className="text-xs text-red-700">{doc.name}</span>
              //       </div>
              //       <span className="px-1 py-0.5 text-xs rounded bg-red-100 text-red-800">REJECTED</span>
              //     </div>
              //   ))}
              // </div>
            )}

            {/* Resubmission upload area */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Resubmit Corrected Documents</h5>
              <ul className="text-sm text-blue-800 space-y-1 mb-3">
                <li>• Ensure documents are clear and all text is readable</li>
                <li>• Upload both front and back sides if applicable</li>
                <li>• Use high-quality images or PDF scans</li>
              </ul>
            </div>

            <DocumentUpload 
              type="identity"
              onUpload={handleDocumentUpload}
              maxFiles={5}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            {/* <DocumentPreview
              type="identity"
              documents={uploadedDocuments.identity.files}
              onCategoryChange={(fileId, category) => updateDocumentCategory('identity', fileId, category)}
              onRemove={(fileId) => removeDocument('identity', fileId)}
              categories={documentCategories.identity}
              submitted={uploadedDocuments.identity.submitted}
            /> */}
             <DocumentPreview
              type="identity"
              documents={uploadedDocuments.identity.files}
              onCategoryChange={(fileId, category) => updateDocumentCategory('identity', fileId, category)}
              onRemove={(fileId) => removeDocument('identity', fileId)}
              categories={documentCategories.identity}
              submitted={uploadedDocuments.identity.submitted}
              showActions={true}
              verificationStatus="not_started"
            />
          </div>
        
        /* SCENARIO 4: NOT STARTED */
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Required Documents (2 minimum)</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Government-issued ID (Driver's License, Passport, or National ID)</li>
                <li>• Both front and back sides (if applicable)</li>
                <li>• Clear, high-quality images</li>
                <li>• All text must be readable</li>
              </ul>
            </div>

            {!uploadedDocuments.identity.submitted ? (
              <>
                <DocumentUpload 
                  type="identity"
                  onUpload={handleDocumentUpload}
                  maxFiles={5}
                  acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                />
{/* 
                <DocumentPreview
                  type="identity"
                  documents={uploadedDocuments.identity.files}
                  onCategoryChange={(fileId, category) => updateDocumentCategory('identity', fileId, category)}
                  onRemove={(fileId) => removeDocument('identity', fileId)}
                  categories={documentCategories.identity}
                  submitted={uploadedDocuments.identity.submitted}
                /> */}
                  <DocumentPreview
                  type="identity"
                  documents={uploadedDocuments.identity.files}
                  onCategoryChange={(fileId, category) => updateDocumentCategory('identity', fileId, category)}
                  onRemove={(fileId) => removeDocument('identity', fileId)}
                  categories={documentCategories.identity}
                  submitted={uploadedDocuments.identity.submitted}
                  showActions={true}
                  verificationStatus="not_started"
                />
              </>
            ) : null}
          </div>
        )}

        {/* Admin Testing Buttons (Remove in Production) */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="text-xs text-gray-600 mb-2">Admin Testing Actions:</p>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => simulateAdminAction('identity', 'verified')}
            >
              Mark Verified
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => simulateAdminAction('identity', 'rejected', 'Document images are blurry and text is not clearly readable. Please resubmit with high-quality, clear images where all text and details are visible.')}
            >
              Mark Rejected
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => simulateAdminAction('identity', 'under_review')}
            >
              Mark Under Review
            </Button>
          </div>
        </div>
      </div>

      {/* Professional Verification - Same pattern as Identity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationData.professional.status === 'verified' ? 'bg-green-100' : 
              verificationData.professional.status === 'under_review' ? 'bg-yellow-100' : 
              verificationData.professional.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Icon 
                name="Award" 
                size={20} 
                className={
                  verificationData.professional.status === 'verified' ? "text-green-600" : 
                  verificationData.professional.status === 'under_review' ? "text-yellow-600" : 
                  verificationData.professional.status === 'rejected' ? "text-red-600" : "text-gray-600"
                }
              />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Professional Verification</h4>
              <p className="text-xs text-muted-foreground">Upload professional documents (minimum 4)</p>
            </div>
          </div>
          {getVerificationBadge(verificationData.professional.status)}
        </div>
        
         {/* SCENARIO 1: VERIFIED */}
        {verificationData.professional.status === 'verified' ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-800">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm">Professional verified on {formatDate(verificationData.professional.verifiedAt)}</span>
              </div>
            </div>
             <DocumentPreview
              type="professional"
              documents={verificationData.professional.documents}
              onCategoryChange={null}
              onRemove={null}
              categories={documentCategories.professional}
              submitted={true}
              showActions={false}
              verificationStatus="verified"
            />
            {/* <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Verified Documents</h5>
              {verificationData.identity.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {documentCategories.identity.find(cat => cat.value === doc.category)?.label} • Verified {formatDate(doc.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div> */}
          </div>
       
        /* SCENARIO 2: UNDER REVIEW */
        ) : verificationData.professional.status === 'under_review' ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                <Icon name="Clock" size={16} />
                <span className="text-sm font-medium">Under Review</span>
              </div>
              <p className="text-sm text-yellow-800">
                Your documents are being reviewed by our team. This typically takes 1-3 business days.
                {verificationData.professional.resubmissionCount > 0 && (
                  <span className="block mt-1 font-medium">
                    Resubmission #{verificationData.professional.resubmissionCount} - Thank you for the updated documents.
                  </span>
                )}
              </p>
            </div>
                
                 <DocumentPreview
              type="professional"
              documents={verificationData.professional.documents}
              onCategoryChange={null}
              onRemove={null}
              categories={documentCategories.professional}
              submitted={true}
              showActions={false}
              verificationStatus="under_review"
            />
            {/* <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Submitted Documents</h5>
              {verificationData.identity.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {doc.name}
                        {doc.isResubmission && <span className="ml-2 text-blue-600 text-xs">[RESUBMITTED]</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {documentCategories.identity.find(cat => cat.value === doc.category)?.label} • Submitted {formatDate(doc.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    UNDER REVIEW
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        
        /* SCENARIO 3: REJECTED WITH RESUBMISSION */
        ) : verificationData.professional.status === 'rejected' ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <Icon name="XCircle" size={16} />
                <span className="text-sm font-medium">Professional Documents Rejected</span>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Your professional documents were rejected on {formatDate(verificationData.professional.rejectedAt)}.
                Please review the remarks and resubmit corrected documents.
              </p>
              
          
              {verificationData.professional.rejectionRemarks && (
                <div className="bg-red-100 border border-red-300 rounded p-3 mb-3">
                  <h6 className="text-xs font-semibold text-red-900 mb-1">Admin Remarks:</h6>
                  <p className="text-sm text-red-800">{verificationData.professional.rejectionRemarks}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-red-700">
                <Icon name="RefreshCw" size={14} />
                <span className="text-xs">You can upload new documents below to resubmit for verification.</span>
              </div>
            </div>
             {verificationData.professional.documents.length > 0 && (
               <DocumentPreview
                type="professional"
                documents={verificationData.professional.documents}
                onCategoryChange={null}
                onRemove={null}
                categories={documentCategories.professional}
                submitted={true}
                showActions={false}
                verificationStatus="rejected"
              />  )}

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-purple-900 mb-3">Resubmit Professional Documents (4 minimum)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <Icon name="GraduationCap" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Educational Certificates</p>
                    <p className="text-xs text-purple-700">Degrees, diplomas, course completions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="Award" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Professional Certifications</p>
                    <p className="text-xs text-purple-700">AWS, Google Cloud, Microsoft, etc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="BookOpen" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Training Certificates</p>
                    <p className="text-xs text-purple-700">Workshop completions, bootcamps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="Briefcase" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Work Experience</p>
                    <p className="text-xs text-purple-700">Employment letters, recommendations</p>
                  </div>
                </div>
              </div>
            </div>

            <DocumentUpload 
              type="professional"
              onUpload={handleDocumentUpload}
              maxFiles={5}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            {/* <DocumentPreview
              type="identity"
              documents={uploadedDocuments.identity.files}
              onCategoryChange={(fileId, category) => updateDocumentCategory('identity', fileId, category)}
              onRemove={(fileId) => removeDocument('identity', fileId)}
              categories={documentCategories.identity}
              submitted={uploadedDocuments.identity.submitted}
            /> */}
             <DocumentPreview
              type="professional"
              documents={uploadedDocuments.professional.files}
              onCategoryChange={(fileId, category) => updateDocumentCategory('professional', fileId, category)}
              onRemove={(fileId) => removeDocument('professional', fileId)}
              categories={documentCategories.professional}
              submitted={uploadedDocuments.professional.submitted}
              showActions={true}
              verificationStatus="not_started"
            />
          </div>
        
        /* SCENARIO 4: NOT STARTED */
  ) : (
            
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-purple-900 mb-3">Required Professional Documents (4 minimum)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <Icon name="GraduationCap" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Educational Certificates</p>
                    <p className="text-xs text-purple-700">Degrees, diplomas, course completions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="Award" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Professional Certifications</p>
                    <p className="text-xs text-purple-700">AWS, Google Cloud, Microsoft, etc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="BookOpen" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Training Certificates</p>
                    <p className="text-xs text-purple-700">Workshop completions, bootcamps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Icon name="Briefcase" size={16} className="text-purple-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Work Experience</p>
                    <p className="text-xs text-purple-700">Employment letters, recommendations</p>
                  </div>
                </div>
              </div>
            </div>

            {!uploadedDocuments.professional.submitted ? (
              <>
                <DocumentUpload 
                  type="professional"
                  onUpload={handleDocumentUpload}
                  maxFiles={10}
                  acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                />

                <DocumentPreview
                  type="professional"
                  documents={uploadedDocuments.professional.files}
                  onCategoryChange={(fileId, category) => updateDocumentCategory('professional', fileId, category)}
                  onRemove={(fileId) => removeDocument('professional', fileId)}
                  categories={documentCategories.professional}
                  submitted={uploadedDocuments.professional.submitted}
                />
              </>
            ) : null}
   </div>
        )}
            {/* Admin Testing Buttons */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-600 mb-2">Admin Testing Actions:</p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => simulateAdminAction('professional', 'verified')}
                >
                  Mark Verified
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => simulateAdminAction('professional', 'rejected', 'Some certificates appear to be expired or from unrecognized institutions. Please provide valid, current certifications from accredited organizations.')}
                >
                  Mark Rejected
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => simulateAdminAction('professional', 'under_review')}
                >
                  Mark Under Review
                </Button>
              </div>
            </div>
       
      </div>

      {/* Address Verification */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationData.address.status === 'verified' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Icon 
                name="MapPin" 
                size={20} 
                className={verificationData.address.status === 'verified' ? "text-green-600" : "text-gray-600"}
              />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Address Verification</h4>
              <p className="text-xs text-muted-foreground">Verify your residential address</p>
            </div>
          </div>
          {getVerificationBadge(verificationData.address.status)}
        </div>

        {verificationData.address.status === 'verified' ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-green-800">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm">Address verified on {formatDate(verificationData.address.verifiedAt)}</span>
              </div>
            </div>
             <DocumentPreview
              type="address"
              documents={verificationData.address.documents}
              onCategoryChange={null}
              onRemove={null}
              categories={documentCategories.address}
              submitted={true}
              showActions={false}
              verificationStatus="verified"
            />
            {/* <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Verified Documents</h5>
              {verificationData.identity.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {documentCategories.identity.find(cat => cat.value === doc.category)?.label} • Verified {formatDate(doc.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    VERIFIED
                  </span>
                </div>
              ))}
            </div> */}
          </div>
       
        /* SCENARIO 2: UNDER REVIEW */
        ) : verificationData.address.status === 'under_review' ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                <Icon name="Clock" size={16} />
                <span className="text-sm font-medium">Under Review</span>
              </div>
              <p className="text-sm text-yellow-800">
                Your documents are being reviewed by our team. This typically takes 1-3 business days.
                {verificationData.address.resubmissionCount > 0 && (
                  <span className="block mt-1 font-medium">
                    Resubmission #{verificationData.address.resubmissionCount} - Thank you for the updated documents.
                  </span>
                )}
              </p>
            </div>
                
                 <DocumentPreview
              type="address"
              documents={verificationData.address.documents}
              onCategoryChange={null}
              onRemove={null}
              categories={documentCategories.address}
              submitted={true}
              showActions={false}
              verificationStatus="under_review"
            />
            {/* <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Submitted Documents</h5>
              {verificationData.identity.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="FileText" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {doc.name}
                        {doc.isResubmission && <span className="ml-2 text-blue-600 text-xs">[RESUBMITTED]</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {documentCategories.identity.find(cat => cat.value === doc.category)?.label} • Submitted {formatDate(doc.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    UNDER REVIEW
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        
        /* SCENARIO 3: REJECTED WITH RESUBMISSION */
        ) : verificationData.address.status === 'rejected' ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <Icon name="XCircle" size={16} />
                <span className="text-sm font-medium">Address Documents Rejected</span>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Your address documents were rejected on {formatDate(verificationData.address.rejectedAt)}.
                Please review the remarks and resubmit corrected documents.
              </p>
              
          
              {verificationData.address.rejectionRemarks && (
                <div className="bg-red-100 border border-red-300 rounded p-3 mb-3">
                  <h6 className="text-xs font-semibold text-red-900 mb-1">Admin Remarks:</h6>
                  <p className="text-sm text-red-800">{verificationData.address.rejectionRemarks}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-red-700">
                <Icon name="RefreshCw" size={14} />
                <span className="text-xs">You can upload new documents below to resubmit for verification.</span>
              </div>
            </div>
             {verificationData.address.documents.length > 0 && (
               <DocumentPreview
                type="address"
                documents={verificationData.address.documents}
                onCategoryChange={null}
                onRemove={null}
                categories={documentCategories.address}
                submitted={true}
                showActions={false}
                verificationStatus="rejected"
              />  )}

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-purple-900 mb-3">Resubmit Address Documents (4 minimum)</h5>
              <ul className="text-sm text-blue-800 space-y-1 mb-3">
                <li>• Ensure documents are clear and all text is readable</li>
                <li>• Upload both front and back sides if applicable</li>
                <li>• Use high-quality images or PDF scans</li>
              </ul>
            </div>

            <DocumentUpload 
              type="address"
              onUpload={handleDocumentUpload}
              maxFiles={5}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            />

            {/* <DocumentPreview
              type="identity"
              documents={uploadedDocuments.identity.files}
              onCategoryChange={(fileId, category) => updateDocumentCategory('identity', fileId, category)}
              onRemove={(fileId) => removeDocument('identity', fileId)}
              categories={documentCategories.identity}
              submitted={uploadedDocuments.identity.submitted}
            /> */}
             <DocumentPreview
              type="address"
              documents={uploadedDocuments.address.files}
              onCategoryChange={(fileId, category) => updateDocumentCategory('address', fileId, category)}
              onRemove={(fileId) => removeDocument('address', fileId)}
              categories={documentCategories.address}
              submitted={uploadedDocuments.address.submitted}
              showActions={true}
              verificationStatus="not_started"
            />
          </div>
        
        /* SCENARIO 4: NOT STARTED */
  ) : (
            
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <h5 className="text-sm font-medium text-indigo-900 mb-2">Accepted Address Documents</h5>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Utility bills (electricity, water, gas)</li>
                <li>• Bank statements</li>
                <li>• Government correspondence</li>
                <li>• Lease agreements</li>
                <li>• Documents must be dated within the last 3 months</li>
              </ul>
            </div>

            {!uploadedDocuments.address.submitted ? (
              <>
                <DocumentUpload 
                  type="address"
                  onUpload={handleDocumentUpload}
                  maxFiles={3}
                  acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                />

                <DocumentPreview
                  type="address"
                  documents={uploadedDocuments.address.files}
                  onCategoryChange={(fileId, category) => updateDocumentCategory('address', fileId, category)}
                  onRemove={(fileId) => removeDocument('address', fileId)}
                  categories={documentCategories.address}
                  submitted={uploadedDocuments.address.submitted}
                />
              </>
            ) : null}
          </div>
        )}
         {/* Admin Testing Buttons */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-xs text-gray-600 mb-2">Admin Testing Actions:</p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => simulateAdminAction('address', 'verified')}
                >
                  Mark Verified
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => simulateAdminAction('address', 'rejected', 'Some certificates appear to be expired or from unrecognized institutions. Please provide valid, current certifications from accredited organizations.')}
                >
                  Mark Rejected
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => simulateAdminAction('address', 'under_review')}
                >
                  Mark Under Review
                </Button>
              </div>
            </div>
      </div>

      {/* Verification Help & Support */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-4">Need Help?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Common Issues</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Document images are blurry or unclear</li>
              <li>• Information doesn't match profile data</li>
              <li>• Documents are expired or invalid</li>
              <li>• Wrong document type uploaded</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Get Support</h5>
            <div className="space-y-2">
              <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
                Contact Support
              </Button>
              <Button variant="ghost" size="sm" iconName="HelpCircle" iconPosition="left">
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  // Updated public profile render function
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
            <p className="text-xl text-blue-100 mb-2">{profileData.title}</p>
            <p className="text-blue-200 mb-4">{profileData.location} • {profileData.timezone}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {profileData.expertise.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                >
                  {skill}
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
              <div className="text-xs text-blue-200">Rating</div>
            </div>
            <Button
              variant="secondary"
              onClick={handleEditClick} // Updated to use handleEditClick
              iconName="Edit"
              iconPosition="left"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.totalStudents.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Students</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.totalWebinars}</div>
          <div className="text-sm text-muted-foreground">Webinars</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.totalHoursTaught}</div>
          <div className="text-sm text-muted-foreground">Hours Taught</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{profileData.statistics.responseRate}%</div>
          <div className="text-sm text-muted-foreground">Response Rate</div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">About</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">{profileData.bio}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((lang, index) => (
                <span key={index} className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Hourly Rate</h4>
            <p className="text-primary font-semibold text-lg">{profileData.hourlyRate}/hour</p>
          </div>
        </div>
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Briefcase" size={20} className="mr-2" />
            Experience
          </h3>
          <p className="text-muted-foreground">{profileData.experience} in software development</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="GraduationCap" size={20} className="mr-2" />
            Education
          </h3>
          <p className="text-muted-foreground">{profileData.education}</p>
        </div>
      </div>

      {/* Certifications */}
      {profileData.certifications.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Award" size={20} className="mr-2" />
            Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {profileData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-muted-foreground">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expertise */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Code" size={20} className="mr-2" />
          Technical Expertise
        </h3>
        <div className="flex flex-wrap gap-3">
          {profileData.expertise.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Add this new component for document viewing
// Enhanced DocumentViewer component with iframe support for multiple formats
const DocumentViewer = ({ document, isOpen, onClose }) => {
  if (!isOpen || !document) return null;

  const isImage = document.type?.startsWith('image/') || document.preview;
  const isPDF = document.type === 'application/pdf';
  const isOfficeDoc = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint' // .ppt
  ].includes(document.type);
  
  const isTextFile = [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'application/xml'
  ].includes(document.type);

  // Get file URL for iframe
  const getFileUrl = () => {
    if (document.url) return document.url;
    if (document.preview) return document.preview;
    if (document.file && document.file instanceof File) {
      return URL.createObjectURL(document.file);
    }
    return null;
  };

  const fileUrl = getFileUrl();

  // Google Docs Viewer URL for office documents
  const getGoogleViewerUrl = (url) => {
    return `https://docs.google.com/gviewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  // Microsoft Office Online Viewer URL
  const getOfficeViewerUrl = (url) => {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  };

  const renderContent = () => {
    if (!fileUrl) {
      return (
        <div className="text-center p-8">
          <Icon name="AlertCircle" size={64} className="mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">Unable to load document</p>
          <p className="text-sm text-muted-foreground">File URL not available</p>
        </div>
      );
    }

    // Handle Images
    if (isImage) {
      return (
        <div className="flex items-center justify-center p-4">
          <img
            src={fileUrl}
            alt={document.name}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '70vh' }}
          />
        </div>
      );
    }

    // Handle PDF files
    if (isPDF) {
      return (
        <div className="w-full h-full">
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            style={{ minHeight: '70vh' }}
            title={`PDF Viewer - ${document.name}`}
            onError={() => {
              // Fallback if direct PDF viewing fails
              console.log('PDF iframe failed, showing download option');
            }}
          />
          
          {/* PDF Controls */}
          <div className="flex justify-center space-x-2 mt-4 p-2 bg-gray-50 rounded">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = document.name;
                link.click();
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="ExternalLink"
              iconPosition="left"
              onClick={() => window.open(fileUrl, '_blank')}
            >
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    // Handle Office Documents (Word, Excel, PowerPoint)
    if (isOfficeDoc) {
      return (
        <div className="w-full h-full">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <Icon name="Info" size={16} className="inline mr-1" />
              Viewing office document using Microsoft Office Online Viewer
            </p>
          </div>
          
          <iframe
            src={getOfficeViewerUrl(fileUrl)}
            className="w-full border rounded"
            style={{ minHeight: '70vh' }}
            title={`Office Viewer - ${document.name}`}
            onError={() => {
              // Fallback to Google Docs Viewer
              console.log('Office viewer failed, trying Google Docs viewer');
            }}
          />
          
          {/* Office Document Controls */}
          <div className="flex justify-center space-x-2 mt-4 p-2 bg-gray-50 rounded">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={() => window.open(getGoogleViewerUrl(fileUrl), '_blank')}
            >
              View in Google Docs
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = document.name;
                link.click();
              }}
            >
              Download
            </Button>
          </div>
        </div>
      );
    }

    // Handle Text Files
    if (isTextFile) {
      return (
        <div className="w-full h-full">
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              <Icon name="FileText" size={16} className="inline mr-1" />
              Text file content preview
            </p>
          </div>
          
          <iframe
            src={fileUrl}
            className="w-full border rounded"
            style={{ minHeight: '70vh' }}
            title={`Text Viewer - ${document.name}`}
          />
          
          <div className="flex justify-center space-x-2 mt-4 p-2 bg-gray-50 rounded">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = document.name;
                link.click();
              }}
            >
              Download File
            </Button>
          </div>
        </div>
      );
    }

    // Handle other file types with Google Docs Viewer
    return (
      <div className="w-full h-full">
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <p className="text-sm text-purple-800">
            <Icon name="Eye" size={16} className="inline mr-1" />
            Viewing document using Google Docs Viewer
          </p>
        </div>
        
        <iframe
          src={getGoogleViewerUrl(fileUrl)}
          className="w-full border rounded"
          style={{ minHeight: '70vh' }}
          title={`Document Viewer - ${document.name}`}
          onError={() => {
            console.log('Google Docs viewer failed');
          }}
        />
        
        {/* Fallback message */}
        <div className="flex justify-center space-x-2 mt-4 p-2 bg-gray-50 rounded">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => {
              const link = document.createElement('a');
              link.href = fileUrl;
              link.download = document.name;
              link.click();
            }}
          >
            Download File
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconPosition="left"
            onClick={() => window.open(fileUrl, '_blank')}
          >
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="max-w-6xl max-h-[95vh] w-full mx-4 bg-white rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">{document.name}</h3>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-muted-foreground">
                {document.category && `${documentCategories.identity?.find(cat => cat.value === document.category)?.label || 
                  documentCategories.professional?.find(cat => cat.value === document.category)?.label || 
                  documentCategories.address?.find(cat => cat.value === document.category)?.label}`}
              </p>
              <span className="text-xs text-muted-foreground">
                {document.type} • {document.size ? `${(document.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              iconName="Maximize2"
              onClick={() => window.open(fileUrl, '_blank')}
              title="Open in full screen"
            >
              Full Screen
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              title="Close viewer"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>

        {/* Footer with file info */}
       <div className="p-3 bg-gray-50 border-t text-center">
  <p className="text-xs text-muted-foreground">
    {/* Show most recent action first */}
    {document.status === 'rejected' && document.rejectedAt && `Rejected: ${formatDate(document.rejectedAt)} • `}
    {((!document.rejectedAt && document.verifiedAt) || document.status === 'verified') && (`Verified: ${formatDate(document.verifiedAt)} • `)}
    {(document.status === 'under_review' || (!document.rejectedAt && !document.verifiedAt && document.submittedAt) )&& ( `Submitted: ${formatDate(document.submittedAt)} • `)}
    {document.uploadedAt && `Uploaded: ${formatDate(document.uploadedAt)} • `}
    Use Ctrl+scroll to zoom in/out
  </p>
</div>

      </div>
    </div>
  );
};



  

  // Create a separate edit form render function
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
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
            disabled={isSaving || !hasChanges()}
            className={isSaving ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
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
          
          <div className="md:col-span-2">
            <Input
              label="Professional Title *"
              value={profileData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Senior React Developer"
              error={errors.title}
              required
            />
          </div>
          
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
          
          <Input
            label="Experience"
            value={profileData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 5+ years"
          />
          
          <Input
            label="Hourly Rate"
            value={profileData.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            placeholder="e.g., $75"
          />
          
          <div className="md:col-span-2">
            <Input
              label="Education"
              value={profileData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="e.g., M.S. in Computer Science - MIT"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio *
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                errors.bio ? 'border-error' : 'border-border'
              }`}
            />
            {errors.bio && (
              <p className="text-error text-xs mt-1">{errors.bio}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {profileData.bio.length}/500 characters (minimum 50)
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Languages Spoken
            </label>
            <Input
              value={profileData.languages.join(', ')}
              onChange={(e) => handleLanguagesChange(e.target.value)}
              placeholder="English, Spanish, French..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate languages with commas
            </p>
          </div>
        </div>
      </div>

      {/* Skills & Certifications */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="font-medium text-foreground mb-4">Skills & Certifications</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Technical Expertise *
            </label>
            <Input
              value={profileData.expertise.join(', ')}
              onChange={(e) => handleExpertiseChange(e.target.value)}
              placeholder="React, JavaScript, Node.js, TypeScript..."
              error={errors.expertise}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate skills with commas
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Certifications
            </label>
            <textarea
              value={profileData.certifications.join('\n')}
              onChange={(e) => handleCertificationChange(e.target.value)}
              placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional Developer..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-1">
              One certification per line
            </p>
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
          
          <Input
            label="YouTube"
            value={profileData.socialLinks.youtube}
            onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
            placeholder="https://youtube.com/c/username"
            error={errors['socialLinks.youtube']}
          />
          
          <Input
            label="Medium"
            value={profileData.socialLinks.medium}
            onChange={(e) => handleInputChange('socialLinks.medium', e.target.value)}
            placeholder="https://medium.com/@username"
            error={errors['socialLinks.medium']}
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
                Allow students to see your email address on your profile
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
                Allow students to see your phone number on your profile
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
                Let students send you private messages through the platform
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={profileData.contactPreferences.allowBookingRequests}
              onChange={(e) => handleInputChange('contactPreferences.allowBookingRequests', e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-foreground">Allow booking requests</p>
              <p className="text-xs text-muted-foreground">
                Accept requests for private coaching or consultation sessions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const handleRequestPayout = async () => {
    if (!selectedAccount || !payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Please select a bank account and enter a valid payout amount');
      return;
    }

    const amount = parseFloat(payoutAmount);
    if (amount > earnings.availableBalance) {
      alert('Payout amount cannot exceed available balance');
      return;
    }

    setPayoutLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPayout = {
        id: Date.now().toString(),
        amount: amount,
        status: 'processing',
        requestedAt: new Date().toISOString(),
        processedAt: null,
        bankAccount: `${selectedAccount.bankName} ${selectedAccount.accountNumber}`,
        transactionId: `TXN_${Date.now()}`,
        description: `Earnings payout - ${new Date().toLocaleDateString()}`
      };

      setPayoutHistory(prev => [newPayout, ...prev]);
      setEarnings(prev => ({
        ...prev,
        availableBalance: prev.availableBalance - amount,
        pendingAmount: prev.pendingAmount + amount
      }));
      setPayoutAmount('');
      
      alert('Payout requested successfully! Processing typically takes 1-3 business days.');
    } catch (error) {
      alert('Failed to request payout. Please try again.');
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (!newBankAccount.bankName || !newBankAccount.accountNumber || !newBankAccount.routingNumber || !newBankAccount.accountHolderName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const account = {
        id: Date.now().toString(),
        bankName: newBankAccount.bankName,
        accountNumber: `****${newBankAccount.accountNumber.slice(-4)}`,
        accountType: newBankAccount.accountType,
        accountHolderName: newBankAccount.accountHolderName,
        isDefault: bankAccounts.length === 0,
        isVerified: false,
        addedAt: new Date().toISOString()
      };

      setBankAccounts(prev => [...prev, account]);
      setNewBankAccount({
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'savings',
        accountHolderName: ''
      });
      setShowAddBankForm(false);
      
      alert('Bank account added successfully! It will be verified within 1-2 business days.');
    } catch (error) {
      alert('Failed to add bank account. Please try again.');
    }
  };

  const handleRemoveBankAccount = async (accountId) => {
    if (!confirm('Are you sure you want to remove this bank account?')) {
      return;
    }

    try {
      setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
      if (selectedAccount?.id === accountId) {
        setSelectedAccount(bankAccounts.find(acc => acc.id !== accountId) || null);
      }
      alert('Bank account removed successfully');
    } catch (error) {
      alert('Failed to remove bank account');
    }
  };

  const getPayoutStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    const labels = {
      completed: 'Completed',
      processing: 'Processing',
      failed: 'Failed',
      pending: 'Pending'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Render Earnings & Payouts Tab
  const renderEarnings = () => (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Earnings Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="DollarSign" size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(earnings.totalEarnings)}</div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Wallet" size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(earnings.availableBalance)}</div>
            <div className="text-sm text-muted-foreground">Available Balance</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Clock" size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(earnings.pendingAmount)}</div>
            <div className="text-sm text-muted-foreground">Pending Payouts</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="TrendingUp" size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(earnings.thisMonthEarnings)}</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </div>
        </div>
      </div>

      {/* Request Payout */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Request Payout</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Bank Account</label>
              <select
                value={selectedAccount?.id || ''}
                onChange={(e) => {
                  const account = bankAccounts.find(acc => acc.id === e.target.value);
                  setSelectedAccount(account);
                }}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select bank account</option>
                {bankAccounts.filter(acc => acc.isVerified).map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} {account.accountNumber} ({account.accountType})
                    {account.isDefault && ' - Default'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payout Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                min="0"
                max={earnings.availableBalance}
                step="0.01"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum available: {formatCurrency(earnings.availableBalance)}
              </p>
            </div>

            <Button
              variant="default"
              onClick={handleRequestPayout}
              disabled={payoutLoading || !selectedAccount || !payoutAmount}
              iconName="Send"
              iconPosition="left"
              className="w-full"
            >
              {payoutLoading ? 'Processing...' : 'Request Payout'}
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Payout Information</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Payouts are processed within 1-3 business days</li>
              <li>• Minimum payout amount is $10.00</li>
              <li>• Maximum daily payout limit is $10,000</li>
              <li>• Bank account must be verified for payouts</li>
              <li>• Processing fees may apply for expedited transfers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payout History</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Bank Account</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Transaction ID</th>
                <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(payout.requestedAt)}
                      </p>
                      {payout.processedAt && (
                        <p className="text-xs text-muted-foreground">
                          Processed: {formatDate(payout.processedAt)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-foreground">
                      {formatCurrency(payout.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {payout.bankAccount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {getPayoutStatusBadge(payout.status)}
                    {payout.status === 'failed' && payout.failureReason && (
                      <p className="text-xs text-red-600 mt-1">{payout.failureReason}</p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono text-muted-foreground">
                      {payout.transactionId}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payoutHistory.length === 0 && (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No payout history found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBankAccounts = () => (
    <div className="space-y-6">
      {/* Bank Accounts List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">My Bank Accounts</h3>
          <Button
            variant="default"
            onClick={() => setShowAddBankForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Bank Account
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankAccounts.map((account) => (
            <div key={account.id} className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    account.isVerified ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <Icon 
                      name="CreditCard" 
                      size={20} 
                      className={account.isVerified ? "text-green-600" : "text-yellow-600"}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{account.bankName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {account.accountNumber} • {account.accountType}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {account.isDefault && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Default
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    account.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {account.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Account Holder:</span> {account.accountHolderName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Added:</span> {formatDate(account.addedAt)}
                </p>
              </div>

              <div className="flex space-x-2">
                {!account.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBankAccounts(prev => prev.map(acc => ({
                        ...acc,
                        isDefault: acc.id === account.id
                      })));
                      alert('Default account updated successfully');
                    }}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBankAccount(account.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {bankAccounts.length === 0 && (
          <div className="text-center py-8">
            <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No bank accounts found</p>
            <Button
              variant="default"
              onClick={() => setShowAddBankForm(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Bank Account
            </Button>
          </div>
        )}
      </div>

      {/* Add Bank Account Form */}
      {showAddBankForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Add New Bank Account</h3>
            <Button
              variant="ghost"
              onClick={() => setShowAddBankForm(false)}
              iconName="X"
              iconPosition="left"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Bank Name *"
                value={newBankAccount.bankName}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, bankName: e.target.value }))}
                placeholder="e.g., Chase Bank, Wells Fargo"
                required
              />

              <Input
                label="Account Holder Name *"
                value={newBankAccount.accountHolderName}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountHolderName: e.target.value }))}
                placeholder="Full name as on bank account"
                required
              />

              <Input
                label="Account Number *"
                value={newBankAccount.accountNumber}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="Enter your account number"
                type="password"
                required
              />

              <Input
                label="Routing Number *"
                value={newBankAccount.routingNumber}
                onChange={(e) => setNewBankAccount(prev => ({ ...prev, routingNumber: e.target.value }))}
                placeholder="9-digit routing number"
                maxLength="9"
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Account Type *</label>
                <select
                  value={newBankAccount.accountType}
                  onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountType: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              <Button
                variant="default"
                onClick={handleAddBankAccount}
                iconName="Plus"
                iconPosition="left"
                className="w-full"
              >
                Add Bank Account
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Security Information</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Your bank account information is encrypted and secure</li>
                <li>• We use bank-level security protocols</li>
                <li>• Account verification typically takes 1-2 business days</li>
                <li>• You can add multiple accounts but only one can be default</li>
                <li>• We never store your full account number</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Security */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Security & Verification</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Bank Account Verification Process</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Add Account Details</p>
                  <p className="text-xs text-muted-foreground">Enter your bank account information securely</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Micro-Deposits</p>
                  <p className="text-xs text-muted-foreground">We'll send 1-2 small deposits to verify your account</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Confirm Amounts</p>
                  <p className="text-xs text-muted-foreground">Enter the deposit amounts to complete verification</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Security Features</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="Shield" size={16} />
                <span className="text-sm">256-bit SSL encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="Lock" size={16} />
                <span className="text-sm">PCI DSS compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="Eye" size={16} />
                <span className="text-sm">Account numbers are masked</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Icon name="AlertTriangle" size={16} />
                <span className="text-sm">Fraud monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/instructor-dashboard' },
    { label: 'Instructor Profile', href: null }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Instructor Profile</h1>
          <p className="text-text-secondary">Manage your public profile and professional information</p>
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
                        setIsEditing(false); // Exit edit mode when switching to other tabs
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
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'verification' && renderVerification()}
             {activeTab === 'earnings' && renderEarnings()}
               {activeTab === 'bank-accounts' && renderBankAccounts()}
       
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
