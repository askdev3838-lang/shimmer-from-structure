/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import type { ShimmerConfig, ShimmerContextValue } from '@shimmer-from-structure/core';
import { shimmerDefaults } from '@shimmer-from-structure/core';

const ShimmerContext = createContext<ShimmerContextValue>(shimmerDefaults);

export interface ShimmerProviderProps {
  /** Shimmer configuration to apply to all child Shimmer components */
  config?: ShimmerConfig;
  children: ReactNode;
}

/**
 * Provider component for global shimmer configuration.
 * Wrap your app or a section of your component tree to apply default shimmer settings.
 *
 * @example
 * ```tsx
 * <ShimmerProvider config={{ shimmerColor: '#fff', duration: 2 }}>
 *   <App />
 * </ShimmerProvider>
 * ```
 */
export const ShimmerProvider: React.FC<ShimmerProviderProps> = ({ config = {}, children }) => {
  const mergedConfig: ShimmerContextValue = useMemo(
    () => ({
      shimmerColor: config.shimmerColor ?? shimmerDefaults.shimmerColor,
      backgroundColor: config.backgroundColor ?? shimmerDefaults.backgroundColor,
      duration: config.duration ?? shimmerDefaults.duration,
      fallbackBorderRadius: config.fallbackBorderRadius ?? shimmerDefaults.fallbackBorderRadius,
    }),
    [config.shimmerColor, config.backgroundColor, config.duration, config.fallbackBorderRadius]
  );

  return <ShimmerContext.Provider value={mergedConfig}>{children}</ShimmerContext.Provider>;
};

/**
 * Hook to access the current shimmer configuration from context.
 * Returns default values if no ShimmerProvider is present.
 * All returned values are guaranteed to be defined.
 */
export const useShimmerConfig = (): ShimmerContextValue => {
  return useContext(ShimmerContext);
};

// Re-export defaults for testing and reference
export { shimmerDefaults };
