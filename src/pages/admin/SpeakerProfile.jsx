import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion } from 'framer-motion';
import { Checkbox } from '../../components/ui/Checkbox';
import InstructorAPI from 'services/InstructorAPI';
import { ToastContext } from 'contexts/ToastContext';
import { useAuth } from 'contexts/AuthContext';

import CountryList from 'country-list-with-dial-code-and-flag';
import Select from 'components/ui/Select';
const SpeakerProfile = () => {
  const navigate = useNavigate();
  
  
  const { id } = useParams();
  const { showToast } = useContext(ToastContext);
 const allCountries = CountryList.getAll();

  // Using Map for best performance
  const uniqueCountriesMap = new Map();
  allCountries.forEach(country => {
    if (!uniqueCountriesMap.has(country.code)) {
      uniqueCountriesMap.set(country.code, country);
    }
  });
// ${country.flag} 
  const countryOptions = Array.from(uniqueCountriesMap.values())
    .map(country => ({
      value: country.code,
      label: `${country.name}`,
      dialCode: country.dial_code,
      // flag: country.flag,
      name: country.name
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

  // Get USA as default country
  const defaultCountry = CountryList.findOneByCountryCode('US');
  const defaultDialCode = defaultCountry ? defaultCountry.dial_code : '+1';


  
  // Use the proper useAuth hook
  const { user, isAuthenticated } = useAuth();
       const isAdmin = user?.role === 'admin' || 
                      user?.is_staff === true || 
                      user?.is_superuser === true ||
                      user?.permissions?.includes('manage_contacts');
 
  // Determine if this is create mode (no ID) or edit mode (ID exists)
  const isCreateMode = !id;
  const isEditMode = !!id;

  // State declarations - CLEANED to match minimal backend model
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(isCreateMode);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  
  // Admin contact edit permissions - now using proper auth
  const [canEditContact, setCanEditContact] = useState(false);
  const [isContactEditEnabled, setIsContactEditEnabled] = useState(false);
  
  const fileInputRef = useRef(null);

  // CLEANED: Only fields that exist in your minimal Speaker model
  const [profileData, setProfileData] = useState({
    // Basic Info - matching your backend model
    name: '',
    title: '',
    bio: '',
    company: '',
    
    // Contact info (for create mode)
    email: '',
    phone: '',
    
    // Profile photo
    profilePhoto: null,
      country: 'US', // Default to USA
    countryCode: defaultDialCode, // Default to USA dial code
    isVerified: false,
    isActive: true,
    totalSessions: 0
  });

  
  const handleCountryChange = (countryCode) => {
    const selectedCountry = CountryList.findOneByCountryCode(countryCode);
    
    setProfileData((prev) => ({ 
      ...prev, 
      country: countryCode,
      countryCode: selectedCountry ? selectedCountry.dial_code : prev.countryCode
    }));

    // Clear error if exists
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: undefined }));
    }
  };

  // Check if current user is admin - using proper auth system
  useEffect(() => {
    const checkAdminPermissions = () => {
      if (!user) {
        setCanEditContact(false);
        return;
      }
      
      // Check admin permissions based on your user structure
      
      setCanEditContact(isAdmin);
    };
    
    checkAdminPermissions();
  }, [user]);
