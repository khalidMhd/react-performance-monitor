import { useEffect, useRef } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';

interface UsePerformanceMonitorOptions {
  componentName: string;
  dependencies?: unknown[];
}

export const usePerformanceMonitor = ({ componentName, dependencies = [] }: UsePerformanceMonitorOptions) => {
  const { updateMetrics, config } = usePerformanceContext();
  const renderStartTime = useRef<number>(0);
  const isFirstRender = useRef(true);
  const prevDependencies = useRef<unknown[]>([]);

  useEffect(() => {
    if (config.excludeComponents?.includes(componentName)) {
      return;
    }

    const renderTime = performance.now() - renderStartTime.current;

    if (isFirstRender.current) {
      // Handle mount
      updateMetrics(componentName, {
        mountTime: renderTime,
        renderCount: 1,
        lastRenderTime: renderTime,
        totalRenderTime: renderTime,
      });

      if (config.enableLogging && renderTime > (config.mountWarningThreshold || 100)) {
        console.warn(
          `[React Performance Monitor] Slow mount detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }

      isFirstRender.current = false;
    } else {
      // Handle update
      const hasChanged = dependencies.some(
        (dep, index) => !Object.is(dep, prevDependencies.current[index])
      );

      updateMetrics(componentName, {
        renderCount: (prev) => prev + 1,
        updateTimes: (prev) => [...prev, renderTime],
        lastRenderTime: renderTime,
        totalRenderTime: (prev) => prev + renderTime,
        unnecessaryRenders: (prev) => hasChanged ? prev : prev + 1,
      });

      if (config.enableLogging) {
        if (renderTime > (config.renderWarningThreshold || 16)) {
          console.warn(
            `[React Performance Monitor] Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
          );
        }

        if (!hasChanged) {
          console.warn(
            `[React Performance Monitor] Unnecessary render detected in ${componentName}`
          );
        }
      }
    }

    prevDependencies.current = dependencies;
  }, [componentName, dependencies, config, updateMetrics]);

  // Set render start time before each render
  renderStartTime.current = performance.now();

  return null;
};

export default usePerformanceMonitor; 