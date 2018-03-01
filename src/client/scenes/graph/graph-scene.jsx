import React from 'react';
import { Graph } from './components/graph';
import { NodeListCard } from './components/node-list/node-list-card';
import { NodeInfoCard } from './components/node-info/node-info-card';
import { GraphControls } from './components/graph-controls';
import { GraphSummary } from './components/graph-summary';
import nodeSearch from '../../utils/node-search';

export class GraphScene extends React.Component {
  state = {
    fullGraph: undefined,
    renderedGraph: undefined,
    nodeLookup: undefined,
    edgeLookup: undefined,
    selectedNode: undefined,
    selectedNodeChannels: undefined,
    filteredNodes: undefined,
  };

  componentWillMount() {
    this.loadGraph();
  }

  loadGraph() {
    fetch('/api/graph')
      .then(res => res.json())
      .then(graph => {
        let nodeLookup = new Map(graph.nodes.map(node => [node.pub_key, node]));
        let edgeLookup = new Map();
        for (let edge of graph.edges) {
          edgeLookup.set(edge.node1_pub, (edgeLookup.get(edge.node1_pub) || new Set()).add(edge));
          edgeLookup.set(edge.node2_pub, (edgeLookup.get(edge.node2_pub) || new Set()).add(edge));
        }
        for (let node of graph.nodes) {
          node.channels = (edgeLookup.get(node.pub_key) || new Set()).size;
          node.capacity = Array.from(edgeLookup.get(node.pub_key) || new Set())
            .map(p => parseInt(p.capacity))
            .reduce((sum, val) => sum + val, 0);
        }
        let filteredNodes = graph.nodes.slice();
        this.setState({
          fullGraph: graph,
          renderedGraph: graph,
          filteredNodes,
          nodeLookup,
          edgeLookup,
        });
        this.graphRef.redrawGraph(graph);
      });
  }

  selectNode = pub_key => {
    this.graphRef.selectNode(pub_key);
  };

  deselectNode = () => {
    this.setState({ selectedNode: null, selectedNodeChannels: null });
    this.graphRef.deselectNode();
  };

  highlightNodes = () => {
    let pub_keys = this.state.filteredNodes.map(n => n.pub_key);
    this.graphRef.highlightNodes(pub_keys);
  };

  redrawNodes = () => {
    let nodes = this.state.filteredNodes;
    let pubKeySet = new Set(nodes.map(p => p.pub_key));
    let edges = this.state.fullGraph.edges.filter(
      e => pubKeySet.has(e.node1_pub) && pubKeySet.has(e.node2_pub)
    );
    this.setState({ renderedGraph: { nodes, edges } });
    this.graphRef.redrawGraph({ nodes, edges });
  };

  filterNodes = query => {
    let nodes = nodeSearch.search(this.state.fullGraph, query);
    this.setState({ filteredNodes: nodes });
  };

  onNodeSelected = pub_key => {
    let selectedNode = this.state.nodeLookup.get(pub_key);
    let selectedNodeChannels = Array.from(this.state.edgeLookup.get(pub_key) || []);
    this.setState({ selectedNode, selectedNodeChannels });
  };

  render() {
    return (
      <div className="graph-container">
        <Graph ref={el => (this.graphRef = el)} onNodeSelected={this.onNodeSelected} />
        <GraphSummary graph={this.state.renderedGraph} />
        <GraphControls
          resetZoomPan={this.graphRef && this.graphRef.resetZoomPan}
          zoomIn={this.graphRef && this.graphRef.zoomIn}
          zoomOut={this.graphRef && this.graphRef.zoomOut}
          zoomStop={this.graphRef && this.graphRef.zoomStop}
        />
        <NodeListCard
          {...this.state}
          filterNodes={this.filterNodes}
          selectNode={this.selectNode}
          highlightNodes={this.highlightNodes}
          redrawNodes={this.redrawNodes}
        />
        <NodeInfoCard deselectNode={this.deselectNode} {...this.state} />
      </div>
    );
  }
}
