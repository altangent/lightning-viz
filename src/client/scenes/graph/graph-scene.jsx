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
    let maxNodes = 10000;
    fetch('/api/graph?nodes=' + maxNodes)
      .then(res => res.json())
      .then(graph => {
        let orphan = { pub_key: 'ophans', color: '#000' };
        graph.nodes.push(orphan);
        this.setState({ graph, orphan });
        // this.update();
      });
  }

  // update() {
  //   setTimeout(
  //     () =>
  //       setInterval(() => {
  //         let { graph, orphan } = this.state;
  //         let { nodes, edges } = graph;
  //         nodes.push({ pub_key: 'asdf', color: '#000000' });
  //         links.push({ source: orphan, target: nodes[nodes.length - 1] });
  //         this.setState({ graph });
  //       }, 3000),
  //     15000
  //   );
  // }

  selectNode = pub_key => {
    this.graph.find(pub_key);
  };

  filterChanged = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <div className="graph-container">
        <Graph
          ref={el => (this.graph = el)}
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
