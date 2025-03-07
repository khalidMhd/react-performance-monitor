# React Performance Monitor

A comprehensive performance monitoring tool for React applications that helps developers track, analyze, and optimize their components' performance.

## Features

- 📊 Track component re-renders and render times
- ⚡ Monitor mount and update performance
- 🔍 Identify unnecessary renders
- 📈 Measure component-level performance metrics
- ⚠️ Configurable warning thresholds
- 🎯 Performance optimization suggestions

## Installation

```bash
npm install react-performance-monitor
# or
yarn add react-performance-monitor
```

## Quick Start

1. Wrap your app with the PerformanceProvider:

```jsx
import { PerformanceProvider } from 'react-performance-monitor';

function App() {
  return (
    <PerformanceProvider>
      <YourApp />
    </PerformanceProvider>
  );
}
```

2. Monitor component performance using the hook:

```jsx
import { usePerformanceMonitor } from 'react-performance-monitor';

function MyComponent({ data }) {
  usePerformanceMonitor({
    componentName: 'MyComponent',
    dependencies: [data], // Optional: track specific dependencies
  });

  return <div>{/* Your component content */}</div>;
}
```

## Configuration

You can customize the monitoring behavior using the `usePerformanceContext` hook:

```jsx
import { usePerformanceContext } from 'react-performance-monitor';

function App() {
  const { setConfig } = usePerformanceContext();

  useEffect(() => {
    setConfig({
      enableLogging: true,
      renderWarningThreshold: 16, // ms
      mountWarningThreshold: 100, // ms
      unnecessaryRenderWarningThreshold: 5,
      excludeComponents: ['SomeComponent'],
      logLevel: 'warn',
    });
  }, []);

  return <YourApp />;
}
```

## API Reference

### PerformanceProvider

The context provider that enables performance monitoring throughout your app.

### usePerformanceMonitor

```typescript
function usePerformanceMonitor(options: {
  componentName: string;
  dependencies?: any[];
}): void;
```

### usePerformanceContext

```typescript
function usePerformanceContext(): {
  metrics: PerformanceMetrics;
  config: PerformanceConfig;
  updateMetrics: (componentName: string, metricUpdate: Partial<ComponentMetrics>) => void;
  resetMetrics: () => void;
  setConfig: (config: Partial<PerformanceConfig>) => void;
};
```

## Types

```typescript
interface ComponentMetrics {
  componentName: string;
  renderCount: number;
  mountTime: number;
  updateTimes: number[];
  lastRenderTime: number;
  unnecessaryRenders: number;
  totalRenderTime: number;
}

interface PerformanceMetrics {
  components: Record<string, ComponentMetrics>;
  totalMounts: number;
  totalUpdates: number;
  totalRenderTime: number;
  slowestComponent: string | null;
  unnecessaryRenderCount: number;
}

interface PerformanceConfig {
  enableLogging?: boolean;
  renderWarningThreshold?: number;
  mountWarningThreshold?: number;
  unnecessaryRenderWarningThreshold?: number;
  excludeComponents?: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
```

## Best Practices

1. Add performance monitoring to components that:
   - Handle complex state management
   - Render large lists or tables
   - Process heavy computations
   - Frequently update

2. Use the dependency array to track specific props or state that might cause unnecessary renders

3. Monitor the console for performance warnings and optimize accordingly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 