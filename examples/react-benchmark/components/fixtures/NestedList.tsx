import React from 'react';

interface NestedListProps {
  loading?: boolean;
}

/**
 * Nested list fixture - ~50 DOM nodes, depth 5
 * Tests performance with moderate DOM complexity
 */
export const NestedList: React.FC<NestedListProps> = () => {
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    subtitle: `Subtitle for item ${i + 1}`,
  }));

  return (
    <div className="list-container" style={{ padding: 16 }}>
      <div className="list-header" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Nested List</h3>
        <span style={{ fontSize: 12, color: '#888' }}>10 items</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            <div className="item-content">
              <div style={{ fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{item.subtitle}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

NestedList.displayName = 'NestedList';
