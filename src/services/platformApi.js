import axiosInstance from 'config/axiosInstance';

export const platformService = {
  // ✅ FIXED: Matches /platforms/settings/current/
  getCurrentSettings: async () => {
    const response = await axiosInstance.get('/platforms/settings/current/');
    return response.data;
  },

  // ✅ FIXED: Matches /platforms/settings/update/
  updateSettings: async (data) => {
    const response = await axiosInstance.patch('/platforms/settings/update/', data);
    return response.data;
  },

  // ✅ FIXED: Matches /platforms/settings/test-email/
  testEmailConnection: async () => {
    const response = await axiosInstance.post('/platforms/settings/test-email/');
    return response.data;
  },

  // ✅ FIXED: Matches /platforms/settings/upload-logo/
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await axiosInstance.post('/platforms/settings/upload-logo/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // ✅ FIXED: Matches /platforms/settings/upload-favicon/
  uploadFavicon: async (file) => {
    const formData = new FormData();
    formData.append('favicon', file);
    
    const response = await axiosInstance.post('/platforms/settings/upload-favicon/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Keep these for future use (admin platform list)
  getPlatformConfig: async () => {
    const response = await axiosInstance.get('/platforms/settings/current/');
    return response.data.platform;
  },

  getPaymentGateways: async (platformId) => {
    const response = await axiosInstance.get(`/platforms/${platformId}/stats/`);
    return response.data.platform.payment_gateways || [];
  },
};
