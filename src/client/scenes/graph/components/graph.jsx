import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

/**
 * This component is simply a wrapper for D3 rendered
 * via SVG. For performance reasons we're not going to use
 * JSX to render the SVG components and will instead rely
 * on D3 to do the heavy lifting.  As such, we're going to
 * use shouldComponentUpdate as an escape hatch to prevent
 * React from re-rendering the control once the SVG has been
 * initialized.
 *
 * This component will break from the React declarative
 * mold and use imperative methods to drive interactions with D3.
 * This will greatly simplify interactions with the graph and will
 * allow us to retain "graph" state inside D3 as seperate
 * objects from those stored in our React application.
 */

export class Graph extends React.Component {
  static propTypes = {
    onNodeSelected: PropTypes.func,
  };

  componentDidMount() {
    this._initializeGraph();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <svg ref={elem => (this.svgRef = elem)} />;
  }

  updateGraph(apiGraph) {
    this.graphData = this._mergeGraphState(apiGraph);
    this._renderUpdates();
  }

  selectNode = pub_key => {
    let node = this.graphData.nodes.find(node => node.pub_key === pub_key);
    this._highlightNode(node);
    this._focusNode(node);
  };

  _mergeGraphState(json) {
    let nodes = json.nodes;
    let links = json.edges.map(p => ({
      source: p.node1_pub,
      target: p.node2_pub,
      edge: p,
    }));
    return { nodes, links };
  }

  _initializeGraph = () => {
    let d3svg = d3.select(this.svgRef);
    d3svg
      .attr('width', d3svg.node().parentNode.clientWidth)
      .attr('height', d3svg.node().parentNode.clientHeight);
    let width = d3svg.attr('width');
    let height = d3svg.attr('height');

    // create the zoom function
    let zoomGroup = d3svg.append('g');
    this.zoom = d3.zoom().on('zoom', () => {
      zoomGroup.attr('transform', d3.event.transform);
    });
    d3svg.call(this.zoom);

    // construct the simulation
    this.simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.pub_key))
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength(-100)
          .distanceMax(1000)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', this._simulationTick);

    // construct node selection method
    this.nodes = zoomGroup
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle');

    // construct link selection method
    this.links = zoomGroup
      .append('g')
      .attr('class', 'links')
      .selectAll('line');
  };

  _simulationTick = () => {
    this.links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    this.nodes.attr('cx', d => d.x).attr('cy', d => d.y);
  };

  _renderUpdates = () => {
    let { links, nodes } = this.graphData;

    // merge the new links
    this.links.exit().remove();
    this.links = this.links
      .data(links)
      .enter()
      .append('line')
      .merge(this.links);

    // merge the new nodes (ontop of links)
    this.nodes.exit().remove();
    this.nodes = this.nodes
      .data(nodes)
      .enter()
      .append('circle')
      .attr('id', d => 'pk_' + d.pub_key)
      .attr('style', d => 'stroke: ' + d.color)
      .attr('r', 2)
      .on('click', this._nodeClicked)
      .merge(this.nodes);

    // update the simulation
    this.simulation.nodes(nodes);
    this.simulation.force('link').links(links);
    this.simulation.alpha(0.5).restart(); // adjust to allow first run to finish
  };

  _nodeClicked = d => {
    this.props.onNodeSelected(d);
    this._highlightNode(d);
  };

  _highlightNode = d => {
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

  _focusNode = node => {
    // obtain a transform to move to the current node
    let d3svg = d3.select(this.svgRef);
    let width = d3svg.attr('width');
    let height = d3svg.attr('height');
    let transform = d3.zoomTransform(d3svg).translate(node.x + width, node.y + height);

    // perform translation
    this.zoom.translateTo(d3svg, transform.x, transform.y);
  };
}
