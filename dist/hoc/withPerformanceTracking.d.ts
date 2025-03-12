import React from 'react';
/**
 * Higher-Order Component that wraps a component to track its performance metrics
 * @param Component The component to wrap
 * @param componentName Optional custom name for the component (defaults to Component.displayName or Component.name)
 */
export declare function withPerformanceTracking<P extends object>(Component: React.ComponentType<P>, componentName?: string): React.FC<P>;
export default withPerformanceTracking;
