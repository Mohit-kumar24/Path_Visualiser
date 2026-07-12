// ---------- BREADTH-FIRST SEARCH ----------
// Returns { visitedInOrder: [node...], path: [node...] | null }
import { neighborsOf, buildPath } from "../Path_Visualisation/js/pathfinding-utils.js";

export function bfs(start, target) {
     const visitedInOrder = [];
     const queue = [start];
     start.visited = true;
     while (queue.length) {
          const current = queue.shift();
          visitedInOrder.push(current);
          if (current === target)
               return { visitedInOrder, path: buildPath(current) };
          for (const n of neighborsOf(current)) {
               if (!n.visited) {
                    n.visited = true;
                    n.previous = current;
                    queue.push(n);
               }
          }
     }
     return { visitedInOrder, path: null };
}
