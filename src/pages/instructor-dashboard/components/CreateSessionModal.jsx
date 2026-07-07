import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateSessionModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    price: '',
    category: '',
    maxAttendees: '100'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health & Wellness' }
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.title?.trim()) newErrors.title = 'Title is required';
    if (!formData?.description?.trim()) newErrors.description = 'Description is required';
    if (!formData?.date) newErrors.date = 'Date is required';
    if (!formData?.time) newErrors.time = 'Time is required';
    if (!formData?.price || parseFloat(formData?.price) < 0) newErrors.price = 'Valid price is required';
    if (!formData?.category) newErrors.category = 'Category is required';
    
    // Check if date is in the future
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime <= new Date()) {
      newErrors.date = 'Date and time must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const sessionData = {
        ...formData,
        dateTime: new Date(`${formData.date}T${formData.time}`),
        price: parseFloat(formData?.price),
        duration: parseInt(formData?.duration),
        maxAttendees: parseInt(formData?.maxAttendees)
      };
      
      await onSubmit(sessionData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: '60',
        price: '',
        category: '',
        maxAttendees: '100'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Schedule New Webinar</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Session Title"
                name="title"
                value={formData?.title}
                onChange={handleInputChange}
                placeholder="Enter session title"
                error={errors?.title}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Description"
                name="description"
                value={formData?.description}
                onChange={handleInputChange}
                placeholder="Describe what attendees will learn"
                error={errors?.description}
                required
              />
            </div>
            
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData?.date}
              onChange={handleInputChange}
              error={errors?.date}
              required
            />
            
            <Input
              label="Time"
              name="time"
              type="time"
              value={formData?.time}
              onChange={handleInputChange}
              error={errors?.time}
              required
            />
            
            <Select
              label="Duration"
              options={durationOptions}
              value={formData?.duration}
              onChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
            />
            
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData?.price}
              onChange={handleInputChange}
              placeholder="0.00"
              error={errors?.price}
              required
            />
            
            <Select
              label="Category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              placeholder="Select category"
              error={errors?.category}
              required
            />
            
            <Input
              label="Max Attendees"
              name="maxAttendees"
              type="number"
              min="1"
              max="500"
              value={formData?.maxAttendees}
              onChange={handleInputChange}
              placeholder="100"
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Create Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionModal;