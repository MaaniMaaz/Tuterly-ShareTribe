require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const zoomService = require('./services/zoomService');

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Meeting store
const meetingStore = new Map();

// Routes
app.post('/api/zoom/create-meeting-for-transaction', async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    // Check for existing meeting
    const existingMeeting = meetingStore.get(transactionId);
    if (existingMeeting) {
      return res.json(existingMeeting);
    }

    // Create new meeting
    const topic = `Meeting for Transaction: ${transactionId}`;
    const zoomMeeting = await zoomService.createMeeting(topic);

    const meeting = {
      meetingId: zoomMeeting.id,
      joinUrl: zoomMeeting.join_url,
      startUrl: zoomMeeting.start_url,
      topic: zoomMeeting.topic,
      transactionId
    };

    meetingStore.set(transactionId, meeting);
    return res.json(meeting);
  } catch (error) {
    console.error('Create meeting error:', error);
    return res.status(500).json({
      error: 'Failed to create meeting',
      details: error.response?.data || error.message
    });
  }
});

app.get('/api/zoom/meetings/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  const meeting = meetingStore.get(transactionId);

  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }

  return res.json(meeting);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
