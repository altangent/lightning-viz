import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as d3Sim from '../../../../shared/d3-simulation';

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

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <svg ref={elem => (this.svgRef = elem)} />;
  }

  updateGraph(apiGraph) {
    // TODO, this should merge nodes into the state graph
    this.graphData = this._mergeGraphState(apiGraph);
    this._renderUpdates();
  }

  redrawGraph(apiGraph) {
    this.graphData = this._mergeGraphState(apiGraph);
    this._initializeGraph();
    this._renderUpdates();
  }

  selectNode = pub_key => {
    let node = this.graphData.nodes.find(node => node.pub_key === pub_key);
    this._selectNode(node);
    this._focusNode(node);
    this.props.onNodeSelected(node.pub_key);
  };

  deselectNode = () => {
    this._drawResetSelections();
  };

  highlightNodes = pub_keys => {
    this._drawResetSelections();
    pub_keys.forEach(this._drawHighlightNode);
  };

  resetZoomPan = () => {
    let d3svg = d3.select(this.svgRef);
    let width = d3svg.attr('width');
    let height = d3svg.attr('height');
    let transform = d3.zoomTransform(d3svg).translate(width / 2 - 400, height / 2 - 200);
    this.zoom.translateTo(d3svg, transform.x, transform.y);
    this.zoom.scaleTo(d3svg, 0.5);
  };

  zoomIn = () => {
    this.zooming = true;
    this._zoom(1.02);
  };

  zoomOut = () => {
    this.zooming = true;
    this._zoom(0.98);
  };

  zoomStop = () => {
    this.zooming = false;
  };

  ///////////////////////////////////////////////

  _zoom = amt => {
    let d3svg = d3.select(this.svgRef);
    this.zoom.scaleBy(d3svg, amt);
    if (this.zooming) setTimeout(() => this._zoom(amt), 10);
  };

  _mergeGraphState(json) {
    let nodes = json.nodes.map(p => JSON.parse(JSON.stringify(p)));
    let links = json.edges.map(p => JSON.parse(JSON.stringify(p))).map(p => ({
      source: p.node1_pub,
      target: p.node2_pub,
      edge: p,
    }));
    return { nodes, links };
  }

  _initializeGraph = () => {
    let d3svg = d3.select(this.svgRef);
    d3svg.selectAll('*').remove();

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

    // initialize zoom
    this.resetZoomPan();

    // construct the simulation
    this.simulation = d3Sim.createSimulation({ width, height });
    this.simulation.on('tick', this._simulationTick);
    this.simulation.on('end', () => console.log('render complete'));

    // construct link selection method
    this.links = zoomGroup
      .append('g')
      .attr('class', 'links')
      .selectAll('line');

    // construct node selection method
    this.nodes = zoomGroup
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle');
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

    // merge the new nodes
    this.nodes.exit().remove();
    this.nodes = this.nodes
      .data(nodes)
      .enter()
      .append('circle')
      .attr('id', d => 'pk_' + d.pub_key)
      .attr('style', d => 'fill: ' + d.color)
      .attr('r', 2)
      .on('click', this._nodeClicked)
      .merge(this.nodes);

    // merge the new links
    this.links.exit().remove();
    this.links = this.links
      .data(links)
      .enter()
      .append('line')
      .merge(this.links);

    // update the simulation
    this.simulation.nodes(nodes);
    this.simulation.force('link').links(links);
    this.simulation.alpha(0); // force single render from server values
    //this.simulation.restart(); // adjust to allow first run to finish
  };

  _nodeClicked = d => {
    this.props.onNodeSelected(d.pub_key);
    this._selectNode(d);
  };

  _selectNode = ({ pub_key }) => {
    this._drawResetSelections();
    this._drawSelectNode(pub_key);
    this._drawHighlightConnectedNodes(pub_key);
  };

  _drawSelectNode = pub_key => {
    // update selected node
    d3
      .select('#pk_' + pub_key)
      .attr('r', 5)
      .attr('class', 'selected');

    // update selected channels
    d3
      .selectAll('.links line')
      .attr(
        'class',
        d => (d.edge.node1_pub === pub_key || d.edge.node2_pub === pub_key ? 'selected' : '')
      );
  };

  _drawHighlightConnectedNodes = pub_key => {
    let connPubKeys = this._findConnectedPubKeys(pub_key);
    for (let connPubKey of connPubKeys) {
      this._drawHighlightNode(connPubKey);
    }
  };

  _drawHighlightNode = pub_key => {
    d3
      .select('#pk_' + pub_key)
      .attr('r', 3)
      .attr('class', 'highlight');
  };

  _drawResetSelections = () => {
    // reset all nodes
    d3
      .selectAll('.nodes circle.selected, .nodes circle.highlight')
      .attr('r', 2)
      .attr('class', null);

    // reset all channels
    d3.selectAll('.links line.selected').attr('class', null);
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

  _findConnectedPubKeys = pub_key => {
    return this.graphData.links
      .filter(link => link.edge.node1_pub === pub_key || link.edge.node2_pub === pub_key)
      .map(link => (link.edge.node1_pub === pub_key ? link.edge.node2_pub : link.edge.node1_pub));
  };
}
