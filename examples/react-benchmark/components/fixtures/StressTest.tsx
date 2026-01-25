import React from 'react';

interface StressTestProps {
  loading?: boolean;
  nodeCount?: number;
  depth?: number;
}

/**
 * Stress test fixture - configurable nodes (default 500+), depth 10+
 * Tests upper bounds of shimmer performance
 */
export const StressTest: React.FC<StressTestProps> = ({ nodeCount = 100, depth = 6 }) => {
  const renderNestedLevel = (currentDepth: number, itemsPerLevel: number): React.ReactNode => {
    if (currentDepth >= depth) {
      // Leaf nodes
      return Array.from({ length: itemsPerLevel }, (_, i) => (
        <div
          key={i}
          style={{
            padding: 4,
            fontSize: 12,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            margin: 2,
          }}
        >
          Leaf {i + 1}
        </div>
      ));
    }

    // Calculate items per branch to hit target node count
    const branches = Math.ceil(Math.pow(nodeCount, 1 / depth));

    return Array.from({ length: branches }, (_, i) => (
      <div
        key={i}
        style={{
          padding: 8,
          marginLeft: currentDepth * 4,
          borderLeft: '2px solid #e0e0e0',
        }}
      >
        <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
          Level {currentDepth + 1} - Branch {i + 1}
        </div>
        {renderNestedLevel(currentDepth + 1, Math.ceil(branches / 2))}
      </div>
    ));
  };

  return (
    <div className="stress-container" style={{ padding: 16, maxHeight: 400, overflow: 'auto' }}>
      <div className="stress-header" style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Stress Test</h3>
        <div style={{ fontSize: 12, color: '#888' }}>
          Target: ~{nodeCount} nodes, depth {depth}
        </div>
      </div>
      <div className="stress-content">
        {renderNestedLevel(0, Math.ceil(Math.pow(nodeCount, 1 / depth)))}
      </div>
    </div>
  );
};

StressTest.displayName = 'StressTest';
