import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, Grid, List, Upload, FolderPlus, ArrowLeft, Trash2, Edit, Eye, Download, File, Folder, FolderOpen, CheckCircle, XCircle, AlertCircle, FileText, Presentation, Video, Image, Archive, X, Plus, Filter } from 'lucide-react';

const WebinarResources = () => {
  const [user, setUser] = useState(null);
  const [webinar, setWebinar] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentFolder, setCurrentFolder] = useState('root');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingItem, setRenamingItem] = useState(null);
  const [folderPermission, setFolderPermission] = useState('public');
  const [uploadPermission, setUploadPermission] = useState('public');
  const fileInputRef = useRef(null);

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
      role: "attendee",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    };
    setUser(mockUser);
  }, []);

  // Mock webinar and resources data
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockWebinar = {
        id: '1',
        title: 'Advanced React Patterns and Performance Optimization',
        instructor: 'Dr. Michael Chen',
        date: '2024-12-15T14:00:00Z',
        status: 'upcoming',
        description: 'Master advanced React patterns including render props, compound components, and performance optimization techniques.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
        category: 'Web Development',
        duration: '2 hours',
        maxAttendees: 50,
        enrolled: 42,
        isEnrolled: true,
        allowResourceAccess: true,
        allowResourceUpload: true
      };
      setWebinar(mockWebinar);
      setIsLoading(false);
    }, 1000);
  }, []);

  const fileTypeOptions = [
    { value: '', label: 'All File Types' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'video', label: 'Videos' },
    { value: 'image', label: 'Images' },
    { value: 'document', label: 'Documents' },
    { value: 'archive', label: 'Archives' }
  ];

  const permissionOptions = [
    { value: 'public', label: 'Public - Everyone can access' },
    { value: 'enrolled', label: 'Enrolled Only - Only enrolled users' },
    { value: 'instructor', label: 'Instructor Only - Private' }
  ];

  // State for folders and files
  const [folders, setFolders] = useState([
    {
      id: 'slides',
      name: 'Presentation Slides',
      itemCount: 5,
      parentId: 'root',
      webinarId: '1',
      description: 'Official presentation materials',
      createdAt: '2024-11-20T10:00:00Z',
      isPublic: true,
      permission: 'public',
      createdBy: 'Dr. Michael Chen'
    },
    {
      id: 'code-examples',
      name: 'Code Examples',
      itemCount: 8,
      parentId: 'root',
      webinarId: '1',
      description: 'Sample code and demos',
      createdAt: '2024-11-18T14:00:00Z',
      isPublic: true,
      permission: 'public',
      createdBy: 'Dr. Michael Chen'
    },
    {
      id: 'assignments',
      name: 'Assignments',
      itemCount: 2,
      parentId: 'root',
      webinarId: '1',
      description: 'Practice exercises and homework',
      createdAt: '2024-11-22T11:00:00Z',
      isPublic: false,
      permission: 'enrolled',
      createdBy: 'Dr. Michael Chen'
    }
  ]);

  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'React Patterns Overview.pdf',
      type: 'pdf',
      size: 3457600,
      uploadDate: '2024-11-20T10:30:00Z',
      downloads: 89,
      views: 145,
      folderId: 'slides',
      webinarId: '1',
      thumbnail: null,
      description: 'Comprehensive overview of React design patterns',
      tags: ['react', 'patterns', 'overview'],
      isPublic: true,
      permission: 'public',
      uploadedBy: 'Dr. Michael Chen'
    },
    {
      id: 2,
      name: 'Performance Optimization Slides.pptx',
      type: 'presentation',
      size: 18728640,
      uploadDate: '2024-11-18T14:20:00Z',
      downloads: 67,
      views: 112,
      folderId: 'slides',
      webinarId: '1',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=120&fit=crop',
      description: 'Interactive presentation on React performance optimization',
      tags: ['react', 'performance', 'optimization'],
      isPublic: true,
      permission: 'public',
      uploadedBy: 'Dr. Michael Chen'
    },
    {
      id: 3,
      name: 'Complete Code Examples.zip',
      type: 'archive',
      size: 8242880,
      uploadDate: '2024-11-15T09:45:00Z',
      downloads: 124,
      views: 89,
      folderId: 'code-examples',
      webinarId: '1',
      thumbnail: null,
      description: 'All code examples demonstrated in the webinar',
      tags: ['code', 'examples', 'complete'],
      isPublic: true,
      permission: 'public',
      uploadedBy: 'Dr. Michael Chen'
    },
    {
      id: 4,
      name: 'React Best Practices.pdf',
      type: 'pdf',
      size: 2567890,
      uploadDate: '2024-11-22T15:30:00Z',
      downloads: 43,
      views: 78,
      folderId: 'root',
      webinarId: '1',
      thumbnail: null,
      description: 'Document outlining React development best practices',
      tags: ['react', 'best-practices', 'guide'],
      isPublic: true,
      permission: 'public',
      uploadedBy: 'Dr. Michael Chen'
    }
  ]);

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
      pdf: FileText,
      presentation: Presentation,
      video: Video,
      image: Image,
      document: FileText,
      archive: Archive
    };
    return icons[type] || File;
  };

  const getPermissionBadge = (permission) => {
    const styles = {
      public: 'bg-green-100 text-green-800 border-green-200',
      enrolled: 'bg-blue-100 text-blue-800 border-blue-200',
      instructor: 'bg-orange-100 text-orange-800 border-orange-200'
    };

    const labels = {
      public: 'Public',
      enrolled: 'Enrolled Only',
      instructor: 'Instructor Only'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[permission]}`}>
        {labels[permission]}
      </span>
    );
  };

  // Filter functions
  const getCurrentFiles = () => {
    return files.filter(file => {
      const matchesFolder = file.folderId === currentFolder;
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || file.type === filterType;
      
      const hasAccess = file.permission === 'public' || 
                       (file.permission === 'enrolled' && webinar?.isEnrolled) ||
                       (file.permission === 'instructor' && user?.role === 'instructor');
      
      return matchesFolder && matchesSearch && matchesType && hasAccess;
    });
  };

  const getCurrentFolders = () => {
    return folders.filter(folder => {
      const matchesParent = folder.parentId === currentFolder;
      
      const hasAccess = folder.permission === 'public' || 
                       (folder.permission === 'enrolled' && webinar?.isEnrolled) ||
                       (folder.permission === 'instructor' && user?.role === 'instructor');
      
      return matchesParent && hasAccess;
    });
  };

  // Folder operations
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert('Please enter a folder name');
      return;
    }

    const newFolder = {
      id: `folder_${Date.now()}`,
      name: newFolderName.trim(),
      itemCount: 0,
      parentId: currentFolder,
      webinarId: '1',
      description: '',
      createdAt: new Date().toISOString(),
      isPublic: folderPermission === 'public',
      permission: folderPermission,
      createdBy: user?.name || 'Current User'
    };

    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setShowCreateFolderModal(false);
    setFolderPermission('public');
    
    alert(`Folder "${newFolder.name}" created successfully!`);
  };

  // File operations
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
    
    if (!webinar?.allowResourceUpload) {
      alert('You do not have permission to upload files to this webinar.');
      return;
    }
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  const handleFileUpload = (filesToUpload) => {
    if (!webinar?.allowResourceUpload) {
      alert('You do not have permission to upload files to this webinar.');
      return;
    }

    const newUploads = filesToUpload.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      folderId: currentFolder,
      webinarId: '1',
      type: getFileTypeFromName(file.name),
      permission: uploadPermission
    }));
    
    setUploadQueue(prev => [...prev, ...newUploads]);
    
    // Simulate upload progress
    newUploads.forEach(upload => {
      simulateUpload(upload.id, upload);
    });

    setShowUploadModal(false);
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

  const simulateUpload = (uploadId, uploadData) => {
    const interval = setInterval(() => {
      setUploadQueue(prev => prev.map(upload => {
        if (upload.id === uploadId) {
          const newProgress = Math.min(upload.progress + Math.random() * 15, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            
            const newFile = {
              id: uploadId,
              name: uploadData.name,
              type: uploadData.type,
              size: uploadData.size,
              uploadDate: new Date().toISOString(),
              downloads: 0,
              views: 0,
              folderId: uploadData.folderId,
              webinarId: uploadData.webinarId,
              thumbnail: null,
              description: `Uploaded by ${user?.name}`,
              tags: [],
              isPublic: uploadData.permission === 'public',
              permission: uploadData.permission,
              uploadedBy: user?.name || 'Current User'
            };
            
            setFiles(prev => [...prev, newFile]);
            
            setFolders(prev => prev.map(folder => 
              folder.id === uploadData.folderId 
                ? { ...folder, itemCount: folder.itemCount + 1 }
                : folder
            ));
            
            return { ...upload, progress: 100, status: 'completed' };
          }
          return { ...upload, progress: newProgress };
        }
        return upload;
      }));
    }, 300);

    setTimeout(() => {
      setUploadQueue(prev => prev.filter(upload => upload.id !== uploadId));
    }, 2000);
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

  const handleDeleteFile = (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

    setFiles(prev => prev.filter(f => f.id !== fileId));
    
    setFolders(prev => prev.map(folder => 
      folder.id === file.folderId 
        ? { ...folder, itemCount: Math.max(0, folder.itemCount - 1) }
        : folder
    ));
    
    alert(`File "${file.name}" deleted successfully!`);
  };

  const handleDownloadFile = (file) => {
    alert(`Downloading: ${file.name}`);
  };

  const handleViewFile = (file) => {
    alert(`Opening: ${file.name}`);
  };

  // Navigation
  const handleNavigateToFolder = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedFiles([]);
  };

  const handleNavigateBack = () => {
    const currentFolderObj = folders.find(f => f.id === currentFolder);
    if (currentFolderObj && currentFolderObj.parentId) {
      setCurrentFolder(currentFolderObj.parentId);
    } else {
      setCurrentFolder('root');
    }
    setSelectedFiles([]);
  };

  // File rendering
  const renderFileCard = (file) => {
    const isSelected = selectedFiles.includes(file.id);
    const FileIconComponent = getFileIcon(file.type);
    
    if (viewMode === 'grid') {
      return (
        <div
          key={file.id}
          className={`bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleSelectFile(file.id)}
        >
          <div className="aspect-video w-full mb-3 rounded overflow-hidden bg-gray-100 flex items-center justify-center relative">
            {file.thumbnail ? (
              <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
            ) : (
              <FileIconComponent size={32} className="text-gray-400" />
            )}
            
            <div className="absolute top-2 right-2">
              {getPermissionBadge(file.permission)}
            </div>
          </div>
          
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{file.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{file.description}</p>
          
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>{formatFileSize(file.size)}</span>
              <span>{file.downloads} downloads</span>
            </div>
            <div className="flex justify-between">
              <span>By {file.uploadedBy}</span>
              <span>{file.views} views</span>
            </div>
            <div className="text-xs text-gray-400">
              {formatDate(file.uploadDate)}
            </div>
          </div>
          
          <div className="flex justify-between mt-3">
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewFile(file);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                title="View"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadFile(file);
                }}
                className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
                title="Download"
              >
                <Download size={14} />
              </button>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file.id);
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      );
    } else {
      // List view
      return (
        <div
          key={file.id}
          className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
            isSelected ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
          }`}
          onClick={() => handleSelectFile(file.id)}
        >
          <div className="flex-shrink-0">
            <FileIconComponent size={24} className="text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
              {getPermissionBadge(file.permission)}
            </div>
            <p className="text-sm text-gray-500 truncate">{file.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
              <span>{formatFileSize(file.size)}</span>
              <span>By {file.uploadedBy}</span>
              <span>{formatDate(file.uploadDate)}</span>
              <span>{file.downloads} downloads</span>
              <span>{file.views} views</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewFile(file);
              }}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadFile(file);
              }}
              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file.id);
              }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      );
    }
  };

  const currentFiles = getCurrentFiles();
  const currentFolders = getCurrentFolders();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading webinar resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={16} />
          <span className="hover:text-blue-600 cursor-pointer">Webinars</span>
          <ChevronRight size={16} />
          <span className="text-gray-900">Resources</span>
        </nav>

        {/* Webinar Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={webinar?.thumbnail}
                alt={webinar?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{webinar?.title}</h1>
              <p className="text-gray-600 mb-4">{webinar?.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Instructor:</span>
                  <div className="font-medium text-gray-900">{webinar?.instructor}</div>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <div className="font-medium text-gray-900">{formatDate(webinar?.date)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <div className="font-medium text-gray-900">{webinar?.duration}</div>
                </div>
                <div>
                  <span className="text-gray-500">Enrolled:</span>
                  <div className="font-medium text-gray-900">{webinar?.enrolled}/{webinar?.maxAttendees}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowCreateFolderModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!webinar?.allowResourceUpload}
              >
                <FolderPlus size={18} />
                <span>Create Folder</span>
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={!webinar?.allowResourceUpload}
              >
                <Upload size={18} />
                <span>Upload Files</span>
              </button>
      
              {currentFolder !== 'root' && (
                <button
                  onClick={handleNavigateBack}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
              )}
              
              {selectedFiles.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm(`Delete ${selectedFiles.length} selected file(s)?`)) {
                      selectedFiles.forEach(fileId => {
                        const file = files.find(f => f.id === fileId);
                        if (file) {
                          setFiles(prev => prev.filter(f => f.id !== fileId));
                        }
                      });
                      setSelectedFiles([]);
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Delete ({selectedFiles.length})</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 w-full sm:w-40 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {fileTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drag and Drop Upload Area */}
        {webinar?.allowResourceUpload && (
          <div
            className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={48} className={`mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {dragActive ? 'Drop files here' : 'Drag and drop files here'}
            </h3>
            <p className="text-gray-500 mb-4">
              or click the upload button to browse files
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Supported: PDF, PPT, DOC, ZIP, Images, Videos</span>
              <span>•</span>
              <span>Max 100MB per file</span>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadQueue.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Upload Progress</h3>
            <div className="space-y-3">
              {uploadQueue.map((upload) => (
                <div key={upload.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <File size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{upload.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(upload.size)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          upload.status === 'completed' ? 'bg-green-500' : 
                          upload.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs font-medium">
                    {upload.status === 'completed' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : upload.status === 'error' ? (
                      <XCircle size={16} className="text-red-500" />
                    ) : (
                      `${Math.round(upload.progress)}%`
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Library */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Webinar Resources
              </h2>
              <div className="text-sm text-gray-500">
                {currentFiles.length} files • {currentFolders.length} folders
              </div>
            </div>
            
            {/* Breadcrumb for folder navigation */}
            {currentFolder !== 'root' && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                <button 
                  onClick={() => setCurrentFolder('root')}
                  className="hover:text-gray-700"
                >
                  All Resources
                </button>
                <ChevronRight size={12} />
                <span className="text-gray-900">
                  {folders.find(f => f.id === currentFolder)?.name}
                </span>
              </div>
            )}
          </div>

          {/* Folders */}
          {currentFolders.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Folders</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className="group flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative"
                  >
                    <button
                      onClick={() => handleNavigateToFolder(folder.id)}
                      className="flex items-center space-x-3 flex-1 text-left"
                    >
                      <Folder size={24} className="text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900">{folder.name}</div>
                        <div className="text-xs text-gray-500">{folder.itemCount} items</div>
                        <div className="text-xs text-gray-400">{formatDate(folder.createdAt)}</div>
                        <div className="mt-1">
                          {getPermissionBadge(folder.permission)}
                        </div>
                      </div>
                    </button>
                    
                    {/* Folder actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button
                        onClick={() => {
                          setRenamingItem({ ...folder, type: 'folder' });
                          setNewFolderName(folder.name);
                          setShowRenameModal(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Rename"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete folder "${folder.name}" and all its contents?`)) {
                            setFolders(prev => prev.filter(f => f.id !== folder.id));
                            setFiles(prev => prev.filter(f => f.folderId !== folder.id));
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
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
                <FolderOpen size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterType
                    ? 'Try adjusting your search criteria.'
                    : currentFolder === 'root' 
                    ? 'No resources have been shared for this webinar yet.'
                    : 'This folder is empty.'}
                </p>
                {webinar?.allowResourceUpload && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Upload First File</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Permission
                  </label>
                  <select
                    value={folderPermission}
                    onChange={(e) => setFolderPermission(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {permissionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateFolderModal(false);
                    setNewFolderName('');
                    setFolderPermission('public');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {showRenameModal && renamingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rename {renamingItem.type === 'folder' ? 'Folder' : 'File'}
              </h3>
              
              <input
                type="text"
                placeholder={`${renamingItem.type === 'folder' ? 'Folder' : 'File'} name`}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowRenameModal(false);
                    setNewFolderName('');
                    setRenamingItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newFolderName.trim() || !renamingItem) return;

                    if (renamingItem.type === 'folder') {
                      setFolders(prev => prev.map(folder => 
                        folder.id === renamingItem.id 
                          ? { ...folder, name: newFolderName.trim() }
                          : folder
                      ));
                    } else {
                      setFiles(prev => prev.map(file => 
                        file.id === renamingItem.id 
                          ? { ...file, name: newFolderName.trim() }
                          : file
                      ));
                    }

                    setNewFolderName('');
                    setRenamingItem(null);
                    setShowRenameModal(false);
                    alert(`${renamingItem.type === 'folder' ? 'Folder' : 'File'} renamed successfully!`);
                  }}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Permission
                  </label>
                  <select
                    value={uploadPermission}
                    onChange={(e) => setUploadPermission(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {permissionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-2">Click to select files</p>
                  <p className="text-sm text-gray-500">
                    Drag and drop files here, or click to browse
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.txt"
                />

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Supported formats: PDF, DOC, PPT, XLS, ZIP, Images, Videos</p>
                  <p>• Maximum file size: 100MB</p>
                  <p>• You can upload multiple files at once</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadPermission('public');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Files
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarResources;