const express = require('express');
const graphService = require('./domain/graph-service');
const app = express();

app.get('/api/graph', (req, res, next) => getGraph(req, res).catch(next));

module.exports = app;

async function getGraph(req, res) {
  let data = await graphService.loadGraph();
  res.send(data);
}
