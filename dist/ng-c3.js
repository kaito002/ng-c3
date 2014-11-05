"use strict";

angular.module("ngC3", [])
    .directive("ngC3", function () {

        function isEmptyJSON(json) {
            for (var attr in json) {
                return false;
            }
            return true;
        }

        function pluck(arrayObject, attr) {
            return arrayObject.map(function (el) {
               return el[attr];
            });
        }

        function merge (firstObject, secondObject) {
            for (var attr in secondObject) {
                if (!firstObject.hasOwnProperty(attr)) {
                    firstObject[attr] = secondObject[attr];
                }
            }
        }

        function getData(series) {
            var xs = [];
            var types = {};
            var columns = [];
            var x = [];
            var y = [];
            var yAxis = {};

            if (!series.length){
                return {
                    columns: []
                }
            }

            series.forEach(function (serie) {
                if (serie.yAxis) {
                    yAxis[serie.name] = serie.yAxis;
                }

                if (serie.type) {
                    types[serie.name] = serie.type;
                }

                xs[serie.name] = "x" + serie.name;

                if (serie.data[0] instanceof Array) {
                    x = serie.data.map(function (el) {
                        return el[0];
                    });
                    y = serie.data.map(function (el) {
                        return el[1];
                    });
                } else {
                    x = pluck(serie.data, "x");
                    y = pluck(serie.data, "y");
                }

                x.unshift("x" + serie.name);
                y.unshift(serie.name);
                columns.push.apply(columns, [y]);
//                columns.push.apply(columns, [x, y]);
            });
            var _x = [];
            if (series[0].data[0] instanceof Array) {
                _x = series[0].data.map(function (el) {
                    return el[0];
                });
            } else {
                _x = pluck(series[0].data, "x");
            }
            _x.unshift("x");
            columns.push.apply(columns, [_x]);

            var data = {
                x: 'x',
                columns: columns
//                xs: xs
            };

            if (!isEmptyJSON(types)) {
                data["types"] = types;
            }

            if (!isEmptyJSON(yAxis)) {
                data["axes"] = yAxis;
            }

            return data;
        }

        function getPiesData(series) {
            var columns = [];

            series.forEach(function (serie) {
                var data = serie.data.map(function (el) {
                    return el;
                });
                data.unshift(serie.name);
                columns.push(data);
            });
            return columns;
        }

        return {
            restrict: "AE",
            template: "<div class='chart-container'><div></div><div class='ng-c3-error'><p></p></div></div>",
            scope: {
                series: "=",
                options: "=",
                chartId: "@"
            },
            link: function (scope, element) {

                var chartElement = element[0].childNodes[0].childNodes[0],
                    errorPanel = element[0].childNodes[0].childNodes[1],
                    errorText = errorPanel.childNodes[0];

                chartElement.id = scope.chartId;

                scope.$watch("[series, options]", function (changes) {
                    changes[1] = changes[1] || {};
                    var transform = changes[1].transform || null;
                    var body = {};
                    var typeChart = changes[1].type || "other";
                    var error = changes[1].error || {status: false};

                    if (error.status) {
                        errorPanel.style.opacity = 0.3;
                        errorText.innerHTML = error.message || "Something its Wrong!";
                    } else {
                        errorPanel.style.opacity = 0;
                        switch (typeChart) {
                            case "donut":
                            case "pie":
                            case "gauge":
                                body["data"] = {
                                    type: typeChart,
                                    columns: getPiesData(changes[0])
                                };
                                merge(body, changes[1]);
                                break;
                            default:
                                body["data"] = getData(changes[0]);

                                if (changes[1]) {
                                    merge(body, changes[1]);
                                    body.data["groups"] = changes[1].groups ? changes[1].groups : [];
                                    body.data["onclick"] = changes[1].onclick ? changes[1].onclick : function () {};
                                    body.data["type"] = typeChart !== "other" ? typeChart : "line";
                                    body.data["regions"] = changes[1].regions ? changes[1].regions : [];
                                }
                                break;
                        }
                        body["bindto"] = scope.chartId ? "#" + scope.chartId : "#chart";
                        var chart = c3.generate(body);
                        if (transform) { chart.transform(transform); }
                    }

                }, true);
            }
        }
    });