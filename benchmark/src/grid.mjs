/**
 * Grid generation.
 * Only job: build random test-case grids (walls + start + end) as a
 * flat, algorithm-agnostic representation. What consumes this (the
 * app's own algorithms, loaded via live-adapter.mjs) decides how to
 * turn it into whatever shape it needs — this file doesn't know about
 * node objects, neighbor lookups, or any particular algorithm's data
 * model.
 */

/**
 * Generates one random grid test-case.
 * @returns {{walls: Uint8Array, start: number, end: number}} start/end
 * are flat row-major indices (r * cols + c).
 */
export function generateGrid(rows, cols, wallDensity, rng) {
  const size = rows * cols;
  const walls = new Uint8Array(size);
  for (let i = 0; i < size; i++) walls[i] = rng() < wallDensity ? 1 : 0;

  const randCell = () => (rng() * size) | 0;
  let start = randCell();
  let end = randCell();
  walls[start] = 0;
  walls[end] = 0;
  let guard = 0;
  while (end === start && guard++ < 50) {
    end = randCell();
    walls[end] = 0;
  }
  return { walls, start, end };
}
