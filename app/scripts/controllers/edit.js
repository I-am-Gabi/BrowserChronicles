'use strict';

/**
 * @ngdoc function
 * @name chroniclesApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the chroniclesApp
 */
angular.module('chroniclesApp')
        .controller('EditCtrl', ['$scope', '$rootScope', '$window', '$injector', 'story', 'EVENT_GRAPH_NODE_SELECTED', 'stepTypeHandlers',
            function ($scope, $rootScope, $window, $injector, story, EVENT_GRAPH_NODE_SELECTED, stepTypeHandlers) {
                $scope.stepTypes = stepTypeHandlers;
                $scope.story = story;
                $scope.stepEdit;
                $scope.step;
                $scope.newStory = {};
                $scope.selectedNode;

                // Register the currently selected node
                $scope.selectedNode;
                $rootScope.$on(EVENT_GRAPH_NODE_SELECTED, function (event, params) {
                    $scope.$apply(function () {
                        $scope.selectNode(params[0]);
                    });
                });

                $scope.selectNode = function (nodeId) {
                    $scope.selectedNode = nodeId;
                    if ($scope.selectedNode !== undefined) {
                        $scope.step = $scope.story.steps[$scope.selectedNode];
                        $scope.stepEdit = $injector.get($scope.step.type);
                        $scope.stepEdit.step = $scope.step;
                    } else {
                        $scope.step = undefined;
                        $scope.stepEdit = undefined;
                    }
                };

                $scope.downloadFile = function () {
                    var data = story.parseStepToXML(),
                            blob = new Blob([data], {type: 'text/plain'}),
                            url = $window.URL || $window.webkitURL;
                    $scope.fileUrl = url.createObjectURL(blob);
                };
            }])

        .config(['$compileProvider', function ($compileProvider) {
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|https?|ftp|mailto|chrome-extension):/);
            }]);
