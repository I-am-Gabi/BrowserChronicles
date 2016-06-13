'use strict';
describe('Graph object', function () {
    var g;

    beforeEach(function () {
        g = new Graph();
        g.addNode(0);
        g.addNode(1);
        g.addNode(2);
        g.addNode(3);
        g.addNode(4);
        g.addNode(5);
        g.addNode(6);
        g.addNode(7);
        g.addNode(8);
        g.addNode(9);

        g.addEdge(0, 1, 1);
        g.addEdge(1, 2, 1);
        g.addEdge(1, 3, 1);
        g.addEdge(2, 8, 1);
        g.addEdge(3, 4, 1);
        g.addEdge(3, 5, 1);
        g.addEdge(4, 6, 1);
        g.addEdge(4, 7, 1);
        g.addEdge(5, 4, 1);
        g.addEdge(8, 9, 1);
    });

    it('should have nodes object with properties', function () {
        var actual = Object.keys(g.nodes).sort();
        var expected = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].sort();

        expect(actual).toEqual(expected);
    });

    it('should have correct edges for each of its node', function () {
        expect(g.nodes['0']['1']).toBeDefined();
        expect(g.nodes['1']['2']).toBeDefined();
        expect(g.nodes['1']['3']).toBeDefined();
        expect(g.nodes['2']['8']).toBeDefined();
        expect(g.nodes['3']['4']).toBeDefined();
        expect(g.nodes['3']['5']).toBeDefined();
        expect(g.nodes['4']['6']).toBeDefined();
        expect(g.nodes['4']['7']).toBeDefined();
        expect(g.nodes['5']['4']).toBeDefined();
        expect(g.nodes['8']['9']).toBeDefined();
    });

    it('should be able to compute shortest path', function () {
        var shortestPath1 = ['6', '4', '3', '1', '0'];
        var shortestPath2 = ['4', '3', '1', '0'];

        expect(g.shortestPath('0', '6')).toEqual(shortestPath1);
        expect(g.shortestPath('0', '4')).toEqual(shortestPath2);
    });

    it("should return an empty array when computing shortest path between two node not having any path between them", function () {
        expect(g.shortestPath('3', '9').length).toBe(0);
    });
});
