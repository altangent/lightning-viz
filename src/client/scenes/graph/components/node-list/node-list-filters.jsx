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
    queryMode: false,
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
          <div className="custom-control custom-radio custom-control-inline">
            <label className="">
              <input
                name="mode"
                type="radio"
                className="form-check-input form-check-input-sm"
                value="alias"
                onChange={this.modeChange}
                checked={!queryMode}
              />
              Alias
            </label>
          </div>
          <div className="custom-control custom-radio custom-control-inline">
            <label className="form-check-label form-check-label-sm">
              <input
                id="queryModeRadio"
                name="mode"
                type="radio"
                className="form-check-input form-check-input-sm"
                value="query"
                onChange={this.modeChange}
                checked={queryMode}
              />
              Advanced querying
            </label>
          </div>
          <div className="query-info-container">
            <QueryInfo />
          </div>
          <div className="form-group">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className={'form-control form-control-sm' + (invalid ? ' is-invalid' : '')}
                value={query}
                placeholder={queryMode ? "country in ('US', 'CA')" : 'graph.lndexplorer.com'}
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
          </div>
        </form>
      </div>
    );
  }
}
