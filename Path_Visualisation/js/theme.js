// ---------- THEMES ----------
import { themeIcon } from "./dom.js";

const THEMES = [
     { key: "deck", icon: "◐" },
     { key: "terminal", icon: "▣" },
     { key: "crt", icon: "◈" },
     { key: "daylight", icon: "○" },
];

export function applyTheme(key) {
     document.documentElement.setAttribute("data-theme", key);
     const match = THEMES.find((t) => t.key === key) || THEMES[0];
     themeIcon.textContent = match.icon;
     try {
          localStorage.setItem("pathfinder-theme", key);
     } catch (e) {
          /* ignore */
     }
}

export function cycleTheme() {
     const current =
          document.documentElement.getAttribute("data-theme") || "deck";
     const idx = THEMES.findIndex((t) => t.key === current);
     const next = THEMES[(idx + 1) % THEMES.length];
     applyTheme(next.key);
}

export function initTheme() {
     let saved = "deck";
     try {
          saved = localStorage.getItem("pathfinder-theme") || "deck";
     } catch (e) {
          /* ignore */
     }
     applyTheme(saved);
}
