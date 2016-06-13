'use strict';

describe('Service: end', function () {

  // load the service's module
  beforeEach(module('chroniclesApp'));

  // instantiate service
  var end;
  beforeEach(inject(function (_end_) {
    end = _end_;
  }));

  it('should do something', function () {
    expect(!!end).toBe(true);
  });

});
