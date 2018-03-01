import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export class QueryInfo extends React.Component {
  state = {
    popoverOpen: false,
  };

  toggle = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  };

  render() {
    return (
      <div className="query-info-button">
        <div className="info-icon" onClick={this.toggle} id="queryinfo">
          &#9432;
        </div>
        <Popover isOpen={this.state.popoverOpen} target="queryinfo">
          <PopoverHeader>
            Advanced querying
            <button className="close" onClick={this.toggle}>
              &times;
            </button>
          </PopoverHeader>
          <PopoverBody>
            <QueryInfoContent />
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

export const QueryInfoContent = () => (
  <div className="query-info">
    <div className="intro">
      You can perform advanced querying with a SQL-like language. To enable advanced query mode type{' '}
      <strong>query:</strong>
    </div>
    <div className="note">This feature is experimental and is likely to be buggy.</div>

    <div className="ops">
      <div className="title">Properties:</div>
      <div className="op">
        <div className="op-name">alias</div>
        <div className="op-desc">The configured alias for the node</div>
      </div>
      <div className="op">
        <div className="op-name">country</div>
        <div className="op-desc">The country (based on the adddress)</div>
      </div>
      <div className="op">
        <div className="op-name">is_reachable</div>
        <div className="op-desc">True when the address is pingable</div>
      </div>
      <div className="op">
        <div className="op-name">channels</div>
        <div className="op-desc">Count of open channels</div>
      </div>
      <div className="op">
        <div className="op-name">capacity</div>
        <div className="op-desc">Total capacity for a node</div>
      </div>
    </div>
    <div className="ops">
      <div className="title">Logical operators:</div>
      <div className="op">
        <div className="op-name">and</div>
        <div className="op-desc">boolean and</div>
        <div className="op-ex">country = &apos;US&apos; and is_reachable = true</div>
      </div>
      <div className="op">
        <div className="op-name">or</div>
        <div className="op-desc">boolean or</div>
        <div className="op-ex">capacity = &apos;US&apos; or is_reachable = true</div>
      </div>
    </div>
    <div className="ops">
      <div className="title">Equality operators:</div>
      <div className="op">
        <div className="op-name">=</div>
        <div className="op-desc">equal to</div>
        <div className="op-types">string, bool, int</div>
        <div className="op-ex">is_reachable = true</div>
      </div>
      <div className="op">
        <div className="op-name">in</div>
        <div className="op-desc">match any value</div>
        <div className="op-types">array of values</div>
        <div className="op-ex">country in (&apos;US&apos;, &apos;CA&apos;)</div>
      </div>
    </div>
    <div className="ops">
      <div className="title">Relational operators:</div>
      <div className="op">
        <div className="op-name">&lt;</div>
        <div className="op-desc">less than</div>
        <div className="op-types">string, int</div>
        <div className="op-ex">capacity &lt; 100000</div>
      </div>
      <div className="op">
        <div className="op-name">&lt;=</div>
        <div className="op-desc">less than or equal to</div>
        <div className="op-types">string, int</div>
        <div className="op-ex">capacity &lt;= 100000</div>
      </div>
      <div className="op">
        <div className="op-name">&gt;</div>
        <div className="op-desc">greather than</div>
        <div className="op-types">string, int</div>
        <div className="op-ex">capacity &gt; 100000</div>
      </div>
      <div className="op">
        <div className="op-name">&gt;=</div>
        <div className="op-desc">greater than or equal to</div>
        <div className="op-types">string, int</div>
        <div className="op-ex">capacity &gt;= 100000</div>
      </div>
    </div>
    <div className="ops">
      <div className="title">String operators:</div>
      <div className="op">
        <div className="op-name">like</div>
        <div className="op-desc">string match using * as wildcards</div>
        <div className="op-types">string</div>
        <div className="op-ex">alias like &apos;*lnd*&apos;</div>
      </div>
    </div>
  </div>
);
