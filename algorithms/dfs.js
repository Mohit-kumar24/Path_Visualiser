// ---------- DEPTH-FIRST SEARCH ----------
// Returns { visitedInOrder: [node...], path: [node...] | null }
import { neighborsOf, buildPath } from "../Path_Visualisation/js/pathfinding-utils.js";

export function dfs(start, target) {
     const visitedInOrder = [];
     const stack = [start];
     while (stack.length) {
          const current = stack.pop();
          if (current.visited) continue;
          current.visited = true;
          visitedInOrder.push(current);
          if (current === target)
               return { visitedInOrder, path: buildPath(current) };
          for (const n of neighborsOf(current)) {
               if (!n.visited) {
                    n.previous = n.previous || current;
                    stack.push(n);
               }
          }
     }
     return { visitedInOrder, path: null };
}
