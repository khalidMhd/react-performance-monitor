import React, { useEffect, useRef } from 'react';
import { usePerformanceMonitorContext } from '../components/PerformanceMonitorContext';

/**
 * Higher-Order Component that wraps a component to track its performance metrics
 * @param Component The component to wrap
 * @param componentName Optional custom name for the component (defaults to Component.displayName or Component.name)
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const WrappedComponent: React.FC<P> = (props) => {
    const { recordMetric } = usePerformanceMonitorContext();
    const renderStartTime = useRef<number>(0);
    const isFirstRender = useRef(true);
    const renderCount = useRef(0);
    const totalRenderTime = useRef(0);
    const updateTimes = useRef<number[]>([]);
    const mountTime = useRef(0);
    const unnecessaryRenders = useRef(0);
    const prevProps = useRef<P | null>(null);
    
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
    
    // Set render start time before render
    renderStartTime.current = performance.now();
    
    // After render
    useEffect(() => {
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
      
      // Record the metric with the current total render time
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
  
  WrappedComponent.displayName = `WithPerformanceTracking(${displayName})`;
  
  return WrappedComponent;
}

export default withPerformanceTracking; 