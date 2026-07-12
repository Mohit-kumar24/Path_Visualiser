# Pathfinding Benchmark Harness

Standalone benchmark that directly imports and runs `bfs`, `dfs`,
`dijkstra`, and `bidirectionalBFS` — each straight from its own module
in [`../algorithms/`](../algorithms/), the single shared folder also
used by the browser app — against automatically generated random
grids. Zero dependencies, no copy of any app file.

## How it runs the app's code headlessly

There's no `vendor/` folder and no duplicated algorithm code, and no
second `algorithms/` folder either — `runner.mjs` imports `bfs`, `dfs`,
`dijkstra`, and `bidirectionalBFS` directly from `../../algorithms/index.js`,
and `src/live-adapter.mjs` imports `state`/`makeNode` from
`../Path_Visualisation/js/state.js`. If an algorithm file changes, the
benchmark picks up the change on the next run automatically — there's
nothing to keep in sync.

`src/live-adapter.mjs` is the only glue code: before every algorithm
call it builds a fresh 2D `state.nodes` grid (via `makeNode()`) from our
generated wall layout, points `state.ROWS`/`state.COLS`/`state.nodes`
at it, and hands node objects to the imported `bfs()`/`dfs()`/
`dijkstra()`/`bidirectionalBFS()` functions — exactly the shape they
already expect. `src/algorithm-runner.mjs` wraps that grid-building plus
the result-shape translation into one generic `runAlgorithm()` function
that every algorithm shares, so there's no per-algorithm wrapper file.
Each algorithm gets its own fresh grid per run so one algorithm's
mutations (`visited`, `distance`, `previous`) can never leak into the
next.

## Usage

```bash
cd benchmark

# One grid config, 1000 trials
node cli.mjs --trials 1000 --rows 30 --cols 30 --wallDensity 0.25 --seed 42

# Density sweep — runs the full benchmark once per density and adds a
# cross-density comparison (results/density-sweep-summary.md)
node cli.mjs --trials 1000 --rows 30 --cols 30 --densities 0.1,0.2,0.3,0.4,0.5 --seed 42
```

| Flag | Meaning | Default |
|---|---|---|
| `--trials` | test-cases per density | 1000 |
| `--rows`, `--cols` | grid size | 30, 30 |
| `--wallDensity` | fraction of cells that are walls (single-run mode) | 0.25 |
| `--densities` | comma-separated list of densities to sweep (overrides `--wallDensity`) | — |
| `--seed` | RNG seed — same seed always regenerates the same test grids | 42 |
| `--outDir` | where result files are written | `results` |

## File layout

```
cli.mjs                        # parses args, wires runner + report together — no logic of its own
src/
├── rng.mjs                    # seeded PRNG — reproducible test-case generation
├── grid.mjs                   # random wall/start/end generator (flat, algorithm-agnostic)
├── live-adapter.mjs           # imports state.js/makeNode from ../Path_Visualisation/js/, builds fresh node grids
├── algorithm-runner.mjs       # ONE generic runAlgorithm() adapter used for all 4 algorithms
├── stats.mjs                  # array of numbers -> {mean, median, min, max}
├── runner.mjs                 # imports bfs/dfs/dijkstra/bidirectionalBFS from ../../algorithms/index.js,
│                              # runs N trials through all 4 via runAlgorithm(), aggregates results
└── report.mjs                 # console/JSON/CSV/Markdown output — no computation
```

The repo root's [`algorithms/`](../algorithms/) folder — a sibling of
`Path_Visualisation/` and `benchmark/`, not nested inside either — is
the single copy of `bfs.js`/`dfs.js`/`dijkstra.js`/`bidirectional.js`.
`algorithm-runner.mjs`'s `runAlgorithm(algoFn, ...)` has exactly one
job regardless of which algorithm is passed in: rebuild a fresh grid,
call `algoFn`, and translate its `{visitedInOrder, path}` return shape
into `{explored, found, pathLen}` for the runner. No traversal logic,
and no per-algorithm wrapper file, lives in this folder at all.

## Performance notes (and an honest trade-off)

Running the app's actual code means giving up some of the speed tricks
a from-scratch reimplementation could use (typed-array "visited stamp"
buffers, reusable queues) — each algorithm file manages state through
mutable node objects the way the live visualizer does, so each run
needs a freshly built object grid rather than a reused typed array.
That's the deliberate cost of benchmarking the actual shipped logic
instead of an approximation of it.

In practice, 1000 trials × 4 algorithms on a 30×30 grid finishes in
roughly 3–4 seconds. `dijkstra()` is the dominant cost — it re-sorts
the *entire* unvisited-node array on every step (`unvisited.sort(...)`
in `algorithms/dijkstra.js`), which is O(n² log n) in the worst case
rather than the O(n log n) a binary-heap priority queue would give
you. That's a genuine property of the current implementation, not a
benchmark artifact — worth knowing if you ever profile the live app on
much larger grids.

## Output

Each run writes three files to `--outDir` (default `results/`):
- `benchmark-results.json` — full config + aggregate stats
- `benchmark-results.csv` — one row per trial, for spreadsheet analysis
- `benchmark-results.md` — ready-to-paste summary table for a README

A density sweep additionally writes `density-sweep-summary.{csv,md}`
comparing the bidirectional-BFS node reduction across all tested
densities.
