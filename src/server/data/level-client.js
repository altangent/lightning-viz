const winston = require('winston');
const path = require('path');
const fs = require('fs');
const level = require('level');

module.exports = {
  connect,
};

async function connect(fullpath) {
  ensurePath(fullpath);
  let result = level(fullpath, { valueEncoding: 'json' });
  winston.info('connected to leveldb', fullpath);
  return result;
}

function ensurePath(fullpath) {
  let parts = fullpath.split(path.sep).slice(1);
  let subPath = '/';
  for (let part of parts) {
    subPath = path.join(subPath, part);
    try {
      fs.mkdirSync(subPath);
    } catch (ex) {
      if (ex.code === 'EEXIST') continue;
      else throw ex;
    }
  }
}
