import React from 'react';
import PropTypes from 'prop-types';
import { NodeListItem } from './node-list-item';

export const NodeList = ({ nodes, ...props }) => {
  console.log(nodes[1000]);
  nodes = nodes.slice().sort((a, b) => (a.alias || a.pub_key).localeCompare(b.alias || b.pub_key));
  return (
    <ul className="node-list">
      {nodes.map(node => (
        <NodeListItem key={node.pub_key} node={node} {...props} />
      ))}
    </ul>
  );
};

NodeList.propTypes = {
  nodes: PropTypes.array.isRequired,
};
