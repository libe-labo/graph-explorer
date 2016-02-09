$(function() {
    var idleColor = '#c6c6c6',
        currentStep = -1,
        ids = [];

    var ratio = window.innerWidth > 992 ? 0.2 : 0.3;

    var moveTo = (function() {
        var timer, time = 50, totalTime = 300, currentTime;
        return function(sigInstance, camera, x, y, ratio) {
            window.clearTimeout(timer);

            // Reset currentTime
            currentTime = 0;

            var xScale = d3_scale.scaleLinear().range([camera.x, x]).domain([0, totalTime]),
                yScale = d3_scale.scaleLinear().range([camera.y, y]).domain([0, totalTime]),
                ratioScale = d3_scale.scaleLinear().range([camera.ratio, ratio]).domain([0, totalTime]);

            var update = function() {
                window.clearTimeout(timer);

                camera.x = xScale(currentTime);
                camera.y = yScale(currentTime);
                camera.ratio = ratioScale(currentTime);

                if (currentTime < totalTime) {
                    currentTime += time;
                    window.setTimeout(update, time);
                }

                sigInstance.refresh();
            };

            update();
        };
    })();

    $.get('steps.tsv', function(raw) {
        var steps = d3_dsv.tsv.parse(raw, function(d) {
            return {
                text: d.texte,
                date : d.date,
                ids: d.personnes.replace(/ +/g, '').split(',')
            };
        });

        sigma.parsers.json('graphe.json', {
            container: 'sigma-container',
            type: 'canvas',
            settings: {
                verbose: true,
                maxNodeSize: 8
            }
        }, function(sigInstance) {
            var init = false;
            var changeStep = function(newStep) {
                if (newStep < currentStep) {
                    ids = [];
                    for (var i = 0; i <= newStep; ++i) {
                        ids = ids.concat(steps[i].ids);
                    }
                } else {
                    ids = ids.concat(steps[newStep].ids);
                }

                currentStep = newStep;

                var points = [];
                sigInstance.graph.nodes().forEach(function(node) {
                    node.hidden = ids.indexOf(node.id) < 0;
                    node.color = steps[newStep].ids.indexOf(node.id) >= 0 ? node.originalColor : idleColor;

                    if (node.color === node.originalColor) {
                        points.push({
                            x: node[sigInstance.cameras[0].readPrefix + 'x'],
                            y: node[sigInstance.cameras[0].readPrefix + 'y']
                        });
                    }
                });

                // Compute new x and y camera position
                var x, y;
                if (points.length > 0) {
                    if (points.length === 1) { // We only have one point
                        x = points[0].x;
                        y = points[0].y;
                    } else if (points.length === 2) { // We have a line
                        x = (points[0].x + points[1].x) / 2;
                        y = (points[0].y + points[1].y) / 2;
                    } else { // We have a polygon
                        // Compute a midPoint between any two points of the polygon
                        var midPoint = {
                            x: (points[0].x + points[1].x) / 2,
                            y: (points[0].y + points[1].y) / 2
                        };
                        points.forEach(function(point) {
                            // Compute angle to midpoint for each point
                            point.angle = Math.atan2(point.y - midPoint.y, point.x - midPoint.x);
                        });
                        points.sort(function(a, b) { return b.angle - a.angle; }); // And sort by angle
                        // We now have a non self-intersecting polygon
                        var i, sum;
                        // Compute polygon's area
                        for (i = 0, sum = 0; i < points.length; ++i) {
                            var ip1 = i === points.length - 1 ? 0 : i + 1;
                            sum += (points[i].x * points[ip1].y) - (points[ip1].x * points[i].y);
                        }
                        var a = (1/2) * sum;
                        // Compute centroid's x
                        for (i = 0, sum = 0; i < points.length; ++i) {
                            var ip1 = i === points.length - 1 ? 0 : i + 1;
                            sum += (points[i].x + points[ip1].x) * ((points[i].x * points[ip1].y) - (points[ip1].x * points[i].y));
                        }
                        x = (1 / (6 * a)) * sum;
                        // Compute centroid's y
                        for (i = 0, sum = 0; i < points.length; ++i) {
                            var ip1 = i === points.length - 1 ? 0 : i + 1;
                            sum += (points[i].y + points[ip1].y) * ((points[i].x * points[ip1].y) - (points[ip1].x * points[i].y));
                        }
                        y = (1 / (6 * a)) * sum;
                    }
                }

                if (init) {
                    moveTo(
                        sigInstance,
                        sigInstance.cameras[0],
                        x, y,
                        currentStep === steps.length - 1
                            ? ratio * 2.5
                            : [].indexOf(currentStep) >= 0
                                ? ratio * 1.5
                                : ratio
                    );
                } else {
                    init = true;
                    sigInstance.cameras[0].goTo({ x : x , y : y , ratio : ratio });
                    sigInstance.refresh();
                }

                $('.steps p').first().html(
                    '<span>' + steps[currentStep].date + '</span> ' + steps[currentStep].text
                );

                $('.steps button').first().attr('disabled', currentStep === 0 ? 'disabled' : null);
                $('.steps button').last().attr('disabled', currentStep === steps.length - 1 ? 'disabled' : null);
            };

            sigInstance.graph.nodes().forEach(function(node) {
                node.size = 0.1;
                node.originalColor = node.color;
            });
            sigInstance.graph.edges().forEach(function(edge) { edge.originalColor = edge.color = idleColor; });

            var search = parseInt(window.location.search.replace(/^\?/, '')),
                step = isNaN(search) ? 0 : search < steps.length ? search : 0;

            changeStep(step);
            $('.steps').find('button').each(function(i) {
                $(this).bind('click', (function(i) {
                    return function() {
                        var newStep = currentStep + (i > 0 ? 1 : -1);
                        if (newStep >= 0 && newStep < steps.length) {
                            changeStep(newStep);
                        }
                    };
                })(i));
            });

            setTimeout(function() {
                sigInstance.cameras[0].ratio = ratio;
                sigInstance.refresh();
            }, 100);
        });
    });
});
