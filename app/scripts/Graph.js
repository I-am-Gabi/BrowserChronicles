Graph = function () {
    var INFINITY = 1 / 0;
    this.nodes = {};

    this.addNode = function (id) {
        this.nodes[id] = {
        };
    };

    this.addEdge = function (from, to, wheight) {
        this.nodes[from][to] = wheight;
    };

    this.shortestPath = function (start, finish) {
        var nodes = new PriorityQueue(),
                distances = {},
                previous_distances = {},
                path = [],
                closest_node, node, neighbor, alt;

        for (node in this.nodes) {
            if (node === start) {
                distances[node] = 0;
                nodes.enqueue(0, node);
            } else {
                distances[node] = INFINITY;
                nodes.enqueue(INFINITY, node);
            }

            previous_distances[node] = null;
        }

        while (!nodes.isEmpty()) {
            closest_node = nodes.dequeue();

            if (closest_node === finish) {
                path;

                while (previous_distances[closest_node]) {
                    path.push(closest_node);
                    closest_node = previous_distances[closest_node];
                }

                break;
            }

            if (!closest_node || distances[closest_node] === INFINITY) {
                continue;
            }

            for (neighbor in this.nodes[closest_node]) {
                alt = distances[closest_node] + this.nodes[closest_node][neighbor];

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous_distances[neighbor] = closest_node;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }
        // We want to add the initial step only if there is to path to reach 'end' node
        if (path.length > 0) {
            path.push(start);
        }
        return path;
    };
};