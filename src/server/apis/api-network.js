const winston = require('winston');
const express = require('express');
const graphService = require('../domain/graph-service');
const app = express();
let _graph;

app.get('/api/graph', (req, res, next) => getGraph(req, res).catch(next));
app.loadGraph = loadGraph;

module.exports = app;

function loadGraph() {
  graphService
    .loadGraph()
    .then(graph => (_graph = graph))
    .catch(winston.error)
    .finally(scheduleLoadGraph);
}

function scheduleLoadGraph() {
  const timeout = 600 * 1000; // 10 minutes
  setTimeout(loadGraph, timeout);
}

async function getGraph(req, res) {
  res.send(_graph);
}
