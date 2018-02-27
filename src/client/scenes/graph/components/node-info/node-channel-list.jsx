import React from 'react';
import PropTypes from 'prop-types';
import { NodeChannel } from './node-channel';

export const NodeChannelList = ({ selectedNodeChannels, ...props }) => (
  <ul className="node-channel-list">
    {selectedNodeChannels.map(channel => (
      <NodeChannel key={'chan_' + channel.chan_point} channel={channel} {...props} />
    ))}
  </ul>
);

NodeChannelList.propTypes = {
  selectedNode: PropTypes.object.isRequired,
  selectedNodeChannels: PropTypes.array.isRequired,
};
