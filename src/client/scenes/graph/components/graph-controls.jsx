import React from 'react';
import PropTypes from 'prop-types';

export const GraphControls = ({ resetZoomPan, zoomIn, zoomOut, zoomStop }) => (
  <div className="graph-controls">
    <button className="btn btn-sm btn-secondary" onClick={resetZoomPan}>
      Recenter
    </button>
    <button className="btn btn-sm btn-secondary" onMouseDown={zoomOut} onMouseUp={zoomStop}>
      &minus;
    </button>
    <button className="btn btn-sm btn-secondary" onMouseDown={zoomIn} onMouseUp={zoomStop}>
      +
    </button>
  </div>
);

GraphControls.propTypes = {
  resetZoomPan: PropTypes.func,
  zoomIn: PropTypes.func,
  zoomOut: PropTypes.func,
  zoomStop: PropTypes.func,
};
