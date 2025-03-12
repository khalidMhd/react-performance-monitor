# React Performance Monitor Integration Guide

This guide will help you integrate the React Performance Monitor library into your React application. Follow these steps to set up performance monitoring and visualization for your components.

## Installation

First, install the library using npm or yarn:

```bash
npm install react-perf-mon
# or
yarn add react-perf-mon
```

## Step-by-Step Integration

### Step 1: Wrap your application with the PerformanceMonitoringProvider

The `PerformanceMonitoringProvider` is the main component that enables performance monitoring in your application. It should wrap your entire application or the parts you want to monitor.

```jsx
import React from 'react';
import { PerformanceMonitoringProvider } from 'react-perf-mon';

function App() {
  return (
    <PerformanceMonitoringProvider
      config={{
        enabled: true,
        logToConsole: false,
        includeWarnings: true,
        thresholds: {
          maxRenderCount: 10,
          maxMountTime: 50, // ms
          maxUpdateTime: 25 // ms
        }
      }}
    >
      {/* Your application components */}
      <YourApp />
    </PerformanceMonitoringProvider>
  );
}

export default App;
```

### Step 2: Add the Performance Dashboard

The `PerformanceDashboard` component displays the performance metrics collected by the library. You can place it anywhere within the `PerformanceMonitoringProvider`.

```jsx
import React, { useState } from 'react';
import { PerformanceMonitoringProvider, PerformanceDashboard } from 'react-perf-mon';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  
  return (
    <PerformanceMonitoringProvider config={...}>
      <div>
        <button onClick={() => setShowDashboard(!showDashboard)}>
          {showDashboard ? 'Hide' : 'Show'} Dashboard
        </button>
        
        {/* Your application components */}
        <YourApp />
        
        {/* Conditionally render the dashboard */}
        {showDashboard && <PerformanceDashboard />}
      </div>
    </PerformanceMonitoringProvider>
  );
}
```

### Step 3: Track Component Performance

You can track component performance using either the Higher-Order Component (HOC) approach or the hook approach.

#### Using the HOC approach (Recommended):

```jsx
import React from 'react';
import { withPerformanceTracking } from 'react-perf-mon';

// Your component
const MyComponent = (props) => {
  return <div>Hello, {props.name}!</div>;
};

// Wrap with performance tracking
export default withPerformanceTracking(MyComponent, 'MyComponent');
```

#### Using the hook approach:

```jsx
import React from 'react';
import { useTrackPerformance } from 'react-perf-mon';

const MyComponent = (props) => {
  // Track this component's performance
  useTrackPerformance('MyComponent');
  
  return <div>Hello, {props.name}!</div>;
};

export default MyComponent;
```

## Advanced Integration

### Tracking Lazy-Loaded Components

To track lazy-loaded components, you need to wrap the component with `withPerformanceTracking` before it's lazy-loaded:

```jsx
import React, { lazy, Suspense } from 'react';
import { withPerformanceTracking } from 'react-perf-mon';

// Create your component
const MyLazyComponentContent = () => {
  return <div>I'm lazy loaded!</div>;
};

// Wrap with performance tracking BEFORE lazy loading
const TrackedLazyComponent = withPerformanceTracking(MyLazyComponentContent, 'LazyComponent');

// Create lazy component
const LazyComponent = React.lazy(() => 
  new Promise(resolve => 
    setTimeout(() => 
      resolve({ default: TrackedLazyComponent }),
      1000
    )
  )
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

### Tracking Class Components

The HOC approach works well with class components:

```jsx
import React, { Component } from 'react';
import { withPerformanceTracking } from 'react-perf-mon';

class MyClassComponent extends Component {
  render() {
    return <div>Hello, {this.props.name}!</div>;
  }
}

