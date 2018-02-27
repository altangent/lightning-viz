const path = require('path');
const level = require('./level-client');

let dbPath = path.resolve(__dirname + '/../../../data/telemetry');
let _db;

level.connect(dbPath).then(db => (_db = db));

module.exports = {
  putStat,
  getStat,
};

async function putStat(name, timestamp, value) {
  await _db.put(`stat:${name}:${timestamp}`, value);
}

async function getStat(name, timestamp) {
  try {
    return await _db.get(`stat:${name}:${timestamp}`);
  } catch (ex) {
    return;
  }
}
