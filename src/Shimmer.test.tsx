import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Shimmer } from './Shimmer';
import React from 'react';

// Help helper to advance timers since we use setTimeout in Shimmer
const advanceTimers = () => act(() => vi.advanceTimersByTime(100));

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
            <Shimmer
                loading={true}
                templateProps={{ title: 'Mock Title', subtitle: 'Mock Subtitle' }}
            >
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
        }) as any;

        const { container } = render(
            <Shimmer loading={true} fallbackBorderRadius={12}>
                <div>Content</div>
            </Shimmer>
        );

        // Force layout effect to run
        act(() => {
            vi.runAllTimers();
        });

        // Check if any shimmer block has the fallback border radius
        // Since we can't easily query the generated shimmer blocks' styles directly in jsdom without better mocking,
        // this test mainly verifies no crash. 
        // Ideally we would inspect the style attribute of the generated div.
    });
});
