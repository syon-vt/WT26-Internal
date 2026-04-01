#!/usr/bin/env node
/**
 * simulate.js — 5-algorithm live side-by-side terminal comparison.
 * Algorithms: Euclidean | Manhattan | Chebyshev | Cosine | Pearson
 *
 * Usage:
 *   node scripts/stress-test.js
 *   node scripts/stress-test.js --count 50000
 */

import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: { count: { type: 'string', default: '1000' } },
  strict: false,
});
const TOTAL = parseInt(args.count, 10);
const BAR_WIDTH = 14;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const MAIN_DATA = [
  { id: 1, name: "Radhika", ans: [5, 1, 5, 5, 3, 1, 1, 4, 1, 1, 1, 1, 1, 1, 5, 1, 3, 1, 1, 1] },
  { id: 2, name: "Aditya Shukla", ans: [2, 5, 5, 5, 1, 3, 5, 5, 3, 1, 5, 5, 5, 5, 1, 3, 3, 1, 5, 1] },
  { id: 3, name: "Bhavya", ans: [4, 1, 4, 3, 5, 2, 1, 4, 1, 1, 2, 2, 4, 4, 5, 3, 4, 4, 4, 1] },
  { id: 4, name: "Reenu", ans: [4, 3, 4, 5, 1, 4, 3, 1, 1, 3, 1, 4, 5, 5, 5, 5, 3, 3, 2, 3] },
  { id: 5, name: "Aditya Acharya", ans: [3, 4, 2, 4, 2, 2, 3, 4, 4, 2, 5, 3, 5, 5, 4, 3, 3, 2, 4, 2] },
  { id: 6, name: "Sarah", ans: [4, 1, 5, 2, 3, 5, 3, 5, 1, 5, 2, 4, 4, 2, 5, 1, 3, 5, 3, 1] },
  { id: 7, name: "Rujin", ans: [3, 2, 4, 5, 3, 4, 1, 1, 3, 1, 3, 5, 5, 5, 5, 1, 4, 1, 2, 3] },
  { id: 8, name: "Nitin", ans: [4, 1, 5, 5, 5, 5, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 3, 1, 1, 1] },
  { id: 9, name: "Varshith", ans: [1, 1, 5, 1, 1, 1, 5, 1, 5, 5, 1, 5, 5, 5, 5, 5, 3, 5, 5, 1] },
];
const WEIGHTS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 1.5, 1.5, 1.5];
const N = MAIN_DATA[0].ans.length;
const NAMES = MAIN_DATA.map(d => d.name);

// ---------------------------------------------------------------------------
// Distance functions — all return a number where LOWER = better match
// ---------------------------------------------------------------------------

// 1. Euclidean — penalises big differences heavily (squaring)
function euclidean(a, b) {
  return Math.sqrt(a.reduce((s, v, i) => s + (WEIGHTS[i] ?? 1) * Math.pow(v - b[i], 2), 0));
}

// 2. Manhattan — linear, all differences equal weight
function manhattan(a, b) {
  return a.reduce((s, v, i) => s + (WEIGHTS[i] ?? 1) * Math.abs(v - b[i]), 0);
}

// 3. Chebyshev — only cares about your single WORST mismatch
function chebyshev(a, b) {
  return Math.max(...a.map((v, i) => Math.abs(v - b[i])));
}

// 4. Cosine distance — measures angle between vectors, ignores magnitude
// (good for finding "personality shape" regardless of overall rating level)
function cosine(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  const sim = dot / (magA * magB);
  return 1 - sim; // Convert similarity → distance
}

// 5. Pearson correlation distance — like Cosine but mean-centred first.
// Great for catching "same PATTERN, different overall scale" (e.g. a cautious
// answerer who rates 2–3 vs an expressive one who rates 4–5 for the same things)
function pearson(a, b) {
  const meanA = a.reduce((s, v) => s + v, 0) / N;
  const meanB = b.reduce((s, v) => s + v, 0) / N;
  const dA = a.map(v => v - meanA);
  const dB = b.map(v => v - meanB);
  const num = dA.reduce((s, v, i) => s + v * dB[i], 0);
  const denA = Math.sqrt(dA.reduce((s, v) => s + v * v, 0));
  const denB = Math.sqrt(dB.reduce((s, v) => s + v * v, 0));
  const denom = denA * denB;
  if (denom === 0) return 1; // No correlation possible → maximum distance
  return 1 - (num / denom); // Convert correlation → distance
}

// Generic best-match finder given a distance function
function bestMatch(resp, distFn) {
  return MAIN_DATA
    .map(item => ({ name: item.name, d: distFn(resp, item.ans) }))
    .sort((a, b) => a.d - b.d)[0].name;
}

