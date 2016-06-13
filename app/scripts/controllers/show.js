'use strict';

/**
 * @ngdoc function
 * @name chroniclesApp.controller:ShowctrlCtrl
 * @description
 * # ShowctrlCtrl
 * Controller of the chroniclesApp
 */
angular.module('chroniclesApp')
        .controller('ShowCtrl', ['$scope', '$routeParams', '$rootScope', 'story', 'EVENT_GRAPH_NODE_SELECTED',
            function ($scope, $routeParams, $rootScope, _story, EVENT_GRAPH_NODE_SELECTED) {
                $scope.story = _story;

                // Load the story if provided
                if ($routeParams.story !== undefined) {
                    $scope.story.loadFromServer($routeParams.story);
                }
            }]);
