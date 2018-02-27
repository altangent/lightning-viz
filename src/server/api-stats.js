const express = require('express');
const statService = require('./domain/stat-service');
const app = express();

app.get('/api/stats', (req, res, next) => getStats(req, res).catch(next));

module.exports = app;

async function getStats(req, res) {
  let stats = await statService.getCurrentStats();
  res.send(stats);
}
