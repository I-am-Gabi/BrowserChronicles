'use strict';
/**
 * @ngdoc function
 * @name chroniclesApp.controller:StoryloaderCtrl
 * @description
 * # StoryloaderCtrl
 * Controller of the chroniclesApp
 */
angular.module('chroniclesApp')
        .controller('StoryloaderCtrl', ['$scope', '$http', '$route', 'story', function ($scope, $http, $route, _story) {
                $scope.story = _story;
                $scope.$route = $route;
                $scope.fileUpload = {};
                /**
                 * Handle the submit of file.
                 */
                $scope.loadFile = function () {
                    if ($scope.fileUpload.loaded)
                        $scope.story.parseXML($scope.fileUpload.content);
                };
                $scope.storyList = [];
                /**
                 * Fetch the story list from the server.
                 */
                $scope.getStoryList = function () {
                    $http.get('/stories/storyList.txt').then(function (response) {
                        $scope.storyList = response.data.trim().split('\n');
                        for(var i = 0; i<$scope.storyList.length;i++){
                            $scope.storyList[i]=$scope.storyList[i].replace(".xml","");
                        }
                    }, function (response) {
                        console.warn('Unable to retrieve story list: ' + response.statusText + '.');
                    });
                };
            }]);
