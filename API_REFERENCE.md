# React Performance Monitor API Reference

This document provides a detailed reference for all components, hooks, and functions available in the React Performance Monitor library.

## Components

### PerformanceMonitoringProvider

The main provider component that enables performance monitoring in your application.

```jsx
import { PerformanceMonitoringProvider } from 'react-perf-mon';

<PerformanceMonitoringProvider
  config={{
    enabled: true,
    logToConsole: false,
    includeWarnings: true,
    excludeComponents: [],
    thresholds: {
      maxRenderCount: 10,
      maxMountTime: 50,
      maxUpdateTime: 25
    }
  }}
>
  {children}
</PerformanceMonitoringProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `PerformanceMonitorConfig` | See below | Configuration options for the performance monitor |
| `children` | `ReactNode` | Required | Child components to be monitored |

#### PerformanceMonitorConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable or disable performance monitoring |
| `logToConsole` | `boolean` | `false` | Log performance metrics to the console |
| `includeWarnings` | `boolean` | `true` | Enable threshold warnings |
| `excludeComponents` | `string[]` | `[]` | Array of component names to exclude from monitoring |
| `thresholds.maxRenderCount` | `number` | `10` | Maximum acceptable render count before warning |
| `thresholds.maxMountTime` | `number` | `50` | Maximum acceptable mount time in milliseconds |
| `thresholds.maxUpdateTime` | `number` | `25` | Maximum acceptable update time in milliseconds |

### PerformanceDashboard

A component that displays performance metrics in a visual dashboard.

```jsx
import { PerformanceDashboard } from 'react-perf-mon';

<PerformanceDashboard
  position="bottom-right"
  style={{ /* custom styles */ }}
  initiallyExpanded={false}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Position of the dashboard on the screen |
| `style` | `React.CSSProperties` | `{}` | Custom styles for the dashboard container |
| `initiallyExpanded` | `boolean` | `false` | Whether the dashboard should be initially expanded |

### DebugMode

A component that displays performance metrics in a simplified debug view.

```jsx
import { DebugMode } from 'react-perf-mon';

<DebugMode />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `React.CSSProperties` | `{}` | Custom styles for the debug mode container |

### SuspenseMonitor

A component that monitors and displays Suspense-related performance metrics.

```jsx
import { SuspenseMonitor } from 'react-perf-mon';

<SuspenseMonitor />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `React.CSSProperties` | `{}` | Custom styles for the suspense monitor container |

## Higher-Order Components (HOCs)

### withPerformanceTracking

A HOC that wraps a component to track its performance.

```jsx
import { withPerformanceTracking } from 'react-perf-mon';

const MyTrackedComponent = withPerformanceTracking(MyComponent, 'MyComponent');
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `Component` | `React.ComponentType<P>` | The component to track |
| `componentName` | `string` | A unique name for the component (used in metrics) |
| `options` | `TrackingOptions` (optional) | Additional tracking options |

#### TrackingOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `trackMounts` | `boolean` | `true` | Track component mount performance |
| `trackUpdates` | `boolean` | `true` | Track component update performance |
| `trackUnmounts` | `boolean` | `true` | Track component unmount performance |

#### Returns

A new component with performance tracking applied.

## Hooks

### useTrackPerformance

A hook that tracks the performance of a functional component.

```jsx
import { useTrackPerformance } from 'react-perf-mon';

function MyComponent() {
  useTrackPerformance('MyComponent');
  // Component logic
}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `componentName` | `string` | A unique name for the component (used in metrics) |
| `options` | `TrackingOptions` (optional) | Additional tracking options |

### usePerformanceContext

A hook that provides access to the performance metrics and actions.

```jsx
import { usePerformanceContext } from 'react-perf-mon';

function MyComponent() {
  const { metrics, resetMetrics } = usePerformanceContext();
  // Use metrics or reset action
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `metrics` | `PerformanceMetrics` | Current performance metrics |
| `resetMetrics` | `() => void` | Function to reset all metrics |
| `updateMetrics` | `(metric: PerformanceMetric) => void` | Function to update metrics |

### usePerformanceMonitorContext

A hook that provides access to the performance monitor context.

```jsx
import { usePerformanceMonitorContext } from 'react-perf-mon';

