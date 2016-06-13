'use strict';

describe('Controller: EditCtrl', function () {

    // load the controller's module
    beforeEach(module('chroniclesApp'));

    var EditCtrl,
            scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        EditCtrl = $controller('EditCtrl', {
            $scope: scope
                    // place here mocked dependencies
        });
    }));
});
