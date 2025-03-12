import React, { ReactNode } from 'react';
import type { PerformanceMonitorConfig } from '../types';
interface CombinedProviderProps {
    children: ReactNode;
    config?: PerformanceMonitorConfig;
    /**
     * Whether to automatically track all components that use the useTrackPerformance hook
     * @default true
     */
    enableTracking?: boolean;
}
/**
 * A combined provider that connects both PerformanceMonitorProvider and PerformanceProvider
 * This allows the PerformanceDashboard to work with metrics collected by PerformanceMonitorProvider
 *
 * @example
 * ```jsx
 * <PerformanceMonitoringProvider config={{ enabled: true, logToConsole: true }}>
 *   <App />
 *   {showDashboard && <PerformanceDashboard />}
 * </PerformanceMonitoringProvider>
 * ```
 */
export declare const PerformanceMonitoringProvider: React.FC<CombinedProviderProps>;
/**
 * Higher-Order Component that wraps a component to track its performance metrics
 *
 * @example
 * ```jsx
 * const MyTrackedComponent = withPerformanceTracking(MyComponent, 'MyComponent');
 * ```
 *
 * @param Component The component to wrap
 * @param componentName Optional custom name for the component (defaults to Component.displayName or Component.name)
 */
export declare function withPerformanceTracking<P extends object>(Component: React.ComponentType<P>, componentName?: string): React.FC<P>;
/**
 * Hook to use performance tracking in a functional component
 *
 * @example
 * ```jsx
 * const MyComponent = () => {
 *   useTrackPerformance('MyComponent');
 *   return <div>Hello World</div>;
 * };
 * ```
 *
 * @param componentName The name of the component
 */
export declare function useTrackPerformance(componentName: string): void;
export {};
