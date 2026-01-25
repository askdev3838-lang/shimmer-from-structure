import { inject } from 'vue';
import { shimmerConfigKey, shimmerDefaults } from '../shimmerConfig';
import type { ShimmerContextValue } from '@shimmer-from-structure/core';

/**
 * Composable to access the current shimmer configuration from context.
 * Returns default values if no configuration has been provided.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useShimmerConfig } from '@shimmer-from-structure/vue';
 *
 * const config = useShimmerConfig();
 * console.log(config.shimmerColor); // Current shimmer color
 * </script>
 * ```
 */
export function useShimmerConfig(): ShimmerContextValue {
  const config = inject(shimmerConfigKey, shimmerDefaults);
  return config;
}
