import React from 'react';
import PropTypes from 'prop-types';

export const NodeListItem = ({ node, selectNode }) => (
  <li className="node-list-item" onClick={() => selectNode(node.pub_key)}>
    <div className="node-color ml-1" style={{ backgroundColor: node.color }} />
    <div className="node-alias">{node.alias || node.pub_key.substring(0, 24)}</div>
    <div className={'node-reachable ' + (node.is_reachable ? 'yes' : 'no')} />
  </li>
);

NodeListItem.propTypes = {
  node: PropTypes.object.isRequired,
  selectNode: PropTypes.func.isRequired,
};
