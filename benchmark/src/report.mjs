import { writeFileSync } from 'node:fs';
import { ALGOS } from './runner.mjs';

/**
 * Prints one benchmark run's results as a console table.
 * Only job: formatting for stdout. No computation happens here.
 */
export function printConsoleReport(run) {
  const { config, totalMs, summary, bidirectionalVsBfsReductionPct, solvedBothCount } = run;
  const { trials, rows, cols, wallDensity, seed } = config;

  console.log(`\nPathfinding Benchmark — ${trials} auto-generated trials on ${rows}x${cols} grids (wallDensity=${wallDensity}, seed=${seed})`);
  console.log(`Total run time: ${totalMs.toFixed(1)} ms  (${(totalMs / trials).toFixed(4)} ms / trial, all 4 algorithms combined)\n`);

  console.log('Algorithm      | Success% | Avg Nodes Explored | Median Nodes | Avg Path Len | Avg Time/Run (ms)');
  console.log('----------------|----------|---------------------|--------------|--------------|-------------------');
  for (const a of ALGOS) {
    const s = summary[a];
    console.log(
      `${a.padEnd(15)} | ${s.successRate.toFixed(1).padStart(7)}% | ${s.explored.mean.toFixed(1).padStart(19)} | ${s.explored.median.toFixed(1).padStart(12)} | ${s.pathLength.mean.toFixed(1).padStart(12)} | ${s.timeMsPerRun.mean.toFixed(4).padStart(17)}`
    );
  }

  console.log(`\nBidirectional BFS vs BFS — node-exploration reduction:`);
  console.log(`  Across all ${trials} trials (unsolved grids counted as-is): ${bidirectionalVsBfsReductionPct.allTrials.toFixed(2)}%`);
  console.log(`  Across the ${solvedBothCount} trials both algorithms actually solved: ${bidirectionalVsBfsReductionPct.solvedOnly.toFixed(2)}%`);
}

/** Writes one run's raw + aggregate data as JSON. */
export function writeJsonReport(run, filepath) {
  const { perTrialRows, ...rest } = run; // keep JSON summary-sized; CSV carries per-trial rows
  writeFileSync(filepath, JSON.stringify(rest, null, 2));
}

/** Writes one run's per-trial rows as CSV for spreadsheet analysis. */
export function writeCsvReport(run, filepath) {
  const rows = run.perTrialRows;
  if (rows.length === 0) return;
  const header = Object.keys(rows[0]).join(',');
  const body = rows.map(r => Object.values(r).join(',')).join('\n');
  writeFileSync(filepath, header + '\n' + body);
}

/** Writes one run's results as a ready-to-paste Markdown table. */
export function writeMarkdownReport(run, filepath) {
  const { config, summary, bidirectionalVsBfsReductionPct, solvedBothCount } = run;
  const { trials, rows, cols, wallDensity, seed } = config;

  const md = `## Benchmark Results (auto-generated)

Ran **${trials}** randomly generated grid test-cases (${rows}x${cols}, ${(wallDensity * 100).toFixed(0)}% wall density, seed=${seed}) through BFS, DFS, Dijkstra, and Bidirectional BFS.

| Algorithm | Success Rate | Avg Nodes Explored | Avg Path Length | Avg Time/Run |
|---|---|---|---|---|
${ALGOS.map(a => {
  const s = summary[a];
  return `| ${a} | ${s.successRate.toFixed(1)}% | ${s.explored.mean.toFixed(1)} | ${s.pathLength.mean.toFixed(1)} | ${s.timeMsPerRun.mean.toFixed(4)} ms |`;
}).join('\n')}

**Bidirectional BFS explored ${bidirectionalVsBfsReductionPct.solvedOnly.toFixed(1)}% fewer nodes than standard BFS**, averaged over the ${solvedBothCount} trials where both found a path.

_Reproduce with:_ \`node cli.mjs --trials ${trials} --rows ${rows} --cols ${cols} --wallDensity ${wallDensity} --seed ${seed}\`
`;
  writeFileSync(filepath, md);
}

/**
 * Prints + writes a cross-density comparison table when running a
 * density sweep (--densities 0.1,0.2,0.3,...). Only job: show how the
 * bidirectional-vs-BFS reduction and node counts shift as walls increase.
 */
export function reportDensitySweep(runs, outDir) {
  console.log(`\n\n=== Density Sweep Summary (${runs.length} densities) ===`);
  console.log('Density | BFS Avg Nodes | Bidir Avg Nodes | Bidir Reduction % | BFS Success%');
  console.log('--------|---------------|-----------------|--------------------|---------------');
  const rows = [];
  for (const run of runs) {
    const d = run.config.wallDensity;
    const bfsAvg = run.summary.bfs.explored.mean;
    const bidirAvg = run.summary.bidirectional.explored.mean;
    const reduction = run.bidirectionalVsBfsReductionPct.solvedOnly;
    const successRate = run.summary.bfs.successRate;
    console.log(`${d.toFixed(2).padStart(7)} | ${bfsAvg.toFixed(1).padStart(13)} | ${bidirAvg.toFixed(1).padStart(15)} | ${reduction.toFixed(2).padStart(18)}% | ${successRate.toFixed(1).padStart(12)}%`);
    rows.push({ wallDensity: d, bfsAvgNodes: bfsAvg, bidirAvgNodes: bidirAvg, reductionPct: reduction, bfsSuccessRate: successRate });
  }

  const csvHeader = Object.keys(rows[0]).join(',');
  const csvBody = rows.map(r => Object.values(r).join(',')).join('\n');
  writeFileSync(`${outDir}/density-sweep-summary.csv`, csvHeader + '\n' + csvBody);

  const md = `## Density Sweep Summary

| Wall Density | BFS Avg Nodes | Bidirectional Avg Nodes | Bidirectional Reduction % | BFS Success Rate |
|---|---|---|---|---|
${rows.map(r => `| ${r.wallDensity} | ${r.bfsAvgNodes.toFixed(1)} | ${r.bidirAvgNodes.toFixed(1)} | ${r.reductionPct.toFixed(2)}% | ${r.bfsSuccessRate.toFixed(1)}% |`).join('\n')}
`;
  writeFileSync(`${outDir}/density-sweep-summary.md`, md);

  console.log(`\nWrote density-sweep-summary.csv, density-sweep-summary.md`);
}
