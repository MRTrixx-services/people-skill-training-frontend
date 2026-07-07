import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const UploadResources = () => {
  const navigate = useNavigate();
  const { webinarId } = useParams(); // Get webinarId from URL params
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [currentWebinar, setCurrentWebinar] = useState(null);
  const [myWebinars, setMyWebinars] = useState([]);
  const [selectedWebinarId, setSelectedWebinarId] = useState(webinarId || '');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentFolder, setCurrentFolder] = useState('root');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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

  // Mock webinars data - filtered by instructor
  useEffect(() => {
    const mockWebinars = [
      {
        id: 'w1',
        title: 'Advanced React Patterns and Performance Optimization',
        date: '2024-12-15',
        status: 'upcoming',
        instructorId: 1 // Current user's webinars
      },
      {
        id: 'w2', 
        title: 'JavaScript ES6+ Deep Dive',
        date: '2024-12-20',
        status: 'upcoming',
        instructorId: 1
      },
      {
        id: 'w3',
        title: 'Node.js Microservices Architecture',
        date: '2024-11-25',
        status: 'completed',
        instructorId: 1
      }
    ];
    setMyWebinars(mockWebinars);

    // Set current webinar if webinarId is provided
    if (webinarId) {
      const webinar = mockWebinars.find(w => w.id === webinarId);
      if (webinar) {
        setCurrentWebinar(webinar);
        setSelectedWebinarId(webinarId);
      }
    }
  }, [webinarId]);

  const fileTypeOptions = [
    { value: '', label: 'All File Types' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'video', label: 'Videos' },
    { value: 'image', label: 'Images' },
    { value: 'document', label: 'Documents' },
    { value: 'archive', label: 'Archives' }
  ];

  // Enhanced folders with webinarId association
  const folders = [
    { 
      id: 'react-patterns', 
      name: 'React Patterns', 
      itemCount: 8, 
      parentId: 'root', 
      webinarId: 'w1',
      description: 'Advanced React concepts and patterns',
      createdAt: '2024-11-20T10:00:00Z'
    },
    { 
      id: 'javascript-fundamentals', 
      name: 'JavaScript Fundamentals', 
      itemCount: 12, 
      parentId: 'root', 
      webinarId: 'w1',
      description: 'Core JavaScript concepts',
      createdAt: '2024-11-18T14:00:00Z'
    },
    { 
      id: 'nodejs-advanced', 
      name: 'Node.js Advanced', 
      itemCount: 6, 
      parentId: 'root', 
      webinarId: 'w2',
      description: 'Advanced Node.js development techniques',
      createdAt: '2024-11-15T09:00:00Z'
    },
    {
      id: 'microservices-patterns',
      name: 'Microservices Patterns',
      itemCount: 10,
      parentId: 'root',
      webinarId: 'w3',
      description: 'Microservices architecture patterns',
      createdAt: '2024-11-10T16:00:00Z'
    },
    {
      id: 'supplementary-materials',
      name: 'Supplementary Materials',
      itemCount: 4,
      parentId: 'react-patterns',
      webinarId: 'w1',
      description: 'Additional learning resources',
      createdAt: '2024-11-22T11:00:00Z'
    }
  ];

  // Enhanced files with webinarId association
  const files = [
    {
      id: 1,
      name: 'React Hooks Cheat Sheet.pdf',
      type: 'pdf',
      size: 2457600,
      uploadDate: '2024-11-20T10:30:00Z',
      downloads: 47,
      views: 125,
      folderId: 'react-patterns',
      webinarId: 'w1',
      thumbnail: null,
      description: 'Comprehensive guide to React Hooks with examples',
      tags: ['react', 'hooks', 'cheatsheet'],
      isPublic: true
    },
    {
      id: 2,
      name: 'Advanced Patterns Presentation.pptx',
      type: 'presentation',
      size: 15728640,
      uploadDate: '2024-11-18T14:20:00Z',
      downloads: 35,
      views: 89,
      folderId: 'react-patterns',
      webinarId: 'w1',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop',
      description: 'Slide deck covering advanced React patterns',
      tags: ['react', 'patterns', 'presentation'],
      isPublic: true
    },
    {
      id: 3,
      name: 'Code Examples.zip',
      type: 'archive',
      size: 5242880,
      uploadDate: '2024-11-15T09:45:00Z',
      downloads: 52,
      views: 78,
      folderId: 'react-patterns',
      webinarId: 'w1',
      thumbnail: null,
      description: 'Complete code examples from the webinar',
      tags: ['code', 'examples', 'source'],
      isPublic: false
    },
    {
      id: 4,
      name: 'ES6 Features Overview.mp4',
      type: 'video',
      size: 125829120,
      uploadDate: '2024-11-10T16:15:00Z',
      downloads: 28,
      views: 134,
      folderId: 'javascript-fundamentals',
      webinarId: 'w1',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&h=120&fit=crop',
      description: 'Video tutorial on ES6 features and syntax',
      tags: ['javascript', 'es6', 'video'],
      isPublic: true
    },
    {
      id: 5,
      name: 'Node.js Best Practices.pdf',
      type: 'pdf',
      size: 3847102,
      uploadDate: '2024-11-12T09:20:00Z',
      downloads: 31,
      views: 67,
      folderId: 'nodejs-advanced',
      webinarId: 'w2',
      thumbnail: null,
      description: 'Best practices for Node.js development',
      tags: ['nodejs', 'best-practices', 'guide'],
      isPublic: true
    },
    {
      id: 6,
      name: 'Microservices Architecture.pdf',
      type: 'pdf',
      size: 4567890,
      uploadDate: '2024-11-08T14:45:00Z',
      downloads: 42,
      views: 95,
      folderId: 'microservices-patterns',
      webinarId: 'w3',
      thumbnail: null,
      description: 'Complete guide to microservices architecture',
      tags: ['microservices', 'architecture', 'patterns'],
      isPublic: true
    }
  ];

  // Helper functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const getFileIcon = (type) => {
    const icons = {
      pdf: 'FileText',
      presentation: 'Presentation',
      video: 'Video',
      image: 'Image',
      document: 'FileText',
      archive: 'Archive'
    };
    return icons[type] || 'File';
  };

  // Filter files by selected webinar ONLY
  const getCurrentFiles = () => {
    return files.filter(file => {
      const matchesWebinar = file.webinarId === selectedWebinarId; // Only current webinar files
      const matchesFolder = file.folderId === currentFolder;
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || file.type === filterType;
      return matchesWebinar && matchesFolder && matchesSearch && matchesType;
    });
  };

  // Filter folders by selected webinar ONLY
  const getCurrentFolders = () => {
    return folders.filter(folder => {
      const matchesWebinar = folder.webinarId === selectedWebinarId; // Only current webinar folders
      const matchesParent = folder.parentId === currentFolder;
      return matchesWebinar && matchesParent;
    });
  };

  // Get webinar statistics
  const getWebinarStats = (webinarId) => {
    const webinarFiles = files.filter(f => f.webinarId === webinarId);
    const webinarFolders = folders.filter(f => f.webinarId === webinarId);
    const totalSize = webinarFiles.reduce((sum, file) => sum + file.size, 0);
    const totalDownloads = webinarFiles.reduce((sum, file) => sum + file.downloads, 0);
    const totalViews = webinarFiles.reduce((sum, file) => sum + file.views, 0);

    return {
      fileCount: webinarFiles.length,
      folderCount: webinarFolders.length,
      totalSize,
      totalDownloads,
      totalViews,
      publicFiles: webinarFiles.filter(f => f.isPublic).length,
      privateFiles: webinarFiles.filter(f => !f.isPublic).length
    };
  };

  // Upload handling with webinar context
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
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    if (!selectedWebinarId) {
      alert('Please select a webinar first to upload files.');
      return;
    }

    const newUploads = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      folderId: currentFolder,
      webinarId: selectedWebinarId, // Associate with selected webinar
      type: getFileTypeFromName(file.name),
      isPublic: false // Default to private
    }));
    
    setUploadQueue(prev => [...prev, ...newUploads]);
    
    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload.id);
    });
  };

  const getFileTypeFromName = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': 'pdf',
      'ppt': 'presentation',
      'pptx': 'presentation',
      'mp4': 'video',
      'avi': 'video',
      'mov': 'video',
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'zip': 'archive',
      'rar': 'archive',
      'doc': 'document',
      'docx': 'document',
      'txt': 'document'
    };
    return typeMap[extension] || 'document';
  };

  const simulateUpload = (uploadId) => {
    const interval = setInterval(() => {
      setUploadQueue(prev => prev.map(upload => {
        if (upload.id === uploadId) {
          const newProgress = Math.min(upload.progress + Math.random() * 15, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...upload, progress: 100, status: 'completed' };
          }
          return { ...upload, progress: newProgress };
        }
        return upload;
      }));
    }, 300);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFileUpload(Array.from(e.target.files));
    }
  };

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleWebinarChange = (webinarId) => {
    setSelectedWebinarId(webinarId);
    setCurrentFolder('root'); // Reset to root when changing webinar
    setSelectedFiles([]); // Clear selections
    
    const webinar = myWebinars.find(w => w.id === webinarId);
    setCurrentWebinar(webinar);
    
    // Update URL
    if (webinarId) {
      navigate(`/instructor/upload-resources/${webinarId}`, { replace: true });
    } else {
      navigate('/instructor/upload-resources', { replace: true });
    }
  };

  // Create new folder for current webinar
  const handleCreateFolder = () => {
    if (!selectedWebinarId) {
      alert('Please select a webinar first.');
      return;
    }

    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder = {
        id: `folder_${Date.now()}`,
        name: folderName,
        itemCount: 0,
        parentId: currentFolder,
        webinarId: selectedWebinarId,
        description: `Folder for ${currentWebinar?.title}`,
        createdAt: new Date().toISOString()
      };
      
      console.log('Creating folder:', newFolder);
      // In real app, this would make API call
      alert(`Folder "${folderName}" created for ${currentWebinar?.title}`);
    }
  };

  // Rest of your existing handlers...
  const handleSelectAll = () => {
    const currentFiles = getCurrentFiles();
    if (selectedFiles.length === currentFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(currentFiles.map(f => f.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length > 0) {
      const confirmed = window.confirm(`Delete ${selectedFiles.length} file(s) from "${currentWebinar?.title}"?`);
      if (confirmed) {
        console.log('Deleting files:', selectedFiles);
        setSelectedFiles([]);
      }
    }
  };

  const handleDeleteFile = (fileId) => {
    const file = files.find(f => f.id === fileId);
    const confirmed = window.confirm(`Are you sure you want to delete "${file?.name}" from "${currentWebinar?.title}"?`);
    if (confirmed) {
      console.log('Deleting file:', fileId);
    }
  };

  const handleDownloadFile = (file) => {
    console.log('Downloading file:', file.name, 'from webinar:', currentWebinar?.title);
  };

  const handleShareFile = (file) => {
    console.log('Sharing file:', file.name, 'from webinar:', currentWebinar?.title);
  };

  const toggleFileVisibility = (fileId) => {
    console.log('Toggling visibility for file:', fileId);
    // In real app, this would make API call to update file.isPublic
  };

  // Navigate to folder
  const handleNavigateToFolder = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedFiles([]);
  };

  // Navigate back to parent folder
  const handleNavigateBack = () => {
    const currentFolderObj = folders.find(f => f.id === currentFolder);
    if (currentFolderObj && currentFolderObj.parentId) {
      setCurrentFolder(currentFolderObj.parentId);
    }
  };

  // File card rendering
  const renderFileCard = (file) => {
    const isSelected = selectedFiles.includes(file.id);
    
    if (viewMode === 'grid') {
      return (
        <div
          key={file.id}
          className={`bg-card border rounded-lg p-4 hover-elevate cursor-pointer transition-all ${
            isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => handleSelectFile(file.id)}
        >
          <div className="aspect-video w-full mb-3 rounded overflow-hidden bg-muted flex items-center justify-center">
            {file.thumbnail ? (
              <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
            ) : (
              <Icon name={getFileIcon(file.type)} size={32} className="text-muted-foreground" />
            )}
            {!file.isPublic && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">
                Private
              </div>
            )}
          </div>
          
          <h3 className="font-medium text-foreground line-clamp-2 mb-2">{file.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{file.description}</p>
          
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{formatFileSize(file.size)}</span>
              <span>{file.downloads} downloads</span>
            </div>
            <div className="flex justify-between">
              <span>{formatDate(file.uploadDate)}</span>
              <span>{file.views} views</span>
            </div>
          </div>
          
          {file.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {file.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-1 py-0.5 text-xs bg-primary/10 text-primary rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between mt-3">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadFile(file);
                }}
                iconName="Download"
                title="Download"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareFile(file);
                }}
                iconName="Share"
                title="Share"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFileVisibility(file.id);
                }}
                iconName={file.isPublic ? "Eye" : "EyeOff"}
                title={file.isPublic ? "Make Private" : "Make Public"}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file.id);
              }}
              iconName="Trash2"
              className="text-error hover:bg-error hover:text-white"
              title="Delete"
            />
          </div>
        </div>
      );
    }
    // List view would be similar but in table format
  };

  const customBreadcrumbs = [
    { label: 'My Dashboard', href: '/instructor' },
    { label: 'Upload Resources', href: '/instructor/upload-resources' },
    ...(currentWebinar ? [{ label: currentWebinar.title, href: null }] : [])
  ];

  const currentFiles = getCurrentFiles();
  const currentFolders = getCurrentFolders();
  const webinarStats = selectedWebinarId ? getWebinarStats(selectedWebinarId) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNavigation
          user={user}
          customBreadcrumbs={customBreadcrumbs}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Resources</h1>
          <p className="text-text-secondary">Manage and organize files for your webinars</p>
        </div>

        {/* Webinar Selection */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Select Webinar</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/instructor/my-webinars')}
              iconName="Eye"
              iconPosition="left"
            >
              View All Webinars
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myWebinars.map(webinar => {
              const stats = getWebinarStats(webinar.id);
              return (
                <div
                  key={webinar.id}
                  onClick={() => handleWebinarChange(webinar.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedWebinarId === webinar.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground line-clamp-2">{webinar.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      webinar.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : webinar.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {webinar.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{formatDate(webinar.date)}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="File" size={12} />
                      <span>{stats.fileCount} files</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Folder" size={12} />
                      <span>{stats.folderCount} folders</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="HardDrive" size={12} />
                      <span>{formatFileSize(stats.totalSize)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Download" size={12} />
                      <span>{stats.totalDownloads} downloads</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {!selectedWebinarId && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Please select a webinar to view and upload resources
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedWebinarId && currentWebinar && (
          <>
            {/* Webinar Statistics */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Resource Statistics for "{currentWebinar.title}"
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Icon name="File" size={20} className="mx-auto mb-1 text-blue-600" />
                  <div className="text-sm font-semibold text-foreground">{webinarStats.fileCount}</div>
                  <div className="text-xs text-muted-foreground">Files</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Icon name="Folder" size={20} className="mx-auto mb-1 text-yellow-600" />
                  <div className="text-sm font-semibold text-foreground">{webinarStats.folderCount}</div>
                  <div className="text-xs text-muted-foreground">Folders</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Icon name="HardDrive" size={20} className="mx-auto mb-1 text-purple-600" />
                  <div className="text-sm font-semibold text-foreground">{formatFileSize(webinarStats.totalSize)}</div>
                  <div className="text-xs text-muted-foreground">Total Size</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Icon name="Download" size={20} className="mx-auto mb-1 text-green-600" />
                  <div className="text-sm font-semibold text-foreground">{webinarStats.totalDownloads}</div>
                  <div className="text-xs text-muted-foreground">Downloads</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Icon name="Eye" size={20} className="mx-auto mb-1 text-cyan-600" />
                  <div className="text-sm font-semibold text-foreground">{webinarStats.totalViews}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Icon name="Globe" size={20} className="mx-auto mb-1 text-emerald-600" />
                  <div className="text-sm font-semibold text-foreground">{webinarStats.publicFiles}/{webinarStats.privateFiles}</div>
                  <div className="text-xs text-muted-foreground">Public/Private</div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Upload Files for "{currentWebinar.title}"
                </h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCreateFolder}
                    iconName="FolderPlus"
                    iconPosition="left"
                  >
                    New Folder
                  </Button>
                  {currentFolder !== 'root' && (
                    <Button
                      variant="outline"
                      onClick={handleNavigateBack}
                      iconName="ArrowLeft"
                      iconPosition="left"
                    >
                      Back
                    </Button>
                  )}
                </div>
              </div>
              
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
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
                  multiple
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Files will be uploaded to: <strong>{currentWebinar.title}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Current folder: <strong>{currentFolder === 'root' ? 'Root' : folders.find(f => f.id === currentFolder)?.name}</strong>
                  </p>
                  <Button
                    variant="default"
                    onClick={() => fileInputRef.current?.click()}
                    iconName="FolderOpen"
                    iconPosition="left"
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadQueue.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-foreground mb-3">Upload Progress</h3>
                  <div className="space-y-3">
                    {uploadQueue.map((upload) => (
                      <div key={upload.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                        <Icon name="File" size={20} className="text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{upload.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(upload.size)} → {currentWebinar.title}
                            </span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                upload.status === 'completed' ? 'bg-success' : 
                                upload.status === 'error' ? 'bg-error' : 'bg-primary'
                              }`}
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-xs font-medium">
                          {upload.status === 'completed' ? (
                            <Icon name="CheckCircle" size={16} className="text-success" />
                          ) : upload.status === 'error' ? (
                            <Icon name="XCircle" size={16} className="text-error" />
                          ) : (
                            `${Math.round(upload.progress)}%`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filters and Controls */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                  />
                  <Select
                    options={fileTypeOptions}
                    value={filterType}
                    onChange={setFilterType}
                    className="w-full sm:w-40"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {selectedFiles.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkDelete}
                        iconName="Trash2"
                        iconPosition="left"
                        className="text-error border-error hover:bg-error hover:text-white"
                      >
                        Delete ({selectedFiles.length})
                      </Button>
                    </div>
                  )}

                  <div className="flex border border-border rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Icon name="Grid" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Icon name="List" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Library */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Resources for "{currentWebinar.title}"
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {currentFiles.length} files • {currentFolders.length} folders
                  </div>
                </div>
                
                {/* Breadcrumb for folder navigation */}
                {currentFolder !== 'root' && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                    <button 
                      onClick={() => setCurrentFolder('root')}
                      className="hover:text-foreground"
                    >
                      Root
                    </button>
                    <Icon name="ChevronRight" size={12} />
                    <span className="text-foreground">
                      {folders.find(f => f.id === currentFolder)?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Folders */}
              {currentFolders.length > 0 && (
                <div className="p-6 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground mb-3">Folders</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentFolders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => handleNavigateToFolder(folder.id)}
                        className="flex items-center space-x-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
                      >
                        <Icon name="Folder" size={24} className="text-primary" />
                        <div>
                          <div className="font-medium text-foreground">{folder.name}</div>
                          <div className="text-xs text-muted-foreground">{folder.itemCount} items</div>
                          <div className="text-xs text-muted-foreground">{formatDate(folder.createdAt)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              <div className="p-6">
                {currentFiles.length > 0 ? (
                  <div className={`${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-2'}`}>
                    {currentFiles.map(renderFileCard)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="FolderOpen" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm || filterType
                        ? 'Try adjusting your search criteria.'
                        : `No files uploaded to ${currentFolder === 'root' ? 'this webinar' : 'this folder'} yet.`}
                    </p>
                    <Button
                      variant="default"
                      onClick={() => fileInputRef.current?.click()}
                      iconName="Upload"
                      iconPosition="left"
                    >
                      Upload Files
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadResources;
