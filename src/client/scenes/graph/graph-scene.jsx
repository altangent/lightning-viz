import React from 'react';
import { Graph } from './components/graph';
import { GraphInfoCard } from './components/graph-info-card';

export class GraphScene extends React.Component {
  state = {
    graph: undefined,
    nodeQuery: '',
    showOnlyReachable: false,
  };

  componentWillMount() {
    this.loadGraph();
  }

  loadGraph() {
    let maxNodes = 10000;
    fetch('/api/graph?nodes=' + maxNodes)
      .then(res => res.json())
      .then(graph => {
        this.setState({ graph });
        this.graphRef.updateGraph(graph);
      });
  }

  selectNode = pub_key => {
    this.graphRef.selectNode(pub_key);
  };

  filterChanged = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <div className="graph-container">
        <Graph
          ref={el => (this.graphRef = el)}
          onNodeSelected={console.log}
          graph={this.state.graph}
        />
        <GraphInfoCard
          {...this.state}
          filterChanged={this.filterChanged}
          selectNode={this.selectNode}
        />
      </div>
    );
  }
}
