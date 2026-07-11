// ---------- RUN / ANIMATE ----------
import {
     statVisited,
     statPath,
     statStatus,
     visualizeBtn,
     wallsBtn,
     clearPathBtn,
     clearBoardBtn,
     algoSelect,
     speedSelect,
} from "./dom.js";
import { state, SPEEDS } from "./state.js";
import { clearPathVisuals } from "./board-controls.js";
import { stopIdleTrace, startIdleTrace, pushTrace, flashTrace } from "./trace.js";
import { ALGORITHMS, ALGO_LABELS } from "./algorithms.js";

export function run() {
     if (state.isRunning) return;
     clearPathVisuals();
     state.isRunning = true;
     setControlsDisabled(true);
     stopIdleTrace();
     statStatus.textContent = "running…";

     const start = state.nodes[state.startPos.row][state.startPos.col];
     const target = state.nodes[state.targetPos.row][state.targetPos.col];
     const algoKey = algoSelect.value;
     const { visitedInOrder, path } = ALGORITHMS[algoKey](start, target);
     const delay = SPEEDS[speedSelect.value];

     animateVisited(visitedInOrder, path, delay, algoKey);
}

function animateVisited(visitedInOrder, path, delay, algoKey) {
     let i = 0;
     const total = visitedInOrder.length;
     function step() {
          if (i >= total) {
               finishVisited(path, algoKey);
               return;
          }
          const node = visitedInOrder[i];
          if (!node.isStart && !node.isTarget) {
               state.cells[node.row][node.col].classList.add("node--visited");
          }
          statVisited.textContent = String(i + 1);
          pushTrace(true);
          i++;
          setTimeout(step, delay);
     }
     step();
}

function finishVisited(path, algoKey) {
     if (!path) {
          statStatus.textContent = "no path found";
          statPath.textContent = "—";
          flashTrace("fail");
          state.isRunning = false;
          setControlsDisabled(false);
          startIdleTrace();
          return;
     }
     let i = 0;
     function step() {
          if (i >= path.length) {
               statStatus.textContent = `${ALGO_LABELS[algoKey]} — done`;
               state.isRunning = false;
               setControlsDisabled(false);
               flashTrace("success");
               startIdleTrace();
               return;
          }
          const node = path[i];
          if (!node.isStart && !node.isTarget) {
               state.cells[node.row][node.col].classList.add("node--path");
          }
          statPath.textContent = String(path.length - 1);
          i++;
          setTimeout(step, 22);
     }
     step();
}

export function setControlsDisabled(disabled) {
     visualizeBtn.disabled = disabled;
     wallsBtn.disabled = disabled;
     clearPathBtn.disabled = disabled;
     clearBoardBtn.disabled = disabled;
     algoSelect.disabled = disabled;
}
