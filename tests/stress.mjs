/**
 * Stress test: run 1000 requests against handleRequest to ensure the worker
 * handles load without errors or obvious degradation.
 *
 * Run after build: npm run build && node tests/stress.mjs
 * Or: npm run test:stress
 */

/* global URLSearchParams, performance */

import { TextDecoder } from "util";
import { ENDPOINTS } from "../dist/endpoints.generated.js";
import { handleRequest } from "../dist/index.js";

global.TextDecoder = TextDecoder;

const TOTAL_REQUESTS = 10_000;
const CONCURRENCY = 50;
const BASE = "https://example.com";

const ENDPOINT_NAMES = Object.keys(ENDPOINTS).filter((k) => k !== "random");
const PATHS = ["", "help", "random", ...ENDPOINT_NAMES];
const FORMATS = ["json", "text"];
const MODES = [
  "normal",
  "chaos",
  "corporate",
  "security",
  "wholesome",
  "toxic",
  "sarcastic",
  "devops",
  undefined,
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildUrl() {
  const path = pick(PATHS);
  const format = pick(FORMATS);
  const mode = pick(MODES);
  const pathPart = path ? `/${path}` : "/";
  const params = new URLSearchParams();
  params.set("format", format);
  if (mode) params.set("mode", mode);
  return `${BASE}${pathPart}?${params.toString()}`;
}

async function runOneRequest() {
  const url = buildUrl();
  const req = new Request(url);
  const start = performance.now();
  const res = await handleRequest(req);
  const ms = performance.now() - start;
  const body = await res.text();
  return { status: res.status, ms, url, bodyLength: body.length };
}

async function runBatch(count) {
  const promises = Array.from({ length: count }, () => runOneRequest());
  return Promise.all(promises);
}

function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const i = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, i)];
}

async function main() {
  console.log(`Stress test: ${TOTAL_REQUESTS} requests (concurrency ${CONCURRENCY})\n`);

  const results = [];
  const startTotal = performance.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENCY) {
    const batchSize = Math.min(CONCURRENCY, TOTAL_REQUESTS - i);
    const batch = await runBatch(batchSize);
    results.push(...batch);
    if ((i + batchSize) % 2000 === 0 || i + batchSize === TOTAL_REQUESTS) {
      process.stdout.write(`  ${Math.min(i + batchSize, TOTAL_REQUESTS)} / ${TOTAL_REQUESTS}\r`);
    }
  }

  const totalMs = performance.now() - startTotal;

  const ok = results.filter((r) => r.status === 200).length;
  const notFound = results.filter((r) => r.status === 404).length;
  const other2xx = results.filter(
    (r) => r.status >= 200 && r.status < 300 && r.status !== 200
  ).length;
  const errors = results.filter((r) => r.status >= 500 || r.status === 0).length;
  const statusCounts = {};
  results.forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const latencies = results.map((r) => r.ms).sort((a, b) => a - b);
  const p50 = percentile(latencies, 50);
  const p95 = percentile(latencies, 95);
  const p99 = percentile(latencies, 99);

  console.log("\n--- Results ---\n");
  console.log(`Total requests:     ${TOTAL_REQUESTS}`);
  console.log(`Total time:         ${(totalMs / 1000).toFixed(2)}s`);
  console.log(`Throughput:         ${(TOTAL_REQUESTS / (totalMs / 1000)).toFixed(0)} req/s`);
  console.log(`Status codes:       ${JSON.stringify(statusCounts)}`);
  console.log(`200 OK:             ${ok}`);
  console.log(`404 Not Found:      ${notFound}`);
  console.log(`Other 2xx:          ${other2xx}`);
  console.log(`5xx / errors:       ${errors}`);
  console.log(
    `Latency (ms)  p50:  ${p50.toFixed(2)}  p95: ${p95.toFixed(2)}  p99: ${p99.toFixed(2)}`
  );

  if (errors > 0) {
    console.error("\nStress test FAILED: received 5xx or errors.");
    process.exit(1);
  }

  const expected = ok + notFound + other2xx;
  if (expected !== TOTAL_REQUESTS) {
    console.error("\nStress test FAILED: unexpected status mix.");
    process.exit(1);
  }

  console.log("\nStress test PASSED: 10,000 requests handled successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
