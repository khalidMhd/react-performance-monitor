# React Performance Monitor

A powerful React library for monitoring and analyzing application performance metrics in real-time.

## Features

- 🔍 **Real-time Performance Monitoring**
  - Component render times and counts
  - Mount/unmount times
  - Update times
  - Unnecessary renders detection
  - Component lifecycle tracking
  - Parent-child component relationships

- 📊 **Network Request Monitoring**
  - Request duration tracking
  - Status code monitoring
  - Slow request warnings
  - Automatic fetch interception
  - Request timing analysis

- 💾 **Memory Usage Tracking**
  - Heap size monitoring (Chrome only)
  - Memory usage warnings
  - Memory leak detection
  - Memory snapshot comparison
  - Real-time memory metrics

- 🌐 **Core Web Vitals**
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - First Input Delay (FID)
  - Real-time vitals tracking
  - Performance recommendations

- 📈 **Performance Dashboard**
  - Interactive metrics visualization
  - Time-based filtering
  - Component render tree
  - Network request analysis
  - Memory usage graphs
  - Performance trends
  - Export functionality

## Installation

```bash
npm install react-perf-mon
# or
yarn add react-perf-mon
```

## Quick Start

1. Wrap your app with `PerformanceMonitorProvider`:

```typescript
import { PerformanceMonitorProvider } from 'react-perf-mon';

function App() {
  return (
    <PerformanceMonitorProvider config={{
      enabled: true,
      logToConsole: true,
      includeWarnings: true,
      thresholds: {
        maxRenderCount: 100,
        maxMountTime: 100, // ms
        maxUnnecessaryRenders: 5,
        maxNetworkDuration: 1000, // ms
        maxMemoryUsage: 100, // MB
      },
      warningThresholds: {
        renderTime: 1000,
        unnecessaryRenders: 5
      },
      componentThresholds: {
        'YourComponent': {
          renderTime: 200,
          unnecessaryRenders: 2
        }
      }
    }}>
      <YourApp />
    </PerformanceMonitorProvider>
  );
}
```

2. Add the dashboard to your app:

```typescript
import { PerformanceDashboard } from 'react-perf-mon';

function App() {
  return (
    <PerformanceMonitorProvider>
      <YourApp />
      <PerformanceDashboard />
    </PerformanceMonitorProvider>
  );
}
```

3. Use monitoring in your components:

```typescript
import { usePerformanceMonitorContext } from 'react-perf-mon';

function YourComponent() {
  const { recordMetric, recordNetworkMetric } = usePerformanceMonitorContext();
  
  useEffect(() => {
    const startTime = performance.now();
    // Your component logic
    const endTime = performance.now();
    
    recordMetric({
      componentName: 'YourComponent',
      renderCount: 1,
      mountTime: endTime - startTime,
      updateTimes: [endTime - startTime],
      lastRenderTime: endTime - startTime,
      totalRenderTime: endTime - startTime,
      unnecessaryRenders: 0,
      timestamp: Date.now(),
      lifecycle: {
        mountTime: endTime - startTime,
        updateTimes: [endTime - startTime],
        unmountTime: undefined,
        parentComponent: undefined,
        childComponents: [],
        renderCount: 1,
        lastRenderTime: endTime - startTime
      }
    });
  }, []);

  return <div>Your Component</div>;
}
```

## Configuration Options

```typescript
interface PerformanceMonitorConfig {
  enabled: boolean;                    // Enable/disable monitoring
  logToConsole?: boolean;             // Log metrics to console
  includeWarnings?: boolean;          // Show performance warnings
  thresholds?: {
    maxRenderCount?: number;          // Maximum number of renders
    maxMountTime?: number;            // Maximum mount time in ms
    maxUnnecessaryRenders?: number;   // Maximum unnecessary renders
    maxNetworkDuration?: number;      // Maximum network request duration
    maxMemoryUsage?: number;          // Maximum memory usage in MB
  };
  warningThresholds?: {
    renderTime?: number;              // Warning threshold for render time
    unnecessaryRenders?: number;      // Warning threshold for unnecessary renders
  };
  componentThresholds?: {             // Component-specific thresholds
    [componentName: string]: {
      renderTime?: number;
      unnecessaryRenders?: number;
      memoryUsage?: number;
    };
  };
  excludeComponents?: string[];       // Components to exclude from monitoring
}
```

## Performance Metrics

### Component Metrics
```typescript
interface PerformanceMetric {
  componentName: string;              // Name of the component
  renderCount: number;                // Number of renders
  mountTime: number;                  // Time taken to mount
  updateTimes: number[];              // Array of update times
  lastRenderTime: number;             // Time of last render
  totalRenderTime: number;            // Total render time
  unnecessaryRenders: number;         // Number of unnecessary renders
  timestamp: number;                  // Timestamp of the metric
  warnings?: string[];                // Performance warnings
  memoryUsage?: {                     // Memory usage metrics
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
  lifecycle: {                        // Component lifecycle metrics
    mountTime: number;
    updateTimes: number[];
    unmountTime?: number;
    parentComponent?: string;
    childComponents: string[];
    renderCount: number;
    lastRenderTime: number;
  };
}
```

### Network Metrics
```typescript
interface NetworkMetric {
  url: string;                        // Request URL
  method: string;                     // HTTP method
  duration: number;                   // Request duration
  status: number;                     // HTTP status code
  timestamp: number;                  // Timestamp of the request
}
```

### Core Web Vitals
```typescript
interface CoreWebVitals {
  fcp: number;                        // First Contentful Paint
  lcp: number;                        // Largest Contentful Paint
  cls: number;                        // Cumulative Layout Shift
  fid: number;                        // First Input Delay
  timestamp: number;                  // Timestamp of the vitals
}
```

## Best Practices

1. **Component Monitoring**
   ```typescript
   useEffect(() => {
     const startTime = performance.now();
     // Component logic
     const endTime = performance.now();
     recordMetric({
       // ... metrics
     });
   }, []);
   ```

2. **Network Monitoring**
   ```typescript
   const fetchData = async () => {
     const startTime = performance.now();
     try {
       const response = await fetch(url);
       const duration = performance.now() - startTime;
       recordNetworkMetric({
         url,
         method: 'GET',
         duration,
         status: response.status,
         timestamp: Date.now()
       });
     } catch (error) {
       // Error handling
     }
   };
   ```

3. **Memory Usage Tracking**
   ```typescript
   if (performance.memory) {
     const memoryUsage = {
       jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / (1024 * 1024),
       totalJSHeapSize: performance.memory.totalJSHeapSize / (1024 * 1024),
       usedJSHeapSize: performance.memory.usedJSHeapSize / (1024 * 1024)
     };
     // Use memoryUsage in your metrics
   }
   ```

## Browser Support

- Chrome (recommended for memory metrics)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the amazing framework
- Chart.js for visualization capabilities
- All contributors who help improve this library 