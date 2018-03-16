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
    queryMode: true,
  };

  queryChanged = e => {
    this.setState({ query: e.target.value, invalid: false });
  };

  modeChange = e => {
    this.setState({ queryMode: e.target.value === 'query', query: '', invalid: false });
  };

  search = e => {
    if (e) e.preventDefault();
    let { query, queryMode } = this.state;

    if (queryMode) {
      let valid = nodeSearch.validate(query);
      if (valid) this.props.filterNodes(query);
      else this.setState({ invalid: true });
    } else this.props.filterNodes(`alias like '*${query}*'`);
  };

  render() {
    let { query, queryMode, invalid } = this.state;
    return (
      <div className="node-list-filter">
        <form className="form" onSubmit={this.search}>
          <div className="form-group">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <select className="form-control form-control-sm" onChange={this.modeChange}>
                    <option value="query">Query:</option>
                    <option value="">Alias:</option>
                  </select>
                </div>
              </div>
              <input
                type="text"
                className={'form-control form-control-sm' + (invalid ? ' is-invalid' : '')}
                placeholder={!queryMode ? 'Search by alias...' : 'Search by query...'}
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
            {queryMode && <QueryInfo />}
          </div>
        </form>
      </div>
    );
  }
}
