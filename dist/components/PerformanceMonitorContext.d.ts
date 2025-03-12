import React from 'react';
import type { PerformanceMetric, PerformanceMonitorConfig, PerformanceSubscriber, NetworkMetrics, MemoryMetrics } from '../types';
interface PerformanceMonitorContextValue {
    recordMetric: (metric: PerformanceMetric) => void;
    subscribe: (subscriber: PerformanceSubscriber) => () => void;
    getConfig: () => PerformanceMonitorConfig;
    networkMetrics: NetworkMetrics;
    memoryMetrics: MemoryMetrics;
    updateNetworkMetrics: (metrics: NetworkMetrics) => void;
    updateMemoryMetrics: (metrics: MemoryMetrics) => void;
    getAllMetrics: () => Record<string, PerformanceMetric>;
    resetAllMetrics: () => void;
}
export interface PerformanceMonitorProviderProps {
    children: React.ReactNode;
    config?: PerformanceMonitorConfig;
}
export declare const PerformanceMonitorProvider: React.FC<PerformanceMonitorProviderProps>;
export declare const usePerformanceMonitorContext: () => PerformanceMonitorContextValue;
export {};
