# React Performance Monitor Quick Start Guide

## Installation

```bash
npm install react-performance-monitor
# or
yarn add react-performance-monitor
```

## Basic Setup

1. **Wrap your app with the Provider**

```tsx
import { PerformanceProvider } from 'react-performance-monitor';

function App() {
  return (
    <PerformanceProvider>
      <YourApp />
    </PerformanceProvider>
  );
}
```

2. **Monitor components**

```tsx
import { usePerformanceMonitor } from 'react-performance-monitor';

function YourComponent() {
  usePerformanceMonitor({
    componentName: 'YourComponent',
  });

  return <div>Your content</div>;
}
```

3. **Add the dashboard**

```tsx
import { PerformanceDashboard } from 'react-performance-monitor';

function App() {
  return (
    <PerformanceProvider>
      <PerformanceDashboard />
      <YourApp />
    </PerformanceProvider>
  );
}
```

## Key Features

### 1. Performance Metrics
- View render counts
- Track mount times
- Monitor update times
- Detect unnecessary renders

### 2. Data Export
- Export to JSON
- Export to CSV
- Historical data
- Detailed metrics

### 3. Visualizations
- Render time charts
- Network waterfall
- Bundle size analysis
- Component dependencies

### 4. Debug Tools
- Real-time monitoring
- Session recording
- Performance logs
- Component inspection

## Common Tasks

### Export Performance Data
1. Open the Performance Dashboard
2. Click "Export to JSON" or "Export to CSV"
3. Save the file to your system

### Monitor Network Requests
1. Check the Network Profiler section
2. View request timing and status
3. Analyze waterfall chart
4. Export network metrics

### Track Memory Usage
1. Enable memory monitoring
2. View memory trends
3. Check for leaks
4. Export memory data

### Debug Performance Issues
1. Enable Debug Mode
2. Start recording
3. Reproduce the issue
4. Analyze the logs

## Configuration

```tsx
const config = {
  enableLogging: true,
  renderWarningThreshold: 16,
  mountWarningThreshold: 100,
  excludeComponents: [],
  logLevel: 'warn',
};

function App() {
  return (
    <PerformanceProvider config={config}>
      <YourApp />
    </PerformanceProvider>
  );
}
```

## Keyboard Shortcuts

- `Ctrl + Shift + P`: Open Performance Dashboard
- `Ctrl + Shift + E`: Export Data
- `Ctrl + Shift + D`: Toggle Debug Mode
- `Ctrl + Shift + R`: Start/Stop Recording

## Support

For issues and feature requests, please visit:
[GitHub Repository](https://github.com/yourusername/react-performance-monitor)

## License

MIT License - Feel free to use in your projects! 