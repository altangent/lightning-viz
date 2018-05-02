const d3 = require('d3');

module.exports = {
  createSimulation,
};

function createSimulation({ width, height }) {
  return d3
    .forceSimulation()
    .force('link', d3.forceLink().id(d => d.pub_key))
    .force(
      'charge',
      d3
        .forceManyBody()
        .strength(-100)
        .distanceMax(1000)
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(0.01))
    .force('y', d3.forceY(height / 2).strength(0.01));
}
