import React from 'react';

interface ComplexGridProps {
  loading?: boolean;
}

/**
 * Complex grid fixture - ~200 DOM nodes, depth 4
 * Tests grid layouts with many leaf elements
 */
export const ComplexGrid: React.FC<ComplexGridProps> = () => {
  const [cards] = React.useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      title: `Product ${i + 1}`,
      price: `$${(Math.random() * 100).toFixed(2)}`,
      rating: (3 + Math.random() * 2).toFixed(1),
    }))
  );

  return (
    <div className="grid-container" style={{ padding: 16 }}>
      <div className="grid-header" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Product Grid</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '4px 12px' }}>Filter</button>
          <button style={{ padding: '4px 12px' }}>Sort</button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ddd',
            }}
          >
            <div
              className="product-image"
              style={{
                height: 80,
                backgroundColor: '#f0f0f0',
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div style={{ fontWeight: 500 }}>{card.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontWeight: 600 }}>{card.price}</span>
              <span style={{ fontSize: 12, color: '#888' }}>★ {card.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ComplexGrid.displayName = 'ComplexGrid';
