'use strict';

describe('Service: multiChoice', function () {

  // load the service's module
  beforeEach(module('chroniclesApp'));

  // instantiate service
  var multiChoice;
  beforeEach(inject(function (_multiChoice_) {
    multiChoice = _multiChoice_;
  }));

  it('service multiChoice', function () {
      var step = {};
      step.next = { test1: "1", test2: "2" };
      multiChoice.handleStep(step);
      expect(multiChoice.opts).toBe(step.next);
      expect(multiChoice.next).toBe(undefined);

      step.next = { test1: "1" };
      multiChoice.handleStep(step);
      expect(multiChoice.opts).toBe(undefined);
      expect(multiChoice.next).toBe('1');
  });
});
