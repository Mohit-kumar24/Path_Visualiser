import { performance } from 'node:perf_hooks';
import { mulberry32 } from './rng.mjs';
import { generateGrid } from './grid.mjs';
import { bfs, dfs, dijkstra, bidirectionalBFS } from '../../algorithms/index.js';
import { runAlgorithm } from './algorithm-runner.mjs';
import { summarize } from './stats.mjs';

const ALGOS = ['bfs', 'dfs', 'dijkstra', 'bidirectional'];

/**
 * Runs one full benchmark sweep (all `trials` test-cases, all 4
 * algorithms) for a single grid config, calling the app's own
 * bfs/dfs/dijkstra/bidirectionalBFS functions for every run, and returns per-trial rows plus
 * aggregated stats. Does not print or write anything — that's report.mjs's
 * job.
 *
 * Note: each algorithm wrapper rebuilds a fresh node grid before running
 * (see live-adapter.mjs), since the app's algorithms mutate node objects
 * in-place (visited/distance/previous). That means this can't reuse the
 * typed-array "visited stamp" trick a from-scratch reimplementation
 * could use — that optimization only works when the harness owns the
 * data layout, and here we're deliberately handing control to the
 * repo's own object-based state model instead. It's still fast enough
 * for 1000+ trials because rebuilding a small object grid (e.g. 900
 * nodes for a 30x30) is cheap relative to the traversal itself.
 */
export function runBenchmark({ trials, rows, cols, wallDensity, seed }) {
  const rng = mulberry32(seed);

  const results = { bfs: [], dfs: [], dijkstra: [], bidirectional: [] };
  const timings = { bfs: [], dfs: [], dijkstra: [], bidirectional: [] };
  const perTrialRows = [];

  const t0 = performance.now();
  for (let t = 1; t <= trials; t++) {
    const { walls, start, end } = generateGrid(rows, cols, wallDensity, rng);

    let tStart = performance.now();
    const bfsRes = runAlgorithm(bfs, rows, cols, walls, start, end);
    timings.bfs.push(performance.now() - tStart);

    tStart = performance.now();
    const dfsRes = runAlgorithm(dfs, rows, cols, walls, start, end);
    timings.dfs.push(performance.now() - tStart);

    tStart = performance.now();
    const dijRes = runAlgorithm(dijkstra, rows, cols, walls, start, end);
    timings.dijkstra.push(performance.now() - tStart);

    tStart = performance.now();
    const bidirRes = runAlgorithm(bidirectionalBFS, rows, cols, walls, start, end);
    timings.bidirectional.push(performance.now() - tStart);

    results.bfs.push(bfsRes);
    results.dfs.push(dfsRes);
    results.dijkstra.push(dijRes);
    results.bidirectional.push(bidirRes);

    perTrialRows.push({
      trial: t, rows, cols, wallDensity, start, end,
      bfs_explored: bfsRes.explored, bfs_found: bfsRes.found, bfs_pathLen: bfsRes.pathLen,
      dfs_explored: dfsRes.explored, dfs_found: dfsRes.found, dfs_pathLen: dfsRes.pathLen,
      dijkstra_explored: dijRes.explored, dijkstra_found: dijRes.found, dijkstra_pathLen: dijRes.pathLen,
      bidir_explored: bidirRes.explored, bidir_found: bidirRes.found, bidir_pathLen: bidirRes.pathLen,
    });
  }
  const totalMs = performance.now() - t0;

  const summary = {};
  for (const a of ALGOS) {
    const foundCount = results[a].filter(r => r.found).length;
    summary[a] = {
      successRate: (foundCount / trials) * 100,
      explored: summarize(results[a].map(r => r.explored)),
      pathLength: summarize(results[a].filter(r => r.found).map(r => r.pathLen)),
      timeMsPerRun: summarize(timings[a]),
    };
  }

  const bothFound = perTrialRows.filter(r => r.bfs_found && r.bidir_found);
  const avgBFS = summary.bfs.explored.mean;
  const avgBidir = summary.bidirectional.explored.mean;
  const reductionAll = ((avgBFS - avgBidir) / avgBFS) * 100;

  const bfsSolved = bothFound.map(r => r.bfs_explored);
  const bidirSolved = bothFound.map(r => r.bidir_explored);
  const avgBFSSolved = bfsSolved.reduce((a, b) => a + b, 0) / (bfsSolved.length || 1);
  const avgBidirSolved = bidirSolved.reduce((a, b) => a + b, 0) / (bidirSolved.length || 1);
  const reductionSolved = ((avgBFSSolved - avgBidirSolved) / avgBFSSolved) * 100;

  return {
    config: { trials, rows, cols, wallDensity, seed },
    totalMs,
    perTrialRows,
    summary,
    bidirectionalVsBfsReductionPct: { allTrials: reductionAll, solvedOnly: reductionSolved },
    solvedBothCount: bothFound.length,
  };
}

export { ALGOS };
