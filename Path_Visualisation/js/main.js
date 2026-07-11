// ---------- ENTRY POINT ----------
// Load as: <script type="module" src="js/main.js"></script>
import {
     themeBtn,
     visualizeBtn,
     wallsBtn,
     clearPathBtn,
     clearBoardBtn,
} from "./dom.js";
import { state } from "./state.js";
import { buildGrid } from "./grid.js";
import { clearPathVisuals, clearBoard, randomWalls } from "./board-controls.js";
import { run } from "./animation.js";
import { cycleTheme, initTheme } from "./theme.js";

// ---------- EVENTS ----------
themeBtn.addEventListener("click", cycleTheme);
initTheme();
visualizeBtn.addEventListener("click", run);
wallsBtn.addEventListener("click", () => {
     if (!state.isRunning) randomWalls();
});
clearPathBtn.addEventListener("click", () => {
     if (!state.isRunning) clearPathVisuals();
});
clearBoardBtn.addEventListener("click", () => {
     if (!state.isRunning) clearBoard();
});

let resizeTimer;
window.addEventListener("resize", () => {
     clearTimeout(resizeTimer);
     resizeTimer = setTimeout(() => {
          if (!state.isRunning) buildGrid();
     }, 250);
});

buildGrid();
