// ---------- DIJKSTRA'S ALGORITHM ----------
// Returns { visitedInOrder: [node...], path: [node...] | null }
import { state } from "../Path_Visualisation/js/state.js";
import { neighborsOf, buildPath } from "../Path_Visualisation/js/pathfinding-utils.js";

export function dijkstra(start, target) {
     const visitedInOrder = [];
     const unvisited = [];
     for (let r = 0; r < state.ROWS; r++)
          for (let c = 0; c < state.COLS; c++) {
               if (!state.nodes[r][c].isWall) unvisited.push(state.nodes[r][c]);
          }
     start.distance = 0;
     while (unvisited.length) {
          unvisited.sort((a, b) => a.distance - b.distance);
          const current = unvisited.shift();
          if (current.distance === Infinity) break;
          current.visited = true;
          visitedInOrder.push(current);
          if (current === target)
               return { visitedInOrder, path: buildPath(current) };
          for (const n of neighborsOf(current)) {
               const alt = current.distance + 1;
               if (alt < n.distance) {
                    n.distance = alt;
                    n.previous = current;
               }
          }
     }
     return { visitedInOrder, path: null };
}
