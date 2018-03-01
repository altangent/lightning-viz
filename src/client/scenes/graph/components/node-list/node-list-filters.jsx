import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';

export class NodeListFilters extends React.Component {
  static propTypes = {
    filterNodes: PropTypes.func.isRequired,
    highlightNodes: PropTypes.func.isRequired,
    redrawNodes: PropTypes.func.isRequired,
  };

  state = {
    query: '',
    powerMode: false,
  };

  queryChanged = e => {
    if (e.target.value.startsWith('power:')) {
      this.setState({ query: '', powerMode: true });
    } else {
      this.setState({ query: e.target.value });
    }
  };

  queryKeyUp = e => {
    if (e.key === 'Backspace' && this.state.powerMode && !this.state.query)
      this.setState({ powerMode: false });
  };

  search = e => {
    if (e) e.preventDefault();
    let { query, powerMode } = this.state;
    if (powerMode) this.props.filterNodes(query);
    else this.props.filterNodes(`alias like '*${query}*'`);
  };

  render() {
    let { query, powerMode } = this.state;
    return (
      <div className="node-list-filter">
        <div className="mb-3 text-center">
          <button className="btn-sm btn-secondary mr-1" onClick={this.props.highlightNodes}>
            Highlight
          </button>
          <button className="btn-sm btn-secondary" onClick={this.props.redrawNodes}>
            Redraw
          </button>
        </div>
        <form onSubmit={this.search}>
          <FormGroup>
            <div className="input-group input-group-sm">
              {powerMode && (
                <div className="input-group-prepend">
                  <div className="input-group-text">Power:</div>
                </div>
              )}
              <Input
                bsSize="sm"
                type="text"
                placeholder={!powerMode ? 'Search by alias...' : 'Search by query...'}
                value={query}
                onChange={this.queryChanged}
                onKeyUp={this.queryKeyUp}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ width: '60px' }}
                  onClick={this.search}
                >
                  Search
                </button>
              </div>
            </div>
          </FormGroup>
        </form>
      </div>
    );
  }
}
