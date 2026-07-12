import { loadFreshGrid, rowColOf } from './live-adapter.mjs';

/**
 * Generic bridge between the app's own algorithm functions (bfs, dfs,
 * dijkstra, bidirectionalBFS — imported directly from the shared
 * ../../algorithms/ folder, never copied) and the
 * {explored, found, pathLen} shape the runner/report expect.
 *
 * This one function replaces what used to be five separate wrapper
 * files (one per algorithm) that all did the exact same three steps:
 * build a fresh grid, call the algorithm, translate its return shape.
 * The only thing that varies per algorithm is which function is
 * passed in, so there is nothing left to duplicate per-algorithm here.
 */
export function runAlgorithm(algoFn, rows, cols, wallsFlat, startIdx, endIdx) {
  const nodes = loadFreshGrid(rows, cols, wallsFlat);
  const s = rowColOf(cols, startIdx);
  const e = rowColOf(cols, endIdx);
  const result = algoFn(nodes[s.r][s.c], nodes[e.r][e.c]);
  return {
    explored: result.visitedInOrder.length,
    found: result.path !== null,
    pathLen: result.path ? result.path.length : -1,
  };
}
