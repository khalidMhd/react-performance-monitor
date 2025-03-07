import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { 
  PerformanceContextValue, 
  PerformanceMetrics, 
  PerformanceConfig, 
  ComponentMetrics,
  ComponentMetricUpdates,
  MetricUpdate,
  ComponentMetricKey
} from '../types';

const defaultMetrics: PerformanceMetrics = {
  components: {},
  totalMounts: 0,
  totalUpdates: 0,
  totalRenderTime: 0,
  slowestComponent: null,
  unnecessaryRenderCount: 0,
};

const defaultConfig: PerformanceConfig = {
  enableLogging: true,
  renderWarningThreshold: 16, // ms
  mountWarningThreshold: 100, // ms
  unnecessaryRenderWarningThreshold: 5,
  excludeComponents: [],
  logLevel: 'warn',
};

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

function resolveUpdate<T>(update: MetricUpdate<T>, prevValue: T): T {
  if (typeof update === 'function') {
    return (update as (prev: T) => T)(prevValue);
  }
  return update;
}

type MetricValue<K extends ComponentMetricKey> = ComponentMetrics[K];
type MetricUpdateValue<K extends ComponentMetricKey> = MetricUpdate<MetricValue<K>>;

function resolveMetricUpdate<K extends ComponentMetricKey>(
  key: K,
  update: MetricUpdateValue<K>,
  currentValue: MetricValue<K>
): MetricValue<K> {
  return resolveUpdate(update, currentValue);
}

function findSlowestComponent(components: Record<string, ComponentMetrics>): string | null {
  return Object.entries(components).reduce((slowest, [name, metrics]) => {
    if (!slowest || metrics.totalRenderTime > components[slowest].totalRenderTime) {
      return name;
    }
    return slowest;
  }, null as string | null);
}

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(defaultMetrics);
  const [config, setConfigState] = useState<PerformanceConfig>(defaultConfig);

  const updateMetrics = useCallback((componentName: string, metricUpdate: ComponentMetricUpdates) => {
    setMetrics(prevMetrics => {
      // Get or create component metrics
      const componentMetrics = prevMetrics.components[componentName] || {
        componentName,
        renderCount: 0,
        mountTime: 0,
        updateTimes: [],
        lastRenderTime: 0,
        unnecessaryRenders: 0,
        totalRenderTime: 0,
      };

      // Create new metrics object with updates
      const updatedComponentMetrics = { ...componentMetrics };
      const updates = Object.entries(metricUpdate) as [ComponentMetricKey, MetricUpdateValue<any>][];

      // Apply all updates in a single pass
      for (const [key, update] of updates) {
        if (update !== undefined) {
          const currentValue = componentMetrics[key];
          (updatedComponentMetrics as any)[key] = resolveMetricUpdate(
            key,
            update as MetricUpdateValue<typeof key>,
            currentValue
          );
        }
      }

      // Create new components object
      const updatedComponents = {
        ...prevMetrics.components,
        [componentName]: updatedComponentMetrics,
      };

      // Find slowest component
      const slowestComponent = findSlowestComponent(updatedComponents);

      // Return new metrics state
      return {
        ...prevMetrics,
        components: updatedComponents,
        slowestComponent,
      };
    });
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics(defaultMetrics);
  }, []);

  const setConfig = useCallback((newConfig: Partial<PerformanceConfig>) => {
    setConfigState(prev => ({
      ...prev,
      ...newConfig,
    }));
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<PerformanceContextValue>(() => ({
    metrics,
    config,
    updateMetrics,
    resetMetrics,
    setConfig,
  }), [metrics, config, updateMetrics, resetMetrics, setConfig]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceContext = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  return context;
}; 