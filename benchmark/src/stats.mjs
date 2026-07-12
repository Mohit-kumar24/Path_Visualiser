/**
 * Only job: turn an array of numbers into {n, mean, median, min, max}.
 * Used for nodes-explored, path-length, and per-run timing distributions.
 */
export function summarize(samples) {
  const n = samples.length;
  if (n === 0) return { n: 0, mean: 0, median: 0, min: 0, max: 0 };
  const sorted = [...samples].sort((a, b) => a - b);
  const mean = samples.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  return { n, mean, median, min: sorted[0], max: sorted[n - 1] };
}
