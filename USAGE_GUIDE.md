# React Performance Monitor - Usage Guide

React Performance Monitor is a library that helps you track and visualize the performance of your React components. This guide will show you how to use the library effectively.

## Installation

```bash
npm install react-perf-mon
```

## Basic Setup

Wrap your application with the `PerformanceMonitoringProvider`:

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
          {showDashboard ? 'Hide' : 'Show'} Performance Dashboard
        </button>
        
        {/* Your application components */}
        
        {showDashboard && <PerformanceDashboard />}
      </div>
    </PerformanceMonitoringProvider>
  );
}
```

## Tracking Component Performance

To track a component's performance, use the `withPerformanceTracking` Higher-Order Component (HOC):

```jsx
import { withPerformanceTracking } from 'react-perf-mon';

// Your component
const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

// Wrap it with performance tracking
export default withPerformanceTracking(MyComponent, 'MyComponent');
```

### Tracking Lazy-Loaded Components

For lazy-loaded components, you need to wrap the component before passing it to `React.lazy()`:

```jsx
// Define your component
const LazyComponentContent = () => {
  return <div>Lazy loaded content</div>;
};

// Wrap with performance tracking
const TrackedLazyComponent = withPerformanceTracking(LazyComponentContent, 'LazyComponent');

// Create the lazy component
const LazyComponent = React.lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ default: TrackedLazyComponent });
    }, 2000);
  })
);
```

## Configuration Options

The `PerformanceMonitoringProvider` accepts the following configuration options:

```jsx
<PerformanceMonitoringProvider
  config={{
    // Enable or disable performance monitoring
    enabled: true,
    
    // Log performance metrics to the console
    logToConsole: true,
    
    // Include warnings when thresholds are exceeded
    includeWarnings: true,
    
    // Performance thresholds
    thresholds: {
      // Maximum number of renders before warning
      maxRenderCount: 10,
      
      // Maximum mount time in milliseconds before warning
      maxMountTime: 50,
      
      // Maximum update time in milliseconds before warning
      maxUpdateTime: 25
    },
    
    // Components to exclude from monitoring
    excludeComponents: ['SomeComponent', 'AnotherComponent']
  }}
  
  // Enable or disable tracking globally
  enableTracking={true}
>
  {/* Your application */}
</PerformanceMonitoringProvider>
```

## Using the Dashboard

The `PerformanceDashboard` component displays performance metrics for all tracked components. You can show/hide it as needed:

```jsx
{showDashboard && <PerformanceDashboard />}
```

The dashboard includes:

- Components tracked count
- Total render time
- Unnecessary renders count
- Average mount time
- Component-specific metrics
- Render time charts
- Render count charts

## Additional Features

### Network Monitoring

```jsx
import { useNetworkMonitor } from 'react-perf-mon';

const MyComponent = () => {
  // Monitor network requests
  useNetworkMonitor();
  
  // Your component code
};
```

### Memory Monitoring

```jsx
import { useMemoryMonitor } from 'react-perf-mon';

const MyComponent = () => {
  // Monitor memory usage
  useMemoryMonitor();
  
  // Your component code
};
```

## Best Practices

1. Only track components that you're interested in monitoring
2. Use meaningful component names for better dashboard readability
3. Set appropriate thresholds based on your application's requirements
4. Use the dashboard in development mode to identify performance issues
5. Consider disabling the monitoring in production for better performance

## Troubleshooting

If you're not seeing any data in the dashboard:

1. Make sure you've wrapped your components with `withPerformanceTracking`
2. Check that the `PerformanceMonitoringProvider` is properly configured with `enabled: true`
3. Interact with your components to generate performance metrics
4. Ensure the dashboard is being rendered within the provider's context 