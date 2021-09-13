const path = require('path');
const winston = require('winston');
const express = require('express');
const compression = require('compression');
const serveStatic = require('serve-static');
const scheduler = require('node-schedule');
const app = express();
const lightning = require('./lightning/lightning-service');
const peerProcessor = require('./domain/peer-processor');

const networkApi = require('./apis/api-network');

const listenPort = process.env.HTTP_PORT || 8000;

lightning
  .connect()
  .then(() => networkApi.loadGraph())
  .then(() => peerProcessor.collectPeerInfo(true))
  .catch(err => {
    winston.error(err);
    process.exit(1);
  });

scheduler.scheduleJob('0 1 * * * *', () => peerProcessor.collectPeerInfo(false));

app.use(compression());
app.use('/public', serveStatic(path.join(__dirname, '../public')));
app.use('/public/app', serveStatic(path.join(__dirname, '../../dist/app')));
app.use('/public/css', serveStatic(path.join(__dirname, '../../dist/css')));
app.use(
  '/public/flags',
  serveStatic(path.join(__dirname, '../../node_modules/flag-icon-css/flags'))
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(networkApi);

app.listen(listenPort, () => winston.info('server listening on ' + listenPort.toString(10)));
