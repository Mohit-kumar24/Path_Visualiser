# ◈ Pathfinder — Algorithm Visualizer

A web-based grid traversal and shortest-path visualizer built with plain
HTML5, CSS3, and modern JavaScript (ES modules — no framework, no build
step). Watch **Breadth-First Search**, **Depth-First Search**, **Dijkstra's Algorithm**, and **Bidirectional BFS** explore a grid in real
time, draw walls, drag the start/end nodes, and switch between four visual
themes.

**[Live Demo →](https://luxury-licorice-f7cc7a.netlify.app/)**

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Usage](#usage)
- [Algorithms](#algorithms)
- [Benchmarking](#benchmarking)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Deployment (Netlify)](#deployment-netlify)
- [What I Learned](#what-i-learned)
- [Contributing](#contributing)
- [License](#license)

## Demo

| BFS | DFS |
| --- | --- |
| [![BFS demo](gif/BFS.gif)](gif/BFS.gif) | [![DFS demo](gif/DFS.gif)](gif/DFS.gif) |

| Dijkstra's Algorithm | Bidirectional BFS |
| --- | --- |
| [![Dijkstra demo](gif/Dijsktra.gif)](gif/Dijsktra.gif) | [![Bidirectional BFS demo](gif/Bidirectional_BFS.gif)](gif/Bidirectional_BFS.gif) |

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
- **Automated benchmarking** — a standalone harness generates random grid
test-cases and measures nodes-explored / timing across BFS, DFS,
Dijkstra, and Bidirectional BFS. See [Benchmarking](#benchmarking).

## Usage

1. Open the app (locally or via the live demo link above).
2. **Move the start/end nodes** — click and drag the cyan `S` or coral `E` node to a new cell.
3. **Draw walls** — click and drag over empty cells to add walls; click
and drag over existing walls to erase them.
4. **Pick an algorithm** — choose BFS, DFS, Dijkstra's Algorithm, or
Bidirectional BFS from the *algorithm* dropdown.
5. **Pick a speed** — Fast, Medium, or Slow from the *speed* dropdown.
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

## Benchmarking

[`benchmark/`](benchmark/) is a standalone Node harness that directly
imports `bfs`, `dfs`, `dijkstra`, and `bidirectionalBFS` — each from its
own module in the single shared [`algorithms/`](algorithms/) folder at
the repo root, used by both the browser app and the benchmark — there's
no separate copy anywhere — and runs them against automatically
generated random grid test-cases, reporting nodes-explored, path
length, success rate, and timing. A small headless adapter
([`benchmark/src/live-adapter.mjs`](benchmark/src/live-adapter.mjs))
feeds each run a fresh `state.nodes` grid so those functions execute
exactly as they do in the live app, just without a browser.

```bash
cd benchmark

# 1000 trials on one grid config
node cli.mjs --trials 1000 --rows 30 --cols 30 --wallDensity 0.25 --seed 42

# Density sweep — reruns the full benchmark once per density and adds a
# cross-density comparison (benchmark/results/density-sweep-summary.md)
node cli.mjs --trials 1000 --rows 30 --cols 30 --densities 0.1,0.2,0.3,0.4,0.5 --seed 42
```

Sample result (30×30 grid, 25% wall density, seed 42, 1000 trials,
running the real algorithms):

| Algorithm | Success Rate | Avg Nodes Explored | Avg Path Length | Avg Time/Run |
|---|---|---|---|---|
| BFS | 97.1% | 334.4 | 23.7 | 0.134 ms |
| DFS | 97.1% | 340.0 | 72.0 | 0.102 ms |
| Dijkstra | 97.1% | 334.6 | 23.7 | 3.505 ms |
| Bidirectional BFS | 97.1% | 212.1 | 23.7 | 0.139 ms |

**Bidirectional BFS explored ~35% fewer nodes than standard BFS**,
averaged over the trials both algorithms solved — the exact figure
shifts with wall density (see `benchmark/README.md` for the full sweep
methodology).

Worth noting: Dijkstra's per-run time is much higher than the others
because `dijkstra.js` re-sorts the entire unvisited-node array every
step, rather than using a priority queue — a real property of the
current implementation, not a benchmark artifact. See
`benchmark/README.md` for details and reproduction steps.

## Project Structure

```
Path_Visualiser/
├── .gitignore                   # covers both Path_Visualisation/ and benchmark/results/
├── README.md                    # this file
├── algorithms/                  # single shared source — one file per algorithm, used by BOTH the
│   │                             # browser app and the benchmark harness. No copies anywhere else.
│   ├── bfs.js
│   ├── dfs.js
│   ├── dijkstra.js
│   ├── bidirectional.js         # exports bidirectionalBFS
│   └── index.js                 # re-exports all four + ALGORITHMS/ALGO_LABELS registries
├── Path_Visualisation/
│   ├── index.html              # Page markup, loads js/main.js as a module
│   ├── style.css                # All styling, including the 4 themes
│   ├── netlify.toml               # Netlify deploy config (base dir = Path_Visualisation, see Deployment)
│   ├── LICENSE
│   ├── gif/                        # Demo GIFs (see gif/README.md)
│   │   ├── README.md
│   │   ├── BFS.gif
│   │   ├── DFS.gif
│   │   ├── Dijsktra.gif
│   │   └── Bidirectional_BFS.gif
│   └── js/
│       ├── main.js              # Entry point — wires up events, boots the app
│       ├── state.js              # Shared mutable state object + constants
│       ├── dom.js                 # All document.getElementById() lookups
│       ├── grid.js                 # Grid sizing, node/cell creation, start/target placement
│       ├── interaction.js           # Mouse events: dragging start/target, drawing walls
│       ├── board-controls.js         # Clear path, clear board, randomize walls, reset stats
│       ├── pathfinding-utils.js       # neighborsOf, manhattan distance, buildPath
│       ├── animation.js                 # run() + step-by-step visited/path animation, imports ../../algorithms/index.js
│       ├── trace.js                      # Oscilloscope "signature trace" widget
│       └── theme.js                       # Theme cycling + localStorage persistence
└── benchmark/                    # Standalone benchmark harness — imports each algorithm file directly from
    │                              # ../algorithms/, no copy
    ├── cli.mjs
    ├── package.json
    ├── README.md
    └── src/
        ├── rng.mjs
        ├── grid.mjs
        ├── live-adapter.mjs      # imports state.js/makeNode from ../Path_Visualisation/js/, builds fresh node grids
        ├── algorithm-runner.mjs  # ONE generic adapter (build grid -> call algorithm -> translate result shape),
        │                         # used for all 4 algorithms instead of a wrapper file per algorithm
        ├── stats.mjs
        ├── runner.mjs            # imports bfs/dfs/dijkstra/bidirectionalBFS straight from ../../algorithms/index.js
        └── report.mjs
```

**Module dependency notes**

- `state.js` and `dom.js` have no internal dependencies — every other
module may import them.
- `grid.js` and `interaction.js` reference each other (grid attaches
interaction's event listeners; interaction calls grid's `setStart`/
`setTarget`). This is a safe circular import in ES modules because the
functions are only *called* at runtime, never evaluated at the top of
the file.
- `algorithms/` lives at the repo root (a sibling of `Path_Visualisation/`
and `benchmark/`, not nested inside either) and holds one file per
algorithm (`bfs.js`, `dfs.js`, `dijkstra.js`, `bidirectional.js`) plus
`index.js`, a barrel file that re-exports all four and builds the
`ALGORITHMS`/`ALGO_LABELS` registries the dropdown and `animation.js`
key off of. Each algorithm file only imports what it needs —
`bfs.js`/`dfs.js`/`bidirectional.js` import `pathfinding-utils.js`, and
`dijkstra.js` additionally imports `state.js` for the full-grid
unvisited-node scan. This is the single copy of every algorithm; both
the browser app and the benchmark harness import straight from it.
- `animation.js` is the "conductor" — the only browser-side module that
pulls together `algorithms/index.js` and `trace.js` to run a search and
animate the result.
- `benchmark/` has no copy of any file under `Path_Visualisation/js/` or
`algorithms/`. `runner.mjs` imports `bfs`/`dfs`/`dijkstra`/
`bidirectionalBFS` directly from `../../algorithms/index.js`, and passes
each one through the single generic `runAlgorithm()` adapter in
`src/algorithm-runner.mjs`, which rebuilds a fresh grid, calls the
algorithm, and translates its `{visitedInOrder, path}` result into the
`{explored, found, pathLen}` shape the report expects — the same three
steps for every algorithm, so there's one adapter function instead of a
wrapper file per algorithm. `src/live-adapter.mjs` imports `state.js`
the same way `algorithms/dijkstra.js` does, and is the only module that
touches the shared `state` singleton, rebuilding it fresh before every
algorithm call. If an algorithm file changes, the benchmark picks up the
change automatically — nothing to keep in sync.

## Local Setup

Because the app uses native ES modules (`import`/`export`), it needs to
be served over `http://`, not opened directly from disk (`file://`) —
most browsers block module imports on the `file://` protocol.

1. **Clone the repo**

```
git clone https://github.com/Mohit-kumar24/Path_Visualiser.git
cd Path_Visualiser/Path_Visualisation
```

2. **Serve it locally** — pick whichever you have installed:

```
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

The repo is now a monorepo (`Path_Visualisation/` + `benchmark/`), so
`Path_Visualisation/netlify.toml` publishes relative to a **base
directory**, not the repo root — Netlify needs to be told the app lives
in `Path_Visualisation/`.

**Option A — Netlify UI**

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**.
3. Connect the repo. Set:
   - **Base directory**: `Path_Visualisation`
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (relative to the base directory above)
4. Deploy — Netlify will serve `Path_Visualisation/index.html` directly.

**Option B — Netlify CLI**

```bash
cd Path_Visualisation
npm install -g netlify-cli
netlify deploy --prod
```

Once deployed, replace the `#` placeholder in the **Live Demo** link at
the top of this README with your Netlify URL.

## What I Learned

- **Structuring vanilla JS without a framework** — splitting a single
1,000-line IIFE into focused ES modules (state, DOM, rendering,
interaction, algorithms, animation) taught me a lot about drawing clean
boundaries between *data*, *rendering*, and *behavior* even without
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
- **Benchmarking claims need automation, not eyeballing** — writing a
harness that generates 1000 random grids and re-runs the app's actual
`bfs`/`dfs`/`dijkstra`/`bidirectionalBFS` functions against them turned
the "~9% fewer nodes" claim into a reproducible, seed-controlled
number, and surfaced a real perf issue (Dijkstra's full-array re-sort
per step) I wouldn't have noticed from the visual demo alone.

## Contributing

Contributions are welcome!

1. Fork the repo and create a branch: `git checkout -b feature/my-idea`.
2. Make your changes (keep new logic in the appropriate `js/` module —
see [Project Structure](#project-structure)).
3. Test locally with any static server (see [Local Setup](#local-setup)).
4. Commit and push, then open a pull request describing what changed and
why.

Ideas for contributions: A* search with a visualized heuristic, weighted
terrain cells, maze-generation algorithms, mobile touch support for
drawing walls, additional themes, or swapping Dijkstra's sorted-array
priority queue for a binary heap (the benchmark in `benchmark/` will
immediately show the before/after timing difference since it runs
`algorithms/dijkstra.js` directly).

## License

Released under the [MIT License](LICENSE).
