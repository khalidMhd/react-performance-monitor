# React Performance Monitor

A lightweight, easy-to-use performance monitoring library for React applications. Track render counts, mount times, update times, and identify unnecessary renders to optimize your React components.

## Features

- 📊 **Component Performance Metrics**: Track render counts, mount times, update times, and total render time
- 🔍 **Unnecessary Render Detection**: Identify components that re-render when props haven't changed
- 📈 **Performance Dashboard**: Visualize performance metrics with a built-in dashboard
- 🚦 **Threshold Warnings**: Set thresholds for render counts and render times to get warnings
- 🔄 **HOC & Hook API**: Use either Higher-Order Components or hooks based on your preference
- 🧩 **Context Bridge**: Seamlessly connects monitoring and visualization contexts
- 🛡️ **Error Handling**: Gracefully handles errors to prevent application crashes

## Installation

```bash
npm install react-perf-mon
# or
yarn add react-perf-mon
```

## Quick Start

### 1. Wrap your application with the PerformanceMonitoringProvider

```jsx
import { PerformanceMonitoringProvider, PerformanceDashboard } from 'react-perf-mon';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  
  return (
    <PerformanceMonitoringProvider
      config={{
        enabled: true,
        logToConsole: true,
        includeWarnings: true,
        thresholds: {
          maxRenderCount: 10,
          maxMountTime: 50, // ms
          maxUpdateTime: 25 // ms
        }
      }}
    >
      <div className="App">
        <button onClick={() => setShowDashboard(!showDashboard)}>
          {showDashboard ? 'Hide' : 'Show'} Dashboard
        </button>
        
        {/* Your application components */}
        <YourComponents />
        
        {/* Conditionally render the dashboard */}
        {showDashboard && <PerformanceDashboard />}
      </div>
    </PerformanceMonitoringProvider>
  );
}
```

### 2. Track component performance using HOC (Recommended)

```jsx
import { withPerformanceTracking } from 'react-perf-mon';

// Your component
const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

// Wrap with performance tracking
export default withPerformanceTracking(MyComponent, 'MyComponent');
```

### 3. Or track using hooks

```jsx
import { useTrackPerformance } from 'react-perf-mon';

const MyComponent = ({ name }) => {
  // Track this component's performance
  useTrackPerformance('MyComponent');
  
  return <div>Hello, {name}!</div>;
};

export default MyComponent;
```

## Configuration Options

The `PerformanceMonitoringProvider` accepts the following configuration options:

```typescript
interface PerformanceMonitorConfig {
  enabled?: boolean;              // Enable/disable tracking (default: true)
  logToConsole?: boolean;         // Log metrics to console (default: false)
  includeWarnings?: boolean;      // Enable threshold warnings (default: true)
  excludeComponents?: string[];   // Components to exclude from tracking
  thresholds?: {
    maxRenderCount?: number;      // Maximum acceptable render count
    maxMountTime?: number;        // Maximum acceptable mount time (ms)
    maxUpdateTime?: number;       // Maximum acceptable update time (ms)
  };
}
```

## Performance Dashboard

The `PerformanceDashboard` component provides a visual representation of your application's performance metrics. It shows:

- Total number of components being tracked
- Total render count across all components
- Total render time
- Unnecessary render count
- Detailed metrics for each component
- Identification of the slowest component

```jsx
import { PerformanceDashboard } from 'react-perf-mon';

// Render the dashboard anywhere within the PerformanceMonitoringProvider
<PerformanceDashboard />
```

## Advanced Usage

### Tracking Lazy-Loaded Components

```jsx
import { withPerformanceTracking } from 'react-perf-mon';
import React, { lazy, Suspense } from 'react';

// Create your component
const MyLazyComponentContent = () => {
  return <div>I'm lazy loaded!</div>;
};

// Wrap with performance tracking BEFORE lazy loading
const TrackedLazyComponent = withPerformanceTracking(MyLazyComponentContent, 'LazyComponent');

// Create lazy component
const LazyComponent = React.lazy(() => 
  import('./path/to/component').then(module => ({
    default: TrackedLazyComponent
  }))
);

// Use with Suspense
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Custom Metric Subscribers

You can subscribe to performance metrics directly using the `usePerformanceMonitorContext` hook:

```jsx
import { usePerformanceMonitorContext } from 'react-perf-mon';

const MetricLogger = () => {
  const { subscribe } = usePerformanceMonitorContext();
  
  useEffect(() => {
    const unsubscribe = subscribe({
      onMetricUpdate: (metric) => {
        // Do something with the metric
        console.log(`${metric.componentName} rendered in ${metric.lastRenderTime}ms`);
      },
      onWarning: (warning) => {
        // Handle warnings
        console.warn(`Warning: ${warning.componentName} ${warning.type} exceeded threshold`);
      },
      onReset: () => {
        // Handle metrics reset
        console.log('All metrics have been reset');
      }
    });
    
    return unsubscribe;
  }, [subscribe]);
  
  return null;
};
```

### Accessing Metrics Programmatically

You can access performance metrics directly using the `usePerformanceContext` hook:

```jsx
import { usePerformanceContext } from 'react-perf-mon';

const PerformanceAnalytics = () => {
  const { metrics } = usePerformanceContext();
  
  // Access metrics for a specific component
  const buttonMetrics = metrics.components['Button'];
  
  // Access the slowest component
  const slowestComponent = metrics.slowestComponent;
  
  // Do something with the metrics...
  
  return null;
};
```

## Troubleshooting

### Context Provider Order

If you encounter errors like `usePerformanceContext must be used within a PerformanceProvider`, ensure that your application is properly wrapped with the `PerformanceMonitoringProvider` component. The library handles the correct nesting of context providers internally.

### Performance Impact

The library is designed to have minimal impact on your application's performance. However, if you notice any performance issues, you can:

1. Disable tracking for specific components using the `excludeComponents` option
2. Disable the library entirely by setting `enabled: false` in the config
3. Only enable the library in development or testing environments

### Hook vs HOC

While both the hook (`useTrackPerformance`) and HOC (`withPerformanceTracking`) approaches are supported, the HOC approach is generally more reliable and recommended for most use cases. The HOC approach:

- Works better with class components
- Has better error handling
- Is less prone to issues with hook rules
- Provides more accurate unnecessary render detection

## Best Practices

1. **Use in Development**: Consider enabling the library only in development or testing environments to avoid any performance impact in production.

2. **Selective Tracking**: Only track components that you're interested in monitoring, rather than tracking every component in your application.

3. **Meaningful Component Names**: Provide meaningful names when using `withPerformanceTracking` or `useTrackPerformance` to make the dashboard more useful.

4. **Exclude Fast Components**: Use the `excludeComponents` option to exclude components that update very frequently and don't need monitoring.

5. **Adjust Thresholds**: Adjust the warning thresholds based on your application's performance requirements.

## Example Project

Check out the example project in the `example` directory to see the library in action. It demonstrates various performance scenarios and how to use the library to monitor them.

## License

MIT 