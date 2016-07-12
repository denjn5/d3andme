// d3_force.js
// http://bl.ocks.org/mbostock/950642
// http://bigtext.org/
// return ((NODE_SIZE) ? scale(d.children) : 10);

var MINRELCOUNT = 1 // Set which edges should show
var USECIRCLES = true // set to false to use gender specific svg files


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

// Get ahold of SVG element
var svg = d3.select(".force")
    .attr("width", w)
    .attr("height", h);

// Create the force layout.  After a call to force.start(), the tick method will
// be called repeatedly until the layout "gels" in a stable configuration.
var force = d3.layout.force()
    .size([w, h])
    .linkDistance([50])
    .charge([-100]);


var colors = d3.scale.category10();

// Create a range of opacities to be used for the edges, then create a d3.scale that'll allow 
// all values to be utilized across possible values. 
var MINOPACITY = 0.1; // minimum opacity (0 is invisible)
var MAXOPACITY = 1; // maximum opacity (1 is fully opaque) 
//var minConnections = d3.min(d3.values(dataset.edges)).connections
//var maxConnections = d3.max(d3.values(dataset.edges)).connections
var edgeOpacityScale = d3.scale.linear().domain([1, 3]).range([MINOPACITY, MAXOPACITY]);

// Set up node sizes: scale(0); // returns MINRADIUS
var MINRADIUS = 7;
var MAXRADIUS = 20;
//var minChildren = d3.min(d3.values(dataset.node)).children
//var maxChildren = d3.max(d3.values(dataset.node)).children
var scaleRadius = d3.scale.linear().domain([0, 10]).range([MINRADIUS, MAXRADIUS]);

// load the external data
d3.json("data/data.json", function (error, dataset) {

    dataEdges = dataset.edges.filter(function (d) { return d.connections >= MINRELCOUNT; })
    dataNodes = dataset.node;

    force
        .nodes(dataNodes)
        .links(dataEdges)
        .start();

    //Create edges as lines
    var edges = svg.selectAll("line")
        .data(dataEdges)
        .enter()
        .append("line")
        .attr("class", "edge")
        .style("opacity", function (d) { return edgeOpacityScale(d.connections); });

    // Create the groups under svg
    var gnodes = svg.selectAll('g.gnode')
        .data(dataNodes)
        .enter()
        .append('g')
        .classed('gnode', true);

    if (USECIRCLES) {
        // Add one circle in each group
        var node = gnodes.append("circle")
            .attr("class", "node")
            .attr("r", function (d) { return scaleRadius(d.children); })
            .style("fill", function (d, i) { return colors(d.group); })
            .call(force.drag);

        // grow node a little on mouse over
        var setEvents = node
                .on('mouseenter', function () {
                    //alert("holalalalalal.....!");
                    // select element in current context
                    d3.select(this)
                        .transition()
                        .attr("r", function (d) { return scaleRadius(d.children) * 2; })
                })
                // set back
                .on('mouseleave', function () {
                    d3.select(this)
                        .transition()
                        .attr("r", function (d) { return scaleRadius(d.children); })
                });

    } else {
        // Append images
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

    // Append the labels to each group
    var labels = gnodes.append("text")
        .attr("class", "text")
        .attr("dx", 10)
        .attr("dy", ".35em")
        .style("font-family", "Calibri")
        .style("font-size", "10")
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


