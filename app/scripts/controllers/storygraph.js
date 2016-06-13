'use strict';
/**
 * @ngdoc function
 * @name chroniclesApp.controller:StorygraphCtrl
 * @description
 * # StorygraphCtrl
 * Controller of the chroniclesApp
 */
angular.module('chroniclesApp')
        .constant('EVENT_GRAPH_NODE_SELECTED', 'node_selected')
        .controller('StorygraphCtrl', ['$scope', '$routeParams', '$rootScope', '$http', 'story', 'EVENT_STORY_LOADED', 'EVENT_GRAPH_NODE_SELECTED', 'EVENT_STORY_UPDATED_SHORTEST_PATH',
            function ($scope, $routeParams, $rootScope, $http, _story, EVENT_STORY_LOADED, EVENT_GRAPH_NODE_SELECTED, EVENT_STORY_UPDATED_SHORTEST_PATH) {
                // #### Definitions
                $scope.story = _story;
                $scope.graphDrawn = false;
                // The DOM element that will be used to draw
                $scope.targetElem;
                $scope.automaton;
                $scope.errors = [];
                $scope.data = {};
                $scope.graphOptions = {
                    defaultEgesColor: '#2B7CE9'
                };
                $scope.options = {
                    showEdgesLabel: false,
                    showIds: false
                };
                $scope.$watch('options.showEdgesLabel', function () {
                    if (!$scope.graphDrawn)
                        return;
                    $scope.automaton.setOptions({
                        edges: {
                            font: {
                                size: $scope.options.showEdgesLabel === true ? 14 : 0
                            }
                        }
                    });
                });
                $scope.$watch('options.showIds', function () {
                    if (!$scope.graphDrawn)
                        return;
                    for (var id in $scope.story.steps) {
                        $scope.updateNode(id);
                    }
                });
                /**
                 * Recenter the graph
                 */
                function fitAnimated() {
                    var options = {
                        offset: {x: 0, y: 0},
                        animation: {
                            duration: 1000,
                            easingFunction: "easeInOutQuad"
                        }
                    };
                    $scope.automaton.fit(options);
                }

                function zoomInStartNode() {
                    var options = {
                        offset: {x: 0, y: 0},
                        animation: {
                            duration: 1000,
                            easingFunction: "easeInOutQuad"
                        }
                    };
                    $scope.automaton.focus('start', options);
                }

                /**
                 * Draw the FSM of dataSet at targetElem
                 * @param targetElem the html <div> target element where we will draw the graph
                 * @param dataSet an Object containing the nodes and edges of the graph
                 */
                function drawFSM(targetElem, dataSet) {
                    var options = {
                        height: $scope.targetElem.clientHeight + 'px',
                        edges: {
                            smooth: {
                                enabled: true,
                                type: "dynamic",
                                forceDirection: 'none',
                                roundness: 0.5
                            },
                            font: {
                                align: 'middle',
                                size: $scope.options.showEdgesLabel === true ? 14 : 0
                            },
                            width: 3
                        },
                        physics: {
                            solver: 'forceAtlas2Based',
                            forceAtlas2Based: {
                                gravitationalConstant: -100,
                                centralGravity: 0.005,
                                springLength: 230,
                                springConstant: 0.18,
                            },
                            minVelocity: 0.75,
                            maxVelocity: 200,
                        }
                    };
                    $scope.automaton = new vis.Network(targetElem, dataSet, options);
                }

                $scope.colorPathTimeout = undefined;
                $scope.colorPathWithDelay = function (pathArray) {
                    if ($scope.colorPathTimeout !== undefined) {
                        clearTimeout($scope.colorPathTimeout);
                    }
                    $scope.colorPathTimeout = setTimeout(function () {
                        $scope.colorPath(pathArray);
                        $scope.colorPathTimeout = undefined;
                    }, 100);
                };
                $scope.colorPath = function (pathArray) {
                    // Remove old colors
                    $scope.data.edges.forEach(function (item) {
                        item.color = {
                            color: $scope.graphOptions.defaultEgesColor
                        };
                        $scope.data.edges.update(item);
                    }/*, { // Bug here
                     filter: function (item) {
                     return item.color !== undefined && item.color.color === 'lime';
                     }
                     }*/);
                    for (var i = 0; i < pathArray.length - 1; i++) {
                        for (var e in $scope.data.edges._data) {
                            if ($scope.data.edges._data[e]['to'] === pathArray[i] && $scope.data.edges._data[e]['from'] === pathArray[i + 1]) {
                                $scope.data.edges._data[e].color = {color: 'lime'};
                                $scope.data.edges.update($scope.data.edges._data[e]);
                            }
                        }
                    }
                }

                /**
                 * Draw the visual representation of the passed dot Language representing a FSM
                 * @param dotString the string containing the dot Language of the FSM
                 */
                function drawDotStringFSM(dotString) {
                    var parsedData = vis.network.convertDot(dotString);
                    var data = {
                        nodes: parsedData.nodes,
                        edges: parsedData.edges
                    };
                    //var targetElem = angular.element(document.getElementById('network'))[0];
                    drawFSM($scope.targetElem, data);
                }

                $rootScope.$on(EVENT_STORY_UPDATED_SHORTEST_PATH, function (event, shortest) {
                    $scope.colorPathWithDelay(shortest);
                });
                function loadGraph() {
                    if ($scope.story.isLoaded) {
                        $scope.data = {
                            nodes: new vis.DataSet([]),
                            edges: new vis.DataSet([])
                        };
                        drawFSM($scope.targetElem, $scope.data);
                        $scope.initEvents();
                        fitAnimated();
                        //TODO Zoom to start node maybe
                    }
                }

                $scope.init = function () {
                    if ($scope.targetElem !== undefined && $scope.story.isLoaded && !$scope.graphDrawn) {
                        loadGraph();
                        $scope.graphDrawn = true;
                    }
                };
                //##### Functionnal

                // Executed when a story is loaded : parse NodeList & EdgeList and GraphIt
                $rootScope.$on(EVENT_STORY_LOADED, function () {
                    $scope.init();
                });
                // We need to wait for the element to be linked before we can draw
                $scope.$watch('targetElem', function () {
                    if ($scope.targetElem !== undefined)
                        $scope.init();
                });
                $scope.updateNode = function (stepId) {
                    var title;
                    if ($scope.options.showIds || $scope.story.steps[stepId].title === undefined) {
                        title = stepId;
                    } else {
                        title = $scope.story.steps[stepId].title;
                    }
                    if ($scope.story.steps[stepId]['type'] === 'end') {
                        if ($scope.story.steps[stepId]['won']) {
                            $scope.data.nodes.update({id: stepId, label: title, color: {background: 'lime'}, type: 'goodEnd'});
                        } else {
                            $scope.data.nodes.update({id: stepId, label: title, color: {background: 'red'}, type: 'badEnd'});
                        }
                        $scope.colorPathWithDelay($scope.story.shortestPath);
                    } else if (stepId === 'BEGIN') {
                        $scope.data.nodes.update({id: stepId, label: title, color: {background: '#78BD51'}});
                    } else {
                        $scope.data.nodes.update({id: stepId, label: title});
                    }
                };
                $scope.updateEdges = function (nodeId) {
                    // Save transitions IDs
                    var transitions = [];
                    for (var text in $scope.story.steps[nodeId].next) {
                        transitions.push(text);
                    }
                    // Get the registered edges from nodeId
                    $scope.data.edges.forEach(function (edge) {
                        // Remove old ones
                        if ($scope.story.steps[nodeId].next[edge.label] === undefined) {
                            $scope.data.edges.remove(edge);
                        } else {
                            edge.to = $scope.story.steps[nodeId].next[edge.label];
                            $scope.data.edges.update(edge);
                            transitions.splice(transitions.indexOf(edge.label), 1);
                        }
                    }, {
                        filter: function (item) {
                            return item.from === nodeId;
                        }
                    });
                    for (var i = 0; i < transitions.length; i++) {
                        $scope.data.edges.add({arrows: 'to', from: nodeId, to: $scope.story.steps[nodeId].next[transitions[i]], label: transitions[i]});
                    }
                    $scope.colorPathWithDelay($scope.story.shortestPath);
                };
                $scope.addNode = function (stepId) {
                    $scope.data.nodes.add({id: stepId});
                    $scope.updateNode(stepId);
                };
                // Watch changes in the story to update the graph nodes
                $scope.registeredWatches = {
                    title: {},
                    edges: {},
                    ends: {}
                };
                $scope.initEvents = function () {
                    var funcNodeAction = function (params) {
                        $rootScope.$emit(EVENT_GRAPH_NODE_SELECTED, params.nodes);
                    };
                    $scope.automaton.on("selectNode", funcNodeAction);
                    $scope.automaton.on("deselectNode", funcNodeAction);
                    $scope.automaton.on("dragStart", function (params) {
                        if (params.nodes.length !== 0)
                            funcNodeAction(params);
                    });
                    $scope.$watchCollection('story.steps', function (newValue) {
                        // Unwatch elements that disapeared and remove the nodes
                        for (var key in $scope.registeredWatches.title) {
                            if (newValue[key] === undefined) {
                                $scope.data.nodes.remove(key);
                                $scope.registeredWatches.title[key]();
                                delete $scope.registeredWatches.title[key];
                                $scope.registeredWatches.edges[key]();
                                delete $scope.registeredWatches.edges[key];
                                if ($scope.registeredWatches.ends[key] !== undefined) {
                                    $scope.registeredWatches.ends[key]();
                                    delete $scope.registeredWatches.ends[key];
                                }
                            }
                        }
                        // Watch new elements
                        for (var key in newValue) {
                            if ($scope.registeredWatches.title[key] === undefined) {
                                $scope.addNode(key);
                                (function (key) {
                                    $scope.registeredWatches.title[key] = $scope.$watch('story.steps.' + key + '.title', function (newValue) {
                                        if (newValue !== undefined) {
                                            $scope.updateNode(key);
                                        }
                                    });
                                    $scope.registeredWatches.edges[key] = $scope.$watch('story.steps.' + key + '.next', function (newValue) {
                                        if (newValue !== undefined) {
                                            $scope.updateEdges(key);
                                        }
                                    }, true);
                                    if (newValue[key].type === 'end') {
                                        $scope.registeredWatches.ends[key] = $scope.$watch('story.steps.' + key + '.won', function (newValue) {
                                            if (newValue !== undefined)
                                                $scope.updateNode(key);
                                        });
                                    }
                                })(key);
                            }
                        }
                    });
                };
            }])
        .directive('storyGraph', function () {
            return {
                restrict: 'E',
                templateUrl: '/views/storygraph.html',
                controller: 'StorygraphCtrl',
                link: function (scope, element) {
                    scope.targetElem = element[0].querySelector('#storygraph-graph');
                }
            };
        });
