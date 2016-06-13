'use strict';

describe('Service: memory', function () {

  // load the service's module
  beforeEach(module('chroniclesApp'));

  // instantiate service
  var memory;
  beforeEach(inject(function (_memory_) {
    memory = _memory_;
  }));

  it('should do something', function () {
    expect(!!memory).toBe(true);
  });

});
