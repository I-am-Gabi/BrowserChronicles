'use strict';

/**
 * @ngdoc directive
 * @name chroniclesApp.directive:storyloader
 * @description This directive is used to display the whole loading form, which
 *  is the view 'storyloading.html', along with it's controller.
 * # storyloader
 */
angular.module('chroniclesApp')
        .directive("storyloader", function () {
            return{
                restrict: 'E',
                templateUrl: '/views/storyloading.html',
                controller: 'StoryloaderCtrl'
            };
        });