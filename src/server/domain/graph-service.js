const winston = require('winston');
const peerMapper = require('../data/peer-mapper');
const d3Sim = require('../../shared/d3-simulation');
const lightning = require('../lightning/lightning-service');

module.exports = {
  loadGraph,
};

async function loadGraph() {
  winston.profile('load graph');

  let graph = await lightning.describeGraph();
  graph.chains = ['Bitcoin'];
  graph.testnet = true;

  for (let i = 0; i < graph.nodes.length; i++) {
    let node = graph.nodes[i];
    let peerInfo = await peerMapper.getPeer(node.pub_key);
    graph.nodes[i] = Object.assign(node, peerInfo);
  }

  await runSimulation(graph);
  winston.profile('load graph');
  return graph;
}

function runSimulation({ nodes, edges }) {
  return new Promise(resolve => {
    // perform similar mapping to graph.jsx_mergeGraphState.
    // this could probably be cleaned up
    let links = edges.map(p => ({
      source: p.node1_pub,
      target: p.node2_pub,
      edge: p,
    }));

    // fix the render width/height, this will be accounted
    // for on the client
    let width = 800;
    let height = 600;

    // create the simulation
    let sim = d3Sim.createSimulation({ width, height });
    sim.on('end', () => {
      for (let node of nodes) {
        // attach the fixed position for the node
        node.fx = node.x;
        node.fy = node.y;

        // delete the properties attached during render
        // since they won't be used on the client and
        // just increase the send space
        delete node.index;
        delete node.x;
        delete node.y;
        delete node.vx;
        delete node.vy;
      }
      resolve({ nodes, edges });
    });

    // run the simulation
    sim.nodes(nodes);
    sim.force('link').links(links);
  });
}
