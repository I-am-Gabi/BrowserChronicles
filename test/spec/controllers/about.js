'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('chroniclesApp'));

  var AboutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AboutCtrl = $controller('AboutCtrl', {
      $scope: scope
    });
  }));

  it('scope about should be true', function () {
    expect(scope.about).toBe(true);
  });
});
