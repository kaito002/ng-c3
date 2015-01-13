# ng-c3

This is an angular directive to <a href="http://c3js.org" target="_blank">C3.js</a>

####For the new version, verify the folder of the directive; now is 'dist'

## References
c3js library [http://c3js.org]
AngularJS [https://angularjs.org]

## Usage
you can see the samples folder for more help

First you must create a tag called ng-c3 with these attributes

```html
<ng-c3 chart-id="chartId" series="chart.series" options="chart.options"></ng-c3>

```
Then go to the controller and create the JSON that the chart will use

```javascript
    angular.module("myModule")
        .controller("MyCtrl", ["$scope", 
            function ($scope) {
                $scope.chart = {
                    options: {
                        type: "line",
                        onclick : function (point) {
                            console.log("point: ", point);
                        },
                    },
                    series: [
                        {
                            name: "Data 1",
                            data: [[1, 2], [3, 4], [5, 6]]
                        }, 
                        {
                            name: "Data 2",
                            data: [{x: 1, y: 20}, {x: 3, y: 40}, {x: 5, y: 60}]
                        }
                    ]
                }
            }]);
```

how you can see, there is two way to set the data, with an Array of Arrays or Array of JSONs

### Enjoy the Directive

##MIT License

Copyright (c) 2014 Carlos Montes (github / carlosmontes002)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
