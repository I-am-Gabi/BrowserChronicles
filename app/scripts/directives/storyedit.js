'use strict';

/**
 * @ngdoc directive
 * @name chroniclesApp.directive:storyEdit
 * @description
 * # storyEdit
 */
angular.module('chroniclesApp')
        .directive('storyEdit', function () {
            return {
                templateUrl: 'views/storyedit.html',
                restrict: 'E',
                controller: 'EditCtrl',
                link: function postLink(scope, element, attrs) {
                    if (attrs.readonly !== undefined) {
                        if (attrs.readonly === 'false')
                            scope.readonly = false;
                        else
                            scope.readonly = true;
                    } else
                        scope.readonly = false;
                }
            };
        });
