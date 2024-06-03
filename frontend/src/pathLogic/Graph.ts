
type Vector3 = {
    x: number,
    y: number,
    z: number
}

export class Node {
    value: Vector3;
    edges: Node[];

    parent: Node | null = null;
    g: number = 0; // Cost from start to current node
    h: number = 0; // Heuristic cost to end
    f: number = 0; // Total cost (g + h)

    constructor(value: Vector3) {
        this.value = value;
        this.edges = [];
    }
}

export class Graph {
    nodes: Node[];

    constructor() {
        this.nodes = [];
    }

    addNode(value: Vector3): void {
        this.nodes.push(new Node(value));
    }

    find(value: Vector3): Node | undefined {
        return this.nodes.find(node => node.value === value);
    }

    addEdge(value1: Vector3, value2: Vector3): void {
        let node1 = this.find(value1);
        let node2 = this.find(value2);

        if (node1 && node2) {
            node1.edges.push(node2);
            // node2.edges.push(node1);
        }
    }

    aStar(startValue: Vector3, endValue: Vector3): Node[] | undefined {
        let startNode = this.find(startValue);
        let endNode = this.find(endValue);

        if (!startNode || !endNode) {
            return undefined; // Start or end node not found
        }

        let openSet: Node[] = [startNode];
        let closedSet: Node[] = [];

        startNode.g = 0;
        startNode.h = this.heuristic(startNode, endNode);
        startNode.f = startNode.h;

        while (openSet.length > 0) {
            let current = openSet.reduce((prev, curr) => prev.f < curr.f ? prev : curr);
            if (current === endNode) {
                return this.reconstructPath(endNode);
            }

            openSet = openSet.filter(node => node !== current);
            closedSet.push(current);

            for (let neighbor of current.edges) {
                if (closedSet.includes(neighbor)) continue;

                // let tentativeG = current.g + current.value.distanceTo(neighbor.value);
                let tentativeG = 1; // TODO: implement heuristics

                if (!openSet.includes(neighbor)) openSet.push(neighbor);
                else if (tentativeG >= neighbor.g) continue;

                neighbor.parent = current;
                neighbor.g = tentativeG;
                neighbor.h = this.heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
            }
        }

        return undefined; // Path not found
    }

    heuristic(node: Node, endNode: Node): number {
        return 1   //node.value.distanceTo(endNode.value); // TODO: Euclidean distance
    }

    reconstructPath(endNode: Node): Node[] {
        let path: Node[] = [];
        let current: Node | null = endNode;
        while (current !== null) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }
}
