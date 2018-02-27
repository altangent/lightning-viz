module.exports = {
  channelCapacityHistogram,
  channelCapacitySum,
  channelCapacityMean,
  channelCount,
  channelCapacitySumOfSquares,
  channelCapacityVariance,
  channelCapacityStdDev,
  channelMinCapacity,
  channelMaxCapacity,
  maxChannelsPerNode,
  meanChannelsPerNode,
};

/////////////////////////

function channelCapacityHistogram(graph) {
  let log10 = Math.log(10);
  let results = new Array(10).fill(0);
  for (let edge of graph.edges) {
    let idx = Math.floor(Math.log(edge.capacity) / log10);
    results[idx] += 1;
  }
  return results;
}

function channelCount(graph) {
  return graph.edges.length;
}

function channelCapacitySum(graph) {
  return graph.edges.map(edge => parseInt(edge.capacity)).reduce((sum, val) => sum + val, 0);
}

function channelCapacityMean(graph) {
  let sum = channelCapacitySum(graph);
  let n = channelCount(graph);
  return sum / n;
}

function channelCapacitySumOfSquares(graph) {
  let mean = channelCapacityMean(graph);
  return graph.edges
    .map(edge => Math.pow(edge.capacity - mean, 2))
    .reduce((sum, val) => sum + val, 0);
}

function channelCapacityVariance(graph) {
  let n = channelCount(graph);
  let sumOfSquares = channelCapacitySumOfSquares(graph);
  return sumOfSquares / (n - 1);
}

function channelCapacityStdDev(graph) {
  let variance = channelCapacityVariance(graph);
  return Math.sqrt(variance);
}

function channelMinCapacity(graph) {
  let min = Number.MAX_SAFE_INTEGER;
  for (let edge of graph.edges) {
    let capacity = parseInt(edge.capacity);
    if (capacity < min) min = capacity;
  }
  return min;
}

function channelMaxCapacity(graph) {
  let max = 0;
  for (let edge of graph.edges) {
    let capacity = parseInt(edge.capacity);
    if (capacity > max) max = capacity;
  }
  return max;
}

function maxChannelsPerNode(graph) {
  let map = channelCountMap(graph);
  return Math.max.apply(Math, Array.from(map.values()));
}

function meanChannelsPerNode(graph) {
  return graph.edges.length / graph.nodes.length;
}

function channelCountMap(graph) {
  let map = new Map();
  for (let edge of graph.edges) {
    map.set(edge.node1_key, (map.get(edge.node1_key) || 0) + 1);
    map.set(edge.node2_key, (map.get(edge.node2_key) || 0) + 1);
  }
  return map;
}
