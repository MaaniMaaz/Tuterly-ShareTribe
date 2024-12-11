// services/zoomService.js
const axios = require('axios');
require('dotenv').config();

class ZoomService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;

    // Validate required env variables
    const requiredVars = ['ZOOM_ACCOUNT_ID', 'ZOOM_CLIENT_ID', 'ZOOM_CLIENT_SECRET'];
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    });
  }

  async getToken() {
    try {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry - 300000) {
        return this.accessToken;
      }

      const authBuffer = Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
      ).toString('base64');

      const tokenResponse = await axios({
        method: 'post',
        url: 'https://zoom.us/oauth/token',
        params: {
          grant_type: 'account_credentials',
          account_id: process.env.ZOOM_ACCOUNT_ID
        },
        headers: {
          'Authorization': `Basic ${authBuffer}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = tokenResponse.data.access_token;
      this.tokenExpiry = Date.now() + (tokenResponse.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Token Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error('Failed to obtain Zoom access token');
    }
  }

  async createMeeting(topic) {
    try {
      const token = await this.getToken();

      const response = await axios({
        method: 'post',
        url: 'https://api.zoom.us/v2/users/me/meetings',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          topic: topic,
          type: 2, // Scheduled meeting
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            waiting_room: false,
            mute_upon_entry: false,
            approval_type: 0,
            registration_type: 1,
            use_pmi: false
          },
          start_time: new Date().toISOString(),
          duration: 60,
          timezone: "UTC"
        }
      });

      return response.data;
    } catch (error) {
      console.error('Meeting Creation Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  async getMeeting(meetingId) {
    try {
      const token = await this.getToken();

      const response = await axios({
        method: 'get',
        url: `https://api.zoom.us/v2/meetings/${meetingId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Get Meeting Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new ZoomService();
