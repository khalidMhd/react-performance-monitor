import React, { ReactNode, useEffect, useRef } from 'react';
import { PerformanceMonitorProvider, usePerformanceMonitorContext } from './PerformanceMonitorContext';
import { PerformanceProvider, usePerformanceContext } from '../context/PerformanceContext';
import type { PerformanceMetric, PerformanceMonitorConfig } from '../types';

// Props for the combined provider
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
export const PerformanceMonitoringProvider: React.FC<CombinedProviderProps> = ({ 
  children, 
  config,
  enableTracking = true
}) => {
  const finalConfig = {
    enabled: enableTracking,
    logToConsole: false,
    includeWarnings: true,
    ...config
  };

  // IMPORTANT: The order of providers matters!
  // PerformanceProvider must be the outer provider because the bridge component
  // needs to access both contexts, and the PerformanceContext must be available first
  return (
    <PerformanceProvider>
      <PerformanceMonitorProvider config={finalConfig}>
        <PerformanceMonitorBridge>
          {children}
        </PerformanceMonitorBridge>
      </PerformanceMonitorProvider>
    </PerformanceProvider>
  );
};

/**
 * Bridge component that connects the two contexts by forwarding metrics
 * from PerformanceMonitorContext to PerformanceContext
 */
const PerformanceMonitorBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Access both contexts
  const performanceContext = usePerformanceContext();
  const monitorContext = usePerformanceMonitorContext();
  
  useEffect(() => {
    if (!performanceContext || !monitorContext) return;
    
    // Subscribe to metrics from PerformanceMonitorContext and forward them to PerformanceContext
    const unsubscribe = monitorContext.subscribe({
      onMetricUpdate: (metric: PerformanceMetric) => {
        performanceContext.updateMetrics(metric.componentName, {
          renderCount: metric.renderCount,
          mountTime: metric.mountTime,
          updateTimes: metric.updateTimes,
          lastRenderTime: metric.lastRenderTime,
          totalRenderTime: metric.totalRenderTime,
          unnecessaryRenders: metric.unnecessaryRenders
        });
      },
      onReset: () => {
        // Handle reset if needed
        performanceContext.resetMetrics();
      }
    });
    
    return unsubscribe;
  }, [performanceContext, monitorContext]);
  
  return <>{children}</>;
};

// Create a context-safe version of the HOC
const createSafeHOC = <P extends object>(
  Component: React.ComponentType<P>,
  displayName: string,
  trackingFunction: (props: P) => React.ReactElement
): React.FC<P> => {
  const SafeComponent: React.FC<P> = (props) => {
    try {
      return trackingFunction(props);
    } catch (error) {
      console.warn(`Performance tracking not available for ${displayName}: ${error}`);
      return <Component {...props} />;
    }
  };
  
  SafeComponent.displayName = `WithPerformanceTracking(${displayName})`;
  return SafeComponent;
};

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
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const TrackingComponent = (props: P) => {
    const { recordMetric, getConfig } = usePerformanceMonitorContext();
    const renderStartTime = useRef<number>(0);
    const isFirstRender = useRef(true);
    const renderCount = useRef(0);
    const totalRenderTime = useRef(0);
    const updateTimes = useRef<number[]>([]);
    const mountTime = useRef(0);
    const unnecessaryRenders = useRef(0);
    const prevProps = useRef<P | null>(null);
    const shouldTrack = useRef(true);
    
    // Check if tracking is enabled
    const config = getConfig();
    shouldTrack.current = config.enabled !== false && !config.excludeComponents?.includes(displayName);
    
    // Before render
    renderStartTime.current = performance.now();
    
    // Check if props have changed
    const hasPropsChanged = () => {
      if (!prevProps.current) return true;
      
      const prevEntries = Object.entries(prevProps.current);
      const currentEntries = Object.entries(props);
      
      if (prevEntries.length !== currentEntries.length) return true;
      
      for (const [key, value] of currentEntries) {
        if (prevProps.current[key as keyof P] !== value) return true;
      }
      
      return false;
    };
    
    // After render
    useEffect(() => {
      if (!shouldTrack.current) return;
      
      const renderTime = performance.now() - renderStartTime.current;
      renderCount.current += 1;
      totalRenderTime.current += renderTime;
      
      if (isFirstRender.current) {
        // First render (mount)
        mountTime.current = renderTime;
        isFirstRender.current = false;
      } else {
        // Update render
        updateTimes.current.push(renderTime);
        
        // Check if props changed
        const propsChanged = hasPropsChanged();
        if (!propsChanged) {
          unnecessaryRenders.current += 1;
        }
      }
      
      // Record the metric
      recordMetric({
        componentName: displayName,
        renderCount: renderCount.current,
        mountTime: mountTime.current,
        updateTimes: updateTimes.current,
        lastRenderTime: renderTime,
        totalRenderTime: totalRenderTime.current,
        unnecessaryRenders: unnecessaryRenders.current,
        timestamp: Date.now()
      });
      
      // Update prevProps for next comparison
      prevProps.current = { ...props };
    });
    
    return <Component {...props} />;
  };
  
  return createSafeHOC(Component, displayName, TrackingComponent);
}

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
export function useTrackPerformance(componentName: string): void {
  let contextAvailable = true;
  let recordMetric: ((metric: PerformanceMetric) => void) | null = null;
  let config: PerformanceMonitorConfig = { enabled: false };
  
  try {
    const context = usePerformanceMonitorContext();
    recordMetric = context.recordMetric;
    config = context.getConfig();
  } catch (error) {
    contextAvailable = false;
    console.warn(`Performance tracking not available for ${componentName}: ${error}`);
  }
  
  const renderStartTime = useRef<number>(performance.now());
  const isFirstRender = useRef(true);
  const renderCount = useRef(0);
  const totalRenderTime = useRef(0);
  const updateTimes = useRef<number[]>([]);
  const mountTime = useRef(0);
  const shouldTrack = useRef(contextAvailable);
  
  // Check if tracking is enabled
  shouldTrack.current = contextAvailable && 
    config.enabled !== false && 
    !config.excludeComponents?.includes(componentName);
  
  useEffect(() => {
    if (!shouldTrack.current || !recordMetric) return;
    
    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;
    totalRenderTime.current += renderTime;
    
    if (isFirstRender.current) {
      // First render (mount)
      mountTime.current = renderTime;
      isFirstRender.current = false;
    } else {
      // Update render
      updateTimes.current.push(renderTime);
    }
    
    // Record the metric
    recordMetric({
      componentName,
      renderCount: renderCount.current,
      mountTime: mountTime.current,
      updateTimes: updateTimes.current,
      lastRenderTime: renderTime,
      totalRenderTime: totalRenderTime.current,
      unnecessaryRenders: 0, // Can't detect unnecessary renders with a hook
      timestamp: Date.now()
    });
    
    // Reset the render start time for the next render
    renderStartTime.current = performance.now();
  });
} 