// apiRouter.js
const express = require('express');
const router = express.Router();
const zoomService = require('./api/zoomService');
const translateRouter = require('./api/translate');

// In-memory store for meetings
const meetingStore = new Map();



// Mount the translate router
router.use('/translate', translateRouter);

// Zoom routes
router.post('/zoom/create-meeting-for-transaction', async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        error: 'Transaction ID is required',
        timestamp: new Date().toISOString()
      });
    }

    // Check existing meeting
    let meeting = meetingStore.get(transactionId);
    if (meeting) {
      // Verify meeting still exists in Zoom
      try {
        await zoomService.getMeeting(meeting.meetingId);
        return res.json(meeting);
      } catch (error) {
        // If meeting doesn't exist in Zoom anymore, remove it from store
        meetingStore.delete(transactionId);
      }
    }

    // Create new meeting
    const topic = `Meeting for Transaction: ${transactionId}`;
    const zoomMeeting = await zoomService.createMeeting(topic);

    meeting = {
      meetingId: zoomMeeting.id,
      joinUrl: zoomMeeting.join_url,
      startUrl: zoomMeeting.start_url,
      topic: zoomMeeting.topic,
      transactionId,
      createdAt: new Date().toISOString()
    };

    meetingStore.set(transactionId, meeting);
    console.log('Meeting created successfully:', meeting.meetingId);
    return res.json(meeting);

  } catch (error) {
    console.error('Create meeting error:', error);
    return res.status(500).json({
      error: 'Failed to create meeting',
      details: error.response?.data || error.message,
      timestamp: new Date().toISOString()
    });
  }
});






router.get('/zoom/meetings/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const meeting = meetingStore.get(transactionId);

    if (!meeting) {
      return res.status(404).json({
        error: 'Meeting not found',
        timestamp: new Date().toISOString()
      });
    }

    // Verify meeting still exists in Zoom
    try {
      await zoomService.getMeeting(meeting.meetingId);
      return res.json(meeting);
    } catch (error) {
      // If meeting doesn't exist in Zoom anymore, remove it from store
      meetingStore.delete(transactionId);
      return res.status(404).json({
        error: 'Meeting no longer exists',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Get meeting error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve meeting',
      details: error.response?.data || error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
