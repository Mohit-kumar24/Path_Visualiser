// ---------- STATE ----------
// Single source of truth for mutable app state.
// Other modules import `state` and read/write its properties directly
// (plain `let` exports can't be reassigned across ES modules, so we use
// one shared object instead).

export const CELL = 24;

export const SPEEDS = { fast: 4, medium: 12, slow: 32 };

export const state = {
     ROWS: 0,
     COLS: 0,
     nodes: [], // 2D array of node model objects
     cells: [], // 2D array of DOM elements
     startPos: null,
     targetPos: null,
     isMouseDown: false,
     mode: null, // 'wall-add' | 'wall-remove' | 'drag-start' | 'drag-target'
     isRunning: false,
     traceIdle: null,
     traceBuffer: new Array(60).fill(30),
};

export function makeNode(row, col) {
     return {
          row,
          col,
          isWall: false,
          isStart: false,
          isTarget: false,
          distance: Infinity,
          f: Infinity,
          g: Infinity,
          previous: null,
          visited: false,
     };
}
