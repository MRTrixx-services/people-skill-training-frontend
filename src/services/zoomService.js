// services/zoomService.js
class ZoomService {
  constructor() {
    this.baseURL = 'https://api.zoom.us/v2';
    this.accessToken = null;
  }

  // Get access token using JWT or OAuth
  async getAccessToken() {
    try {
      // Method 1: Server-side JWT (recommended for production)
      const response = await fetch('/api/zoom/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get Zoom access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken;

    } catch (error) {
      console.error('Error getting Zoom access token:', error);
      throw error;
    }
  }

  // Test Zoom connection
  async testConnection() {
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }

      const response = await fetch(`${this.baseURL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Zoom API error: ${response.status}`);
      }

      const userData = await response.json();
      return {
        success: true,
        message: 'Zoom connection successful!',
        user: userData
      };

    } catch (error) {
      console.error('Zoom connection test failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
  }

  // Create a Zoom meeting
  async createMeeting(webinarData) {
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }

      // Convert form data to Zoom meeting format
      const meetingData = this.formatMeetingData(webinarData);

      const response = await fetch(`${this.baseURL}/users/me/meetings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create Zoom meeting');
      }

      const meeting = await response.json();
      
      return {
        success: true,
        meeting: {
          id: meeting.id,
          join_url: meeting.join_url,
          start_url: meeting.start_url,
          password: meeting.password,
          meeting_id: meeting.id,
          host_id: meeting.host_id,
          topic: meeting.topic,
          start_time: meeting.start_time,
          duration: meeting.duration,
          timezone: meeting.timezone
        }
      };

    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Format webinar form data to Zoom meeting format
  formatMeetingData(webinarData) {
    const startDateTime = new Date(`${webinarData.date}T${webinarData.time}`);
    const duration = webinarData.duration === 'custom' 
      ? parseInt(webinarData.customDuration) 
      : parseInt(webinarData.duration);

    return {
      topic: webinarData.title,
      type: 2, // Scheduled meeting
      start_time: startDateTime.toISOString(),
      duration: duration,
      timezone: webinarData.timezone,
      agenda: webinarData.description,
      settings: {
        host_video: true,
        participant_video: false,
        cn_meeting: false,
        in_meeting: false,
        join_before_host: false,
        mute_upon_entry: webinarData.muteOnEntry !== false,
        watermark: false,
        use_pmi: false,
        approval_type: 2, // Manual approve
        audio: 'both',
        auto_recording: this.getRecordingSetting(webinarData.recordingPreference),
        enforce_login: false,
        registrants_confirmation_email: true,
        waiting_room: webinarData.waitingRoom === 'enabled',
        registrants_email_notification: true,
        meeting_authentication: false,
        allow_multiple_devices: true,
        chat_enabled: webinarData.enableChat !== false,
        private_chat: webinarData.enableChat !== false,
        auto_saving_chat: true,
        entry_exit_chime: 'tone',
        feedback: true,
        post_meeting_feedback: true,
        co_hosts: [],
        polling: webinarData.enablePolls || false,
        file_transfer: false,
        request_permission_to_unmute_participants: false,
        show_share_button: webinarData.allowScreenShare || false,
        allow_live_streaming: false,
        live_streaming_facebook: false,
        live_streaming_workplace: false,
        live_streaming_youtube: false,
        custom_live_streaming_url: '',
        custom_service: false,
        custom_data_center_regions: [],
        alternative_hosts: '',
        breakout_room: {
          enable: false
        }
      },
      recurrence: null // Add recurrence logic if needed
    };
  }

  // Convert recording preference to Zoom format
  getRecordingSetting(preference) {
    switch (preference) {
      case 'automatic':
        return 'cloud';
      case 'manual':
        return 'none';
      case 'disabled':
        return 'none';
      default:
        return 'none';
    }
  }

  // Update meeting
  async updateMeeting(meetingId, webinarData) {
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }

      const meetingData = this.formatMeetingData(webinarData);

      const response = await fetch(`${this.baseURL}/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        throw new Error('Failed to update Zoom meeting');
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating Zoom meeting:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete meeting
  async deleteMeeting(meetingId) {
    try {
      if (!this.accessToken) {
        await this.getAccessToken();
      }

      const response = await fetch(`${this.baseURL}/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete Zoom meeting');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting Zoom meeting:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export default new ZoomService();