import React, { createContext, useContext, useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Add type declarations at the top of the file
declare global {
  interface Performance {
    memory?: {
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
      usedJSHeapSize: number;
    };
  }
}

interface PerformanceMetric {
  componentName: string;
  renderCount: number;
  mountTime: number;
  updateTimes: number[];
  lastRenderTime: number;
  totalRenderTime: number;
  unnecessaryRenders: number;
  timestamp: number;
  warnings?: string[];
  memoryUsage?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
  lifecycle: ComponentLifecycle;
  renderTree?: RenderTree;
}

interface NetworkMetric {
  url: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
}

// Add these types at the top of the file
type TimeRange = 'all' | '5min' | '10min' | '30min';

interface WarningThresholds {
  renderTime: number;
  unnecessaryRenders: number;
  memoryUsage?: number; // MB
}

interface ComponentThresholds {
  renderTime: number;
  unnecessaryRenders: number;
  memoryUsage?: number;
}

interface PerformanceMonitorConfig {
  enabled: boolean;
  logToConsole?: boolean;
  includeWarnings?: boolean;
  thresholds?: {
    maxRenderCount?: number;
    maxMountTime?: number;
    maxUnnecessaryRenders?: number;
    maxNetworkDuration?: number;
    maxMemoryUsage?: number; // MB
  };
  warningThresholds: WarningThresholds;
  componentThresholds?: {
    [componentName: string]: ComponentThresholds;
  };
}

interface PerformanceRecommendation {
  type: 'warning' | 'suggestion' | 'critical';
  message: string;
  component: string;
  timestamp: number;
}

interface PerformanceTrend {
  type: 'improvement' | 'degradation' | 'stable';
  metric: 'renderTime' | 'memoryUsage' | 'unnecessaryRenders';
  component: string;
  change: number;
  message: string;
  timestamp: number;
}

interface CoreWebVitals {
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  cls: number;  // Cumulative Layout Shift
  fid: number;  // First Input Delay
  timestamp: number;
}

interface LayoutShift extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

interface FirstInputDelay extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface PerformanceMonitorContextValue {
  metrics: PerformanceMetric[];
  networkMetrics: NetworkMetric[];
  coreWebVitals: CoreWebVitals[];
  recordMetric: (metric: PerformanceMetric) => void;
  recordNetworkMetric: (metric: NetworkMetric) => void;
  recordCoreWebVitals: (vitals: CoreWebVitals) => void;
  config: PerformanceMonitorConfig;
  recommendations: PerformanceRecommendation[];
  trends: PerformanceTrend[];
}

interface DashboardFilters {
  timeRange: 'all' | '5min' | '10min' | '30min';
  showWarnings: boolean;
  showMemory: boolean;
  showNetwork: boolean;
  componentFilter: string;
}

interface ComponentLifecycle {
  mountTime: number;
  updateTimes: number[];
  unmountTime?: number;
  parentComponent?: string;
  childComponents: string[];
  renderCount: number;
  lastRenderTime: number;
}

interface RenderTree {
  componentName: string;
  children: RenderTree[];
  renderCount: number;
  mountTime: number;
  lastRenderTime: number;
}

const PerformanceMonitorContext = createContext<PerformanceMonitorContextValue | null>(null);

export interface PerformanceMonitorProviderProps {
  children: React.ReactNode;
  config?: Partial<PerformanceMonitorConfig>;
}

export const PerformanceMonitorProvider: React.FC<PerformanceMonitorProviderProps> = ({
  children,
  config = {},
}) => {
  const configRef = useRef<PerformanceMonitorConfig>({
    enabled: true,
    logToConsole: true,
    includeWarnings: true,
    thresholds: {
      maxRenderCount: 100,
      maxMountTime: 100, // ms
      maxUnnecessaryRenders: 5,
      maxNetworkDuration: 1000, // ms
      maxMemoryUsage: 100, // MB
      ...config.thresholds
    },
    warningThresholds: {
      renderTime: 1000,
      unnecessaryRenders: 5
    },
    componentThresholds: {
      'HeavyComponent': {
        renderTime: 500,
        unnecessaryRenders: 3,
        memoryUsage: 50
      },
      'TestComponent': {
        renderTime: 200,
        unnecessaryRenders: 2
      },
      ...config.componentThresholds
    },
    ...config
  });

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetric[]>([]);
  const [coreWebVitals, setCoreWebVitals] = useState<CoreWebVitals[]>([]);
  const [recommendations, setRecommendations] = useState<PerformanceRecommendation[]>([]);
  const [trends, setTrends] = useState<PerformanceTrend[]>([]);

  // Memory monitoring
  useEffect(() => {
    if (!configRef.current.enabled) return;

    const checkMemory = () => {
      if (performance.memory) {
        const memoryUsage = {
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / (1024 * 1024), // Convert to MB
          totalJSHeapSize: performance.memory.totalJSHeapSize / (1024 * 1024),
          usedJSHeapSize: performance.memory.usedJSHeapSize / (1024 * 1024)
        };

        if (configRef.current.includeWarnings && 
            memoryUsage.usedJSHeapSize > (configRef.current.thresholds?.maxMemoryUsage || 100)) {
          console.warn(`[Memory Warning] High memory usage detected: ${memoryUsage.usedJSHeapSize.toFixed(2)}MB`);
        }

        setMetrics(prev => {
          if (prev.length > 0) {
            const lastMetric = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...lastMetric, memoryUsage }];
          }
          return prev;
        });
      }
    };

    const memoryInterval = setInterval(checkMemory, 5000); // Check every 5 seconds
    return () => clearInterval(memoryInterval);
  }, []);

  // Network monitoring
  useEffect(() => {
    if (!configRef.current.enabled) return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        const networkMetric: NetworkMetric = {
          url: args[0] instanceof Request ? args[0].url : String(args[0]),
          method: args[0] instanceof Request ? args[0].method : 'GET',
          duration,
          status: response.status,
          timestamp: Date.now()
        };

        setNetworkMetrics(prev => [...prev, networkMetric]);

        if (configRef.current.logToConsole) {
          console.log(`[Network Monitor] ${networkMetric.method} ${networkMetric.url}:`, networkMetric);
        }

        if (configRef.current.includeWarnings && duration > (configRef.current.thresholds?.maxNetworkDuration || 1000)) {
          console.warn(`[Network Warning] Slow request detected: ${duration}ms for ${networkMetric.url}`);
        }

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        console.error(`[Network Error] Request failed after ${duration}ms:`, error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const trackCoreWebVitals = useCallback(() => {
    if (!configRef.current.enabled) return;

    // Track First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcp = entries[entries.length - 1].startTime;
      
      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lcp = entries[entries.length - 1].startTime;
        
        // Track Cumulative Layout Shift (CLS)
        let cls = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShift = entry as LayoutShift;
            if (!layoutShift.hadRecentInput) {
              cls += layoutShift.value;
            }
          }
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstInput = entries[0] as FirstInputDelay;
          const fid = firstInput.processingStart - firstInput.startTime;

          // Record all Core Web Vitals
          const vitals: CoreWebVitals = {
            fcp,
            lcp,
            cls,
            fid,
            timestamp: Date.now()
          };

          setCoreWebVitals(prev => [...prev, vitals]);

          // Generate recommendations based on Core Web Vitals
          if (configRef.current.includeWarnings) {
            const recommendations: PerformanceRecommendation[] = [];
            
            if (fcp > 1800) { // Poor FCP threshold
              recommendations.push({
                type: 'warning',
                message: `Slow First Contentful Paint (${fcp.toFixed(2)}ms). Consider optimizing initial page load.`,
                component: 'Page',
                timestamp: Date.now()
              });
            }
            
            if (lcp > 2500) { // Poor LCP threshold
              recommendations.push({
                type: 'warning',
                message: `Slow Largest Contentful Paint (${lcp.toFixed(2)}ms). Optimize main content loading.`,
                component: 'Page',
                timestamp: Date.now()
              });
            }
            
            if (cls > 0.1) { // Poor CLS threshold
              recommendations.push({
                type: 'warning',
                message: `High Cumulative Layout Shift (${cls.toFixed(3)}). Fix layout stability issues.`,
                component: 'Page',
                timestamp: Date.now()
              });
            }
            
            if (fid > 100) { // Poor FID threshold
              recommendations.push({
                type: 'warning',
                message: `High First Input Delay (${fid.toFixed(2)}ms). Optimize main thread work.`,
                component: 'Page',
                timestamp: Date.now()
              });
            }

            setRecommendations(prev => [...prev, ...recommendations]);
          }

          // Cleanup observers
          fidObserver.disconnect();
          clsObserver.disconnect();
        });

        fidObserver.observe({ entryTypes: ['first-input'] });
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    });

    fcpObserver.observe({ entryTypes: ['paint'] });
  }, []);

  useEffect(() => {
    trackCoreWebVitals();
  }, [trackCoreWebVitals]);

  const generateRecommendations = useCallback((metric: PerformanceMetric) => {
    const newRecommendations: PerformanceRecommendation[] = [];
    const componentThresholds = configRef.current.componentThresholds?.[metric.componentName];
    const thresholds = componentThresholds || configRef.current.warningThresholds;

    // Check render time
    if (metric.lastRenderTime > thresholds.renderTime) {
      newRecommendations.push({
        type: 'warning',
        message: `High render time detected (${metric.lastRenderTime.toFixed(2)}ms). Consider optimizing component render logic or using React.memo().`,
        component: metric.componentName,
        timestamp: Date.now()
      });
    }

    // Check unnecessary renders
    if (metric.unnecessaryRenders > thresholds.unnecessaryRenders) {
      newRecommendations.push({
        type: 'suggestion',
        message: `Multiple unnecessary renders detected (${metric.unnecessaryRenders}). Consider using useMemo() or useCallback() for expensive computations.`,
        component: metric.componentName,
        timestamp: Date.now()
      });
    }

    // Check memory usage
    if (metric.memoryUsage && thresholds.memoryUsage && 
        metric.memoryUsage.usedJSHeapSize > thresholds.memoryUsage) {
      newRecommendations.push({
        type: 'critical',
        message: `High memory usage detected (${metric.memoryUsage.usedJSHeapSize.toFixed(2)}MB). Consider implementing virtualization for large lists.`,
        component: metric.componentName,
        timestamp: Date.now()
      });
    }

    setRecommendations(prev => [...prev, ...newRecommendations]);
  }, []);

  const analyzeTrends = useCallback((metric: PerformanceMetric) => {
    const newTrends: PerformanceTrend[] = [];
    const recentMetrics = metrics.slice(-5); // Look at last 5 metrics for same component
    if (recentMetrics.length < 2) return;

    // Analyze render time trend
    const renderTimeTrend = recentMetrics.map(m => m.lastRenderTime);
    const avgRenderTime = renderTimeTrend.reduce((a, b) => a + b, 0) / renderTimeTrend.length;
    const renderTimeChange = ((metric.lastRenderTime - avgRenderTime) / avgRenderTime) * 100;

    if (Math.abs(renderTimeChange) > 20) { // 20% change threshold
      newTrends.push({
        type: renderTimeChange > 0 ? 'degradation' : 'improvement',
        metric: 'renderTime',
        component: metric.componentName,
        change: renderTimeChange,
        message: `Render time ${renderTimeChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(renderTimeChange).toFixed(1)}%`,
        timestamp: Date.now()
      });
    }

    // Analyze unnecessary renders trend
    const unnecessaryRendersTrend = recentMetrics.map(m => m.unnecessaryRenders);
    const avgUnnecessaryRenders = unnecessaryRendersTrend.reduce((a, b) => a + b, 0) / unnecessaryRendersTrend.length;
    const unnecessaryRendersChange = ((metric.unnecessaryRenders - avgUnnecessaryRenders) / avgUnnecessaryRenders) * 100;

    if (Math.abs(unnecessaryRendersChange) > 20) {
      newTrends.push({
        type: unnecessaryRendersChange > 0 ? 'degradation' : 'improvement',
        metric: 'unnecessaryRenders',
        component: metric.componentName,
        change: unnecessaryRendersChange,
        message: `Unnecessary renders ${unnecessaryRendersChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(unnecessaryRendersChange).toFixed(1)}%`,
        timestamp: Date.now()
      });
    }

    // Analyze memory usage trend if available
    if (metric.memoryUsage && recentMetrics.some(m => m.memoryUsage)) {
      const memoryTrend = recentMetrics
        .filter(m => m.memoryUsage)
        .map(m => m.memoryUsage!.usedJSHeapSize);
      const avgMemory = memoryTrend.reduce((a, b) => a + b, 0) / memoryTrend.length;
      const memoryChange = ((metric.memoryUsage.usedJSHeapSize - avgMemory) / avgMemory) * 100;

      if (Math.abs(memoryChange) > 20) {
        newTrends.push({
          type: memoryChange > 0 ? 'degradation' : 'improvement',
          metric: 'memoryUsage',
          component: metric.componentName,
          change: memoryChange,
          message: `Memory usage ${memoryChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(memoryChange).toFixed(1)}%`,
          timestamp: Date.now()
        });
      }
    }

    setTrends(prev => [...prev, ...newTrends]);
  }, [metrics]);

  const recordMetric = useCallback((metric: PerformanceMetric) => {
    if (!configRef.current.enabled) return;

    const warnings: string[] = [];
    
    // Check thresholds
    if (configRef.current.includeWarnings) {
      if (metric.renderCount > (configRef.current.thresholds?.maxRenderCount || 100)) {
        warnings.push(`High render count: ${metric.renderCount}`);
      }
      if (metric.mountTime > (configRef.current.thresholds?.maxMountTime || 100)) {
        warnings.push(`Slow mount time: ${metric.mountTime}ms`);
      }
      if (metric.unnecessaryRenders > (configRef.current.thresholds?.maxUnnecessaryRenders || 5)) {
        warnings.push(`High unnecessary renders: ${metric.unnecessaryRenders}`);
      }
      if (metric.memoryUsage && 
          metric.memoryUsage.usedJSHeapSize > (configRef.current.thresholds?.maxMemoryUsage || 100)) {
        warnings.push(`High memory usage: ${metric.memoryUsage.usedJSHeapSize.toFixed(2)}MB`);
      }
    }

    const metricWithWarnings = {
      ...metric,
      warnings: warnings.length > 0 ? warnings : undefined
    };

    setMetrics(prev => [...prev, metricWithWarnings]);
    generateRecommendations(metricWithWarnings);
    analyzeTrends(metricWithWarnings);

    if (configRef.current.logToConsole) {
      console.log(`[Performance Monitor] ${metric.componentName}:`, metricWithWarnings);
      if (warnings.length > 0) {
        console.warn(`[Performance Warnings] ${metric.componentName}:`, warnings);
      }
    }
  }, [generateRecommendations, analyzeTrends]);

  const recordNetworkMetric = useCallback((metric: NetworkMetric) => {
    if (!configRef.current.enabled) return;

    setNetworkMetrics(prev => [...prev, metric]);
    if (configRef.current.logToConsole) {
      console.log('Network Metric:', metric);
    }
  }, []);

  const recordCoreWebVitals = useCallback((vitals: CoreWebVitals) => {
    if (!configRef.current.enabled) return;

    setCoreWebVitals(prev => [...prev, vitals]);
    if (configRef.current.logToConsole) {
      console.log('Core Web Vitals:', vitals);
    }
  }, []);

  const exportMetrics = useCallback(() => {
    const exportData = {
      metrics,
      networkMetrics,
      coreWebVitals,
      timestamp: new Date().toISOString(),
      config: configRef.current
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [metrics, networkMetrics, coreWebVitals]);

  const contextValue = {
    recordMetric,
    recordNetworkMetric,
    metrics,
    networkMetrics,
    coreWebVitals,
    recordCoreWebVitals,
    exportMetrics,
    config: configRef.current,
    recommendations,
    trends
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

export const PerformanceDashboard: React.FC = () => {
  const { metrics, networkMetrics, config, recommendations, trends, coreWebVitals } = usePerformanceMonitorContext();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [showWarnings, setShowWarnings] = useState(true);
  const [showMemory, setShowMemory] = useState(true);
  const [showNetwork, setShowNetwork] = useState(true);

  const buildRenderTree = useCallback((metrics: PerformanceMetric[]): RenderTree => {
    const componentMap = new Map<string, RenderTree>();
    
    metrics.forEach(metric => {
      componentMap.set(metric.componentName, {
        componentName: metric.componentName,
        children: [],
        renderCount: metric.renderCount,
        mountTime: metric.mountTime,
        lastRenderTime: metric.lastRenderTime
      });
    });
    
    metrics.forEach(metric => {
      const node = componentMap.get(metric.componentName);
      if (node && metric.lifecycle.parentComponent) {
        const parent = componentMap.get(metric.lifecycle.parentComponent);
        if (parent) {
          parent.children.push(node);
        }
      }
    });
    
    const rootComponent = metrics.find(m => !m.lifecycle.parentComponent)?.componentName;
    return rootComponent ? componentMap.get(rootComponent)! : { componentName: 'root', children: [], renderCount: 0, mountTime: 0, lastRenderTime: 0 };
  }, []);

  // Get unique component names
  const componentNames = useMemo(() => {
    const names = new Set(metrics.map(m => m.componentName));
    return Array.from(names);
  }, [metrics]);

  // Filter metrics based on time range and component
  const filteredMetrics = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      '5min': 5 * 60 * 1000,
      '10min': 10 * 60 * 1000,
      '30min': 30 * 60 * 1000
    };

    return metrics.filter(metric => {
      const timeFilter = timeRange === 'all' || 
        (now - metric.timestamp) <= timeRanges[timeRange];
      const componentFilter = selectedComponent === 'all' || 
        metric.componentName === selectedComponent;
      return timeFilter && componentFilter;
    });
  }, [metrics, timeRange, selectedComponent]);

  // Filter network metrics based on time range
  const filteredNetworkMetrics = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      '5min': 5 * 60 * 1000,
      '10min': 10 * 60 * 1000,
      '30min': 30 * 60 * 1000
    };

    return networkMetrics.filter(metric => 
      timeRange === 'all' || (now - metric.timestamp) <= timeRanges[timeRange]
    );
  }, [networkMetrics, timeRange]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!filteredMetrics.length) return null;

    const totalRenders = filteredMetrics.reduce((sum, m) => sum + m.renderCount, 0);
    const totalRenderTime = filteredMetrics.reduce((sum, m) => sum + m.totalRenderTime, 0);
    const maxRenderTime = Math.max(...filteredMetrics.map(m => m.lastRenderTime));
    const warnings = filteredMetrics.filter(m => 
      m.lastRenderTime > config.warningThresholds.renderTime ||
      m.unnecessaryRenders > config.warningThresholds.unnecessaryRenders
    );

    return {
      totalRenders,
      averageRenderTime: totalRenderTime / filteredMetrics.length,
      maxRenderTime,
      warnings: warnings.length
    };
  }, [filteredMetrics, config.warningThresholds]);

  // Prepare chart data
  const renderCountData = useMemo(() => ({
    labels: filteredMetrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Render Count',
      data: filteredMetrics.map(m => m.renderCount),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }), [filteredMetrics]);

  const renderTimeData = useMemo(() => ({
    labels: filteredMetrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Render Time (ms)',
      data: filteredMetrics.map(m => m.lastRenderTime),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }]
  }), [filteredMetrics]);

  const networkData = useMemo(() => ({
    labels: filteredNetworkMetrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Request Duration (ms)',
      data: filteredNetworkMetrics.map(m => m.duration),
      borderColor: 'rgb(54, 162, 235)',
      tension: 0.1
    }]
  }), [filteredNetworkMetrics]);

  const memoryData = useMemo(() => ({
    labels: filteredMetrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Memory Usage (MB)',
      data: filteredMetrics.map(m => m.memoryUsage?.usedJSHeapSize || 0),
      borderColor: 'rgb(153, 102, 255)',
      tension: 0.1
    }]
  }), [filteredMetrics]);

  // Filter recommendations based on time range and component
  const filteredRecommendations = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      '5min': 5 * 60 * 1000,
      '10min': 10 * 60 * 1000,
      '30min': 30 * 60 * 1000
    };

    return recommendations.filter(rec => {
      const timeFilter = timeRange === 'all' || 
        (now - rec.timestamp) <= timeRanges[timeRange];
      const componentFilter = selectedComponent === 'all' || 
        rec.component === selectedComponent;
      return timeFilter && componentFilter;
    });
  }, [recommendations, timeRange, selectedComponent]);

  // Filter trends based on time range and component
  const filteredTrends = useMemo(() => {
    const now = Date.now();
    const timeRanges = {
      '5min': 5 * 60 * 1000,
      '10min': 10 * 60 * 1000,
      '30min': 30 * 60 * 1000
    };

    return trends.filter(trend => {
      const timeFilter = timeRange === 'all' || 
        (now - trend.timestamp) <= timeRanges[timeRange];
      const componentFilter = selectedComponent === 'all' || 
        trend.component === selectedComponent;
      return timeFilter && componentFilter;
    });
  }, [trends, timeRange, selectedComponent]);

  // Add this inside the PerformanceDashboard component, after the existing chart data preparation
  const coreWebVitalsData = useMemo(() => ({
    labels: coreWebVitals.map(v => new Date(v.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'First Contentful Paint (ms)',
        data: coreWebVitals.map(v => v.fcp),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Largest Contentful Paint (ms)',
        data: coreWebVitals.map(v => v.lcp),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'First Input Delay (ms)',
        data: coreWebVitals.map(v => v.fid),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  }), [coreWebVitals]);

  const clsData = useMemo(() => ({
    labels: coreWebVitals.map(v => new Date(v.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Cumulative Layout Shift',
      data: coreWebVitals.map(v => v.cls),
      borderColor: 'rgb(153, 102, 255)',
      tension: 0.1
    }]
  }), [coreWebVitals]);

  // Add chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Metrics Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Add this component before the PerformanceDashboard component
  const RenderTreeVisualizer: React.FC<{ tree: RenderTree; level?: number }> = ({ tree, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    return (
      <div style={{ marginLeft: `${level * 20}px` }}>
        <div 
          className="render-tree-node"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
          <span className="component-name">{tree.componentName}</span>
          <span className="render-count">({tree.renderCount} renders)</span>
          <span className="render-time">{tree.lastRenderTime.toFixed(2)}ms</span>
        </div>
        {isExpanded && tree.children.map((child, index) => (
          <RenderTreeVisualizer key={index} tree={child} level={level + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="performance-dashboard">
      <div className="filters-container">
        <div className="filter-group">
          <label>Time Range:</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="all">All Time</option>
            <option value="5min">Last 5 Minutes</option>
            <option value="10min">Last 10 Minutes</option>
            <option value="30min">Last 30 Minutes</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Component:</label>
          <select 
            value={selectedComponent} 
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            <option value="all">All Components</option>
            {componentNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={showWarnings}
              onChange={(e) => setShowWarnings(e.target.checked)}
            />
            Show Warnings
          </label>
          <label>
            <input
              type="checkbox"
              checked={showMemory}
              onChange={(e) => setShowMemory(e.target.checked)}
            />
            Show Memory Usage
          </label>
          <label>
            <input
              type="checkbox"
              checked={showNetwork}
              onChange={(e) => setShowNetwork(e.target.checked)}
            />
            Show Network Requests
          </label>
        </div>
      </div>

      {summaryStats && (
        <div className="summary-stats">
          <div className="stat-card">
            <h3>Total Renders</h3>
            <p>{summaryStats.totalRenders}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Render Time</h3>
            <p>{summaryStats.averageRenderTime.toFixed(2)}ms</p>
          </div>
          <div className="stat-card">
            <h3>Max Render Time</h3>
            <p>{summaryStats.maxRenderTime.toFixed(2)}ms</p>
          </div>
          <div className="stat-card">
            <h3>Warnings</h3>
            <p>{summaryStats.warnings}</p>
          </div>
        </div>
      )}

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Render Count Over Time</h3>
          <Line data={renderCountData} options={chartOptions} />
        </div>

        <div className="chart-wrapper">
          <h3>Render Time Over Time</h3>
          <Line data={renderTimeData} options={chartOptions} />
        </div>

        {showNetwork && (
          <div className="chart-wrapper">
            <h3>Network Request Duration</h3>
            <Line data={networkData} options={chartOptions} />
          </div>
        )}

        {showMemory && (
          <div className="chart-wrapper">
            <h3>Memory Usage</h3>
            <Line data={memoryData} options={chartOptions} />
          </div>
        )}

        {coreWebVitals.length > 0 && (
          <>
            <div className="chart-wrapper">
              <h3>Core Web Vitals</h3>
              <Line data={coreWebVitalsData} options={chartOptions} />
            </div>
            <div className="chart-wrapper">
              <h3>Cumulative Layout Shift</h3>
              <Line data={clsData} options={chartOptions} />
            </div>
            <div className="core-web-vitals-summary">
              <h3>Core Web Vitals Summary</h3>
              <div className="vitals-grid">
                <div className="vital-card">
                  <h4>First Contentful Paint</h4>
                  <p className={coreWebVitals[coreWebVitals.length - 1].fcp > 1800 ? 'warning' : 'good'}>
                    {coreWebVitals[coreWebVitals.length - 1].fcp.toFixed(2)}ms
                  </p>
                  <small>{coreWebVitals[coreWebVitals.length - 1].fcp > 1800 ? 'Poor' : 'Good'}</small>
                </div>
                <div className="vital-card">
                  <h4>Largest Contentful Paint</h4>
                  <p className={coreWebVitals[coreWebVitals.length - 1].lcp > 2500 ? 'warning' : 'good'}>
                    {coreWebVitals[coreWebVitals.length - 1].lcp.toFixed(2)}ms
                  </p>
                  <small>{coreWebVitals[coreWebVitals.length - 1].lcp > 2500 ? 'Poor' : 'Good'}</small>
                </div>
                <div className="vital-card">
                  <h4>Cumulative Layout Shift</h4>
                  <p className={coreWebVitals[coreWebVitals.length - 1].cls > 0.1 ? 'warning' : 'good'}>
                    {coreWebVitals[coreWebVitals.length - 1].cls.toFixed(3)}
                  </p>
                  <small>{coreWebVitals[coreWebVitals.length - 1].cls > 0.1 ? 'Poor' : 'Good'}</small>
                </div>
                <div className="vital-card">
                  <h4>First Input Delay</h4>
                  <p className={coreWebVitals[coreWebVitals.length - 1].fid > 100 ? 'warning' : 'good'}>
                    {coreWebVitals[coreWebVitals.length - 1].fid.toFixed(2)}ms
                  </p>
                  <small>{coreWebVitals[coreWebVitals.length - 1].fid > 100 ? 'Poor' : 'Good'}</small>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showWarnings && filteredRecommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Performance Recommendations</h3>
          {filteredRecommendations.map((rec, index) => (
            <div key={index} className={`recommendation-item ${rec.type}`}>
              <p><strong>{rec.component}</strong></p>
              <p>{rec.message}</p>
              <small>{new Date(rec.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}

      {filteredTrends.length > 0 && (
        <div className="trends-section">
          <h3>Performance Trends</h3>
          {filteredTrends.map((trend, index) => (
            <div key={index} className={`trend-item ${trend.type}`}>
              <p><strong>{trend.component}</strong></p>
              <p>{trend.message}</p>
              <small>{new Date(trend.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}

      <button 
        className="export-button"
        onClick={() => {
          const data = {
            metrics: filteredMetrics,
            networkMetrics: filteredNetworkMetrics,
            summary: summaryStats
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'performance-metrics.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }}
      >
        Export Metrics
      </button>

      {filteredMetrics.length > 0 && (
        <div className="render-tree-section">
          <h3>Component Render Tree</h3>
          <div className="render-tree-container">
            <RenderTreeVisualizer tree={buildRenderTree(filteredMetrics)} />
          </div>
        </div>
      )}
    </div>
  );
}; 