'use strict';

/**
 * @ngdoc overview
 * @name chroniclesApp
 * @description
 * # chroniclesApp
 *
 * Main module of the application.
 */
angular.module('chroniclesApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
]).config(function ($routeProvider) {
    $routeProvider.when('/play', {
        templateUrl: 'views/play.html',
        controller: 'PlayCtrl',
        controllerAs: 'play'
    }).when('/play/:story', {
        templateUrl: 'views/play.html',
        controller: 'PlayCtrl',
        controllerAs: 'play'
    }).when('/show', {
        templateUrl: 'views/show.html',
        controller: 'ShowCtrl',
        controllerAs: 'show'
    }).when('/show/:story', {
        templateUrl: 'views/show.html',
        controller: 'ShowCtrl',
        controllerAs: 'show'
    }).when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
    }).when('/edit', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl',
        controllerAs: 'edit'
    }).otherwise({
        redirectTo: '/about'
    });
});
