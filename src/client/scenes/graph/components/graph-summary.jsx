import React from 'react';
import PropTypes from 'prop-types';

export const GraphSummary = ({ graph }) => {
  if (!graph) return '';
  let nodeCount = graph.nodes.length;
  let channelCount = graph.edges.length;
  let capacity = graph.edges
    .map(edge => parseInt(edge.capacity))
    .reduce((sum, val) => sum + val, 0);
  return (
    <div className="graph-stats">
      <div className="graph-stat">
        <div className="value">{nodeCount}</div>
        <div className="title">Nodes</div>
      </div>
      <div className="graph-stat">
        <div className="value">{channelCount}</div>
        <div className="title">Channels</div>
      </div>
      <div className="graph-stat">
        <div className="value">₿{(capacity / 1e8).toFixed(2)}</div>
        <div className="title">Capacity</div>
      </div>
    </div>
  );
};
GraphSummary.propTypes = {
  graph: PropTypes.object,
};
