// ---------- SIGNATURE TRACE (oscilloscope) ----------
import { traceLine, traceDot } from "./dom.js";
import { state } from "./state.js";

const TRACE_POINTS = 60;

export function pushTrace(active) {
     const amp = active ? 8 + Math.random() * 20 : 2 + Math.random() * 3;
     const dir = Math.random() > 0.5 ? 1 : -1;
     state.traceBuffer.push(30 + dir * amp);
     state.traceBuffer.shift();
     renderTrace();
}

export function renderTrace() {
     const step = 600 / (TRACE_POINTS - 1);
     const pts = state.traceBuffer
          .map((y, idx) => `${(idx * step).toFixed(1)},${y.toFixed(1)}`)
          .join(" ");
     traceLine.setAttribute("points", pts);
}

export function startIdleTrace() {
     stopIdleTrace();
     let t = 0;
     state.traceIdle = setInterval(() => {
          t += 1;
          state.traceBuffer.push(30 + Math.sin(t / 3) * 4);
          state.traceBuffer.shift();
          renderTrace();
     }, 90);
}

export function stopIdleTrace() {
     if (state.traceIdle) clearInterval(state.traceIdle);
     state.traceIdle = null;
}

export function flashTrace(kind) {
     traceLine.classList.remove("is-success", "is-fail");
     void traceLine.offsetWidth;
     traceLine.classList.add(kind === "success" ? "is-success" : "is-fail");
     traceDot.style.opacity = "1";
     setTimeout(() => {
          traceDot.style.opacity = "0";
     }, 900);
}
