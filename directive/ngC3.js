"use strict";

angular.module("ngC3", [])
    .directive("ngC3", function () {

        function isEmptyJSON(obj) {
            for(var i in obj) { return false; }
            return true;
        }

        function seriesTransform (series) {
            var xs      = [];
            var types   = {};
            var columns = [];
            var _x      = [];
            var _y      = [];
            var yAxis   = {};

            series.forEach(function (serie) {
                if (serie.yAxis) {
                    yAxis[serie.name] = serie.yAxis;
                }

                if (serie.type) {
                    types[serie.name] = serie.type;
                }

                xs[serie.name] = "x" + serie.name;

                _x = _.pluck(serie.data, "x");
                _y = _.pluck(serie.data, "y");

                _x.unshift("x" + serie.name);
                _y.unshift(serie.name);

                columns.push.apply(columns, [_x, _y]);
            });

            var data = {
                columns: columns,
                xs: xs
            }

            if (!isEmptyJSON(types)) {
                data["types"] = types;
            }

            if (!isEmptyJSON(yAxis)) {
                data["axes"] = yAxis;
            }

            return data;
        }

        return {
            restrict: "AE",
            template: "<div></div>",
            scope: {
                series: "=",
                options: "=",
                chartId: "@"
            },
            link: function (scope, element) {

                var chartElement = element[0].childNodes[0];
                chartElement.id = scope.chartId;

                scope.$watch("[series, options]", function (newChanges){
                    newChanges[1] = newChanges[1] ? newChanges[1] : {};
                    var body  = {};
                    var typeChart = newChanges[1].type ? newChanges[1].type : "other";

                    switch(typeChart) {
                        case "donut":
                        case "pie":
                        case "gauge":

                        break;
                        default:
                            body["data"] = seriesTransform(newChanges[0]);

                            if (newChanges[1]) {
                                _.merge(body, newChanges[1]);
                                body.data["groups"] = newChanges[1].groups ? newChanges[1].groups : [];
                            }

                            body["bindto"] = scope.chartId ? "#" + scope.chartId : "#chart";
                        break;
                    }

                    var chart = c3.generate(body);
                }, true);
            }
        }
    });