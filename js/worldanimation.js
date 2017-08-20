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

//projection.rotate([λ(width/2), φ(height/2)]);
projection.rotate([λ(-250), φ(height / 2)]);

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

    setInfo('Loading...')

    function showInfo(visible_stops) {
        setInfo(undefined, visible_stops)
    }

    var stops
    var names_timeout

    function showName(d) {
        var countries_names = svg.selectAll('text.countries').data(d, function (d) {
            return d.IATA
        })
        countries_names.enter()
            .append('text')
            .attr('class', 'countries')
            .attr('x', function (d) {
                return projection([d.LONG, d.LAT])[0] + 10
            })
            .attr('y', function (d) {
                return projection([d.LONG, d.LAT])[1] + 5
            })
            .attr('fill', 'white')
            .text(function (d) {
                return d.CITY + ", " + d.COUNTRY + " (" + d.IATA + ")"
            })
        countries_names.exit().remove()
        var countries_names = svg.selectAll('text.airports').data(d, function (d) {
            return d.IATA
        })
        countries_names.enter()
            .append('text')
            .attr('class', 'airports')
            .attr('x', function (d) {
                return projection([d.LONG, d.LAT])[0] + 10
            })
            .attr('y', function (d) {
                return projection([d.LONG, d.LAT])[1] + 19
            })
            .attr('fill', 'white')
            .attr('font-size', '13px')
            .text(function (d) {
                return d.AIRPORT_NAME
            })
        countries_names.exit().remove()

    }

    function setInfo(remote_stops, visible_stops) {
        if (remote_stops != undefined) {
            stops = remote_stops
        } else {
            console.log('using previous stops', stops)
        }
        var visible_stops_iatas = []
        if (visible_stops != undefined) {
            _.each(visible_stops, function (each_stop) {
                visible_stops_iatas.push(each_stop.IATA)
            })
        }

        var title = []
        if (typeof (stops) != 'string') {
            var airport_stops = []
            _.each(stops, function (each_stop) {
                airport_stops.push(airports_by_iata[each_stop])
            })
            title = ["Route from " + airport_stops[0].IATA + ' to ' + airport_stops[airport_stops.length - 1].IATA + ":"]
        } else {
            title.push(stops)
        }

        var titlesvg = infosvg.selectAll('text.tit').data(title, function (d) {
            return d
        })
        titlesvg.enter()
            .append('text')
            .attr('class', 'tit')
            .attr('x', function (d, i) {
                return 0
            })
            .attr('y', function (d, i) {
                return 20
            })
            .attr('fill', '#05376A')
            .text(function (d) {
                return d
            })
            .attr('font-size', '25px')
            .transition()
            .attr('fill', 'white')
        titlesvg.exit()
            .remove()



        if (typeof (stops) != 'string') {

            var vertical_distance = 60

            var infodots = infosvg.selectAll('circle').data(airport_stops)

            infodots
                .attr('fill', function (d) {
                    if (visible_stops_iatas.indexOf(d.IATA) > -1) {
                        return 'white'
                    } else {
                        return '#8ED83D'
                    }
                })




            var titles = infosvg.selectAll('text.iata').data(airport_stops)
            infodots.enter()
                .append('text')
                .attr('class', 'iata')
                .attr('x', function (d, i) {
                    return 40
                })
                .attr('y', function (d, i) {
                    return i * vertical_distance + 58
                })
                .attr('fill', '#05376A')

                .text(function (d) {
                    return d.CITY + ', ' + d.COUNTRY + ' (' + d.IATA + ')'
                })
                .transition()
                .delay(function (d, i) {
                    return 400 * i + 400
                })
                .attr('fill', 'white')


            var titles = infosvg.selectAll('text.name').data(airport_stops)
            titles.enter()
                .append('text')
                .attr('class', 'name')
                .attr('font-size', '16px')
                .attr('x', function (d, i) {
                    return 40
                })
                .attr('y', function (d, i) {
                    return i * vertical_distance + 78
                })
                .attr('fill', '#05376A')
                .text(function (d) {
                    return d.AIRPORT_NAME
                })
                .transition()
                .delay(function (d, i) {
                    return 400 * i + 400
                })
                .attr('fill', 'white')


            airport_stops.shift()
            visible_stops_iatas.shift()
            var vertical_con = []
            _.each(airport_stops, function (each) {
                vertical_con.push({
                    distance: each.distance,
                    IATA: each.IATA
                })
            })

            var previous_duration = 0
            var previous_distance = 0
            var previous_distance_delay = 0
            var rects = infosvg.selectAll('rect').data(vertical_con)

            rects
                .attr('fill', function (d) {
                    if (visible_stops_iatas.indexOf(d.IATA) > -1) {
                        return 'white'
                    } else {
                        return '#8ED83D'
                    }
                })
            rects.enter()
                .append('rect')
                .attr('x', function (d, i) {
                    return 16
                })
                .attr('y', function (d, i) {
                    return i * vertical_distance + 50
                })
                .attr('width', 7.7)
                .attr('height', 0)
                .attr('fill', '#8ED83D')
                .transition()
                .delay(function (d, i) {
                    var this_distance = d.distance - previous_distance_delay
                    previous_distance_delay = d.distance

                    previous_duration = previous_duration + (this_distance * 40);
                    return previous_duration - (this_distance * 40)
                })
                .duration(function (d) {
                    var this_distance = d.distance - previous_distance
                    previous_distance = d.distance
                    return this_distance * 40
                })
                .attr('height', vertical_distance)


            infodots.enter()
                .append('circle')
                .attr('cx', function (d, i) {
                    return 20
                })
                .attr('cy', function (d, i) {
                    return i * vertical_distance + 50
                })
                .attr('r', '0px')
                .attr('fill', function (d) {
                    if (d.IATA in visible_stops_iatas) {
                        return 'red'
                    } else {
                        return '#8ED83D'
                    }
                })
                .transition()
                .delay(function (d, i) {
                    return 400 * i
                })
                .attr('r', '10px')

        }

    }


    d3.csv('airports.csv', function (airports) {

        _.each(airports, function (each) {
            var push_left = 0
            if ((each.CONTINENT.indexOf('Pacific') > -1 ||
                    each.CONTINENT.indexOf('Asia') > -1 ||
                    each.CONTINENT.indexOf('Australia') > -1) &&
                each.CONTINENT.indexOf('Calcutta') == -1) {
                push_left = 360
            }
            each.IATA = each.IATA.replace('*', '')
            each.LONG = each.LONG - push_left
            airports_by_iata[each.IATA] = each
        })

        function addLinkToAirportByIATA(fullname, link, distance) {
            var node = getAirportByIATA(fullname)
            try {
                if (getAirportByIATA(link) != undefined && distance > 0)
                    node['links'].push({
                        target: getAirportByIATA(link),
                        value: distance
                    })
            } catch (err) {
                console.log('was unable to add ', link, ' to ', fullname)
            }
        }

        function getAirportByIATA(fulliata) {
            // console.log(fulliata)
            var name = fulliata.split('-')[0];
            try {
                if (airports_by_iata[name]['links'] == undefined) {
                    var airport = airports_by_iata[name]
                    airport['links'] = []
                }
                return airports_by_iata[name];
            } catch (err) {
                return undefined
            }

        }


        var airports_dots
        d3.csv('united.csv', function (united) {
            d3.csv('conexiones.csv', function (conexiones) {
                var united_iatas = _.map(united, function (each_united) {
                    return each_united['IATA']
                })
                setInfo('')

                var united_airports = _.filter(airports, function (each_airport) {
                    if (united_iatas.indexOf(each_airport.IATA) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                })
                // only calculate routes for united airports for now
                _.each(united_airports, function (each) {
                    united_airports_by_iata[each.IATA] = each
                })
                ///console.log(airports_by_iata)

                airports_by_iata = united_airports_by_iata
                // console.log(united_airports_by_iata)


                airports_dots = svg.selectAll("circle")
                    .data(united_airports)

                airports_dots.enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        // console.log(projection([d.LONG, d.LAT]))
                        return projection([d.LONG, d.LAT])[0];
                    })
                    .attr("cy", function (d) {
                        return projection([d.LONG, d.LAT])[1];
                    })
                    .attr("r", "1px")
                    .attr('stroke', 'rgba(0,0,0,0)')
                    .attr('stroke-width', '10px')

                    .attr("fill", "#336190")
                    .on('click', function (dot) {
                        console.log(dot)
                        console.log(dot.IATA)
                    })
                    .on('mouseover', function (d) {
                        console.log('mouseover!')
                        d3.select(this)
                            .attr("r", '5px')
                        console.log(d)
                        clearTimeout(names_timeout)

                        showName([d])



                    })
                    .on('mouseout', function (d) {
                        console.log('mouseout!')
                        names_timeout = setTimeout(function () {
                            showName([])
                        }, 2000)
                        d3.select(this)
                            .attr("r", '1px')
                    })
                    .transition().delay(function (d, i) {
                        return i * 4
                    })
                    .attr("fill", "#10C113")

                //.attr("stroke-width", "0.3")
                //.attr("stroke", "white")

                var nodes = [],
                    nodesByName = {},
                    links = [];



                var conections = {}
                _.each(conexiones, function (fila) {
                    var origen = fila['ORIGEN']

                    if (conections[origen] == undefined) {
                        conections[origen] = []
                    }
                    delete fila['ORIGEN']
                    _.each(Object.keys(fila), function (each_column) {
                        if (each_column.indexOf('DESTINO') > -1) {
                            if (fila[each_column] != undefined && fila[each_column].length > 0) {
                                conections[origen].push(fila[each_column])
                            }
                        }
                    })
                })

                _.each(conections, function (d, key) {
                    _.each(d, function (k) {
                        var origin_iata = key.split('-')[0]
                        var destination_iata = k.split('-')[0]

                        //var goesleft = destination_iata.indexOf('*') > -1
                        origin_iata = origin_iata.replace('*', '')
                        destination_iata = destination_iata.replace('*', '')
                        var distance = getDistanceOfIatas(origin_iata, destination_iata)
                        // console.log(distance)
                        addLinkToAirportByIATA(origin_iata, destination_iata, distance)
                        addLinkToAirportByIATA(destination_iata, origin_iata, distance)
                        airports_with_routes[origin_iata] = 1
                        airports_with_routes[destination_iata] = 1
                        // links.push({
                        //   "source": addNodeByName(origin_iata),
                        //   "target": addNodeByName(destination_iata),
                        //   "value": distance})
                        // addLinkToNode(origin_iata, addNodeByName(destination_iata))
                    })
                });
                // console.log(links)



                function drawRoute(origin, destination, callback, distance, color, icon, originAirport, destinationAirport) {
                    var bezierLine = d3.svg.line()
                        .x(function (d) {
                            return projection(d)[0];
                        })
                        .y(function (d) {
                            return projection(d)[1];
                        })
                        .interpolate("basis");

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
                        .attr("stroke", color)
                        .attr("stroke-width", stroke_width)
                        .attr("fill", "none")
                        .attr("stroke-dasharray", "0,1")
                        .on("mouseover", function (d) {
                            console.log('origin', originAirport)
                            console.log('destination', destinationAirport)
                            var stops = []
                            stops.push(originAirport)
                            stops.push(destinationAirport)
                            showInfo(stops)
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
                            callback()
                        })

                }

                function getDistanceOfIatas(originIATA, destinationIATA) {
                    try {
                        long_diff = airports_by_iata[originIATA].LONG - airports_by_iata[destinationIATA].LONG
                        lat_diff = airports_by_iata[originIATA].LAT - airports_by_iata[destinationIATA].LAT
                        distance = Math.sqrt(Math.pow(long_diff, 2) + Math.pow(lat_diff, 2))
                        return distance
                    } catch (e) {
                        return -1
                    }
                }

                function drawLeg(originIATA, destinationIATA, color, icon) {
                    // console.log('will draw: ', originIATA, destinationIATA)
                    return new Promise(function (resolve, reject) {
                        try {
                            var origin = [parseFloat(airports_by_iata[originIATA].LONG), parseFloat(airports_by_iata[originIATA].LAT)]
                            var destination = [parseFloat(airports_by_iata[destinationIATA].LONG), parseFloat(airports_by_iata[destinationIATA].LAT)]
                            distance = getDistanceOfIatas(originIATA, destinationIATA)
                            drawRoute(origin, destination, resolve, distance, color, icon, airports_by_iata[originIATA], airports_by_iata[destinationIATA])
                        } catch (e) {
                            console.log("error with:", originIATA, destinationIATA)
                            resolve()
                        }
                    });
                }

                function performDrawLeg(last_destination, each_united_airport, color, icon) {
                    return function () {
                        return drawLeg(last_destination.slice(0), each_united_airport, color, icon)
                    }
                }
                // var colors = ["#4d9221", "#1f78b4", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#c51b7d", "#6a3d9a", "#b15928", 'black', 'black', 'black']
                var routes_i = 0
                var colors = d3.scale.linear()
                    .domain([0, 4])
                    .range(["#8ED83D", "#3D58D8"]);

                // console.log(colors[0])

                function drawLegs(iatas, icon, callback) {
                    var origin = undefined
                    var last_destination = undefined
                    var color = colors(routes_i)
                    routes_i++
                    _.each(iatas.slice(1, iatas.length), function (each_united_airport) {
                        if (origin == undefined) {
                            origin = drawLeg(iatas[0], each_united_airport, color, icon)
                            last_destination = each_united_airport
                        } else {
                            origin = origin.then(performDrawLeg(last_destination, each_united_airport, color, icon))
                            last_destination = each_united_airport
                        }
                    })
                    origin.then(function () {
                        callback()
                    })
                }

                // var n_limit = 1
                // routes = path.split('')
                //
                // console.log('last:', routes[routes.length - 1][0])
                // if (routes[routes.length - 1][0].length == 1) {
                //   n_limit = routes[1]
                // }

                function calculate_and_draw_route(route_list, n_limit) {
                    if (route_list.length >= 2) {
                        var origin = route_list[0].toUpperCase()
                        var destination = route_list[1].toUpperCase()
                        //origin = origin.replace('*','')
                        //destination = destination.replace('*','')
                        // console.log('Calculating routes!!!', route_list)

                        // n_limit = 1
                        // console.log('last:', routes[routes.length - 1][0])
                        // if (routes[routes.length - 1][0].length == 1) {
                        //   n_limit = routes[1]
                        // }

                        var dijkstra = d3.dijkstra()
                            .nodes(_.map(airports_by_iata, function (d) {
                                return d
                            }))
                            .pointa(getAirportByIATA(origin))
                            .pointb(getAirportByIATA(destination))
                            .limit(n_limit)
                            .graph(function (route) {
                                var iatas_route = []
                                route.forEach(function (airport) {
                                    iatas_route.push(airport.IATA)
                                })
                                // console.log('****** got route: ', iatas_route)

                                setInfo(iatas_route, 'blue')

                                drawLegs(iatas_route, undefined, function () {
                                    console.log("finished route!!!")
                                    route_list.shift()
                                    calculate_and_draw_route(route_list, n_limit)
                                })

                            })

                        dijkstra.on("tick", paint_dots_weights);

                        // airports_dots.on("click", dijkstra.start);
                        dijkstra.start()
                    } else {
                        // if (route.length == 1) {
                        //   var origin = route_list[0].toUpperCase()
                        //
                        //   var dijkstra = d3.dijkstra()
                        //     .nodes(_.map(airports_by_iata, function(d) {
                        //       return d
                        //     }))
                        //     .pointa(getAirportByIATA(origin))
                        //
                        //   dijkstra.on("tick", paint_dots_weights);
                        //
                        //   // airports_dots.on("click", dijkstra.start);
                        //   dijkstra.start()
                        // }
                    }

                }


                var path = window.location.pathname.replace('/', '')

                if (window.location.search.length > -1) {
                    path = window.location.search
                    path = path.replace('?', '')
                }

                if (path.length > 0) {

                    var n_limit = 1
                    routes = path.split(',')
                    if (routes.length > 1 && routes[routes.length - 1].length == 1) {
                        n_limit = routes[routes.length - 1]
                    }
                    console.log('n_limit', n_limit)

                    var routes = []
                    _.each(path.split(','), function (each_route) {
                        var airports = []
                        _.each(each_route.split('-'), function (each_airport) {
                            airports.push(each_airport)
                        })
                        routes.push(airports)
                    })
                    // console.log('routes')
                    // console.log(routes)

                    var color = d3.scale.linear()
                        .domain([0, 200, 240])
                        .range(['#12FF24', '#FBFF12', '#FF0909']);

                    function paint_dots_weights() {
                        airports_dots.style("fill", function (d) {
                            if (d.distance < Infinity) {
                                return color(d.distance);
                            } else {
                                return '#336190'
                            }
                        });
                    }

                    routes.forEach(function (route) {
                        if (route.length < 4) {

                            calculate_and_draw_route(route, n_limit)

                        } else {
                            drawLegs(route)
                        }
                    })


                    // _.each(_.range(20), function(){
                    //   drawLegs(_.sample(united_iatas, 10), 'plane')
                    // })
                } else {
                    function getRandomArbitrary(min, max) {
                        return parseInt(Math.random() * (max - min) + min);
                    }
                    var sample_route = []
                    var the_airports_with_routes = Object.keys(airports_with_routes)
                    var origin = 'SCL'
                    var destination = the_airports_with_routes[getRandomArbitrary(10, the_airports_with_routes.length)]
                    if (destination.indexOf(origin) > -1) {
                        destination = the_airports_with_routes[getRandomArbitrary(10, the_airports_with_routes.length)]
                    }
                    sample_route.push(origin)
                    sample_route.push(destination)

                    calculate_and_draw_route(sample_route, 1)
                    // _.each(_.range(20), function() {
                    //     drawLegs(_.sample(united_iatas, 10), 'line')
                    //   })
                }


            });
        });

    })
});

d3.select(self.frameElement).style("height", height + "px");