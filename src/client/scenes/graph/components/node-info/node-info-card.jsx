import React from 'react';
import PropTypes from 'prop-types';
import { ColorCircle } from '../../../components/color-circle';
import { NodeDetails } from './node-details';
import { NodeChannelList } from './node-channel-list';

export const NodeInfoCard = ({ selectedNode, deselectNode, ...props }) => {
  if (!selectedNode) return null;
  return (
    <div className="card node-info">
      <div className="card-header">
        <div className="float-right">
          <div className="h2 btn-close" onClick={deselectNode}>
            &times;
          </div>
        </div>
        <h3 className="node-info-title">
          <ColorCircle className="mr-2" color={selectedNode.color} size="1rem" />
          {selectedNode.alias || selectedNode.pub_key}
        </h3>
      </div>
      <div className="card-body node-info-body">
        <NodeDetails selectedNode={selectedNode} {...props} />
        <hr className="my-3" />
        <NodeChannelList selectedNode={selectedNode} {...props} />
      </div>
    </div>
  );
};

NodeInfoCard.propTypes = {
  deselectNode: PropTypes.func.isRequired,
  selectedNode: PropTypes.object,
  selectedNodeChannels: PropTypes.array,
  graph: PropTypes.object,
};
