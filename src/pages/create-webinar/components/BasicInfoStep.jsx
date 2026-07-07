import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { ToastContext } from 'contexts/ToastContext';

const MAX_FILE_SIZE_MB = 5;

const BasicInfoStep = ({ 
  formData, 
  onUpdate, 
  onNext, 
  errors = {},
  categories = [],
  speakers = []
}) => {
  const [description, setDescription] = useState(formData?.description || '');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);
  const { showToast } = useContext(ToastContext);

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'blockquote', 'code-block',
    'link', 'color', 'background', 'align'
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  // Convert speakers from API to options format  
  const speakerOptions = speakers.map(speaker => ({
    value: speaker.id.toString(),
    label: `${speaker.full_name}`,
    bio: speaker.bio || speaker.specialization
  }));

  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner', description: 'No prior experience required' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience helpful' },
    { value: 'advanced', label: 'Advanced', description: 'Significant experience required' },
    { value: 'all-levels', label: 'All Levels', description: 'Suitable for everyone' }
  ];

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  // Updated description handler for Quill editor
  const handleDescriptionChange = (content, delta, source, editor) => {
    const htmlContent = content;
    const textContent = editor.getText().trim();
    
    setDescription(htmlContent);
    handleInputChange('description', htmlContent);
    
    // Optional: Store plain text for validation/preview
    handleInputChange('descriptionText', textContent);
  };

  // Get character count from Quill editor
  const getDescriptionLength = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      return editor.getText().length - 1; // Subtract 1 for the trailing newline
    }
    return description.replace(/<[^>]*>/g, '').length;
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileUpload(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Unsupported file type. Please upload an image.', 'error');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showToast(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      handleInputChange('coverImage', {
        file,
        preview: e.target.result,
        name: file.name,
      });
      showToast('Image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileUpload(e?.target?.files?.[0]);
    }
  };

  const removeCoverImage = () => {
    handleInputChange('coverImage', null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
    showToast('Cover image removed', 'info');
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  // Add field reference attributes for error scrolling
  const getFieldProps = (fieldName) => ({
    'data-field': fieldName,
    className: errors?.[fieldName] ? 'error-field' : ''
  });

  // Check if description has meaningful content
  const hasValidDescription = () => {
    if (!description) return false;
    const textContent = description.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Basic Information
        </h2>
        <p className="text-text-secondary">
          Let's start with the essential details about your webinar
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Title Input with error scrolling support */}
          <div {...getFieldProps('title')}>
            <Input
              label="Webinar Title"
              type="text"
              name="title"
              placeholder="Enter an engaging title for your webinar"
              value={formData?.title || ''}
              onChange={(e) => handleInputChange('title', e?.target?.value)}
              error={errors?.title}
              required
              className="w-full"
            />
          </div>

          {/* Rich Text Editor for Description */}
          <div {...getFieldProps('description')}>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-error">*</span>
            </label>
            <div className={`border rounded-lg ${
              errors?.description 
                ? 'border-error' 
                : 'border-border hover:border-primary focus-within:border-primary'
            }`}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={description}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Provide a detailed description of what attendees will learn. Include key topics, benefits, and what makes this webinar unique..."
                style={{
                  minHeight: '200px',
                }}
                className={`custom-quill ${errors?.description ? 'quill-error' : ''}`}
              />
            </div>
            {errors?.description && (
              <p className="mt-1 text-sm text-error">{errors?.description}</p>
            )}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-text-secondary">
                Use the toolbar to format your content with headings, lists, and emphasis
              </p>
              <p className="text-xs text-text-secondary">
                {getDescriptionLength()}/2000 characters
              </p>
            </div>
          </div>

          {/* Category Select with error scrolling support */}
          <div {...getFieldProps('category')}>
            <Select
              label="Category"
              name="category"
              placeholder="Select a category"
              options={categoryOptions}
              value={formData?.category || ''}
              onChange={(value) => handleInputChange('category', value)}
              error={errors?.category}
              required
            />
          </div>

          {/* Skill Level Select with error scrolling support */}
          <div {...getFieldProps('skillLevel')}>
            <Select
              label="Skill Level"
              name="skillLevel"
              placeholder="Select target skill level"
              options={skillLevelOptions}
              value={formData?.skillLevel || ''}
              onChange={(value) => handleInputChange('skillLevel', value)}
              error={errors?.skillLevel}
              required
            />
          </div>

          {/* Speaker Select with error scrolling support */}
          <div {...getFieldProps('speaker')}>
            <Select
              label="Speaker"
              name="speaker"
              placeholder="Select speaker"
              options={speakerOptions}
              value={formData?.speaker || ''}
              onChange={(value) => handleInputChange('speaker', value)}
              error={errors?.speaker}
              required
              searchable
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Cover Image Upload with error scrolling support */}
          <div {...getFieldProps('coverImage')}>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image
            </label>
            
            {formData?.coverImage ? (
              <div className="relative">
                <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={formData?.coverImage?.preview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    {formData?.coverImage?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCoverImage}
                    iconName="X"
                    iconSize={16}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`relative w-full h-48 border-2 border-dashed rounded-lg transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : `border-border hover:border-primary ${errors?.coverImage ? 'border-error' : ''}`
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Icon name="Upload" size={32} color="var(--color-text-secondary)" />
                  <p className="mt-2 text-sm font-medium text-foreground">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    PNG, JPG up to {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>
              </div>
            )}
            
            {errors?.coverImage && (
              <p className="mt-1 text-sm text-error">{errors?.coverImage}</p>
            )}
          </div>

          {/* Enhanced Tips section */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
              <Icon name="Lightbulb" size={16} color="var(--color-accent)" className="mr-2" />
              Tips for a Great Webinar Description
            </h3>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Use a clear, benefit-focused title</li>
              <li>• Structure content with headings and bullet points</li>
              <li>• Highlight specific learning outcomes</li>
              <li>• Include what makes your webinar unique</li>
              <li>• Choose an eye-catching cover image</li>
              <li>• Use formatting to make content scannable</li>
            </ul>
          </div>

          {/* Progress indicator - updated to check description properly */}
          {formData && Object.keys(formData).length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mr-2" />
                Completion Progress
              </h3>
              <div className="space-y-2">
                {[
                  { field: 'title', label: 'Title' },
                  { field: 'description', label: 'Description', validator: hasValidDescription },
                  { field: 'category', label: 'Category' },
                  { field: 'skillLevel', label: 'Skill Level' },
                  { field: 'speaker', label: 'Speaker' }
                ].map(({ field, label, validator }) => {
                  const isCompleted = validator ? validator() : formData?.[field];
                  return (
                    <div key={field} className="flex items-center space-x-2">
                      <Icon 
                        name={isCompleted ? "Check" : "Circle"} 
                        size={14} 
                        className={isCompleted ? 'text-green-600' : 'text-gray-400'}
                      />
                      <span className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {label} {isCompleted ? 'completed' : 'required'}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData?.coverImage ? "Check" : "Circle"} 
                    size={14} 
                    className={formData?.coverImage ? 'text-green-600' : 'text-gray-400'}
                  />
                  <span className={`text-xs ${formData?.coverImage ? 'text-green-600' : 'text-gray-500'}`}>
                    Cover image {formData?.coverImage ? 'uploaded' : 'optional'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-6 border-t border-border">
        <Button
          variant="default"
          onClick={handleNext}
          iconName="ArrowRight"
          iconPosition="right"
          disabled={
            !formData?.title || !hasValidDescription() || !formData?.category || 
            !formData?.skillLevel || !formData?.speaker
          }
        >
          Continue to Scheduling
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
