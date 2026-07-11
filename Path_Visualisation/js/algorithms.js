// ---------- ALGORITHMS ----------
// Each returns { visitedInOrder: [node...], path: [node...] | null }
import { state } from "./state.js";
import { neighborsOf, buildPath } from "./pathfinding-utils.js";

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

export function bidirectionalBFS(start, target) {
     const visitedInOrder = [];
     const prevFromStart = new Map();
     const prevFromTarget = new Map();
     const seenByStart = new Set([start]);
     const seenByTarget = new Set([target]);
     let queueStart = [start];
     let queueTarget = [target];
     let meetingNode = null;

     function expand(queue, seenBySelf, seenByOther, prevMap) {
          const nextQueue = [];
          for (const current of queue) {
               visitedInOrder.push(current);
               if (seenByOther.has(current)) {
                    meetingNode = current;
                    return nextQueue;
               }
               for (const n of neighborsOf(current)) {
                    if (!seenBySelf.has(n)) {
                         seenBySelf.add(n);
                         prevMap.set(n, current);
                         nextQueue.push(n);
                    }
               }
          }
          return nextQueue;
     }

     while (queueStart.length && queueTarget.length && !meetingNode) {
          queueStart = expand(
               queueStart,
               seenByStart,
               seenByTarget,
               prevFromStart,
          );
          if (meetingNode) break;
          queueTarget = expand(
               queueTarget,
               seenByTarget,
               seenByStart,
               prevFromTarget,
          );
     }

     if (!meetingNode) {
          // one frontier may have found the other's territory without yet processing it as "current"
          for (const n of seenByStart)
               if (seenByTarget.has(n)) {
                    meetingNode = n;
                    break;
               }
     }
     if (!meetingNode) return { visitedInOrder, path: null };

     const fromStartSide = [];
     let cur = meetingNode;
     while (cur) {
          fromStartSide.push(cur);
          cur = prevFromStart.get(cur) || null;
     }
     fromStartSide.reverse(); // start -> ... -> meetingNode

     const fromTargetSide = [];
     cur = prevFromTarget.get(meetingNode) || null;
     while (cur) {
          fromTargetSide.push(cur);
          cur = prevFromTarget.get(cur) || null;
     }
     // fromTargetSide is already ordered meetingNode-neighbor -> ... -> target

     return { visitedInOrder, path: fromStartSide.concat(fromTargetSide) };
}

export const ALGORITHMS = { bfs, dfs, dijkstra, bibfs: bidirectionalBFS };
export const ALGO_LABELS = {
     bfs: "Breadth-First Search",
     dfs: "Depth-First Search",
     dijkstra: "Dijkstra's Algorithm",
     bibfs: "Bidirectional BFS",
};
