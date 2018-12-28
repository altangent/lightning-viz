import React from 'react';
import PropTypes from 'prop-types';
import { ColorCircle } from '../../../components/color-circle';
import { Reachable } from '../../../components/reachable';

export const NodeListItem = ({ node, selectNode }) => (
  <li className="node-list-item" onClick={() => selectNode(node.pub_key)}>
    <div className="node-color">
      <ColorCircle color={node.color} />
    </div>
    <div className="node-alias">{node.alias || node.pub_key}</div>
    <div className="node-country">
      {node.geo_info && node.geo_info.country_code ? (
        <span className={'flag-icon flag-icon-' + node.geo_info.country_code.toLowerCase()} />
      ) : (
        <span className={'flag-icon'} />
      )}
    </div>
    <div className="node-reachable">
      <Reachable reachable={node.is_reachable} />
    </div>
  </li>
);

NodeListItem.propTypes = {
  node: PropTypes.object.isRequired,
  selectNode: PropTypes.func.isRequired,
};
