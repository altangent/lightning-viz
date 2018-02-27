import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';

export const NodeListFilters = ({ nodeQuery, showOnlyReachable, filterChanged }) => (
  <div className="node-list-filter">
    <FormGroup>
      <Input
        bsSize="sm"
        type="text"
        placeholder="Find nodes..."
        value={nodeQuery}
        onChange={e => filterChanged('nodeQuery', e.target.value)}
      />
    </FormGroup>
    <FormGroup check>
      <Label check>
        <Input
          type="checkbox"
          checked={!showOnlyReachable}
          onChange={e => filterChanged('showOnlyReachable', !e.target.checked)}
        />
        include unreachable nodes
      </Label>
    </FormGroup>
  </div>
);

NodeListFilters.propTypes = {
  nodeQuery: PropTypes.string.isRequired,
  showOnlyReachable: PropTypes.bool.isRequired,
  filterChanged: PropTypes.func.isRequired,
};
