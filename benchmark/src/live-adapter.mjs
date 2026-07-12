import { state, makeNode } from '../../Path_Visualisation/js/state.js';

/**
 * Only job: translate our flat wall array (Uint8Array, row-major) into
 * the 2D `state.nodes` shape that the algorithms/ modules and
 * pathfinding-utils.js expect, and point the shared `state` singleton at it.
 *
 * Called fresh before every single algorithm run (not once per trial),
 * so each algorithm always sees untouched nodes — visited: false,
 * distance: Infinity, previous: null — exactly like the live app after
 * "Clear Board". This is the harness's job, not a change to the app's
 * own files: state.js already expects callers to populate
 * state.ROWS/COLS/nodes this way.
 */
export function loadFreshGrid(rows, cols, wallsFlat) {
  state.ROWS = rows;
  state.COLS = cols;
  const nodes = new Array(rows);
  for (let r = 0; r < rows; r++) {
    const row = new Array(cols);
    for (let c = 0; c < cols; c++) {
      const node = makeNode(r, c);
      node.isWall = wallsFlat[r * cols + c] === 1;
      row[c] = node;
    }
    nodes[r] = row;
  }
  state.nodes = nodes;
  return nodes;
}

/** Flat row-major index -> {r, c}, since our grid generator works in flat indices. */
export function rowColOf(cols, idx) {
  return { r: (idx / cols) | 0, c: idx % cols };
}
