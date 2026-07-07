import axiosInstance from 'config/axiosInstance';

/**
 * InstructorAPI - Handles all instructor/speaker profile operations
 * Uses the shared axiosInstance with platform API key and token refresh
 */
class InstructorAPI {
  /**
   * Format arrays for FormData submission
   * @private
   */
  _formatArrayForFormData(value) {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : null;
      if (Array.isArray(parsed)) {
        return value;
      }
      return JSON.stringify([value]);
    } catch {
      return JSON.stringify([value]);
    }
  }

  /**
   * Append data to FormData with proper formatting
   * @private
   */
  _appendToFormData(formData, key, value) {
    if (value === null || value === undefined || value === '') {
      return;
    }
    
    if (key === 'expertise' || key === 'certifications') {
      formData.append(key, this._formatArrayForFormData(value));
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'boolean') {
      formData.append(key, value.toString());
    } else {
      formData.append(key, value);
    }
  }

  /**
   * Get instructor/speaker profile
   * @param {string|number} speakerId - Speaker ID or 'me' for current user
   * @returns {Promise<Object>} Profile data
   */
  async getProfile(speakerId) {
    try {
      const endpoint = speakerId === 'me' || !speakerId 
        ? '/speakers/me/' 
        : `/speakers/${speakerId}/`;
      
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update instructor/speaker profile
   * @param {string|number} speakerId - Speaker ID or 'me' for current user
   * @param {Object} profileData - Profile data to update
   * @param {File} photoFile - Optional photo file
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(speakerId, profileData, photoFile = null) {
    try {
      const endpoint = speakerId === 'me' || !speakerId 
        ? '/speakers/me/' 
        : `/speakers/${speakerId}/`;

      if (photoFile) {
        const formData = new FormData();
        
        Object.entries(profileData).forEach(([key, value]) => {
          this._appendToFormData(formData, key, value);
        });
        
        formData.append('avatar', photoFile);

        const response = await axiosInstance.patch(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return response.data;
      } else {
        const response = await axiosInstance.patch(endpoint, profileData);
        return response.data;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Create new instructor/speaker profile
   * @param {Object} profileData - Profile data
   * @param {File} photoFile - Optional photo file
   * @returns {Promise<Object>} Created profile data
   */
  async createProfile(profileData, photoFile = null) {
    try {
      if (photoFile) {
        const formData = new FormData();
        
        Object.entries(profileData).forEach(([key, value]) => {
          this._appendToFormData(formData, key, value);
        });
        
        formData.append('avatar', photoFile);

        const response = await axiosInstance.post('/speakers/create/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return response.data;
      } else {
        const response = await axiosInstance.post('/speakers/create/', profileData);
        return response.data;
      }
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  }

  /**
   * Delete instructor/speaker profile
   * @param {string|number} speakerId - Speaker ID or 'me' for current user
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteProfile(speakerId) {
    try {
      const endpoint = speakerId === 'me' || !speakerId 
        ? '/speakers/me/' 
        : `/speakers/${speakerId}/`;
      
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Delete profile error:', error);
      throw error;
    }
  }

  /**
   * Get instructor statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getStats() {
    try {
      const response = await axiosInstance.get('/speakers/stats/');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  }

  /**
   * Get instructor webinars
   * @param {Object} params - Query parameters (status, limit, etc.)
   * @returns {Promise<Object>} Webinars list
   */
  async getWebinars(params = {}) {
    try {
      const response = await axiosInstance.get('/webinars/instructor/', { params });
      return response.data;
    } catch (error) {
      console.error('Get webinars error:', error);
      throw error;
    }
  }

  /**
   * Get instructor earnings/revenue
   * @returns {Promise<Object>} Earnings data
   */
  async getEarnings() {
    try {
      const response = await axiosInstance.get('/instructors/earnings/');
      return response.data;
    } catch (error) {
      console.error('Get earnings error:', error);
      throw error;
    }
  }

  /**
   * Get instructor dashboard overview
   * @returns {Promise<Object>} Dashboard data
   */
  async getDashboard() {
    try {
      const response = await axiosInstance.get('/instructors/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get list of all speakers (public)
   * @param {Object} params - Query parameters (search, filters, etc.)
   * @returns {Promise<Object>} Speakers list
   */
  async getSpeakers(params = {}) {
    try {
      const response = await axiosInstance.get('/speakers/', { params });
      return response.data;
    } catch (error) {
      console.error('Get speakers error:', error);
      throw error;
    }
  }

  /**
   * Search speakers
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchSpeakers(query, filters = {}) {
    try {
      const response = await axiosInstance.get('/speakers/search/', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Search speakers error:', error);
      throw error;
    }
  }

  /**
   * Get featured speakers
   * @returns {Promise<Object>} Featured speakers list
   */
  async getFeaturedSpeakers() {
    try {
      const response = await axiosInstance.get('/speakers/featured/');
      return response.data;
    } catch (error) {
      console.error('Get featured speakers error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new InstructorAPI();

// Also export the axiosInstance for direct use if needed
export { axiosInstance as apiClient };
