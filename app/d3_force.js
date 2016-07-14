// d3_force.js
// http://bl.ocks.org/mbostock/950642
// http://bigtext.org/
// return ((NODE_SIZE) ? scale(d.children) : 10);

var MINRELCOUNT = 1 // Set which edges should show
var USECIRCLES = true // set to false to use gender specific svg files

// The action response for a button on the html page. It determines which 'edges' show
// on the network graph.
// TODO: Either redraw the graph or add/remove edges on the fly.
function conn_show() {
    //alert("holalalalalal.....!");
    btn_cc = document.getElementById("conn_count");
    if (btn_cc.innerText == "Show All Connections") {
        btn_cc.innerText = "Only Show 3+ Connections";
        MINRELCOUNT = 1;
        force.start();
    }
    else {
        btn_cc.innerText = "Show All Connections";
        MINRELCOUNT = 3;
        force.start();
    };
}

//Width and height
var w = 500;
var h = 300;

// Start off by creating an SVG container to hold the visualization. We only need to specify
// the dimensions for this container.
var svg = d3.select(".force")
    .attr("width", w)
    .attr("height", h);

// Create the force layout.  After a call to force.start(), the tick method will
//   be called repeatedly until the layout "gels" in a stable configuration.
// linkDistance() is the distance we desire between connected nodes, 20 is default
// linkStrength() adjusts the strength of the linkDistance, 1 is default; a data driven statement:
//   force.linkStrength(function(link) { if (link.className === 'red')  return 0.1; return 1; });
// charge() default is -30; a negative value results in node repulsion, a positive
//   value in node attraction
// TODO: Set charge to a greater number for nodes with no links. Or alter gravity.
var force = d3.layout.force()
    .size([w, h])
    .linkDistance(50)
    .charge(-75);


var colors = d3.scale.category10();

// Create a range of opacities to be used for the edges, to make stronger bonds stand out.
// then create a d3.scale that'll allow values to be evenly spread across possible values.
// TODO: Fix min/max and incorporate.
var MINOPACITY = 0.1; // minimum opacity (0 is invisible)
var MAXOPACITY = 1; // maximum opacity (1 is fully opaque) 
//var minConnections = d3.min(d3.values(dataset.edges)).connections
//var maxConnections = d3.max(d3.values(dataset.edges)).connections
var edgeOpacityScale = d3.scale.linear().domain([1, 3]).range([MINOPACITY, MAXOPACITY]);


// Create a range of radii to be used for the node sizes, based on child count.
// then create a d3.scale that'll allow values to be evenly spread across possible values.
// TODO: Fix min/max and incorporate
var MINRADIUS = 7;
var MAXRADIUS = 20;
//var minChildren = d3.min(d3.values(dataset.node)).children
//var maxChildren = d3.max(d3.values(dataset.node)).children
var nodeRadiusScale = d3.scale.linear().domain([0, 10]).range([MINRADIUS, MAXRADIUS]);

