const winston = require('winston');
const lnd = require('../lnd');
const peerMapper = require('../data/peer-mapper');
const { splitAddr } = require('../utils/addr-utils');
const geoService = require('./geo-service');
const peerService = require('./peer-service');

module.exports = {
  collectPeerInfo,
};

async function collectPeerInfo(skipProcessed = false) {
  try {
    let graph = await lnd.client.describeGraph({});
    winston.info(`found ${graph.nodes.length} peers to process`);

    winston.profile('peer processing');
    for (let node of graph.nodes) {
      await processNode(node, skipProcessed);
    }
    winston.profile('peer processing');
  } catch (ex) {
    winston.error(ex);
  }
}

async function processNode({ pub_key, addresses }, skipProcessed) {
  let peer = await peerMapper.getPeer(pub_key);

  if (skipProcessed && peer) return;

  if (!peer) {
    peer = {
      pub_key,
      host: undefined,
      port: undefined,
      isAvailable: false,
      geoInfo: undefined,
    };
  }

  if (!addresses.length) {
    peer.isAvailable = false;
    await peerMapper.putPeer(peer);
    return;
  }

  let addr = addresses[0].addr;
  let [host] = splitAddr(addr);

  if (!peer.geoInfo) {
    let geoInfo = await geoService.getHostGeoInfo(host);
    peer.geoInfo = {
      country_code: geoInfo.country_code,
      country_name: geoInfo.country_name,
      region_code: geoInfo.region_code,
      region_name: geoInfo.region_name,
      latitude: geoInfo.latitude,
      longitude: geoInfo.longitude,
    };
  }

  peer.isAvailable = await peerService.checkPeerConnection(addr);
  await peerMapper.putPeer(peer);
}
