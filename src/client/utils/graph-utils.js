export function findChannels(pub_key, graph) {
  return graph.edges.filter(edge => edge.node1_pub === pub_key || edge.node2_pub === pub_key);
}

export function findNode(pub_key, graph) {
  return graph.nodes.find(node => node.pub_key === pub_key);
}
