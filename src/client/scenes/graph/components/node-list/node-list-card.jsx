import React from 'react';
import PropTypes from 'prop-types';
import { NodeListFilters } from './node-list-filters';
import { NodeList } from './node-list';
import { NodeListSummary } from './node-list-summary';

export const NodeListCard = ({ fullGraph, filteredNodes, ...props }) => {
  if (!filteredNodes) return '';
  let { testnet } = fullGraph;
  return (
    <div className="nodes-card card">
      <h3 className="card-header">Bitcoin {testnet ? 'Testnet' : 'Mainnet'}</h3>
      <div className="nodes-card-body card-body">
        <NodeListFilters nodes={filteredNodes} {...props} />
        <NodeList nodes={filteredNodes} {...props} />
      </div>
      <div className="card-footer">
        <NodeListSummary
          selectedCount={filteredNodes.length}
          totalCount={fullGraph.nodes.length}
          {...props}
        />
      </div>
    </div>
  );
};

NodeListCard.propTypes = {
  filteredNodes: PropTypes.array,
  fullGraph: PropTypes.object,
};
