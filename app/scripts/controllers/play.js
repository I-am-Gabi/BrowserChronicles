'use strict';
/**
 * @ngdoc function
 * @name chroniclesApp.controller:PlayctrlCtrl
 * @description
 * @source Algorithm to calculate the distance based: https://gist.github.com/andrei-m/982927
 * # PlayctrlCtrl
 * Controller of the chroniclesApp
 */

angular.module('chroniclesApp')
        .controller('PlayCtrl', function ($scope, $rootScope, $routeParams, $cookies, story, EVENT_STORY_LOADED, game, $injector, $compile) {
            $scope.story = story;
            $scope.step;
            $scope.currentStep;
            $scope.totalSteps;
            $scope.opts;
            $scope.currentStepHandler;
            $scope.selectedChoice = {
                next: undefined
            };

            // Load the story if provided
            if ($routeParams.story !== undefined) {
                $scope.story.loadFromServer($routeParams.story);
            }

            /**
             * Restart the story from the beggining
             * @returns {undefined}
             */
            $scope.reset = function () {
                $scope.nextStep('BEGIN');
                $scope.totalSteps = 0;
                $cookies.put("nbStep", $scope.totalSteps);
            };

            /**
             * Wrapper used to automatically get the next step id, be it a
             * function or a variable.
             * @returns {currentStepHandler.next}
             */
            $scope.next = function () {
                if ($scope.currentStepHandler === undefined)
                    return undefined;
                return typeof $scope.currentStepHandler.next === 'function' ? $scope.currentStepHandler.next() : $scope.currentStepHandler.next;
            };

            $scope.nextStep = function (newStepId) {
                if (newStepId === undefined || newStepId === $scope.currentStep)
                    return;
                if ($scope.story.steps[newStepId] === undefined) {
                    console.error("Unknown id: '" + $scope.currentStep + "'.");
                    return false;
                }

                $scope.currentStep = newStepId;
                $scope.step = $scope.story.steps[newStepId];

                // Store the new step in cookies
                $cookies.put("step", $scope.currentStep);
                $cookies.put("nbStep", ++$scope.totalSteps);

                $scope.opts = {};
                $scope.step.type = $scope.story.steps[$scope.currentStep].type;
                $scope.title = $scope.story.steps[$scope.currentStep].title;
                $scope.description = $scope.story.steps[$scope.currentStep].description;
                $scope.hint = $scope.story.steps[$scope.currentStep].hint;
                $scope.currentStepHandler = $injector.get($scope.step.type);
                $scope.currentStepHandler.handleStep($scope.step);
                $scope.currentStepHandler.error = undefined;
            };

            // Restores the previous position, if we play the same story
            $scope.init = function () {
                var step = 'BEGIN';
                if ($cookies.get('story') !== undefined && $cookies.get('story') === $scope.story.name && $cookies.get('step') !== undefined) {
                    step = $cookies.get('step');
                    $scope.totalSteps = $cookies.get('nbStep') - 1;
                } else {
                    $scope.reset();
                    return;
                }
                $cookies.put('story', $scope.story.name);
                $scope.nextStep(step);
            };
            $rootScope.$on(EVENT_STORY_LOADED, $scope.init);

            if ($scope.story.isLoaded)
                $scope.init();
        });
