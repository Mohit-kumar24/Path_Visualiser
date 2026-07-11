# ◈ Pathfinder — Algorithm Visualizer

A web-based grid traversal and shortest-path visualizer built with plain
HTML5, CSS3, and modern JavaScript (ES modules — no framework, no build
step). Watch **Breadth-First Search**, **Depth-First Search**,
**Dijkstra's Algorithm**, and **Bidirectional BFS** explore a grid in real
time, draw walls, drag the start/end nodes, and switch between four visual
themes.

**[Live Demo →](https://luxury-licorice-f7cc7a.netlify.app/)** <!-- replace with your Netlify URL, e.g. https://your-site.netlify.app -->

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Usage](#usage)
- [Algorithms](#algorithms)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Deployment (Netlify)](#deployment-netlify)
- [What I Learned](#what-i-learned)
- [Contributing](#contributing)
- [License](#license)

## Demo

| BFS                      | DFS                      |
| ------------------------ | ------------------------ |
| ![BFS demo](gif/BFS.gif) | ![DFS demo](gif/DFS.gif) |

| Dijkstra's Algorithm               | Bidirectional BFS                                    |
| ---------------------------------- | ---------------------------------------------------- |
| ![Dijkstra demo](gif/Dijsktra.gif) | ![Bidirectional BFS demo](gif/Bidirectional_BFS.gif) |

> GIFs live in [`gif/`](gif/) — see that folder's README for recording
> tips and expected filenames.

## Features

- **Four algorithms** — BFS, DFS, Dijkstra's Algorithm, and Bidirectional
  BFS, selectable from a dropdown.
- **Interactive grid** — click and drag to draw or erase walls; drag the
  `S` (start) and `E` (target) nodes anywhere on the board.
- **Adjustable speed** — Fast / Medium / Slow animation presets.
- **Live stats readout** — nodes visited, path length, and run status,
  updated as the algorithm runs.
- **Signature oscilloscope trace** — a decorative live waveform in the
  header that reacts to grid activity.
- **Four themes** — Deck (default dark), Terminal (green phosphor), CRT
  (amber), and Daylight (light mode) — cycled with the theme button and
  persisted to `localStorage`.
- **Responsive layout** — grid auto-sizes to the viewport and rebuilds on
  window resize.
- **Zero dependencies** — native ES modules, no bundler, no framework.

## Usage

1. Open the app (locally or via the live demo link above).
2. **Move the start/end nodes** — click and drag the cyan `S` or coral `E`
   node to a new cell.
3. **Draw walls** — click and drag over empty cells to add walls; click
   and drag over existing walls to erase them.
4. **Pick an algorithm** — choose BFS, DFS, Dijkstra's Algorithm, or
   Bidirectional BFS from the _algorithm_ dropdown.
5. **Pick a speed** — Fast, Medium, or Slow from the _speed_ dropdown.
6. **Visualize** — click **Visualize** to run the algorithm and watch the
   visited cells (amber) and final path (green) animate in.
7. **Random Walls** — scatter random obstacles across the board.
8. **Clear Path** — clear the visited/path animation, keep the walls.
9. **Clear Board** — reset the entire grid, including walls.
10. **Theme** — click the theme button to cycle through the four color
    themes.

## Algorithms

### Breadth-First Search (BFS)

Explores the grid level by level, visiting every neighboring node at the
current distance before moving further out. On an unweighted grid like
this one, BFS is guaranteed to find the shortest path.

### Depth-First Search (DFS)

Explores as far as possible down one branch before backtracking. It
reaches the target eventually but does **not** guarantee the shortest
path — useful here mainly as a contrast to the other algorithms.

### Dijkstra's Algorithm

A shortest-path algorithm that repeatedly expands the closest unvisited
node. On this uniform-cost grid it behaves like BFS with an explicit
priority queue (implemented here as a sorted array), but the same
structure generalizes to weighted graphs.

### Bidirectional BFS

Runs two BFS frontiers simultaneously — one from the start, one from the
target — and stops as soon as they meet in the middle. It typically
visits far fewer nodes than a single-direction search on open grids.

## Project Structure

```
Path_Visualisation/
├── index.html              # Page markup, loads js/main.js as a module
├── style.css                # All styling, including the 4 themes
├── netlify.toml               # Netlify deploy config (static, no build)
├── LICENSE
├── .gitignore
├── gif/                        # Demo GIFs (see gif/README.md)
│   ├── README.md
│   ├── BFS.gif
│   ├── DFS.gif
│   ├── Dijsktra.gif
│   └── Bidirectional_BFS.gif
└── js/
    ├── main.js              # Entry point — wires up events, boots the app
    ├── state.js              # Shared mutable state object + constants
    ├── dom.js                 # All document.getElementById() lookups
    ├── grid.js                 # Grid sizing, node/cell creation, start/target placement
    ├── interaction.js           # Mouse events: dragging start/target, drawing walls
    ├── board-controls.js         # Clear path, clear board, randomize walls, reset stats
    ├── pathfinding-utils.js       # neighborsOf, manhattan distance, buildPath
    ├── algorithms.js               # bfs, dfs, dijkstra, bidirectionalBFS + registries
    ├── animation.js                 # run() + step-by-step visited/path animation
    ├── trace.js                      # Oscilloscope "signature trace" widget
    └── theme.js                       # Theme cycling + localStorage persistence
```

**Module dependency notes**

- `state.js` and `dom.js` have no internal dependencies — every other
  module may import them.
- `grid.js` and `interaction.js` reference each other (grid attaches
  interaction's event listeners; interaction calls grid's `setStart`/
  `setTarget`). This is a safe circular import in ES modules because the
  functions are only _called_ at runtime, never evaluated at the top of
  the file.
- `animation.js` is the "conductor" — the only module that pulls together
  `algorithms.js` and `trace.js` to run a search and animate the result.

## Local Setup

Because the app uses native ES modules (`import`/`export`), it needs to
be served over `http://`, not opened directly from disk (`file://`) —
most browsers block module imports on the `file://` protocol.

1. **Clone the repo**

     ```bash
     git clone https://github.com/<your-username>/<your-repo>.git
     cd Path_Visualisation
     ```

2. **Serve it locally** — pick whichever you have installed:

     ```bash
     # Node (no install needed, via npx)
     npx serve .

     # Python 3
     python3 -m http.server 8000

     # VS Code
     # Right-click index.html → "Open with Live Server"
     ```

3. **Open it in your browser**, e.g. `http://localhost:8000`.

No build step, no `npm install`, no dependencies — it's plain HTML/CSS/JS.

## Deployment (Netlify)

This repo includes a `netlify.toml` that publishes the project root with
no build command, since it's a static site.

**Option A — Netlify UI**

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**.
3. Connect the repo. Leave the build command empty and set the publish
   directory to `.` (repo root).
4. Deploy — Netlify will serve `index.html` directly.

**Option B — Netlify CLI**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Once deployed, replace the `#` placeholder in the **Live Demo** link at
the top of this README with your Netlify URL.

## What I Learned

- **Structuring vanilla JS without a framework** — splitting a single
  1,000-line IIFE into focused ES modules (state, DOM, rendering,
  interaction, algorithms, animation) taught me a lot about drawing clean
  boundaries between _data_, _rendering_, and _behavior_ even without
  React/Vue's component model.
- **Shared mutable state across modules** — ES module bindings for
  primitives (`let x = 1; export { x }`) can't be reassigned by
  importers, so shared state that needs to change (grid dimensions,
  running flag, node arrays) has to live on a shared object. That's a
  different mental model from working inside a single closure.
- **Graph traversal on a grid** — implementing BFS, DFS, Dijkstra, and
  Bidirectional BFS side by side made the practical differences between
  them concrete: BFS/Dijkstra both guarantee shortest paths on this
  uniform-cost grid, DFS trades correctness for simplicity, and
  Bidirectional BFS meaningfully cuts down visited-node count by
  searching from both ends at once.
- **Animating algorithm state without blocking the UI** — using
  `setTimeout`-driven step functions (rather than `for` loops) to animate
  the visited-order array cell by cell, so the browser stays responsive
  and the visualization is actually watchable.
- **Small UX details matter** — debounced grid rebuilds on resize,
  disabling controls mid-run, and clearing stale path state before a new
  run all avoid subtle bugs (e.g. animating over a resized grid, or
  double-triggering a run).

## Contributing

Contributions are welcome!

1. Fork the repo and create a branch: `git checkout -b feature/my-idea`.
2. Make your changes (keep new logic in the appropriate `js/` module —
   see [Project Structure](#project-structure)).
3. Test locally with any static server (see [Local Setup](#local-setup)).
4. Commit and push, then open a pull request describing what changed and
   why.

Ideas for contributions: A\* search with a visualized heuristic, weighted
terrain cells, maze-generation algorithms, mobile touch support for
drawing walls, or additional themes.

## License

Released under the [MIT License](LICENSE).
