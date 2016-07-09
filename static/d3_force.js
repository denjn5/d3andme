// d3_force.js
// http://bl.ocks.org/mbostock/950642
// http://bigtext.org/
// return ((NODE_SIZE) ? scale(d.children) : 10);

//Width and height
var w = 500;
var h = 300;


// Get ahold of SVG element
var svg = d3.select(".force")
    .attr("width", w)
    .attr("height", h);


//Initialize a default force layout, using the node and edges in dataset
var force = d3.layout.force()
    .size([w, h])
    .linkDistance([50])
    .charge([-100]);


var colors = d3.scale.category10();


// Set up node sizes: scale(0); // returns MINRADIUS
var MINOPACITY = 0.1;
var MAXOPACITY = 1; 
var scaleOpacity = d3.scale.linear().domain([1, 3]).range([MINOPACITY, MAXOPACITY]);


// Set up node sizes: scale(0); // returns MINRADIUS
var MINRADIUS = 7;
var MAXRADIUS = 20;
var scaleRadius = d3.scale.linear().domain([0, 10]).range([MINRADIUS, MAXRADIUS]);


// load the external data
d3.json("static/data.json", function (error, dataset) {

    force
        .nodes(dataset.node)
        .links(dataset.edges)
        .start()


    //Create edges as lines
    var edges = svg.selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .attr("class", "edge")
        .style("opacity", function (d) { return scaleOpacity(d.count); });


    // Create the groups under svg
    var gnodes = svg.selectAll('g.gnode')
        .data(dataset.node)
        .enter()
        .append('g')
        .classed('gnode', true);

    // Add one circle in each group
    var node = gnodes.append("circle")
        .attr("class", "node")
        .attr("r", function (d) { return scaleRadius(d.children); })
        .style("fill", function (d, i) { return colors(d.group); })
        .call(force.drag);


    // Append the labels to each group
    var labels = gnodes.append("text")
        .attr("class", "text")
        .attr("dx", 10)
        .attr("dy", ".35em")
        .text(function (d) { return d.name});


    //Every time the simulation "ticks", this will be called
    force.on("tick", function () {

        edges.attr("x1", function (d) { return d.source.x; })
             .attr("y1", function (d) { return d.source.y; })
             .attr("x2", function (d) { return d.target.x; })
             .attr("y2", function (d) { return d.target.y; });

        gnodes.attr("transform", function (d) {
            return 'translate(' + [d.x, d.y] + ')';
        });
    });
});


