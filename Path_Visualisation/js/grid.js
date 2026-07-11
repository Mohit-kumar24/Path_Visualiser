// ---------- GRID SETUP ----------
import { gridEl } from "./dom.js";
import { state, CELL, makeNode } from "./state.js";
import { attachGridEvents } from "./interaction.js";
import { resetStats } from "./board-controls.js";
import { startIdleTrace } from "./trace.js";

export function computeDimensions() {
     const stageWidth = gridEl.parentElement.clientWidth - 26;
     const stageHeight = Math.max(window.innerHeight - 340, 320);
     state.COLS = Math.min(70, Math.max(20, Math.floor(stageWidth / CELL)));
     state.ROWS = Math.min(30, Math.max(12, Math.floor(stageHeight / CELL)));
}

export function buildGrid() {
     computeDimensions();
     gridEl.style.gridTemplateColumns = `repeat(${state.COLS}, ${CELL}px)`;
     gridEl.style.gridTemplateRows = `repeat(${state.ROWS}, ${CELL}px)`;
     gridEl.innerHTML = "";
     state.nodes = [];
     state.cells = [];

     state.startPos = {
          row: Math.floor(state.ROWS / 2),
          col: Math.floor(state.COLS / 4),
     };
     state.targetPos = {
          row: Math.floor(state.ROWS / 2),
          col: Math.floor((state.COLS * 3) / 4),
     };

     for (let r = 0; r < state.ROWS; r++) {
          const nodeRow = [];
          const cellRow = [];
          for (let c = 0; c < state.COLS; c++) {
               const node = makeNode(r, c);
               const el = document.createElement("div");
               el.className = "node";
               el.dataset.row = r;
               el.dataset.col = c;
               gridEl.appendChild(el);
               nodeRow.push(node);
               cellRow.push(el);
          }
          state.nodes.push(nodeRow);
          state.cells.push(cellRow);
     }

     setStart(state.startPos.row, state.startPos.col);
     setTarget(state.targetPos.row, state.targetPos.col);
     attachGridEvents();
     resetStats();
     startIdleTrace();
}

export function setStart(row, col) {
     if (state.startPos) {
          state.nodes[state.startPos.row][state.startPos.col].isStart = false;
          renderCell(state.startPos.row, state.startPos.col);
     }
     state.startPos = { row, col };
     state.nodes[row][col].isStart = true;
     state.nodes[row][col].isWall = false;
     renderCell(row, col);
}

export function setTarget(row, col) {
     if (state.targetPos) {
          state.nodes[state.targetPos.row][state.targetPos.col].isTarget = false;
          renderCell(state.targetPos.row, state.targetPos.col);
     }
     state.targetPos = { row, col };
     state.nodes[row][col].isTarget = true;
     state.nodes[row][col].isWall = false;
     renderCell(row, col);
}

export function renderCell(row, col) {
     const node = state.nodes[row][col];
     const el = state.cells[row][col];
     el.className = "node";
     el.textContent = "";
     if (node.isStart) {
          el.classList.add("node--start");
          el.textContent = "S";
     } else if (node.isTarget) {
          el.classList.add("node--target");
          el.textContent = "E";
     } else if (node.isWall) {
          el.classList.add("node--wall");
     }
}
