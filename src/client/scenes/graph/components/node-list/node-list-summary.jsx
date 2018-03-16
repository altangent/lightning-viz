import React from 'react';
import PropTypes from 'prop-types';

export const NodeListSummary = ({ selectedCount, totalCount, highlightNodes, redrawNodes }) => (
  <div className="node-list-summary">
    <div className="summary-counts">
      {selectedCount} / {totalCount} nodes
    </div>
    <div className="summary-controls">
      <button className="btn btn-sm btn-secondary mr-1" onClick={highlightNodes}>
        Highlight nodes
      </button>
      <button className="btn btn-sm btn-secondary" onClick={redrawNodes}>
        Draw nodes
      </button>
    </div>
  </div>
);

NodeListSummary.propTypes = {
  selectedCount: PropTypes.number,
  totalCount: PropTypes.number,
  highlightNodes: PropTypes.func.isRequired,
  redrawNodes: PropTypes.func.isRequired,
};
