import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Reachable } from '../../../components/reachable';

export const NodeDetails = ({ selectedNode, selectedNodeChannels }) => (
  <div className="node-details">
    <div className="row">
      <div className="col-sm-4">Reachable:</div>
      <div className="col-sm-8">
        <Reachable reachable={selectedNode.is_reachable} />
      </div>
    </div>
    <div className="row mb-2">
      <div className="col-sm-4">Pubkey:</div>
      <div className="col-sm-8">{selectedNode.pub_key}</div>
    </div>
    <div className="row">
      <div className="col-sm-4">Addresses:</div>
      <div className="col-sm-8">{selectedNode.addresses.map(p => p.addr).join(', ')}</div>
    </div>
    <div className="row">
      <div className="col-sm-4">Location:</div>
      <div className="col-sm-8">
        {selectedNode.geo_info ? selectedNode.geo_info.country_name : 'Unknown'}
      </div>
    </div>
    <div className="row">
      <div className="col-sm-4">Updated:</div>
      <div className="col-sm-8">{moment.unix(selectedNode.last_update).format('lll')}</div>
    </div>
    <div className="row">
      <div className="col-sm-4">Channels:</div>
      <div className="col-sm-8">{selectedNodeChannels.length}</div>
    </div>
    <div className="row">
      <div className="col-sm-4">Capacity:</div>
      <div className="col-sm-8">
        {selectedNodeChannels.map(p => parseInt(p.capacity)).reduce((sum, val) => sum + val, 0)} sat
      </div>
    </div>
  </div>
);

NodeDetails.propTypes = {
  selectedNode: PropTypes.object.isRequired,
  selectedNodeChannels: PropTypes.array.isRequired,
};