function MyComponent() {
  const { config, subscribe } = usePerformanceMonitorContext();
  // Use config or subscribe to metrics
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `config` | `PerformanceMonitorConfig` | Current configuration |
| `subscribe` | `(subscriber: MetricSubscriber) => () => void` | Function to subscribe to metric updates |
| `isEnabled` | `boolean` | Whether monitoring is enabled |

## Types

### PerformanceMetric

Represents a single performance metric for a component.

```typescript
interface PerformanceMetric {
  componentName: string;
  mountTime?: number;
  updateTime?: number;
  unmountTime?: number;
  renderCount: number;
  lastRenderTime: number;
  totalRenderTime: number;
  averageRenderTime: number;
  timestamp: number;
}
```

### PerformanceMetrics

A collection of performance metrics for all tracked components.

```typescript
interface PerformanceMetrics {
  components: Record<string, PerformanceMetric>;
  slowestComponent?: string;
  mostRenderedComponent?: string;
}
```

### PerformanceWarning

Represents a warning when a component exceeds performance thresholds.

```typescript
interface PerformanceWarning {
  componentName: string;
  type: 'render' | 'mount' | 'update';
  value: number;
  threshold: number;
  timestamp: number;
}
```

### MetricSubscriber

Interface for subscribing to performance metric updates.

```typescript
interface MetricSubscriber {
  onMetricUpdate?: (metric: PerformanceMetric) => void;
  onWarning?: (warning: PerformanceWarning) => void;
  onReset?: () => void;
}
```

## Examples

### Basic Usage

```jsx
import React from 'react';
import { 
  PerformanceMonitoringProvider, 
  PerformanceDashboard,
  withPerformanceTracking 
} from 'react-perf-mon';

// Component to track
const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

// Wrap with performance tracking
const TrackedComponent = withPerformanceTracking(MyComponent, 'MyComponent');

// App with monitoring
function App() {
  return (
    <PerformanceMonitoringProvider>
      <div>
        <TrackedComponent name="World" />
        <PerformanceDashboard />
      </div>
    </PerformanceMonitoringProvider>
  );
}
```

### Custom Subscriber

```jsx
import React, { useEffect } from 'react';
import { usePerformanceMonitorContext } from 'react-perf-mon';

function MetricsLogger() {
  const { subscribe } = usePerformanceMonitorContext();
  
  useEffect(() => {
    // Subscribe to metrics
    const unsubscribe = subscribe({
      onMetricUpdate: (metric) => {
        console.log(`Component ${metric.componentName} rendered in ${metric.lastRenderTime}ms`);
      },
      onWarning: (warning) => {
        console.warn(`Warning: ${warning.componentName} ${warning.type} exceeded threshold`);
      },
      onReset: () => {
        console.log('All metrics have been reset');
      }
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, [subscribe]);
  
  return null;
}
```

### Accessing Metrics Programmatically

```jsx
import React from 'react';
import { usePerformanceContext } from 'react-perf-mon';

function PerformanceReport() {
  const { metrics, resetMetrics } = usePerformanceContext();
  
  const handleExport = () => {
    // Export metrics to JSON
    const json = JSON.stringify(metrics, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-metrics.json';
    a.click();
    
    // Cleanup
    URL.revokeObjectURL(url);
  };
  
  return (
    <div>
      <h2>Performance Report</h2>
      <button onClick={handleExport}>Export Metrics</button>
      <button onClick={resetMetrics}>Reset Metrics</button>
      
      <h3>Slowest Component</h3>
      {metrics.slowestComponent && (
        <p>{metrics.slowestComponent}: {metrics.components[metrics.slowestComponent].averageRenderTime.toFixed(2)}ms</p>
      )}
      
      <h3>Most Rendered Component</h3>
      {metrics.mostRenderedComponent && (
        <p>{metrics.mostRenderedComponent}: {metrics.components[metrics.mostRenderedComponent].renderCount} renders</p>
      )}
    </div>
  );
} 