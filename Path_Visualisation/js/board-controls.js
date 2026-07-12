// ---------- BOARD CONTROLS ----------
import { statVisited, statPath, statStatus } from "./dom.js";
import { state } from "./state.js";
import { renderCell } from "./grid.js";

export function clearPathVisuals() {
     for (let r = 0; r < state.ROWS; r++) {
          for (let c = 0; c < state.COLS; c++) {
               const node = state.nodes[r][c];
               node.visited = false;
               node.distance = Infinity;
               node.f = Infinity;
               node.g = Infinity;
               node.previous = null;
               const el = state.cells[r][c];
               el.classList.remove("node--visited", "node--path");
          }
     }
     resetStats();
}

export function clearBoard() {
     for (let r = 0; r < state.ROWS; r++) {
          for (let c = 0; c < state.COLS; c++) state.nodes[r][c].isWall = false;
     }
     clearPathVisuals();
     for (let r = 0; r < state.ROWS; r++)
          for (let c = 0; c < state.COLS; c++) renderCell(r, c);
}

export function randomWalls() {
     clearPathVisuals();
     for (let r = 0; r < state.ROWS; r++) {
          for (let c = 0; c < state.COLS; c++) {
               const node = state.nodes[r][c];
               if (node.isStart || node.isTarget) continue;
               node.isWall = Math.random() < 0.28;
               renderCell(r, c);
          }
     }
}

export function resetStats() {
     statVisited.textContent = "0";
     statPath.textContent = "—";
     statStatus.textContent = "idle";
}
