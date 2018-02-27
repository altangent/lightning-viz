import React from 'react';
import { Graph } from './components/graph';
import { NodeListCard } from './components/node-list/node-list-card';
import { NodeInfoCard } from './components/node-info/node-info-card';

export class GraphScene extends React.Component {
  state = {
    graph: undefined,
    nodeLookup: undefined,
    edgeLookup: undefined,
    nodeQuery: '',
    showOnlyReachable: false,
    selectedNode: undefined,
    selectedNodeChannels: undefined,
  };

  componentWillMount() {
    this.loadGraph();
  }

  loadGraph() {
    let maxNodes = 10000;
    fetch('/api/graph?nodes=' + maxNodes)
      .then(res => res.json())
      .then(graph => {
        let nodeLookup = new Map(graph.nodes.map(node => [node.pub_key, node]));
        let edgeLookup = new Map();
        for (let edge of graph.edges) {
          edgeLookup.set(edge.node1_pub, (edgeLookup.get(edge.node1_pub) || new Set()).add(edge));
          edgeLookup.set(edge.node2_pub, (edgeLookup.get(edge.node2_pub) || new Set()).add(edge));
        }
        this.setState({ graph, nodeLookup, edgeLookup });
        this.graphRef.updateGraph(graph);
      });
  }

  selectNode = pub_key => {
    this.graphRef.selectNode(pub_key);
  };

  filterChanged = (key, value) => {
    this.setState({ [key]: value });
  };

  onNodeSelected = pub_key => {
    let selectedNode = this.state.nodeLookup.get(pub_key);
    let selectedNodeChannels = Array.from(this.state.edgeLookup.get(pub_key));
    this.setState({ selectedNode, selectedNodeChannels });
  };

  render() {
    return (
      <div className="graph-container">
        <Graph
          ref={el => (this.graphRef = el)}
          onNodeSelected={this.onNodeSelected}
          graph={this.state.graph}
        />
        <NodeListCard
          {...this.state}
          filterChanged={this.filterChanged}
          selectNode={this.selectNode}
        />
        <NodeInfoCard {...this.state} />
      </div>
    );
  }
}
