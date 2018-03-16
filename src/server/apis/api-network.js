const winston = require('winston');
const express = require('express');
const scheduler = require('node-schedule');
const graphService = require('../domain/graph-service');
const app = express();
let _graph;

app.get('/api/graph', (req, res, next) => getGraph(req, res).catch(next));

module.exports = app;

// schedule graph loading
scheduler.scheduleJob('0 * * * * *', loadGraph);
function loadGraph() {
  graphService
    .loadGraph()
    .then(graph => (_graph = graph))
    .catch(winston.error);
}
setTimeout(loadGraph, 1000);

async function getGraph(req, res) {
  res.send(_graph);
}
