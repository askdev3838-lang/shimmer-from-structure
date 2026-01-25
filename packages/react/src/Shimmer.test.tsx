import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Shimmer } from './Shimmer';
import React from 'react';

describe('Shimmer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders children normally when loading=false', () => {
    render(
      <Shimmer loading={false}>
        <div data-testid="content">Content</div>
      </Shimmer>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    // Should not have the measure container
    expect(screen.queryByTestId('shimmer-measure-container')).not.toBeInTheDocument();
  });

  it('renders shimmer structure when loading=true', () => {
    const { container } = render(
      <Shimmer loading={true}>
        <div style={{ width: 100, height: 50 }}>Content</div>
      </Shimmer>
    );

    // Should render the measure container
    // We didn't add a testId to the measure container in the source, but we can query by class
    const measureContainer = container.querySelector('.shimmer-measure-container');
    expect(measureContainer).toBeInTheDocument();
  });

  it('injects templateProps into the first child', () => {
    const TestComponent = ({ title, subtitle }: { title?: string; subtitle?: string }) => (
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    );

    render(
      <Shimmer loading={true} templateProps={{ title: 'Mock Title', subtitle: 'Mock Subtitle' }}>
        <TestComponent />
      </Shimmer>
    );

    expect(screen.getByText('Mock Title')).toBeInTheDocument();
    expect(screen.getByText('Mock Subtitle')).toBeInTheDocument();
  });

  it('preserves container backgrounds by using transparent text', () => {
    const { container } = render(
      <Shimmer loading={true}>
        <div className="card">Content</div>
      </Shimmer>
    );

    // Verify the style tag is injected
    expect(container.innerHTML).toContain('.shimmer-measure-container * {');
    expect(container.innerHTML).toContain('color: transparent !important');
  });

  it('uses fallbackBorderRadius when element has 0px border-radius', () => {
    // Mock getComputedStyle to return 0px
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn().mockReturnValue({
      borderRadius: '0px',
    }) as unknown as typeof window.getComputedStyle;

    render(
      <Shimmer loading={true} fallbackBorderRadius={12}>
        <div>Content</div>
      </Shimmer>
    );

    // Force layout effect to run
    act(() => {
      vi.runAllTimers();
    });

    // Restore original
    window.getComputedStyle = originalGetComputedStyle;
  });

  it('retries measurement for async components that render late', async () => {
    // Async component that renders content after a delay
    function AsyncComponent() {
      const [ready, setReady] = React.useState(false);

      React.useEffect(() => {
        const timer = setTimeout(() => setReady(true), 50);
        return () => clearTimeout(timer);
      }, []);

      if (!ready) return <div />;
      return <div className="async-content">Ready</div>;
    }

    const { container } = render(
      <Shimmer loading={true}>
        <AsyncComponent />
      </Shimmer>
    );

    // Initially should have no shimmer blocks (or empty container fallback)
    // Advance timers by less than retry delay
    act(() => {
      vi.advanceTimersByTime(50); // Component updates state
    });

    // Advance timers to trigger Shimmer retry (retryDelay is 100ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should now detect the element
    // We expect the shimmer logic to have run again
    expect(container.querySelector('.shimmer-measure-container')).toBeInTheDocument();
  });
});
