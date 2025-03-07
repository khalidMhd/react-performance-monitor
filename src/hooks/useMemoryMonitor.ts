import { useEffect, useRef } from 'react';
import { usePerformanceMonitorContext } from '../components/PerformanceMonitorContext';
import { MemoryMetrics } from '../types';

export const useMemoryMonitor = (componentName: string, interval = 5000) => {
  const { updateMemoryMetrics } = usePerformanceMonitorContext();
  const intervalRef = useRef<number>();

  useEffect(() => {
    // Check if performance.memory is available (Chrome only)
    if (!(performance as any).memory) {
      console.warn('Memory monitoring is only available in Chrome');
      return;
    }

    const trackMemory = () => {
      const memory = (performance as any).memory;
      const metrics: MemoryMetrics = {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize,
        timestamp: Date.now(),
      };

      updateMemoryMetrics(metrics);
    };

    // Take initial snapshot
    trackMemory();

    // Set up interval for tracking
    intervalRef.current = window.setInterval(trackMemory, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [componentName, interval, updateMemoryMetrics]);

  return {
    takeSnapshot: () => {
      if (!(performance as any).memory) {
        console.warn('Memory monitoring is only available in Chrome');
        return;
      }

      const memory = (performance as any).memory;
      return {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize,
        timestamp: Date.now(),
      };
    },
  };
}; 