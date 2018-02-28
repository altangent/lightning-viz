import React from 'react';
import PropTypes from 'prop-types';
import { NodeListItem } from './node-list-item';

export const NodeList = ({ nodes, ...props }) => (
  <ul className="node-list">
    {nodes.map(node => <NodeListItem key={node.pub_key} node={node} {...props} />)}
  </ul>
);

NodeList.propTypes = {
  nodes: PropTypes.array.isRequired,
};
