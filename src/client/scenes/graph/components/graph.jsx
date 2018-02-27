import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export class Graph extends React.Component {
  static propTypes = {
    graph: PropTypes.object,
    onNodeSelected: PropTypes.func,
    selectedNode: PropTypes.object,
  };

  componentDidMount() {
    this.initializeGraph();
  }

  shouldComponentUpdate(newProps) {
    if (!this.props.graph) {
      let graph = this.mapLndGraph(newProps.graph);
      this.graph = graph;
      this.renderUpdates();
    }
    return false;
  }

  render() {
    return <svg ref={elem => (this.svgRef = elem)} />;
  }

  mapLndGraph(json) {
    let nodes = json.nodes;
    let links = json.edges.map(p => ({
      source: p.node1_pub,
      target: p.node2_pub,
      edge: p,
    }));
    return { nodes, links };
  }

  initializeGraph = () => {
    let d3svg = d3.select(this.svgRef);
    d3svg
      .attr('width', d3svg.node().parentNode.clientWidth)
      .attr('height', d3svg.node().parentNode.clientHeight);

    let width = d3svg.attr('width');
    let height = d3svg.attr('height');

    let group = d3svg.append('g');

    this.simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.pub_key))
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength(-100)
          //.distanceMin(10)
          .distanceMax(1000)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      // .force('x', d3.forceX())
      // .force('y', d3.forceY())
      .on('tick', this.simulationTick);

    this.links = group
      .append('g')
      .attr('class', 'links')
      .selectAll('line');

    this.nodes = group
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle');

    // create the zoom function
    this.zoom = d3.zoom().on('zoom', () => {
      group.attr('transform', d3.event.transform);
    });

    // apply zoom function to svg
    d3svg.call(this.zoom);
  };

  simulationTick = () => {
    this.links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    this.nodes.attr('cx', d => d.x).attr('cy', d => d.y);
  };

  renderUpdates = () => {
    let { links, nodes } = this.graph;

    this.links.exit().remove();
    this.links = this.links
      .data(links)
      .enter()
      .append('line')

      .merge(this.links);

    this.nodes.exit().remove();
    this.nodes = this.nodes
      .data(nodes)
      .enter()
      .append('circle')
      .attr('id', d => 'pk_' + d.pub_key)
      .attr('style', d => 'stroke: ' + d.color)
      .attr('r', 2)
      .on('click', this.nodeClicked)
      .merge(this.nodes);

    this.simulation.nodes(nodes);
    this.simulation.force('link').links(links);
    this.simulation.alpha(0.5).restart(); // adjust to allow first run to finish
  };

  nodeClicked = d => {
    this.props.onNodeSelected(d);
    this.selectNode(d);
  };

  selectNode = d => {
    let selectedPubKey = d.pub_key;

    // change all nodes to radius 2
    d3
      .select('.nodes circle.selected')
      .attr('r', 2)
      .attr('class', null);

    // update current node to radius 4
    d3
      .select('#pk_' + d.pub_key)
      .attr('r', 4)
      .attr('class', 'selected');

    // remove selected line
    d3.selectAll('.links .selected').attr('class', null);

    // add selected lines
    d3
      .selectAll('.links line')
      .attr(
        'class',
        d =>
          d.edge.node1_pub === selectedPubKey || d.edge.node2_pub === selectedPubKey
            ? 'selected'
            : ''
      );
  };

  find = pub_key => {
    let node = this.graph.nodes.find(node => node.pub_key === pub_key);

    // obtain a transform to move to the current node
    let d3svg = d3.select(this.svgRef);
    let width = d3svg.attr('width');
    let height = d3svg.attr('height');
    let transform = d3.zoomTransform(d3svg).translate(node.x + width, node.y + height);

    // perform translation
    this.zoom.translateTo(d3svg, transform.x, transform.y);

    this.selectNode(node);
  };
}
