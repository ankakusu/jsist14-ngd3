/**
 * Created by yaprak on 24/09/14.
 */
var directives = angular.module("directives");

directives.directive("mapCanvas", function($http){
  var that = this;

  that.processData = function(data){
    var datas = [];
    for(d in data.results){
      datas.push(data.results[d].geometry.location);
    }
    return datas;
  };

  var mapCanvas = {};
  mapCanvas.scope = {
    data: "@",
    rotateYaw: "@",
    rotatePitch: "@",
    centerLat: "@",
    centerLon: "@",
    scale: "@"
  };
  mapCanvas.restrict = "AE";
  mapCanvas.template =
    "<div class='map-form'><input style='width: 20em;' ng-model='searchText' class='form-control' type='text' placeholder='Enter search text!'> </input>" +
    "<button class='btn btn-default' ng-click='search()'>Search!</button></div>" ;

  mapCanvas.link = function(lScope, lElem, lAttr){
    lScope.render = function(data){
      // update circles
      var circles = g.selectAll("circle").data(data);

      circles.attr("cx", function(d) {
          return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.lng, d.lat])[1];
        });

      // add new circles
      circles.enter()
        .append("circle")
        .attr("cx", function(d) {
          return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.lng, d.lat])[1];
        })
        .attr("r", 5)
        .style("fill", "red");

      // delete unused circles
      circles.exit().remove();

    };

    lScope.search = function(){
      var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + lScope.searchText.split(' ').join('+') + "&key=AIzaSyDqbi8tp0DeUHQKASyRyJUqJbOZpMOuuig";
      $http.get(url).success(function(data){
        lScope.render(that.processData(data));
      })
      .error(function(err){
        console.error("Error in google places api");
        console.log(err);
      });
    };

    lScope.$watch("data", function() {
      if(that.topology){
        console.log("Topology");
        console.log(lAttr);

        $( "#"+ lAttr.id +" svg g *").remove();

        projection = d3.geo.mercator()
          .center([ parseFloat(lAttr["centerLon"]), parseFloat(lAttr["centerLat"]) ] )
          .scale(parseFloat(lAttr["scale"]))
          .rotate([parseFloat(lAttr["rotateYaw"]), parseFloat(lAttr["rotatePitch"]) ]);

        path = d3.geo.path().projection(projection);

       g.selectAll("path")
          .data(topojson.object(that.topology, that.topology.objects.countries)
            .geometries).enter()
          .append("path")
          .attr("d", path);

        // zoom and pan
        var zoom = d3.behavior.zoom()
          .on("zoom",function() {
            g.attr("transform","translate("+
              d3.event.translate.join(",")+")scale("+d3.event.scale+")");
            g.selectAll("circle")
              .attr("d", path.projection(projection));
            g.selectAll("path")
              .attr("d", path.projection(projection));
          });

        svg.call(zoom);
      }

    }, true);

    var width = 550,
      height = 400;

    var projection = d3.geo.mercator()
    .center([ parseFloat(lAttr["centerLon"]), parseFloat(lAttr["centerLat"]) ] )
    .scale(parseFloat(lAttr["scale"]))
    .rotate([parseFloat(lAttr["rotateYaw"]), parseFloat(lAttr["rotatePitch"]) ]);

    var svg = d3.select("#" + lAttr.id).append("svg")
      .attr("width", width)
      .attr("height", height);

    var path = d3.geo.path()
      .projection(projection);

    var g = svg.append("g");

    // load and display the World
    d3.json("data/worldData.json", function(error, topology) {
      that.topology = topology;
      g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries).geometries)
        .enter()
        .append("path")
        .attr("d", path);
    });

    // zoom and pan
    var zoom = d3.behavior.zoom()
      .on("zoom",function() {
        g.attr("transform","translate("+
          d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("circle")
          .attr("d", path.projection(projection));
        g.selectAll("path")
          .attr("d", path.projection(projection));
      });

    svg.call(zoom);
  };

  return mapCanvas;
});