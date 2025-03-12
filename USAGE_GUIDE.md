# React Performance Monitor Usage Guide

This guide provides detailed information about using the React Performance Monitor library effectively in your application.

## Table of Contents
1. [Setup](#setup)
2. [Performance Dashboard](#performance-dashboard)
3. [Component Tracking](#component-tracking)
4. [Configuration](#configuration)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Setup

### Installation

```bash
npm install react-perf-mon
# or
yarn add react-perf-mon
```

### Basic Setup

Wrap your application with the `PerformanceMonitoringProvider`:

```jsx
import { PerformanceMonitoringProvider } from 'react-perf-mon';

function App() {
  return (
    <PerformanceMonitoringProvider>
      <YourApp />
    </PerformanceMonitoringProvider>
  );
}
```

## Performance Dashboard

The Performance Dashboard is a real-time visualization tool for your application's performance metrics.

### Adding the Dashboard

```jsx
import { PerformanceDashboard } from 'react-perf-mon';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <PerformanceMonitoringProvider>
      <button onClick={() => setShowDashboard(!showDashboard)}>
        Toggle Dashboard
      </button>
      <YourApp />
      {showDashboard && <PerformanceDashboard />}
    </PerformanceMonitoringProvider>
  );
}
```

### Dashboard Features

1. **Key Metrics**
   - Components Tracked
   - Total Renders
   - Total Render Time
   - Unnecessary Renders

2. **Component Table**
   - Component-level metrics
   - Sortable by render time
   - Filterable by component name
   - Average update time calculation

3. **Controls**
   - Reset Metrics button
   - Component search/filter
   - Real-time updates

## Component Tracking

### Using the HOC (Recommended)

```jsx
import { withPerformanceTracking } from 'react-perf-mon';

const MyComponent = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

export default withPerformanceTracking(MyComponent, 'MyComponent');
```

### Using the Hook

```jsx
import { useTrackPerformance } from 'react-perf-mon';

const MyComponent = ({ name }) => {
  useTrackPerformance('MyComponent');
  return <div>Hello, {name}!</div>;
};

export default MyComponent;
```

## Configuration

### Provider Configuration

```jsx
<PerformanceMonitoringProvider
  config={{
    enabled: true,
    logToConsole: true,
    includeWarnings: true,
    thresholds: {
      maxRenderCount: 10,
      maxMountTime: 50,
      maxUpdateTime: 25
    },
    excludeComponents: ['FastUpdatingComponent']
  }}
>
  <YourApp />
</PerformanceMonitoringProvider>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | true | Enable/disable performance tracking |
| logToConsole | boolean | false | Log metrics to console |
| includeWarnings | boolean | true | Show performance warnings |
| thresholds | object | {} | Performance thresholds |
| excludeComponents | string[] | [] | Components to exclude |

## Best Practices

1. **Component Naming**
   - Use meaningful, unique names for components
   - Follow a consistent naming convention

2. **Performance Monitoring**
   - Track only components you need to monitor
   - Use the HOC for more accurate metrics
   - Reset metrics periodically for clean data

3. **Dashboard Usage**
   - Place the dashboard where it won't interfere with your app
   - Use component filtering for large applications
   - Monitor trends over time

4. **Configuration**
   - Set appropriate thresholds for your app
   - Enable console logging during development
   - Exclude frequently updating components

## Troubleshooting

### Common Issues

1. **No Metrics Showing**
   - Verify the provider is properly set up
   - Check if tracking is enabled
   - Ensure components are wrapped correctly

2. **Incorrect Metrics**
   - Reset metrics and try again
   - Check for duplicate component names
   - Verify proper HOC/hook usage

3. **Performance Impact**
   - Reduce number of tracked components
   - Increase warning thresholds
   - Disable in production if needed

### Error Messages

1. **"usePerformanceContext must be used within a PerformanceProvider"**
   - Check provider nesting order
   - Verify all required providers are present

2. **"Component name is required"**
   - Provide a name when using HOC/hook
   - Check for undefined component names

3. **"Invalid threshold values"**
   - Ensure threshold values are numbers
   - Use positive values for thresholds 