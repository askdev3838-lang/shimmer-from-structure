export interface ElementInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  tag: string;
  borderRadius: string;
}

export interface ShimmerConfig {
  shimmerColor?: string;
  backgroundColor?: string;
  duration?: number;
  fallbackBorderRadius?: number;
}

export interface ShimmerContextValue {
  shimmerColor: string;
  backgroundColor: string;
  duration: number;
  fallbackBorderRadius: number;
}
