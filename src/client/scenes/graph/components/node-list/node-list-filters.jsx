import React from 'react';
import PropTypes from 'prop-types';
import nodeSearch from '../../../../utils/node-search';
import { QueryInfo } from './query-info';

export class NodeListFilters extends React.Component {
  static propTypes = {
    filterNodes: PropTypes.func.isRequired,
  };

  state = {
    query: '',
    invalid: false,
    powerMode: false,
  };

  queryChanged = e => {
    if (e.target.value.startsWith('query:')) {
      this.setState({ query: '', powerMode: true, invalid: false });
    } else {
      this.setState({ query: e.target.value, invalid: false });
    }
  };

  queryKeyDown = e => {
    if (e.key === 'Backspace' && this.state.powerMode && !this.state.query)
      this.setState({ powerMode: false, invalid: false });
  };

  search = e => {
    if (e) e.preventDefault();
    let { query, powerMode } = this.state;

    if (powerMode) {
      let valid = nodeSearch.validate(query);
      if (valid) this.props.filterNodes(query);
      else this.setState({ invalid: true });
    } else this.props.filterNodes(`alias like '*${query}*'`);
  };

  render() {
    let { query, powerMode, invalid } = this.state;
    return (
      <div className="node-list-filter">
        <form className="form" onSubmit={this.search}>
          <div className="form-group">
            <div className="input-group input-group-sm">
              {powerMode && (
                <div className="input-group-prepend">
                  <div className="input-group-text">Query:</div>
                </div>
              )}
              <input
                type="text"
                className={'form-control form-control-sm' + (invalid ? ' is-invalid' : '')}
                placeholder={!powerMode ? 'Search by alias...' : 'Search by query...'}
                value={query}
                onChange={this.queryChanged}
                onKeyDown={this.queryKeyDown}
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
            <QueryInfo />
          </div>
        </form>
      </div>
    );
  }
}
