'use strict';

describe('Controller: ShowctrlCtrl', function () {

    // load the controller's module
    beforeEach(module('chroniclesApp'));

    var ShowctrlCtrl,
            scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ShowctrlCtrl = $controller('ShowCtrl', {
            $scope: scope
                    // place here mocked dependencies
        });
    }));

});
