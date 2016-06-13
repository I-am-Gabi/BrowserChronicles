'use strict';

describe('Service: riddle', function () {

    // load the service's module
    beforeEach(module('chroniclesApp'));

    // instantiate service
    var riddle;
    beforeEach(inject(function (_riddle_) {
        riddle = _riddle_;
    }));

    it('levenshtein distance should get distance 0 to equals words', function () {
        expect(riddle.distance('test', 'test')).toBe(0);
        expect(riddle.distance('response', 'response')).toBe(0);
        expect(riddle.distance('Test', 'test')).toBe(0);
    });

    it('levenshtein distance should get distance > 0 to different words', function () {
        expect(riddle.distance('tests', 'test')).toBe(1);
        expect(riddle.distance('test', 'tests')).toBe(1);
        expect(riddle.distance('tesy', 'test')).toBe(1);

        expect(riddle.distance('test', 'gests')).toBe(2);
        expect(riddle.distance('tesyj', 'test')).toBe(2);

        expect(riddle.distance('abcdef', 'ghijkl')).toBe(6);
    });

    it('service riddle', function () {
        var step = {};
        step.next = {test1: "1", test2: "2"};
        riddle.handleStep(step);
        expect(riddle.opts).toBe(step.next);

        riddle.answer = "test1";
        riddle.checkAnswer();
        expect(riddle.answer).toBe('');
        expect(riddle.error).toBe(false);
        expect(riddle.next()).toBe("1");

        riddle.answer = "error";
        riddle.checkAnswer();
        expect(riddle.answer).toBe('');
        expect(riddle.error).toBe('Invalid answer!');
    });
});
