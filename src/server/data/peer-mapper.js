const path = require('path');
const level = require('./level-client');

let dbPath = path.resolve(__dirname + '/../../../data/peers');
let _db;

level.connect(dbPath).then(db => (_db = db));

module.exports = {
  getPeer,
  putPeer,
};

async function getPeer(pub_key) {
  try {
    return await _db.get('peer:' + pub_key);
  } catch (ex) {
    return;
  }
}

async function putPeer(peer) {
  return await _db.put('peer:' + peer.pub_key, peer);
}
