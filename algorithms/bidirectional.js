// ---------- BIDIRECTIONAL BFS ----------
// Returns { visitedInOrder: [node...], path: [node...] | null }
import { neighborsOf } from "../Path_Visualisation/js/pathfinding-utils.js";

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