// Wrap with performance tracking
export default withPerformanceTracking(MyClassComponent, 'MyClassComponent');
```

### Custom Configuration

The `PerformanceMonitoringProvider` accepts a configuration object with the following options:

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

Example with custom configuration:

```jsx
<PerformanceMonitoringProvider
  config={{
    enabled: process.env.NODE_ENV === 'development', // Only enable in development
    logToConsole: true,
    includeWarnings: true,
    excludeComponents: ['VeryFrequentlyUpdatingComponent'], // Exclude specific components
    thresholds: {
      maxRenderCount: 5,
      maxMountTime: 30, // ms
      maxUpdateTime: 10 // ms
    }
  }}
>
  {/* Your application */}
</PerformanceMonitoringProvider>
```

### Accessing Performance Metrics Programmatically

You can access performance metrics programmatically using the `usePerformanceContext` hook:

```jsx
import React, { useEffect } from 'react';
import { usePerformanceContext } from 'react-perf-mon';

const PerformanceLogger = () => {
  const { metrics } = usePerformanceContext();
  
  useEffect(() => {
    // Log metrics to an analytics service
    if (metrics.slowestComponent) {
      analytics.logEvent('slow-component', {
        component: metrics.slowestComponent,
        renderTime: metrics.components[metrics.slowestComponent].totalRenderTime
      });
    }
  }, [metrics]);
  
  return null;
};
```

### Subscribing to Performance Metrics

You can subscribe to performance metrics using the `usePerformanceMonitorContext` hook:

```jsx
import React, { useEffect } from 'react';
import { usePerformanceMonitorContext } from 'react-perf-mon';

const MetricSubscriber = () => {
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

## Troubleshooting

### Context Provider Order

If you encounter errors like `usePerformanceContext must be used within a PerformanceProvider`, ensure that your application is properly wrapped with the `PerformanceMonitoringProvider` component. The library handles the correct nesting of context providers internally.

Common causes of this error:
1. Not wrapping your application with `PerformanceMonitoringProvider`
2. Using the dashboard or tracking components outside the provider
3. Using an outdated version of the library

### Performance Impact

The library is designed to have minimal impact on your application's performance. However, if you notice any performance issues, you can:

1. Disable tracking for specific components using the `excludeComponents` option
2. Disable the library entirely by setting `enabled: false` in the config
3. Only enable the library in development or testing environments

### Dashboard Not Showing Metrics

If the dashboard is not showing any metrics:

1. Ensure that your components are properly wrapped with `withPerformanceTracking` or using the `useTrackPerformance` hook
2. Check that the `enabled` option in the config is set to `true`
3. Interact with your components to generate metrics
4. Check the console for any errors related to the performance monitoring

### Hook vs HOC Approach

While both the hook (`useTrackPerformance`) and HOC (`withPerformanceTracking`) approaches are supported, the HOC approach is generally more reliable and recommended for most use cases. The HOC approach:

- Works better with class components
- Has better error handling
- Is less prone to issues with hook rules
- Provides more accurate unnecessary render detection

If you're experiencing issues with the hook approach, try switching to the HOC approach.

## Best Practices

1. **Use in Development**: Consider enabling the library only in development or testing environments to avoid any performance impact in production.

2. **Selective Tracking**: Only track components that you're interested in monitoring, rather than tracking every component in your application.

3. **Meaningful Component Names**: Provide meaningful names when using `withPerformanceTracking` or `useTrackPerformance` to make the dashboard more useful.

4. **Exclude Fast Components**: Use the `excludeComponents` option to exclude components that update very frequently and don't need monitoring.

5. **Adjust Thresholds**: Adjust the warning thresholds based on your application's performance requirements.

6. **Reset Metrics**: Use the reset button on the dashboard to clear metrics when you want to start fresh.

7. **Filter Components**: Use the filter input on the dashboard to focus on specific components.

## Example Project

For a complete example of how to use the library, check out the example project in the `example` directory of the repository. It demonstrates various performance scenarios and how to use the library to monitor them. 