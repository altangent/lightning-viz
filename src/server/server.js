const path = require('path');
const winston = require('winston');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();
const lnd = require('./lnd');

lnd.connect();

app.use('/public', serveStatic(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(require('./api-network'));
app.listen(8000, () => winston.info('server listening on 8000'));
