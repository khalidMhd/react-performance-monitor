import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import type {
  PerformanceMetric,
  PerformanceMonitorConfig,
  PerformanceSubscriber,
  PerformanceWarning,
  NetworkMetrics,
  MemoryMetrics
} from '../types';

interface PerformanceMonitorContextValue {
  recordMetric: (metric: PerformanceMetric) => void;
  subscribe: (subscriber: PerformanceSubscriber) => () => void;
  getConfig: () => PerformanceMonitorConfig;
  networkMetrics: NetworkMetrics;
  memoryMetrics: MemoryMetrics;
  updateNetworkMetrics: (metrics: NetworkMetrics) => void;
  updateMemoryMetrics: (metrics: MemoryMetrics) => void;
}

const initialNetworkMetrics: NetworkMetrics = {
  requests: []
};

const initialMemoryMetrics: MemoryMetrics = {
  jsHeapSizeLimit: 0,
  totalJSHeapSize: 0,
  usedJSHeapSize: 0,
  timestamp: Date.now()
};

const PerformanceMonitorContext = createContext<PerformanceMonitorContextValue | null>(null);

export interface PerformanceMonitorProviderProps {
  children: React.ReactNode;
  config?: PerformanceMonitorConfig;
}

export const PerformanceMonitorProvider: React.FC<PerformanceMonitorProviderProps> = ({
  children,
  config = {},
}) => {
  const subscribersRef = useRef<Set<PerformanceSubscriber>>(new Set());
  const configRef = useRef<PerformanceMonitorConfig>({
    enabled: true,
    logToConsole: true,
    includeWarnings: true,
    ...config
  });
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>(initialNetworkMetrics);
  const [memoryMetrics, setMemoryMetrics] = useState<MemoryMetrics>(initialMemoryMetrics);

  const emitWarning = useCallback((warning: PerformanceWarning) => {
    subscribersRef.current.forEach((subscriber) => {
      subscriber.onWarning?.(warning);
    });
  }, []);

  const recordMetric = useCallback((metric: PerformanceMetric) => {
    if (!configRef.current.enabled) return;

    // Check if component is excluded
    if (configRef.current.excludeComponents?.includes(metric.componentName)) {
      return;
    }

    // Notify subscribers
    subscribersRef.current.forEach((subscriber) => {
      subscriber.onMetricUpdate(metric);
    });

    // Check thresholds and emit warnings
    if (configRef.current.includeWarnings && configRef.current.thresholds) {
      const { thresholds } = configRef.current;
      
      if (thresholds.maxRenderCount && metric.renderCount > thresholds.maxRenderCount) {
        emitWarning({
          componentName: metric.componentName,
          type: 'render-count',
          value: metric.renderCount,
          threshold: thresholds.maxRenderCount,
          timestamp: Date.now(),
        });
      }

      if (thresholds.maxMountTime && metric.mountTime > thresholds.maxMountTime) {
        emitWarning({
          componentName: metric.componentName,
          type: 'mount-time',
          value: metric.mountTime,
          threshold: thresholds.maxMountTime,
          timestamp: Date.now(),
        });
      }
    }

    // Log to console if enabled
    if (configRef.current.logToConsole) {
      console.log(`[Performance Monitor] ${metric.componentName}:`, metric);
    }
  }, [emitWarning]);

  const subscribe = useCallback((subscriber: PerformanceSubscriber) => {
    subscribersRef.current.add(subscriber);
    return () => {
      subscribersRef.current.delete(subscriber);
    };
  }, []);

  const getConfig = useCallback(() => configRef.current, []);

  const updateNetworkMetrics = useCallback((metrics: NetworkMetrics) => {
    setNetworkMetrics(metrics);
  }, []);

  const updateMemoryMetrics = useCallback((metrics: MemoryMetrics) => {
    setMemoryMetrics(metrics);
  }, []);

  const contextValue = {
    recordMetric,
    subscribe,
    getConfig,
    networkMetrics,
    memoryMetrics,
    updateNetworkMetrics,
    updateMemoryMetrics
  };

  return (
    <PerformanceMonitorContext.Provider value={contextValue}>
      {children}
    </PerformanceMonitorContext.Provider>
  );
};

export const usePerformanceMonitorContext = () => {
  const context = useContext(PerformanceMonitorContext);
  if (!context) {
    throw new Error('usePerformanceMonitorContext must be used within a PerformanceMonitorProvider');
  }
  return context;
}; 