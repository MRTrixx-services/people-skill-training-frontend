import axios from 'axios';
import { API_BASE_URL } from 'config/axiosInstance';
// import { API_BASE_URL } from 'contexts/AuthContext';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
      if (status === 403) return Promise.reject(new Error('Access denied.'));
      if (status === 404) return Promise.reject(new Error('Resource not found.'));
      if (status >= 500) return Promise.reject(new Error('Server error.'));
    } else if (error.request) {
      return Promise.reject(new Error('Network error.'));
    } else {
      return Promise.reject(new Error('Request configuration error.'));
    }
    return Promise.reject(error);
  }
);

class InstructorAPI {
  _formatArrayForFormData(value) {
    if (Array.isArray(value)) return JSON.stringify(value);
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : null;
      if (Array.isArray(parsed)) return value;
      return JSON.stringify([value]);
    } catch {
      return JSON.stringify([value]);
    }
  }

  _appendToFormData(formData, key, value) {
    if (value === null || value === undefined || value === '') return;
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

  async getProfile(speakerId) {
    const endpoint = speakerId === 'me' || !speakerId ? '/speakers/me/' : `/speakers/${speakerId}/`;
    const response = await apiClient.get(endpoint);
    return response.data;
  }

  async updateProfile(speakerId, profileData, photoFile) {
    const endpoint = speakerId === 'me' || !speakerId ? '/speakers/me/' : `/speakers/${speakerId}/`;

    if (photoFile) {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => this._appendToFormData(formData, key, value));
      formData.append('avatar', photoFile);

      const response = await apiClient.patch(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      const response = await apiClient.patch(endpoint, profileData);
      return response.data;
    }
  }

  async createProfile(profileData, photoFile) {
    if (photoFile) {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => this._appendToFormData(formData, key, value));
      formData.append('avatar', photoFile);

      const response = await apiClient.post('/speakers/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      const response = await apiClient.post('/speakers/create/', profileData);
      return response.data;
    }
  }

  async deleteProfile(speakerId) {
    const endpoint = speakerId === 'me' || !speakerId ? '/speakers/me/' : `/speakers/${speakerId}/`;
    const response = await apiClient.delete(endpoint);
    return response.data;
  }

  // Include any other backend-supported methods here, only if they exist in your backend
}

export default new InstructorAPI();
export { apiClient };
