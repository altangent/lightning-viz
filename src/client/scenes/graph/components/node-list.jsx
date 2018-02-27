import React from 'react';
import PropTypes from 'prop-types';
import { NodeListItem } from './node-list-item';

export const NodeList = ({ graph, nodeQuery, showOnlyReachable, ...props }) => {
  if (!graph) return <div>Loading...</div>;

  nodeQuery = nodeQuery.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

  let nodes = graph.nodes.filter(
    node =>
      (!showOnlyReachable || (showOnlyReachable && node.is_reachable)) &&
      (!nodeQuery ||
        node.pub_key.match(new RegExp(nodeQuery, 'i')) ||
        (node.alias && node.alias.match(new RegExp(nodeQuery, 'i'))))
  );
  return (
    <ul className="node-list">
      {nodes.map(node => <NodeListItem key={node.pub_key} node={node} {...props} />)}
    </ul>
  );
};

NodeList.propTypes = {
  graph: PropTypes.object,
  nodeQuery: PropTypes.string.isRequired,
  showOnlyReachable: PropTypes.bool.isRequired,
};
