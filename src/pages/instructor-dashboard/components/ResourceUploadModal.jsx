import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResourceUploadModal = ({ isOpen, onClose, session, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e?.target?.files);
    const validFiles = selectedFiles?.filter(file => {
      if (!allowedTypes?.includes(file?.type)) {
        alert(`${file?.name} is not a supported file type. Please upload PDF or PPT files only.`);
        return false;
      }
      if (file?.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`${file?.name} is too large. Please upload files smaller than 10MB.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles?.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: file?.type,
      status: 'pending'
    }))]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev?.filter(f => f?.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return 'FileText';
    if (type?.includes('presentation')) return 'Presentation';
    return 'File';
  };

  const simulateUpload = (fileId) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'completed' } : f
          ));
          resolve();
        } else {
          setUploadProgress(prev => ({ ...prev, [fileId]: Math.round(progress) }));
        }
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (files?.length === 0) return;

    setUploading(true);
    
    try {
      // Simulate upload for each file
      const uploadPromises = files?.filter(f => f?.status === 'pending')?.map(f => simulateUpload(f?.id));
      
      await Promise.all(uploadPromises);
      
      // Call the onUpload callback with the files
      if (onUpload) {
        await onUpload(session?.id, files);
      }
      
      // Reset state
      setTimeout(() => {
        setFiles([]);
        setUploadProgress({});
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Resources</h2>
            <p className="text-sm text-muted-foreground mt-1">{session?.title}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <div className="p-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6">
            <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Upload Session Resources</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: PDF, PPT, PPTX (Max 10MB each)
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          {/* File List */}
          {files?.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-foreground">Selected Files</h4>
              {files?.map((fileItem) => (
                <div key={fileItem?.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Icon name={getFileIcon(fileItem?.type)} size={20} className="text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{fileItem?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(fileItem?.size)}</p>
                    
                    {fileItem?.status === 'pending' && uploadProgress?.[fileItem?.id] !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress?.[fileItem?.id]}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress?.[fileItem?.id]}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {fileItem?.status === 'completed' && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Icon name="CheckCircle" size={12} className="text-success" />
                        <span className="text-xs text-success">Uploaded</span>
                      </div>
                    )}
                  </div>
                  
                  {fileItem?.status === 'pending' && !uploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(fileItem?.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files?.length === 0 || uploading}
              loading={uploading}
              iconName="Upload"
              iconPosition="left"
              iconSize={16}
            >
              Upload Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadModal;