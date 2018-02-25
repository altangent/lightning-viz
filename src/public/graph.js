function onNodeSelected(node) {
  console.log(node);
}
function mapLndGraph(json) {
  let nodes = json.nodes;
  let links = json.edges.map(p => ({
    source: p.node1_pub,
    target: p.node2_pub,
    edge: p,
  }));
  return { nodes, links };
}

function renderNetworkGraph(svg) {
  svg = d3.select(svg);
  svg
    .attr('width', svg.node().parentNode.clientWidth)
    .attr('height', svg.node().parentNode.clientHeight);

  let width = svg.attr('width');
  let height = svg.attr('height');
  let maxNodes = 10000;

  fetch('/api/graph?nodes=' + maxNodes)
    .then(res => res.json())
    .then(graphJson => this.mapLndGraph(graphJson))
    .then(graph => render(graph));

  function render(graph, info) {
    let { nodes, links } = graph;
    let selectedPubKey = null;
    onNodeSelected(selectedPubKey);

    var g = svg.append('g');

    let simulation = d3
      .forceSimulation()
      .force('links', d3.forceLink().id(d => d.pub_key))
      // .force(
      //   'charge',
      //   d3
      //     .forceCollide()
      //     .radius(20)
      //     .strength(0.2)
      // )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    let link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr(
        'class',
        d => (d.source === selectedPubKey || d.target === selectedPubKey ? 'selected' : '')
      );

    let node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('id', d => 'pk_' + d.pub_key)
      .attr('class', d => (d.pub_key === selectedPubKey ? 'selected' : ''))
      .attr('style', d => 'stroke: ' + d.color)
      .attr('r', d => (d.pub_key === selectedPubKey ? 4 : 2))
      .on('click', nodeClicked);

    simulation.nodes(nodes).on('tick', ticked);
    simulation.force('links').links(links);

    // create the zoom function
    let zoom = (window.zoom = d3.zoom().on('zoom', () => {
      g.attr('transform', d3.event.transform);
    }));

    // apply zoom function to svg
    svg.call(zoom);

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('cx', d => d.x).attr('cy', d => d.y);
    }

    function nodeClicked(d) {
      onNodeSelected(d.pub_key);
      selectNode(d);
    }

    function selectNode(d) {
      selectedPubKey = d.pub_key;

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
    }

    function find(search) {
      let node = nodes.find(node => node.pub_key === search);

      // obtain a transform to move to the current node
      let transform = d3.zoomTransform(svg).translate(node.x + width, node.y + height);

      // perform translation
      zoom.translateTo(svg, transform.x, transform.y);

      selectNode(node);
    }

    document.getElementById('searchBtn').onclick = () => {
      find(document.getElementById('search').value);
    };
  }
}
