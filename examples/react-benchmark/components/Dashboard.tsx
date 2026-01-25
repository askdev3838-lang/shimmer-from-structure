import React, { useState, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from 'recharts';
import { Shimmer } from 'shimmer-from-structure';
import { BenchmarkResult, FixtureInfo } from '../types';
import { runBenchmark, formatTime, getPerformanceGrade } from '../utils/performance';
import { SimpleCard, NestedList, ComplexGrid, StressTest } from './fixtures';

// Define test fixtures
const fixtures: FixtureInfo[] = [
  { name: 'SimpleCard', domNodes: 5, domDepth: 2, component: SimpleCard },
  { name: 'NestedList', domNodes: 50, domDepth: 5, component: NestedList },
  { name: 'ComplexGrid', domNodes: 200, domDepth: 4, component: ComplexGrid },
  { name: 'StressTest', domNodes: 500, domDepth: 10, component: StressTest },
];

// Dashboard Component
const Dashboard: React.FC = () => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [iterations, setIterations] = useState(20);
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const runAllBenchmarks = useCallback(async () => {
    if (!renderContainerRef.current) return;

    setIsRunning(true);
    setResults([]);
    const newResults: BenchmarkResult[] = [];

    for (const fixture of fixtures) {
      setCurrentTest(fixture.name);

      const Fixture = fixture.component;

      const result = await runBenchmark(
        fixture.name,
        fixture.domNodes,
        fixture.domDepth,
        () => {
          const container = renderContainerRef.current!;
          const root = createRoot(container);
          root.render(
            <Shimmer loading={true}>
              <Fixture />
            </Shimmer>
          );
          root.unmount();
        },
        { iterations }
      );

      newResults.push(result);
      setResults([...newResults]);
    }

    setIsRunning(false);
    setCurrentTest(null);
  }, [iterations]);

  const chartData = results.map((r) => ({
    name: r.name,
    avg: parseFloat(r.avgRenderTime.toFixed(2)),
    min: parseFloat(r.minRenderTime.toFixed(2)),
    max: parseFloat(r.maxRenderTime.toFixed(2)),
    nodes: r.domNodes,
  }));

  const scatterData = results.map((r) => ({
    nodes: r.domNodes,
    time: r.avgRenderTime,
    name: r.name,
  }));

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          ⚡ Shimmer Performance Benchmarks
        </h1>
        <p style={{ margin: '8px 0 0', color: '#666', fontSize: 14 }}>
          Measure render time, memory usage, and scalability characteristics
        </p>
      </header>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Iterations:</span>
          <input
            type="number"
            value={iterations}
            onChange={(e) => setIterations(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: 60, padding: '4px 8px', borderRadius: 4, border: '1px solid #ddd' }}
            min={1}
            max={100}
          />
        </label>
        <button
          onClick={runAllBenchmarks}
          disabled={isRunning}
          style={{
            padding: '10px 24px',
            backgroundColor: isRunning ? '#ccc' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          {isRunning ? `Running: ${currentTest}...` : 'Run All Benchmarks'}
        </button>
        {results.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 14, color: '#666' }}>
            {results.length} / {fixtures.length} completed
          </span>
        )}
      </div>

      {/* Hidden render container for benchmarks */}
      <div
        ref={renderContainerRef}
        style={{ position: 'absolute', left: -9999, top: -9999, visibility: 'hidden' }}
      />

      {/* Results Table */}
      {results.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>📊 Results Summary</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  Fixture
                </th>
                <th style={{ padding: 12, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                  DOM Nodes
                </th>
                <th style={{ padding: 12, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                  Avg Time
                </th>
                <th style={{ padding: 12, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                  Min / Max
                </th>
                <th style={{ padding: 12, textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>
                  Std Dev
                </th>
                <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => {
                const grade = getPerformanceGrade(result.avgRenderTime, result.domNodes);
                return (
                  <tr
                    key={result.name}
                    style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f8fafc' }}
                  >
                    <td style={{ padding: 12, borderBottom: '1px solid #e2e8f0', fontWeight: 500 }}>
                      {result.name}
                    </td>
                    <td
                      style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}
                    >
                      {result.domNodes}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: 'right',
                        borderBottom: '1px solid #e2e8f0',
                        fontWeight: 600,
                      }}
                    >
                      {formatTime(result.avgRenderTime)}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: 'right',
                        borderBottom: '1px solid #e2e8f0',
                        color: '#666',
                      }}
                    >
                      {formatTime(result.minRenderTime)} / {formatTime(result.maxRenderTime)}
                    </td>
                    <td
                      style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}
                    >
                      ±{formatTime(result.stdDev)}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: 'center',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: 32,
                          height: 32,
                          lineHeight: '32px',
                          borderRadius: '50%',
                          backgroundColor: grade.color,
                          color: 'white',
                          fontWeight: 700,
                        }}
                      >
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts */}
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Bar Chart */}
          <div
            style={{
              padding: 16,
              backgroundColor: 'white',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Render Time by Fixture</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value) => (value != null ? [`${Number(value).toFixed(2)}ms`] : ['-'])}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend />
                <Bar dataKey="avg" fill="#2563eb" name="Avg" />
                <Bar dataKey="min" fill="#22c55e" name="Min" />
                <Bar dataKey="max" fill="#f97316" name="Max" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Chart - Scalability */}
          <div
            style={{
              padding: 16,
              backgroundColor: 'white',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Scalability (Nodes vs Time)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nodes" name="DOM Nodes" fontSize={12} />
                <YAxis dataKey="time" name="Time (ms)" fontSize={12} />
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === 'number'
                      ? name === 'time'
                        ? `${value.toFixed(2)}ms`
                        : value
                      : '-',
                    name === 'time' ? 'Render Time' : 'DOM Nodes',
                  ]}
                />
                <Scatter data={scatterData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Individual Run Distribution */}
      {results.length > 0 && (
        <div
          style={{
            padding: 16,
            backgroundColor: 'white',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Individual Run Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="iteration"
                type="number"
                domain={[1, iterations]}
                label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }}
                fontSize={12}
              />
              <YAxis fontSize={12} label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value) => (value != null ? [`${Number(value).toFixed(2)}ms`] : ['-'])}
              />
              <Legend />
              {results.map((result, idx) => {
                const colors = ['#2563eb', '#22c55e', '#f97316', '#8b5cf6'];
                const data = result.times.map((time: number, i: number) => ({
                  iteration: i + 1,
                  [result.name]: time,
                }));
                return (
                  <Line
                    key={result.name}
                    data={data}
                    type="monotone"
                    dataKey={result.name}
                    stroke={colors[idx % colors.length]}
                    dot={false}
                    name={result.name}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: '1px solid #e2e8f0',
          color: '#666',
          fontSize: 12,
        }}
      >
        <p>
          <strong>Note:</strong> Results may vary based on system load, browser, and hardware. Run
          benchmarks multiple times for accurate measurements.
        </p>
        <p>
          Memory measurements require Chrome with <code>--enable-precise-memory-info</code> flag.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