useEffect(() => {
  if (Object.keys(errors).length > 0) {
    scrollToFirstError();
  }
}, [errors]);

  // ReactQuill configuration for bio field
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block', 'link'
  ];

  // Enhanced scroll to first error
   const scrollToFirstError = (errorKeys = null) => {
    const errorsToCheck = errorKeys || Object.keys(errors);
    
    if (errorsToCheck.length === 0) return;

    // Wait for DOM to update
    setTimeout(() => {
      // Try to find the first error field by common selectors
      const errorSelectors = [
        `[name="${errorsToCheck[0]}"]`,
        `input[name="${errorsToCheck[0]}"]`,
        `select[name="${errorsToCheck[0]}"]`,
        `textarea[name="${errorsToCheck[0]}"]`,
        `.error-field[data-field="${errorsToCheck[0]}"]`,
        `.field-${errorsToCheck[0]}`,
        `#${errorsToCheck[0]}`,
        '.error-border',
        '.border-red-500',
        '.border-destructive'
      ];

      let errorElement = null;

      // Try to find the error element using various selectors
      for (const selector of errorSelectors) {
        errorElement = document.querySelector(selector);
        if (errorElement) break;
      }

      // If we found an error element, scroll to it
      if (errorElement) {
        // Check if element is in a scrollable container or if we need to scroll the page
        const rect = errorElement.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;

        if (!isVisible) {
          // Scroll element into view with some offset for better UX
          const yOffset = -100; // Offset from top
          const yPosition = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: yPosition,
            behavior: 'smooth'
          });
        }

        // Also focus the element if it's focusable
        if (errorElement.focus && typeof errorElement.focus === 'function') {
          setTimeout(() => {
            errorElement.focus();
          }, 300); // Small delay to ensure smooth scroll completes
        }
      } 
      // else {
      //   // Fallback: scroll to step content if no specific field found
      //   if (stepContentRef.current) {
      //     stepContentRef.current.scrollIntoView({
      //       behavior: 'smooth',
      //       block: 'start'
      //     });
      //   }
      // }
    }, 100);
  };

  // Map API response to component state - CLEANED
  const mapApiResponseToState = (apiData) => {
    if (!apiData) {
      console.warn('mapApiResponseToState called with null/undefined apiData');
      return;
    }
   const fullPhone = apiData.phone || apiData.user_phone || (apiData.user ? apiData.user.phone : '');
    const { countryCode, phoneNumber } = splitPhone(fullPhone);

    // Extract country code from dial code
    let countryCodeFromDialCode = 'US'; // default
    if (countryCode) {
      const foundCountry = allCountries.find(c => c.dial_code === countryCode);
      if (foundCountry) {
        countryCodeFromDialCode = foundCountry.code;
      }
    }
    // Map only existing backend fields
    const mappedProfileData = {
      name: apiData.full_name || '',
      title: apiData.title || '',
      bio: apiData.bio || '',
      company: apiData.company || '',
      email: apiData.email || (apiData.user ? apiData.user.email : ''),
      // phone: apiData.phone || apiData.user_phone || (apiData.user ? apiData.user.phone : ''),
  //  countryCode: countryCode,  // Set separately
  //   phone: phone,
   countryCode: countryCode,
      phone: phoneNumber,
      country: countryCodeFromDialCode,
      profilePhoto: apiData.avatar ? { preview: apiData.avatar } : null,
      isVerified: apiData.is_verified || false,
      isActive: apiData.is_active || true,
      totalSessions: apiData.total_sessions || 0
    };

    setProfileData(mappedProfileData);
    setOriginalData({ ...mappedProfileData });
  };
