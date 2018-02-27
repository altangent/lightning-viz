import React from 'react';
import { NodeListFilters } from './node-list-filters';
import { NodeList } from './node-list';

export const NodeListCard = ({ ...props }) => (
  <div className="graph-info card">
    <h3 className="card-header">Graph Details</h3>
    <div className="card-body">
      <NodeListFilters {...props} />
      <hr />
      <NodeList {...props} />
    </div>
  </div>
);

NodeListCard.propTypes = {};
