// ---------- INTERACTION ----------
import { gridEl } from "./dom.js";
import { state } from "./state.js";
import { setStart, setTarget, renderCell } from "./grid.js";
import { clearPathVisuals } from "./board-controls.js";

export function attachGridEvents() {
     gridEl.addEventListener("mousedown", onCellDown);
     gridEl.addEventListener("mouseover", onCellEnter);
     document.addEventListener("mouseup", onDocUp);
     gridEl.addEventListener("contextmenu", (e) => e.preventDefault());
}

function cellFromEvent(e) {
     const target = e.target.closest(".node");
     if (!target) return null;
     return { row: +target.dataset.row, col: +target.dataset.col };
}

function onCellDown(e) {
     if (state.isRunning) return;
     const pos = cellFromEvent(e);
     if (!pos) return;
     const node = state.nodes[pos.row][pos.col];
     state.isMouseDown = true;

     if (node.isStart) {
          state.mode = "drag-start";
          state.cells[pos.row][pos.col].classList.add("node--dragging");
          return;
     }
     if (node.isTarget) {
          state.mode = "drag-target";
          state.cells[pos.row][pos.col].classList.add("node--dragging");
          return;
     }

     state.mode = node.isWall ? "wall-remove" : "wall-add";
     toggleWall(pos.row, pos.col, state.mode === "wall-add");
}

function onCellEnter(e) {
     if (!state.isMouseDown || state.isRunning) return;
     const pos = cellFromEvent(e);
     if (!pos) return;
     const node = state.nodes[pos.row][pos.col];

     if (state.mode === "drag-start" && !node.isWall && !node.isTarget) {
          state.cells[state.startPos.row][state.startPos.col].classList.remove(
               "node--dragging",
          );
          setStart(pos.row, pos.col);
          state.cells[pos.row][pos.col].classList.add("node--dragging");
          clearPathVisuals();
          return;
     }
     if (state.mode === "drag-target" && !node.isWall && !node.isStart) {
          state.cells[state.targetPos.row][state.targetPos.col].classList.remove(
               "node--dragging",
          );
          setTarget(pos.row, pos.col);
          state.cells[pos.row][pos.col].classList.add("node--dragging");
          clearPathVisuals();
          return;
     }
     if (
          (state.mode === "wall-add" || state.mode === "wall-remove") &&
          !node.isStart &&
          !node.isTarget
     ) {
          toggleWall(pos.row, pos.col, state.mode === "wall-add");
     }
}

function onDocUp() {
     state.isMouseDown = false;
     if (state.mode === "drag-start")
          state.cells[state.startPos.row][state.startPos.col].classList.remove(
               "node--dragging",
          );
     if (state.mode === "drag-target")
          state.cells[state.targetPos.row][state.targetPos.col].classList.remove(
               "node--dragging",
          );
     state.mode = null;
}

export function toggleWall(row, col, makeWall) {
     const node = state.nodes[row][col];
     if (node.isStart || node.isTarget) return;
     node.isWall = makeWall;
     renderCell(row, col);
}