// load the external data
d3.json("data/data.json", function (error, dataset) {


    // Define the data for the example (from the *.json file above). A force layout generally
    // requires 2 data arrays. 1) The 'nodes' contains the object that are the focal point of the 
    // visualization. 2) The 'links' or 'edges' identifying all the links between the nodes.
    //
    // dataEdges is an array containing objects with 'source' & 'target'. The values of those 
    // properties are the indices in dataNodes array (the 2 endpoints of the link/edge).
    dataNodes = dataset.node;
    dataEdges = dataset.edges.filter(function (d) { return d.connections >= MINRELCOUNT; })

    // start() calls the tick() method repeatedly to lay out the graph.
    force
        .nodes(dataNodes)
        .links(dataEdges)
        .start();

    // Add the nodes & edges to the visualization. For now we'll just stick them into the SVG
    //   container. We start with edges. The order is important because we want the nodes to appear
    //   "on top of" the links. (SVG doesn't really have a convenient equivalent to HTML's 'z-index'; 
    //   instead it relies on the order of the elements in the markup. By adding the nodes *after*
    //   the edges we ensure that nodes appear on top of edges.
    // Edges are pretty simple. They're just SVG lines, and we're not even going to specify their 
    //   coordinates. (We'll let the force layout take care of that.) Without any coordinates, 
    //   the lines won't even be visible, but the markup will be sitting inside the SVG container
    //   ready and waiting for the force layout to set their location.
    //
    // .selectAll() selects *all* elements that match the criteria.  When this is run, no objects 
    //   meet the criteria (because our svg pallette does not yet have any lines).
    // .data() binds our datasource ('dataEdges' here) to all existing lines, by ID. How does it work?
    //   dataEdges is an array of data values (specifying 'source', 'target', 'connections'), but it 
    //   could be a function that returns an array of values. Since we didn't specify a key (an optional
    //   2nd variable), then the first value of our array ('source') is used as the key for each element.
    //   And the entire array is stored in the __data__ property (defined by D3), so it's available later. 
    // .enter() returns all of the data elements that are not yet bound to an existing line (which is all
    //   of them the 1st time through.
    // .append() adds a "line" (in this case) for each data-element that lacks a pre-existing line.
    //   It returns the appended elmenents.
    // .attr() adds an html "class" to each element, named "edge" for later use in CSS references.
    // .style() directly affects the CSS style "opacity" by looping through each element in the data
    //   and passing it into the function.  In this case we pass d.connections into our previously created
    //   edgeOpacityScale, whic will return a number between 0 and 1 to designate the line's opacity.
    var edges = svg.selectAll("line")
        .data(dataEdges)
        .enter()
        .append("line")
        .attr("class", "edge")
        .style("opacity", function (d) { return edgeOpacityScale(d.connections); });

    // It's the nodes' turn. While we could draw circles (or whatever) here, we'll instead add a
    //   container element ('g') which can hold a circle, a picture, or text.
    // The 'g' element is a container used to group other SVG elements. Transformations applied to
    //   the g element are performed on all of its child elements, and any of its attributes are
    //   inherited by its child elements.
    // .classed() adds the 'gnode' class to each element, but only if it doesn't already exist.
    var gnodes = svg.selectAll('g.gnode')
        .data(dataNodes)
        .enter()
        .append('g')
        .classed('gnode', true);

    
    if (USECIRCLES) {
        // Add one circle to each gnode, with a class of node.
        // .attr() for "r" sets the radius based on the number of children.
        // .style() for "fill" sets the color based on our previously created colors var
        // .call() takes a selection ("gnodes" here) and hands it off to a function (force.drag)
        // force.drag binds a behavior to our nodes to allow interactive dragging, either mouse 
        //   or touch
        // TODO: Make it sticky: http://bl.ocks.org/mbostock/3750558
        // TODO: Make it collapsible: http://bl.ocks.org/mbostock/1093130
        // TODO: Use divergent forces: http://bl.ocks.org/mbostock/1021841
        var node = gnodes.append("circle")
            .attr("class", "node")
            .attr("r", function (d) { return nodeRadiusScale(d.children); })
            .style("fill", function (d, i) { return colors(d.group); })
            .call(force.drag);

        // Add events to each node: resize on mouseenter and mouseleave
        // 'this' is a keyword which refers to the object on which the currently executing
        //   method has been invoked (the mouseenter event in this case).
        // .transition() is similar to .select(), but it animates changes smoothly over time
        //   rather than applying instantaneously.
        // .attr() here uses the same scale that we set previously, but we double it (or reset
        //   it on mouseleave).
        var nodeEvents = node
            .on('mouseenter', function () {
                d3.select(this)
                .transition()
                .attr("r", function (d) { return nodeRadiusScale(d.children) * 2; })
            })
            // set back
            .on('mouseleave', function () {
                d3.select(this)
                .transition()
                .attr("r", function (d) { return nodeRadiusScale(d.children); })
            });

    } else {
        // TODO: Improve image appending (sizes are off and colors are not applied)
        var node = gnodes.append("svg:image")
            .attr("xlink:href", function (d) {
                var link = ((d.type == "F") ? "resource/female_symbol.svg" : "resource/male_symbol.svg");
                return link;
            })
            .attr("class", "node")
            .attr("x", function (d) { return -15; })
            .attr("y", function (d) { return -15; })
            .attr("height", 30)
            .attr("width", 30)
            .call(force.drag);
    }

    // Append a label to each node (or each gnode in this case). x, y, dx, and dy are SVG
    //   attributes. While x and y are absolute coordinates and dx and dy are relative coordinates
    //   (relative to the specified x and y for the containing gnode).
    // TODO: Set dx based on radius size.
    var labels = gnodes.append("text")
        .attr("class", "text")
        .attr("dx", 10)
        .attr("dy", 3)
        .style("font-family", "Calibri")
        .style("font-size", "10")
        .text(function (d) { return d.name});

    // This tick method is called repeatedly until the layout stabilizes. The order in which we
    // update nodes and edges does *not* determine which gets drawn 1st.  Drawing order is
    // determined above by the order in which we added them.
    force.on("tick", function () {

        // Drawing the edges (links between source and target): Update the start and end points
        // of each line element from the x, y fields of the corresponding source and target
        // node objects. (This is the glue that makes the edges and the nodes appear related.)
        // x1, etc. are SVG attributes that define a line
        edges.attr("x1", function (d) { return d.source.x; })
             .attr("y1", function (d) { return d.source.y; })
             .attr("x2", function (d) { return d.target.x; })
             .attr("y2", function (d) { return d.target.y; });

        // Reposition the nodes (which we drew above): Update the x, y fields of the gnodes.
        // 'transform' is an SVG attribute which applies a list of transformations to an element
        //   and it's children.
        // 'translate' is an SVG command to move the element relative to its parent (I think?) 
        gnodes.attr("transform", function (d) {
            return 'translate(' + [d.x, d.y] + ')';
        });
    });
});

