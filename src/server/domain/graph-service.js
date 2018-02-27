const winston = require('winston');
const peerMapper = require('../data/peer-mapper');
const lnd = require('../lnd');

module.exports = {
  loadGraph,
};

async function loadGraph() {
  winston.profile('load graph');
  let graph = await lnd.client.describeGraph({});

  for (let i = 0; i < graph.nodes.length; i++) {
    let node = graph.nodes[i];
    let peerInfo = await peerMapper.getPeer(node.pub_key);
    if (peerInfo) console.log(peerInfo);
    graph.nodes[i] = Object.assign(node, peerInfo);
  }

  winston.profile('load graph');
  return graph;
}
