// server.js
require('./env').configureEnv();

const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const { deserialize } = require('./api-util/sdk');

const apiRouter = require('./apiRouter');

const PORT = process.env.REACT_APP_DEV_API_SERVER_PORT || 3500;
const app = express();

app.use(cors({
  origin: process.env.REACT_APP_MARKETPLACE_ROOT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.text({
  type: 'application/transit+json',
}));
app.use(compression());

// Transit+JSON parsing middleware
app.use((req, res, next) => {
  if (req.get('Content-Type') === 'application/transit+json' && typeof req.body === 'string') {
    try {
      req.body = deserialize(req.body);
    } catch (e) {
      console.error('Failed to parse request body as Transit:', e);
      res.status(400).send('Invalid Transit in request body.');
      return;
    }
  }
  next();
});

// API routes
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
