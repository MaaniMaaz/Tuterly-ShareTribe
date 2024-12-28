// server/api/translate.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Note: Use '/' instead of '/translate' since we're already mounted at '/api/translate'
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    console.log('Received translation request:', { text, targetLanguage }); // Add logging

    if (!text || !targetLanguage) {
      return res.status(400).json({
        error: 'Text and target language are required',
        timestamp: new Date().toISOString()
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text to ${targetLanguage}. Only respond with the translation, nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 1000
    });

    const translation = completion.choices[0].message.content.trim();

    console.log('Translation successful:', translation); // Add logging

    res.json({
      translation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      error: 'Translation failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