const splitPhone = (fullPhone = '') => {
  const match = fullPhone.match(/^(\+\d+)\s*(.*)$/);
  if (match) {
    return {
      countryCode: match[1],
      phoneNumber: match[2]
    };
  }
  return {
    countryCode: '',
    phoneNumber: fullPhone // fallback as whole
  };
};
  // Map component state to API request format - CLEANED
  const mapStateToApiRequest = (profileData) => {
    const baseData = {
      title: profileData.title,
      bio: profileData.bio,
      company: profileData.company,
    };

    // Include user fields for creation or when contact editing is enabled
    if (isCreateMode || (isEditMode && isContactEditEnabled)) {
       const fullPhone = `${profileData.countryCode} ${profileData.phone}`.trim();

      return {
        ...baseData,
        email: profileData.email,
        // phone: profileData.phone,
 phone: fullPhone,
        ...(isCreateMode && {
          first_name: profileData.name.split(' ')[0],
          last_name: profileData.name.split(' ').slice(1).join(' ') || 'User'
        })
      };
    }

    return baseData;
  };

  // Load data from API on component mount (only for edit mode)
  useEffect(() => {
    if (isEditMode && isAuthenticated) {
      const fetchInstructorData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Use getAuthHeaders() for authenticated requests
          const apiData = await InstructorAPI.getProfile(id);
          
          if (apiData) {
            mapApiResponseToState(apiData);
          } else {
            setError('No profile data received');
          }
        } catch (error) {
          console.error('Error loading instructor data:', error);
          setError(error.message);
          showToast('Failed to load profile data', 'error');
        } finally {
          setLoading(false);
        }
      };
      
      fetchInstructorData();
    } else if (!isAuthenticated && isEditMode) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      setLoading(false);
      setOriginalData({ ...profileData });
    }
  }, [id, isAuthenticated]);

  // Form validation - CLEANED
  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profileData?.title?.trim()) {
      newErrors.title = 'Professional title is required';
    }
    if (!profileData?.bio?.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (profileData?.bio.replace(/<[^>]*>/g, '').length < 50) {
      newErrors.bio = 'Bio should be at least 50 characters';
    }
    
    // Create mode validations OR contact edit mode validations
    if (isCreateMode || (isEditMode && isContactEditEnabled)) {
      if (!profileData?.email?.trim()) {
        newErrors.email = 'Email is required';
      }
      if (!profileData?.phone?.trim()) {
        newErrors.phone = 'Phone number is required';
      }
        if (!profileData?.country) {
        newErrors.country = 'Country is required';
      }
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        scrollToFirstError();
      }, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced input change handler
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // NEW: Enable contact editing
  const handleEnableContactEdit = () => {
    setIsContactEditEnabled(true);
    showToast('Contact information is now editable', 'info');
  };

  // NEW: Disable contact editing
  const handleDisableContactEdit = () => {
    setIsContactEditEnabled(false);
    if (originalData) {
      setProfileData(prev => ({
        ...prev,
        email: originalData.email,
        phone: originalData.phone,
        country: originalData.country,
        countryCode: originalData.countryCode
      }));
    }
    setErrors(prev => ({ 
      ...prev, 
      email: undefined, 
      phone: undefined,
      country: undefined 
    }));
    showToast('Contact information is now readonly', 'info');
  };

  // Save handler - CLEANED with proper authentication
  const handleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save changes', 'error');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      showToast('Please fix the validation errors before saving', 'error');
      setTimeout(() => {
        scrollToFirstError();
      }, 100);
      return;
    }
    
    setIsSaving(true);
    setErrors({});
    
    try {
      let response;
      const photoFile = profileData.profilePhoto?.file || null;
      const apiRequestData = mapStateToApiRequest(profileData);
      
      // Include auth headers in requests
      // const requestOptions = {
      //   headers: getAuthHeaders()
      // };
      
      if (isCreateMode) {
        response = await InstructorAPI.createProfile(apiRequestData, photoFile);
        showToast('Profile created successfully!', 'success');
        setTimeout(() => navigate(`/admin/instructor-profile/${response.data.id}`), 1000);
      } else {
        response = await InstructorAPI.updateProfile(id, apiRequestData, photoFile);
        showToast('Profile updated successfully!', 'success');
        setIsEditing(false);
        // Reset contact edit mode after successful save
        setIsContactEditEnabled(false);
      }

      if (response && response.data) {
        try {
          mapApiResponseToState(response.data);
        } catch (mappingError) {
          console.warn('Error mapping API response:', mappingError);
        }
        setIsEditing(false);
      }

    } catch (error) {
      console.error('Save error:', error);
      
      if (error.response?.status === 401) {
        showToast('Session expired. Please login again.', 'error');
        navigate('/login');
        return;
      }
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const fieldErrors = {};
          let errorMessages = [];
          
          errorData.errors.forEach(errorObj => {
            Object.keys(errorObj).forEach(field => {
              fieldErrors[field] = errorObj[field];
              errorMessages.push(`${field}: ${errorObj[field]}`);
            });
          });
          
          setErrors(fieldErrors);
          const toastMessage = errorData.message || errorMessages.join(', ');
          showToast(toastMessage, 'error');
          
        } else if (errorData.message) {
          showToast(errorData.message, 'error');
        } else {
          showToast('An error occurred while saving. Please try again.', 'error');
        }
      } else {
        const networkMessage = error.message || 'Network error occurred. Please check your connection.';
        showToast(networkMessage, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are changes
  const hasChanges = () => {
    if (isCreateMode) {
      return profileData.name || profileData.title || profileData.bio;
    }
    return JSON.stringify(profileData) !== JSON.stringify(originalData);
  };

  // Cancel handler
  const handleCancel = () => {
    if (isCreateMode) {
      navigate('/admin/instructors');
    } else {
      setProfileData({ ...originalData });
      setIsEditing(false);
      setIsContactEditEnabled(false); // Reset contact edit mode
    }
    setErrors({});
  };

  // Photo upload handling
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file', 'error');
      setErrors(prev => ({ ...prev, profilePhoto: 'Please upload a valid image file' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be smaller than 5MB', 'error');
      setErrors(prev => ({ ...prev, profilePhoto: 'Image must be smaller than 5MB' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      handleInputChange('profilePhoto', { file, preview: e.target.result });
      setErrors(prev => ({ ...prev, profilePhoto: undefined }));
      showToast('Profile photo uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removePhoto = () => {
    handleInputChange('profilePhoto', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const selectedCountryInfo = profileData.country 
    ? CountryList.findOneByCountryCode(profileData.country)
    : null;

  // Loading state - check authentication first
  if (!isAuthenticated && isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-blue-500 mb-4">
            <Icon name="Lock" size={48} className="mx-auto" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Please login to view this profile</p>
          <Button onClick={() => navigate('/login')} className="w-full sm:w-auto">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 sm:h-32 sm:w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-600">Loading instructor profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 mb-4">
            <Icon name="AlertCircle" size={48} className="mx-auto" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Profile view (for edit mode when not editing)
  const renderProfileView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Profile Header - Fully Responsive */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full"></div>
          <div className="absolute top-6 sm:top-10 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
          <div className="absolute -bottom-8 right-1/3 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Profile Photo - Responsive */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
              {profileData?.profilePhoto ? (
                <Image 
                  src={profileData.profilePhoto.preview} 
                  alt={profileData?.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="User" size={user ? 36 : 48} className="text-white/50" />
                </div>
              )}
            </div>

            {/* Profile Info - Responsive */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{profileData?.name}</h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-2 break-words">{profileData?.title}</p>
              {profileData?.company && (
                <p className="text-blue-200 mb-4 break-words">{profileData.company}</p>
              )}
              
              {/* Status Badges - Responsive */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4 mb-4">
                {profileData?.isVerified && (
                  <span className="px-2 sm:px-3 py-1 bg-green-500/80 rounded-full text-xs sm:text-sm font-medium">
                    ✓ Verified
                  </span>
                )}
                <span className="px-2 sm:px-3 py-1 bg-blue-500/80 rounded-full text-xs sm:text-sm font-medium">
                  {profileData?.totalSessions} Sessions
                </span>
              </div>
            </div>

            {/* Edit Button - Responsive */}
            <div className="flex flex-col items-center space-y-3 w-full lg:w-auto">
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(true)}
                iconName="Edit" 
                iconPosition="left" 
                className="bg-white/20 border-2 border-white/40 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 font-semibold px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm w-full lg:w-auto text-sm sm:text-base"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section - Admin Only - Fully Responsive */}
      {canEditContact && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Mail" size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 ml-3 sm:ml-4">Contact Information</h2>
            </div>
            <div className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium self-start sm:self-auto">
              <Icon name="Shield" size={12} className="inline mr-1" />
              Admin View
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Email - Responsive */}
              <div className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-green-200/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <Icon name="Mail" size={16} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Email Address</p>
                  <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">{profileData?.email || 'Not provided'}</p>
                  <p className="text-xs text-gray-500 mt-1">Primary contact method</p>
                </div>
              </div>
              
              {/* Phone - Responsive */}
              <div className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-green-200/50">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <Icon name="Phone" size={16} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Phone Number</p>
                  <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">{profileData?.countryCode} {profileData?.phone || 'Not provided'}</p>
                  <p className="text-xs text-gray-500 mt-1">Secondary contact method</p>
                </div>
              </div>
            </div>
            
            {/* Contact Actions - Responsive */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => profileData?.email && window.open(`mailto:${profileData.email}`)}
                iconName="Mail"
                iconPosition="left"
                className="text-blue-600 border-blue-300 hover:bg-blue-50 w-full sm:w-auto text-sm"
                disabled={!profileData?.email}
              >
                Send Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => profileData?.phone && window.open(`tel:${profileData?.countryCode}${profileData.phone}`)}
                iconName="Phone"
                iconPosition="left"
                className="text-green-600 border-green-300 hover:bg-green-50 w-full sm:w-auto text-sm"
                disabled={!profileData?.phone}
              >
                Call Phone
              </Button>
              <div className="flex-1 flex justify-center sm:justify-end">
                <p className="text-xs text-gray-500 px-2 py-2 bg-yellow-50 rounded border border-yellow-200 text-center sm:text-left">
                  <Icon name="AlertTriangle" size={12} className="inline mr-1 text-yellow-600" />
                  This information is only visible to administrators
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Section - Fully Responsive */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
            <Icon name="User" size={20} className="text-white sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 ml-3 sm:ml-4">About {isAdmin? "Speaker":"Me"}</h2>
        </div>
        
        {/* Enhanced Bio Content with Your Styling - Responsive */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100">
          <div 
            className="webinar-content text-gray-900 leading-relaxed
                 /* Clean list styling with black text - Responsive */
                 [&>ul]:space-y-2 sm:[&>ul]:space-y-3 [&>ul]:my-4 sm:[&>ul]:my-6 [&>ul]:ml-0 [&>ul]:pl-0
                 [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:list-none
                 [&>ul>li]:text-gray-900 [&>ul>li]:text-sm sm:[&>ul>li]:text-base [&>ul>li]:leading-relaxed
                 
                 /* Content styling with black text - Responsive */
                 [&>h1]:text-gray-900 [&>h1]:text-xl sm:[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-4 sm:[&>h1]:mt-6 [&>h1]:mb-3 sm:[&>h1]:mb-4 [&>h1]:border-b [&>h1]:border-blue-600/50 [&>h1]:pb-2
                 [&>h2]:text-gray-900 [&>h2]:text-lg sm:[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-4 sm:[&>h2]:mt-5 [&>h2]:mb-2 sm:[&>h2]:mb-3
                 [&>h3]:text-gray-900 [&>h3]:text-base sm:[&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-3 sm:[&>h3]:mt-4 [&>h3]:mb-2
                 [&>h4]:text-gray-800 [&>h4]:text-sm sm:[&>h4]:text-base [&>h4]:font-semibold [&>h4]:mt-2 sm:[&>h4]:mt-3 [&>h4]:mb-2
                 [&>p]:text-gray-900 [&>p]:mb-3 sm:[&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-sm sm:[&>p]:text-base
                 [&>strong]:text-gray-900 [&>strong]:text-lg sm:[&>strong]:text-xl [&>strong]:font-bold
                 [&>b]:text-gray-900 [&>b]:font-bold
                 [&>em]:text-blue-700 [&>em]:italic
                 [&>a]:text-blue-600 [&>a]:underline [&>a]:font-medium hover:[&>a]:text-blue-800
                 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 [&>blockquote]:pl-4 sm:[&>blockquote]:pl-6 [&>blockquote]:py-3 sm:[&>blockquote]:py-4 [&>blockquote]:my-4 sm:[&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-blue-800 [&>blockquote]:bg-blue-50
                 [&>code]:bg-gray-100 [&>code]:text-gray-900 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-xs [&>code]:border
                 [&>pre]:bg-gray-100 [&>pre]:text-gray-900 [&>pre]:p-3 sm:[&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-3 sm:[&>pre]:my-4 [&>pre]:border
                 [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-4 sm:[&>img]:my-6 [&>img]:mx-auto [&>img]:shadow-lg
                 [&>table]:w-full [&>table]:bg-white [&>table]:rounded-lg [&>table]:overflow-hidden [&>table]:my-4 sm:[&>table]:my-6 [&>table]:border
                 [&>th]:text-gray-900 [&>th]:font-semibold [&>th]:p-2 sm:[&>th]:p-3 [&>th]:text-left [&>th]:bg-gray-50 [&>th]:border-b [&>th]:text-xs sm:[&>th]:text-sm
                 [&>td]:p-2 sm:[&>td]:p-3 [&>td]:text-gray-900 [&>td]:border-b [&>td]:border-gray-200 [&>td]:text-xs sm:[&>td]:text-sm
                 [&>hr]:border-0 [&>hr]:h-px [&>hr]:bg-gradient-to-r [&>hr]:from-transparent [&>hr]:via-blue-600 [&>hr]:to-transparent [&>hr]:my-4 sm:[&>hr]:my-6"
            dangerouslySetInnerHTML={{ __html: profileData?.bio }}
          />
        </div>
      </div>
      
      {/* Enhanced CSS with Responsive Styling */}
      <style jsx>{`
        .webinar-content ul {
          margin: 16px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        @media (min-width: 640px) {
          .webinar-content ul {
            margin: 24px 0;
            gap: 12px;
          }
        }
        
        .webinar-content ul li {
          display: flex;
          align-items: flex-start;
          list-style: none;
          color: rgb(17, 24, 39);
          font-size: 14px;
          line-height: 1.6;
          font-weight: 500;
        }
        
        @media (min-width: 640px) {
          .webinar-content ul li {
            font-size: 16px;
          }
        }
        
        .webinar-content ul li::before {
          content: '✓';
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: linear-gradient(to right, #3b82f6, #6366f1);
          border-radius: 50%;
          color: white;
          font-size: 10px;
          font-weight: bold;
          margin-right: 10px;
          margin-top: 2px;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        
        @media (min-width: 640px) {
          .webinar-content ul li::before {
            width: 24px;
            height: 24px;
            margin-right: 16px;
            font-size: 12px;
          }
        }
        
        .webinar-content h1 {
          color: rgb(17, 24, 39);
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0 0.75rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(59, 130, 246, 0.5);
        }
        
        @media (min-width: 640px) {
          .webinar-content h1 {
            font-size: 1.5rem;
            margin: 1.5rem 0 1rem 0;
          }
        }
        
        .webinar-content h2 {
          color: rgb(17, 24, 39);
          font-size: 1.125rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        
        @media (min-width: 640px) {
          .webinar-content h2 {
            font-size: 1.25rem;
            margin: 1.25rem 0 0.75rem 0;
          }
        }
        
        .webinar-content h3 {
          color: rgb(17, 24, 39);
          font-size: 1rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem 0;
        }
        
        @media (min-width: 640px) {
          .webinar-content h3 {
            font-size: 1.125rem;
            margin: 1rem 0 0.5rem 0;
          }
        }
        
        .webinar-content h4 {
          color: rgb(31, 41, 55);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0.5rem 0 0.5rem 0;
        }
        
        @media (min-width: 640px) {
          .webinar-content h4 {
            font-size: 1rem;
            margin: 0.75rem 0 0.5rem 0;
          }
        }
        
        .webinar-content p {
          color: rgb(17, 24, 39);
          margin-bottom: 0.75rem;
          line-height: 1.6;
          font-size: 14px;
          font-weight: 400;
        }
        
        @media (min-width: 640px) {
          .webinar-content p {
            margin-bottom: 1rem;
            font-size: 16px;
          }
        }
        
        .webinar-content strong,
        .webinar-content b {
          color: rgb(17, 24, 39);
          font-weight: bold;
        }
        
        .webinar-content em {
          color: rgb(29, 78, 216);
          font-style: italic;
        }
        
        .webinar-content a {
          color: rgb(37, 99, 235);
          text-decoration: underline;
          font-weight: 500;
        }
        
        .webinar-content a:hover {
          color: rgb(29, 78, 216);
        }
        
        .webinar-content blockquote {
          border-left: 4px solid rgb(37, 99, 235);
          background-color: rgba(59, 130, 246, 0.05);
          padding: 0.75rem 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: rgb(29, 78, 216);
        }
        
        @media (min-width: 640px) {
          .webinar-content blockquote {
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
          }
        }
        
        .webinar-content code {
          background-color: rgb(243, 244, 246);
          color: rgb(17, 24, 39);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 12px;
          border: 1px solid rgb(209, 213, 219);
        }
        
        .webinar-content pre {
          background-color: rgb(243, 244, 246);
          color: rgb(17, 24, 39);
          padding: 0.75rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 0.75rem 0;
          border: 1px solid rgb(209, 213, 219);
          font-size: 12px;
        }
        
        @media (min-width: 640px) {
          .webinar-content pre {
            padding: 1rem;
            margin: 1rem 0;
            font-size: 14px;
          }
        }
        
        .webinar-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        @media (min-width: 640px) {
          .webinar-content img {
            margin: 1.5rem auto;
          }
        }
        
        .webinar-content table {
          width: 100%;
          background-color: white;
          border-radius: 0.5rem;
          overflow: hidden;
          margin: 1rem 0;
          border: 1px solid rgb(209, 213, 219);
          font-size: 12px;
        }
        
        @media (min-width: 640px) {
          .webinar-content table {
            margin: 1.5rem 0;
            font-size: 14px;
          }
        }
        
        .webinar-content th {
          background-color: rgb(249, 250, 251);
          color: rgb(17, 24, 39);
          font-weight: 600;
          padding: 0.5rem;
          text-align: left;
          border-bottom: 1px solid rgb(209, 213, 219);
        }
        
        @media (min-width: 640px) {
          .webinar-content th {
            padding: 0.75rem;
          }
        }
        
        .webinar-content td {
          padding: 0.5rem;
          border-bottom: 1px solid rgb(229, 231, 235);
          color: rgb(17, 24, 39);
        }
        
        @media (min-width: 640px) {
          .webinar-content td {
            padding: 0.75rem;
          }
        }
        
        .webinar-content tr:hover {
          background-color: rgb(249, 250, 251);
        }
        
        /* Mobile optimizations */
        @media (max-width: 639px) {
          .webinar-content {
            font-size: 14px;
          }
          
          .webinar-content table {
            font-size: 11px;
          }
          
          .webinar-content th,
          .webinar-content td {
            padding: 0.25rem;
          }
        }
      `}</style>
    </motion.div>
  );

  // Edit form - Fully Responsive
  const renderEditForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Form Header - Responsive */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {isCreateMode ? 'Create Your Instructor Profile' : 'Edit Profile'}
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              iconName="X"
              iconPosition="left"
              disabled={isSaving}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
              disabled={isSaving || (!hasChanges() && !isCreateMode)}
              className={`w-full sm:w-auto text-sm sm:text-base ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSaving ? (isCreateMode ? 'Creating...' : 'Saving...') : (isCreateMode ? 'Create Profile' : 'Save Changes')}
            </Button>
          </div>
        </div>

        {/* Photo Upload - Responsive */}
        <div className="mb-6 sm:mb-8">
          <h4 className="font-medium text-gray-900 mb-4 text-base sm:text-lg">Profile Photo</h4>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mx-auto sm:mx-0">
              {profileData?.profilePhoto ? (
                <Image 
                  src={profileData?.profilePhoto.preview} 
                  alt="Profile photo" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="User" size={28} className="text-gray-400 sm:w-8 sm:h-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div 
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : errors.profilePhoto 
                      ? 'border-red-500' 
                      : 'border-gray-300 hover:border-blue-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                   name="file"
                      id="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Icon name="Upload" size={20} className="mx-auto mb-2 text-gray-400 sm:w-6 sm:h-6" />
                  <p className="text-sm text-gray-900">Drop photo here or click to browse</p>
                  <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                </div>
              </div>
              {errors.profilePhoto && (
                <p className="text-red-500 text-xs mt-1">{errors.profilePhoto}</p>
              )}
              {profileData?.profilePhoto && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removePhoto}
                  iconName="Trash2"
                  iconPosition="left"
                  className="mt-2 w-full sm:w-auto text-xs sm:text-sm"
                >
                  Remove Photo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information - Create Mode OR Edit Mode with Admin Controls - Responsive */}
        {(isCreateMode || isEditMode) && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h4 className="font-medium text-gray-900 text-base sm:text-lg">Contact Information</h4>
              
              {/* Admin Edit Controls for Contact Info - Responsive */}
              {isEditMode && canEditContact && (
                <div className="flex items-center space-x-2">
                  {!isContactEditEnabled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEnableContactEdit}
                      iconName="Unlock"
                      iconPosition="left"
                      className="text-orange-600 border-orange-300 hover:bg-orange-500 text-xs sm:text-sm"
                    >
                      Enable Contact Edit
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisableContactEdit}
                      iconName="Lock"
                      iconPosition="left"
                      className="text-blue-600 border-blue-300 hover:bg-blue-700 text-xs sm:text-sm"
                    >
                      Disable Contact Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Read-only notice for non-admin users - Responsive */}
            {isEditMode && !canEditContact && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Icon name="Info" size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Contact information is read-only. Contact admin to modify email or phone.
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  value={profileData?.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  error={errors.email}
                  required={isCreateMode || isContactEditEnabled}
                  readOnly={isEditMode && !isContactEditEnabled}
                  className={`${isEditMode && !isContactEditEnabled ? 'bg-gray-50 cursor-not-allowed' : ''} text-sm sm:text-base`}
                />
                {isEditMode && !isContactEditEnabled && (
                  <p className="text-xs text-gray-500 mt-1">
                    <Icon name="Lock" size={12} className="inline mr-1" />
                    This field is read-only
                  </p>
                )}
              </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
                         <Select
                        label="Country"
                    name="country"
                    placeholder="Select your country"
                    options={countryOptions}
                    value={profileData.country}
                    onChange={handleCountryChange}
                    error={errors.country}
                    searchable
                    helpText="Select your country of residence"
                    required={isCreateMode || isContactEditEnabled}
                    disabled={isEditMode && !isContactEditEnabled}
                    className={`${isEditMode && !isContactEditEnabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''} text-sm sm:text-base`}
                  />
{/*             
            <Select
  label="Country Code"
  name="countryCode"
  placeholder="Select Country Code"
  options={countryOptions}
  value={profileData.countryCode}
  onChange={handleCountryCodeChange}
  error={errors.countryCode}
  searchable
  required={isCreateMode || isContactEditEnabled}
  disabled={isEditMode && !isContactEditEnabled}  // Add disabled prop
  className={`${isEditMode && !isContactEditEnabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''} text-sm sm:text-base`}
/> */}


{isEditMode && !isContactEditEnabled && (
  <p className="text-xs text-gray-500 mt-1">
    <Icon name="Lock" size={12} className="inline mr-1" />
    This field is read-only
  </p>
)}

             </div><div>
                <Input
                  label="Phone Number"
                  id="phone"
                     name="phone"
                  type="tel"
                  value={profileData?.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  error={errors.phone}
                  required={isCreateMode || isContactEditEnabled}
                  readOnly={isEditMode && !isContactEditEnabled}
                  className={`${isEditMode && !isContactEditEnabled ? 'bg-gray-50 cursor-not-allowed' : ''} text-sm sm:text-base`}
                />
                {isEditMode && !isContactEditEnabled && (
                  <p className="text-xs text-gray-500 mt-1">
                    <Icon name="Lock" size={12} className="inline mr-1" />
                    This field is read-only
                  </p>
                )}   </div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information - Responsive */}
        <div className="mb-6 sm:mb-8">
          <h4 className="font-medium text-gray-900 mb-4 text-base sm:text-lg">Basic Information</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Input
                label="Full Name"
                id="name"
                 name="name"
                value={profileData?.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <Input
                label="Professional Title"
                id="title"
                     name="title"
                value={profileData?.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior React Developer"
                error={errors.title}
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <Input
                label="Company"
                id="company"
                 name="company"
                value={profileData?.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g., Tech Corp Inc."
                error={errors.company}
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                theme="snow"
                value={profileData?.bio}
                onChange={(value) => handleInputChange('bio', value)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                className={`${errors.bio ? 'border-red-500' : ''}`}
                // style={{ height: '150px', marginBottom: '42px' }}
                   style={{
                  minHeight: '200px',
                }}
              />
              {errors.bio && (
                <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {profileData?.bio ? profileData.bio.replace(/<[^>]*>/g, '').length : 0} characters (minimum 50)
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between ">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {isCreateMode ? 'Create Profile' : 'Instructor Profile'}
              </h1>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">
                {isCreateMode 
                  ? 'Set up your professional instructor profile' 
                  : 'Manage your public profile and professional information'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Responsive */}
        <div className="w-full">
          {isCreateMode || isEditing ? renderEditForm() : renderProfileView()}
        </div>
      </div>
    </div>
  );
};

export default SpeakerProfile;
