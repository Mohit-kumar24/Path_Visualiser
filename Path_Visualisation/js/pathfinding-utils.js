// ---------- NEIGHBORS / PATH HELPERS ----------
import { state } from "./state.js";

export function neighborsOf(node) {
     const { row, col } = node;
     const deltas = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
     ];
     const result = [];
     for (const [dr, dc] of deltas) {
          const r = row + dr,
               c = col + dc;
          if (
               r >= 0 &&
               r < state.ROWS &&
               c >= 0 &&
               c < state.COLS &&
               !state.nodes[r][c].isWall
          ) {
               result.push(state.nodes[r][c]);
          }
     }
     return result;
}

export function manhattan(a, b) {
     return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function buildPath(targetNode) {
     const path = [];
     let cur = targetNode;
     while (cur) {
          path.push(cur);
          cur = cur.previous;
     }
     return path.reverse();
}
