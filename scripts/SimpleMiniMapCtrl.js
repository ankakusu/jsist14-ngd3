angular.module("controllers")
  .controller("SimpleMiniMapCtrl", function(){
    var width = 600,
      height = 450;

    var projection = d3.geo.mercator()
      .center([0, 0])
      .scale(120)
      .rotate([0, 0]);

    var svg = d3.select(".mini-map").append("svg")
      .attr("width", width)
      .attr("height", height);

    var path = d3.geo.path()
      .projection(projection);

    var g = svg.append("g");

// load and display the World Data
    d3.json("data/worldData.json", function(error, topology) {
      g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries).geometries)
        .enter()
        .append("path")
        .attr("d", path);
    });
  });