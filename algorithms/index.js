// ---------- ALGORITHM REGISTRY ----------
// Barrel file: re-exports each algorithm from its own module, plus the
// registries the UI (algorithm dropdown, animation.js) keys off of.
export { bfs } from "./bfs.js";
export { dfs } from "./dfs.js";
export { dijkstra } from "./dijkstra.js";
export { bidirectionalBFS } from "./bidirectional.js";

import { bfs } from "./bfs.js";
import { dfs } from "./dfs.js";
import { dijkstra } from "./dijkstra.js";
import { bidirectionalBFS } from "./bidirectional.js";

export const ALGORITHMS = { bfs, dfs, dijkstra, bibfs: bidirectionalBFS };
export const ALGO_LABELS = {
     bfs: "Breadth-First Search",
     dfs: "Depth-First Search",
     dijkstra: "Dijkstra's Algorithm",
     bibfs: "Bidirectional BFS",
};
