const path = require('path');
const winston = require('winston');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();
const lnd = require('./lnd');
const peerProcessor = require('./domain/peer-processor');
const scheduler = require('node-schedule');
const statProcessor = require('./domain/stat-processor');

lnd
  .connect()
  .then(() => peerProcessor.collectPeerInfo(true))
  .then(() => statProcessor.collectStats('bitcoin'))
  .catch(err => {
    winston.error(err);
    process.exit(1);
  });

scheduler.scheduleJob('0 * * * * *', () => statProcessor.collectStats('bitcoin'));
scheduler.scheduleJob('0 1 * * * *', () => peerProcessor.collectPeerInfo(false));

app.use('/public', serveStatic(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(require('./api-network'));
app.use(require('./api-stats'));

app.listen(8000, () => winston.info('server listening on 8000'));
