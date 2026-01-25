import { InjectionKey, provide, computed } from 'vue';
import type { ShimmerConfig, ShimmerContextValue } from '@shimmer-from-structure/core';
import { shimmerDefaults } from '@shimmer-from-structure/core';

export const shimmerConfigKey: InjectionKey<ShimmerContextValue> = Symbol('shimmerConfig');

/**
 * Provide shimmer configuration to child components.
 * Use this in a parent component to set global shimmer defaults.
 *
 * @example
 * ```vue
 * <script setup>
 * import { provideShimmerConfig } from '@shimmer-from-structure/vue';
 *
 * provideShimmerConfig({
 *   shimmerColor: 'rgba(56, 189, 248, 0.4)',
 *   duration: 2.5
 * });
 * </script>
 *
 * <template>
 *   <router-view />
 * </template>
 * ```
 */
export function provideShimmerConfig(config: ShimmerConfig = {}) {
  const mergedConfig = computed<ShimmerContextValue>(() => ({
    shimmerColor: config.shimmerColor ?? shimmerDefaults.shimmerColor,
    backgroundColor: config.backgroundColor ?? shimmerDefaults.backgroundColor,
    duration: config.duration ?? shimmerDefaults.duration,
    fallbackBorderRadius: config.fallbackBorderRadius ?? shimmerDefaults.fallbackBorderRadius,
  }));

  provide(shimmerConfigKey, mergedConfig.value);
}

export { shimmerDefaults };
