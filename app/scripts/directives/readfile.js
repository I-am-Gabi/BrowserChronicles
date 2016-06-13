'use strict';

/**
 * @ngdoc directive
 * @name chroniclesApp.directive:readfile
 * @description
 * # readfile
 */
angular.module('chroniclesApp')
        /**
         * This directive should be added on an input tag of type="file" and is
         * used to link it with a controller.
         * @returns {storyloader_L24.storyloaderAnonym$2}
         */
        .directive("readfile", [function () {
                return {
                    restrict: "A",
                    scope: {
                        readfile: "="
                    },
                    link: function (scope, element, attributes) {
                        /**
                         * Bind the function to change event (load the file into
                         * scope.readfile and set content, name and loaded).
                         */
                        element.bind("change", function (changeEvent) {
                            var reader = new FileReader();
                            reader.onload = function (loadEvent) {
                                scope.$apply(function () {
                                    scope.readfile.content = loadEvent.target.result;
                                    scope.readfile.name = changeEvent.target.files[0].name;
                                    scope.readfile.loaded = true;
                                });
                            };
                            reader.readAsText(changeEvent.target.files[0]);
                        });
                    }
                };
            }]);
