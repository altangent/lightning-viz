import React from 'react';
import PropTypes from 'prop-types';

export const NodeChannel = ({ channel, nodeLookup }) => {
  let source = nodeLookup.get(channel.node1_pub);
  let target = nodeLookup.get(channel.node2_pub);
  return (
    <li className="node-channel">
      <div className="clearfix">
        <div className="channel-source-label">{source.alias || source.pub_key}</div>
        <div className="channel-target-label">{target.alias || target.pub_key}</div>
      </div>
      <div className="channel-viz">
        <svg width="265" height="10" className="graph">
          <g>
            <line x1="10" x2="255" y1="5" y2="5" />
          </g>
          <g>
            <circle cx="5" cy="5" r="5" fill={source.color} />
            <circle cx="260" cy="5" r="5" fill={target.color} />
          </g>
        </svg>
      </div>
      <div className="channel-capacity">{channel.capacity} sat</div>
    </li>
  );
};

NodeChannel.propTypes = {
  selectedNode: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  nodeLookup: PropTypes.object.isRequired,
};
