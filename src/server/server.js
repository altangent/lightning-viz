const path = require('path');
const winston = require('winston');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();
const lnd = require('./lnd');
const peerProessor = require('./domain/peer-processor');

lnd
  .connect()
  .then(() => peerProessor.collectPeerInfo(true))
  .catch(err => {
    winston.error(err);
    process.exit(1);
  });

app.use('/public', serveStatic(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(require('./api-network'));
app.listen(8000, () => winston.info('server listening on 8000'));
