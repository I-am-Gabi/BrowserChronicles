'use strict';

describe('Controller: StoryloaderCtrl', function () {

    // load the controller's module
    beforeEach(module('chroniclesApp'));

    var StoryloaderCtrl,
            scope;
    var $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        StoryloaderCtrl = $controller('StoryloaderCtrl', {
            $scope: scope
                    // place here mocked dependencies
        });
    }));
});
