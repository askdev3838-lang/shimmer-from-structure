import React from 'react';

interface SimpleCardProps {
  loading?: boolean;
}

/**
 * Simple card fixture - ~5 DOM nodes, depth 2
 * Baseline for minimum performance expectations
 */
export const SimpleCard: React.FC<SimpleCardProps> = () => {
  return (
    <div className="card" style={{ padding: 16, borderRadius: 8 }}>
      <div className="card-title" style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
        Card Title
      </div>
      <div className="card-description" style={{ fontSize: 14, color: '#666' }}>
        This is a simple card description text.
      </div>
      <button style={{ marginTop: 12, padding: '8px 16px' }}>Action</button>
    </div>
  );
};

SimpleCard.displayName = 'SimpleCard';
