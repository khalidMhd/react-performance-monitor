# Context Provider Issue and Solution

## The Problem

When trying to use the `PerformanceDashboard` component from the `react-perf-mon` library, we encountered the following error:

```
ERROR: usePerformanceContext must be used within a PerformanceProvider
```

This error occurs because the `PerformanceDashboard` component is trying to use a context called `PerformanceContext` through a hook called `usePerformanceContext`, but our app is wrapping everything in a `PerformanceMonitorProvider` instead.

## The Issue

The library appears to have two different context providers:

1. `PerformanceMonitorProvider` - Used for monitoring performance metrics
2. `PerformanceProvider` - Used by the dashboard to display metrics

However, the library doesn't export the `PerformanceProvider` component, which is needed by the dashboard.

## Our Solution

We created a custom implementation of the `PerformanceProvider` and `usePerformanceContext` in `src/PerformanceContext.tsx`. This implementation:

1. Creates a context with the structure expected by the dashboard
2. Provides a provider component that can be used to wrap the application
3. Implements the hook that the dashboard uses to access the context

By wrapping our application with both the library's `PerformanceMonitorProvider` and our custom `PerformanceProvider`, we can make the dashboard work.

## Implementation Details

Our custom implementation includes:

- Types for performance metrics and configuration
- A context provider component
- State management for metrics and configuration
- Methods for updating metrics and configuration
- A hook for accessing the context

## Usage

```jsx
import { PerformanceMonitorProvider } from 'react-perf-mon';
import { PerformanceDashboard } from 'react-perf-mon';
import { PerformanceProvider } from './PerformanceContext';

function App() {
  return (
    <PerformanceMonitorProvider config={...}>
      <PerformanceProvider>
        <div className="App">
          {/* Your app content */}
          <PerformanceDashboard />
        </div>
      </PerformanceProvider>
    </PerformanceMonitorProvider>
  );
}
```

## Limitations

Since our custom implementation is separate from the library's internal implementation, the dashboard will not show the actual metrics collected by the `PerformanceMonitorProvider`. It will only show metrics that are manually added to our custom context.

For a complete solution, the library would need to be updated to:

1. Export the `PerformanceProvider` component
2. Connect the `PerformanceMonitorProvider` and `PerformanceProvider` contexts
3. Ensure that metrics collected by one are available to the other 