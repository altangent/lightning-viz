import React from 'react';
import { NodeListFilters } from './node-list-filters';
import { NodeList } from './node-list';

export const GraphInfoCard = ({ ...props }) => (
  <div className="graph-info card">
    <h3 className="card-header">Graph Details</h3>
    <NodeListFilters {...props} />
    <NodeList {...props} />
  </div>
);

GraphInfoCard.propTypes = {};
