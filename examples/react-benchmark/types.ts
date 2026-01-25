// Benchmark types for Shimmer performance testing

export interface BenchmarkResult {
  name: string;
  domNodes: number;
  domDepth: number;
  iterations: number;
  times: number[];
  avgRenderTime: number;
  minRenderTime: number;
  maxRenderTime: number;
  medianRenderTime: number;
  stdDev: number;
  memoryBefore?: number;
  memoryAfter?: number;
  memoryDelta?: number;
}

export interface BenchmarkConfig {
  name: string;
  iterations: number;
  warmupIterations: number;
}

export interface FixtureInfo {
  name: string;
  domNodes: number;
  domDepth: number;
  component: React.ComponentType<{ loading?: boolean }>;
}
