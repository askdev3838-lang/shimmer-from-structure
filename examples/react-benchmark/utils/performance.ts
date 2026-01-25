import { BenchmarkResult, BenchmarkConfig } from '../types';

/**
 * Measures render time using high-resolution performance API
 */
export function measureRenderTime(callback: () => void): number {
  const start = performance.now();
  callback();
  const end = performance.now();
  return end - start;
}

/**
 * Get current memory usage (Chrome only)
 */
// Non-standard Chrome memory API
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory {
  memory?: PerformanceMemory;
}

/**
 * Get current memory usage (Chrome only)
 */
export function getMemoryUsage(): number | undefined {
  const memory = (performance as unknown as PerformanceWithMemory).memory;
  if (memory) {
    return memory.usedJSHeapSize;
  }
  return undefined;
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values: number[], mean: number): number {
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calculate median
 */
function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Run a benchmark with multiple iterations
 */
export async function runBenchmark(
  name: string,
  domNodes: number,
  domDepth: number,
  renderFn: () => void,
  config: Partial<BenchmarkConfig> = {}
): Promise<BenchmarkResult> {
  const { iterations = 20, warmupIterations = 3 } = config;

  // Warmup runs (not counted)
  for (let i = 0; i < warmupIterations; i++) {
    renderFn();
    await new Promise((r) => setTimeout(r, 10));
  }

  // Force GC if available
  if ((window as unknown as { gc?: () => void }).gc) {
    (window as unknown as { gc?: () => void }).gc?.();
  }

  const memoryBefore = getMemoryUsage();
  const times: number[] = [];

  // Actual benchmark runs
  for (let i = 0; i < iterations; i++) {
    const time = measureRenderTime(renderFn);
    times.push(time);
    // Small delay to let browser settle
    await new Promise((r) => setTimeout(r, 5));
  }

  const memoryAfter = getMemoryUsage();

  const avgRenderTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minRenderTime = Math.min(...times);
  const maxRenderTime = Math.max(...times);
  const medianRenderTime = calculateMedian(times);
  const stdDev = calculateStdDev(times, avgRenderTime);

  return {
    name,
    domNodes,
    domDepth,
    iterations,
    times,
    avgRenderTime,
    minRenderTime,
    maxRenderTime,
    medianRenderTime,
    stdDev,
    memoryBefore,
    memoryAfter,
    memoryDelta: memoryBefore && memoryAfter ? memoryAfter - memoryBefore : undefined,
  };
}

/**
 * Format time in ms with appropriate precision
 */
export function formatTime(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(1)}µs`;
  }
  return `${ms.toFixed(2)}ms`;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Get performance grade based on render time
 */
export function getPerformanceGrade(
  avgMs: number,
  domNodes: number
): {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  color: string;
} {
  // Time per node threshold (microseconds)
  const timePerNode = (avgMs * 1000) / domNodes;

  if (timePerNode < 50) return { grade: 'A', color: '#22c55e' };
  if (timePerNode < 100) return { grade: 'B', color: '#84cc16' };
  if (timePerNode < 200) return { grade: 'C', color: '#eab308' };
  if (timePerNode < 500) return { grade: 'D', color: '#f97316' };
  return { grade: 'F', color: '#ef4444' };
}
