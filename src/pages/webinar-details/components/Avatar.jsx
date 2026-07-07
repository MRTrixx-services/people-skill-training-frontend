// components/Avatar.jsx
import React, { useState } from 'react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);

  // Extract initials from name
  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === '') return '??';
    
    const names = fullName.trim().split(' ').filter(Boolean);
    
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    // First letter of first name + first letter of last name
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Generate consistent color from name using palette
  const getColorFromPalette = (name) => {
    const colors = [
      '#6366f1', // indigo
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#ef4444', // red
      '#f59e0b', // amber
      '#10b981', // emerald
      '#06b6d4', // cyan
      '#3b82f6', // blue
      '#14b8a6', // teal
      '#f97316', // orange
      '#84cc16', // lime
      '#a855f7', // violet
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeMap = {
    xs: { container: 'w-8 h-8', text: 'text-xs' },
    sm: { container: 'w-10 h-10', text: 'text-sm' },
    md: { container: 'w-12 h-12', text: 'text-base' },
    lg: { container: 'w-16 h-16', text: 'text-lg' },
    xl: { container: 'w-20 h-20', text: 'text-xl' },
    '2xl': { container: 'w-24 h-24', text: 'text-2xl' }
  };

  // Check if we should show initials
  const shouldShowInitials = !src || src.trim() === '' || imageError;

  // If should show initials, render the circle with initials
  if (shouldShowInitials) {
    return (
      <div
        className={`${sizeMap[size].container} rounded-full flex items-center justify-center text-white font-bold shadow-sm ${className}`}
        style={{ backgroundColor: getColorFromPalette(name) }}
      >
        <span className={sizeMap[size].text}>{getInitials(name)}</span>
      </div>
    );
  }

  // Otherwise, try to render the image
  return (
    <div className={`${sizeMap[size].container} rounded-full overflow-hidden shadow-sm ${className}`}>
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.log('Image failed to load:', src);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', src);
        }}
      />
    </div>
  );
};

export default Avatar;
