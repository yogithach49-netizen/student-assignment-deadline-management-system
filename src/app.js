const express = require('express');
const { createStore } = require('./data/store');
const { createServices } = require('./services');
const { createRoutes } = require('./routes');

function createApp(store = createStore()) {
  const app = express();
  app.use(express.json());
  const services = createServices(store);
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', createRoutes(services));
  app.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

module.exports = { createApp };
