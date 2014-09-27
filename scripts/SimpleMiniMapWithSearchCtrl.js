angular.module("controllers")
  .controller("SimpleMiniMapWithSearchCtrl", function($scope, $http){
    var width = 600,
      height = 450;

    var projection = d3.geo.mercator()
      .center([0, 0])
      .scale(120)
      .rotate([0, 0]);

    var svg = d3.select("#searchable-map").append("svg")
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

    $scope.search = function(){
      var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="
        + $scope.inpSearch.split(' ').join('+')
        + "&key=AIzaSyDqbi8tp0DeUHQKASyRyJUqJbOZpMOuuig";

      $http.get(url)
        .success(function(data){
          console.log(data);
          render(processData(data));
        })
        .error(function(err){});
    }

    function render(data) {
      console.log(data);
      // update circles
      var circles = g.selectAll("circle").data(data);
      console.log(circles);

      circles.attr("cx", function (d) {
          return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function (d) {
          return projection([d.lng, d.lat])[1];
        });

      // add new circles
      circles.enter()
        .append("circle")
        .attr("cx", function (d) {
          return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function (d) {
          return projection([d.lng, d.lat])[1];
        })
        .attr("r", 5)
        .style("fill", "red");

      // delete unused circles
      circles.exit().remove();
    }

    function processData(data){
      var datas = [];
      for(d in data.results){
        datas.push(data.results[d].geometry.location);
      }
      return datas;
    }
  });