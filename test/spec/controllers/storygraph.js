'use strict';

describe('Controller: StorygraphCtrl', function () {

    // load the controller's module
    beforeEach(module('chroniclesApp'));

    var StorygraphCtrl,
            scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        StorygraphCtrl = $controller('StorygraphCtrl', {
            $scope: scope
                    // place here mocked dependencies
        });
    }));

});
