import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';

export class NodeListFilters extends React.Component {
  static propTypes = {
    filterNodes: PropTypes.func.isRequired,
    highlightNodes: PropTypes.func.isRequired,
    redrawNodes: PropTypes.func.isRequired,
  };

  state = {
    nodeQuery: '',
    showOnlyReachable: false,
    showOnlyConnected: false,
  };

  filterChanged(prop, value) {
    this.setState({ [prop]: value });
    this.props.filterNodes(Object.assign({}, this.state, { [prop]: value }));
  }

  render() {
    let { nodeQuery, showOnlyReachable, showOnlyConnected } = this.state;

    return (
      <div className="node-list-filter">
        <FormGroup>
          <Input
            bsSize="sm"
            type="text"
            placeholder="Find nodes..."
            value={nodeQuery}
            onChange={e => this.filterChanged('nodeQuery', e.target.value)}
          />
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={!showOnlyConnected}
              onChange={e => this.filterChanged('showOnlyConnected', !e.target.checked)}
            />
            include orphans
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={!showOnlyReachable}
              onChange={e => this.filterChanged('showOnlyReachable', !e.target.checked)}
            />
            include unreachable nodes
          </Label>
        </FormGroup>

        <div className="mt-3 text-right">
          <button className="btn-sm btn-secondary mr-1" onClick={this.props.highlightNodes}>
            Highlight
          </button>
          <button className="btn-sm btn-secondary" onClick={this.props.redrawNodes}>
            Redraw
          </button>
        </div>
      </div>
    );
  }
}
