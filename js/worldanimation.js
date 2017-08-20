var amplify = 0.95

var width = 960 * amplify,
    height = 480 * amplify;

var projection = d3.geo.robinson()
    .scale(150 * amplify)
    .translate([width / 2, height / 2])
    .precision(.001);

// var projection = d3.geo.conicEquidistant()
//   .center([0, 15])
//   .scale(128)
//   .translate([width / 2, height / 2])
//   .precision(.1);
//
// var projection = d3.geo.orthographic()
//   .scale(250)
//   .translate([width / 2, height / 2])
//   .clipAngle(90)
//   .precision(.1);

var λ = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var φ = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

projection.rotate([λ(width/2), φ(height/2)]);
// projection.rotate([λ(-250), φ(height / 2)]);

var path = d3.geo.path()
    .projection(projection);


var graticule = d3.geo.graticule();

var airports_by_iata = {}
var united_airports_by_iata = {}
var airports_with_routes = {}

var svg = d3.select("#worldmap") //.append("svg")
    //.call(d3.behavior.zoom().on("zoom", redraw))
    .attr("width", width)
    .attr("height", height);

d3.select(window)
    .on("resize", function () {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth
        // y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        if (x < 750) {
            targetWidth = 500
        } else {
            targetWidth = 960 * amplify
        }
        svg.attr("width", targetWidth);
        // svg.attr("height", targetWidth);
    });


d3.json("world-110m.json", function (error, world) {
    if (error) throw error;

    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
            return a !== b;
        }))
        .attr("class", "boundary")
        .attr("d", path)

    var nocache = new Date()



    var infosvg = d3.select("#info") //.append("svg")
        //.call(d3.behavior.zoom().on("zoom", redraw))
        .attr("width", width)
        .attr("height", height);


    var stops
    var names_timeout

    // var transform_lonlat = function(lon, lat) {
    //     return [
    //       (lon - translate_lon) / scale,
    //       (lat - translate_lat) / scale,
    //     ]
    //   }

    // var add_cable = function(tj, cable) {
    //     var paths = cable.path
    //     var arcs = []
      
    //     for (var i = 0; i < paths.length; i++) {
    //       var path = paths[i];
      
    //       var last = transform_lonlat(path[0][0], path[0][1])
    //       var arc = [last]
      
    //       for (var j = 1; j < path.length; j++) {
    //         var next = transform_lonlat(path[j][0], path[j][1])
    //         arc.push([next[0] - last[0], next[1] - last[1]])
    //         last = next
    //       }
      
    //       arcs.push([tj.arcs.length])
    //       tj.arcs.push(arc)
    //     }
      
    //     var id = 'cable_' + cable._id
    //     var obj = {
    //       type: "MultiLineString",
    //       arcs: arcs,
    //       id: cable._id
    //     }
      
    //     tj.objects[id] = obj
    //   }
    //   var custom = {
    //     "type": "Topology",
    //     "transform": {
    //       "scale": [scale, scale],
    //       "translate": [translate_lon, translate_lat]
    //     },
    //     "objects": {
    //     },
    //     "arcs": [
    //     ]
    //   }
    //   var scale = 0.0001
    //   var translate_lon = -180
    //   var translate_lat = -90
    //   for (var i = 0; i < submarine.length; i++)
    //     add_cable(custom, submarine[i])


    document.drawRoute = function(origin, destination, distance, icon, callback) {
        console.log('drawRoute', arguments)
        var bezierLine = d3.svg.line()
            .x(function (d) {
                return projection(d)[0];
            })
            .y(function (d) {
                return projection(d)[1];
            })
            .interpolate("basis");
        
        // var torigin = origin
        // var tdestination = destination

        // origin[1] = torigin[0]
        // origin[0] = torigin[1]
        // destination[0] = tdestination[1]
        // destination[1] = tdestination[0]

        var trayectory = [origin, [parseFloat(origin[0] + (destination[0] - origin[0]) / 2), parseFloat(origin[1] + (destination[1] - origin[1]) / 2) + 3], destination]

        // if(origin[0] > -180 && destination[0] < -180){
        //   var diff = origin[1]-destination[1]
        //   console.log('===> diff', diff)
        //
        //   var xx = parseFloat(origin[0] + (destination[0] - origin[0]) / 2)
        //   var yy = parseFloat(origin[1] + (destination[1] - origin[1]) / 2)
        //   trayectory = [origin, [xx*10 , -1*diff*10],[0 , -1000], [-xx*10 , diff*10], destination]
        // }

        var stroke_width = 1
        var tweenfunction = function () {
            var len = this.getTotalLength();
            return function (t) {
                return (d3.interpolateString("0," + len, len + ",0"))(t)
            };
        }
        if (icon != undefined) {
            color = 'grey'
            tweenfunction = function () {
                var len = this.getTotalLength();
                return function (t) {
                    if (icon.indexOf('plane') > -1) {
                        return (d3.interpolateString("0,0,3," + len + ",0", "0," + len + ",3,0,0"))(t)
                    } else {
                        return (d3.interpolateString("0," + len, len + ",0"))(t)
                    }
                };
            }
            distance = distance * 2
            stroke_width = 0.1
        }
        var duration = 40 * distance
        svg.append('path')
            .attr("d", bezierLine(trayectory))
            .attr("stroke", 'blue')
            .attr("stroke-width", stroke_width)
            .attr("fill", "none")
            .attr("stroke-dasharray", "0,1")
            .on("mouseover", function (d) {
                var stops = []
                d3.select(this)
                    .attr("stroke-width", 10)
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .attr("stroke-width", stroke_width)
            })
            .transition()
            .duration(duration)
            .attrTween("stroke-dasharray", tweenfunction)

            .each("end", function () {
                console.log('ended!')
                if(callback) callback()
            })

    }

});

// d3.select(self.frameElement).style("height", height + "px");