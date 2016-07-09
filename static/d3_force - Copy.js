// d3_force.js
// http://bl.ocks.org/mbostock/950642

//Width and height
var w = 500;
var h = 300;

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


//Initialize a default force layout, using the node and edges in dataset
var force = d3.layout.force()
    .size([w, h])
    .linkDistance([50])
    .charge([-100]);

// load the external data
d3.json("static/data.json", function (error, treeData) {
    d = treeData;
});

force
    .nodes(d.node)
    .links(d.edges)
    .start()

var colors = d3.scale.category10();

//Create edges as lines
var edges = svg.selectAll("line")
    .data(d.edges)
    .enter()
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);


// Create the groups under svg
var gnodes = svg.selectAll('g.gnode')
    .data(d.node)
    .enter()
    .append('g')
    .classed('gnode', true);

// Add one circle in each group
var node = gnodes.append("circle")
    .attr("class", "node")
    .attr("r", 10)
    .style("fill", function (d, i) { return colors(i); })
    .call(force.drag);

// Append the labels to each group
var labels = gnodes.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    //.style("fill", "blue")
    .style("font-family", "Calibri")
    .style("font-size", "10")
    .text(function (d) { return d.name });


//Every time the simulation "ticks", this will be called
force.on("tick", function () {

    edges.attr("x1", function (d) { return d.source.x; })
         .attr("y1", function (d) { return d.source.y; })
         .attr("x2", function (d) { return d.target.x; })
         .attr("y2", function (d) { return d.target.y; });

    gnodes.attr("transform", function (d) {
        return 'translate(' + [d.x, d.y] + ')';
    });
    //gnodes.attr("cx", function (d) { return d.x; })
    //     .attr("cy", function (d) { return d.y; });

});


