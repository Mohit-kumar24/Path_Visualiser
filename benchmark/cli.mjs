#!/usr/bin/env node
/**
 * CLI entry point. Only job: parse args, call the runner once per
 * density, and hand results to the report module. No algorithm logic
 * and no formatting logic lives in this file — see src/ for that.
 *
 * Single density:
 *   node cli.mjs --trials 1000 --rows 30 --cols 30 --wallDensity 0.25 --seed 42
 *
 * Density sweep (comma-separated list) — runs the full 1000-trial
 * benchmark once per density and adds a cross-density comparison:
 *   node cli.mjs --trials 1000 --rows 30 --cols 30 --densities 0.1,0.2,0.3,0.4,0.5 --seed 42
 */
import { mkdirSync } from 'node:fs';
import { runBenchmark } from './src/runner.mjs';
import {
  printConsoleReport,
  writeJsonReport,
  writeCsvReport,
  writeMarkdownReport,
  reportDensitySweep,
} from './src/report.mjs';

function parseArgs(argv) {
  const out = { trials: 1000, rows: 30, cols: 30, wallDensity: 0.25, densities: null, seed: 42, outDir: 'results' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (key === 'densities') { out.densities = val.split(',').map(Number); i++; continue; }
    if (key === 'outDir') { out.outDir = val; i++; continue; }
    if (['trials', 'rows', 'cols', 'seed'].includes(key)) { out[key] = parseInt(val, 10); i++; continue; }
    if (key === 'wallDensity') { out.wallDensity = parseFloat(val); i++; continue; }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  mkdirSync(args.outDir, { recursive: true });

  const densities = args.densities ?? [args.wallDensity];
  const runs = [];

  for (const wallDensity of densities) {
    const run = runBenchmark({ trials: args.trials, rows: args.rows, cols: args.cols, wallDensity, seed: args.seed });
    printConsoleReport(run);

    const tag = densities.length > 1 ? `-density${wallDensity}` : '';
    writeJsonReport(run, `${args.outDir}/benchmark-results${tag}.json`);
    writeCsvReport(run, `${args.outDir}/benchmark-results${tag}.csv`);
    writeMarkdownReport(run, `${args.outDir}/benchmark-results${tag}.md`);
    runs.push(run);
  }

  console.log(`\nWrote per-density benchmark-results.{json,csv,md} to ./${args.outDir}/`);

  if (densities.length > 1) {
    reportDensitySweep(runs, args.outDir);
  }
}

main();
