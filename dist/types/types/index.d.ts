export interface PerformanceMetric {
    componentName: string;
    renderCount: number;
    mountTime: number;
    updateTimes: number[];
    lastRenderTime: number;
    totalRenderTime: number;
    unnecessaryRenders: number;
    timestamp: number;
}
export interface PerformanceThresholds {
    maxRenderCount?: number;
    maxMountTime?: number;
    maxUpdateTime?: number;
}
export interface PerformanceWarning {
    componentName: string;
    type: 'render-count' | 'mount-time' | 'update-time';
    value: number;
    threshold: number;
    timestamp: number;
}
export interface PerformanceSubscriber {
    onMetricUpdate: (metric: PerformanceMetric) => void;
    onWarning?: (warning: PerformanceWarning) => void;
}
export interface PerformanceMonitorConfig {
    enabled?: boolean;
    logToConsole?: boolean;
    includeWarnings?: boolean;
    excludeComponents?: string[];
    thresholds?: PerformanceThresholds;
}
export interface UsePerformanceMonitorProps {
    componentName: string;
    dependencies?: any[];
}
export interface NetworkRequest {
    url: string;
    method: string;
    duration: number;
    status: number | 'error';
    timestamp: number;
    size?: number;
    error?: string;
}
export interface NetworkMetrics {
    requests: NetworkRequest[];
}
export interface MemoryMetrics {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    timestamp: number;
}
export interface ComponentMetrics {
    componentName: string;
    renderCount: number;
    mountTime: number;
    updateTimes: number[];
    lastRenderTime: number;
    unnecessaryRenders: number;
    totalRenderTime: number;
    networkRequests?: NetworkMetrics[];
    memorySnapshots?: MemoryMetrics[];
}
export type MetricUpdateFunction<T> = (prev: T) => T;
export type MetricUpdate<T> = T | MetricUpdateFunction<T>;
export type ComponentMetricKey = keyof Omit<ComponentMetrics, 'componentName'>;
export interface ComponentMetricUpdates {
    renderCount?: MetricUpdate<number>;
    mountTime?: MetricUpdate<number>;
    updateTimes?: MetricUpdate<number[]>;
    lastRenderTime?: MetricUpdate<number>;
    unnecessaryRenders?: MetricUpdate<number>;
    totalRenderTime?: MetricUpdate<number>;
    networkRequests?: MetricUpdate<NetworkMetrics[]>;
    memorySnapshots?: MetricUpdate<MemoryMetrics[]>;
}
export interface PerformanceMetrics {
    components: Record<string, ComponentMetrics>;
    totalMounts: number;
    totalUpdates: number;
    totalRenderTime: number;
    slowestComponent: string | null;
    unnecessaryRenderCount: number;
}
export interface PerformanceConfig {
    enableLogging?: boolean;
    renderWarningThreshold?: number;
    mountWarningThreshold?: number;
    unnecessaryRenderWarningThreshold?: number;
    excludeComponents?: string[];
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    enableNetworkMonitoring?: boolean;
    enableMemoryMonitoring?: boolean;
    memoryMonitoringInterval?: number;
}
export interface PerformanceContextValue {
    metrics: PerformanceMetrics;
    config: PerformanceConfig;
    updateMetrics: (componentName: string, metricUpdate: ComponentMetricUpdates) => void;
    resetMetrics: () => void;
    setConfig: (config: Partial<PerformanceConfig>) => void;
}