// ---------------------------------------------------------------------------
// Algorithm config
// ---------------------------------------------------------------------------
const ALGOS = [
  { key: 'euclidean', label: 'Euclid', fn: euclidean, color: '\x1b[96m' }, // cyan
  { key: 'manhattan', label: 'Manhatt', fn: manhattan, color: '\x1b[35m' }, // magenta
  { key: 'chebyshev', label: 'Chebysh', fn: chebyshev, color: '\x1b[33m' }, // yellow
  { key: 'cosine', label: 'Cosine', fn: cosine, color: '\x1b[32m' }, // green
  { key: 'pearson', label: 'Pearson', fn: pearson, color: '\x1b[34m' }, // blue
];

// ---------------------------------------------------------------------------
// ANSI helpers
// ---------------------------------------------------------------------------
const clrScreen = '\x1b[2J\x1b[H';
const hideCursor = '\x1b[?25l';
const showCursor = '\x1b[?25h';
const rst = '\x1b[0m';
const bold = s => `\x1b[1m${s}${rst}`;
const dim = s => `\x1b[2m${s}${rst}`;
const green = s => `\x1b[32m${s}${rst}`;

function colorBar(count, maxCount, ansiColor) {
  const filled = Math.round((count / Math.max(maxCount, 1)) * BAR_WIDTH);
  return `${ansiColor}${'█'.repeat(filled)}${rst}${dim('░'.repeat(BAR_WIDTH - filled))}`;
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
function render(dists, done, total, elapsed) {
  const pct = ((done / total) * 100).toFixed(1);
  const rate = elapsed > 0 ? Math.round(done / elapsed) : 0;

  const maxCounts = {};
  for (const a of ALGOS) maxCounts[a.key] = Math.max(...NAMES.map(n => dists[a.key][n] || 0), 1);

  // Sort rows by Euclidean (stable reference)
  const sorted = [...NAMES].sort((a, b) => (dists.euclidean[b] || 0) - (dists.euclidean[a] || 0));

  const totalW = (BAR_WIDTH + 7) * ALGOS.length;
  const progFilled = Math.round((done / total) * totalW);
  const progressBar = `\x1b[32m${'█'.repeat(progFilled)}\x1b[90m${'░'.repeat(totalW - progFilled)}${rst}`;

  let out = clrScreen;
  out += `\n  ${bold('Algorithm Match Distribution')}\n`;
  out += `  ${dim(`${done.toLocaleString()} / ${total.toLocaleString()}  •  ${pct}%  •  ${rate.toLocaleString()}/s`)}\n`;
  out += `  ${progressBar}\n\n`;

  // Header row
  let header = `  ${'Name'.padEnd(18)}`;
  for (const a of ALGOS) {
    header += `  ${a.color}${bold(a.label.padEnd(BAR_WIDTH + 6))}`;
  }
  out += header + `${rst}\n`;
  out += `  ${'─'.repeat(18)}` + ALGOS.map(() => `  ${'─'.repeat(BAR_WIDTH + 6)}`).join('') + '\n';

  // Data rows
  for (const name of sorted) {
    let row = `  ${name.padEnd(18)}`;
    for (const a of ALGOS) {
      const count = dists[a.key][name] || 0;
      const pct = done > 0 ? ((count / done) * 100).toFixed(1) : '0.0';
      const bar = colorBar(count, maxCounts[a.key], a.color);
      row += `  ${bar} ${String(pct).padStart(5)}%`;
    }
    out += row + '\n';
  }

  const expected = done > 0 ? Math.round(done / MAIN_DATA.length) : 0;
  out += `\n  ${dim(`Expected even split: ~${expected} per person`)}\n`;

  if (done === total) {
    out += `\n  ${bold(green('✓ Complete!'))}  ${done.toLocaleString()} simulations in ${elapsed.toFixed(2)}s\n\n`;
    out += `  ${bold('Top match per algorithm:')}\n`;
    for (const a of ALGOS) {
      const top = [...NAMES].sort((x, y) => (dists[a.key][y] || 0) - (dists[a.key][x] || 0))[0];
      const cnt = dists[a.key][top];
      const pct = ((cnt / total) * 100).toFixed(1);
      out += `  ${a.color}${a.label.padEnd(8)}${rst}  ${top.padEnd(18)}  ${cnt} (${pct}%)\n`;
    }
    out += '\n';
  }

  process.stdout.write(out);
}

// ---------------------------------------------------------------------------
// Run — single pass, one final render
// ---------------------------------------------------------------------------
const dists = {};
for (const a of ALGOS) {
  dists[a.key] = {};
  for (const n of NAMES) dists[a.key][n] = 0;
}

console.log(`\nRunning ${TOTAL.toLocaleString()} simulations...`);
const start = Date.now();

for (let i = 0; i < TOTAL; i++) {
  const resp = Array.from({ length: N }, () => Math.ceil(Math.random() * 5));
  for (const a of ALGOS) {
    dists[a.key][bestMatch(resp, a.fn)]++;
  }
}

render(dists, TOTAL, TOTAL, (Date.now() - start) / 1000);
