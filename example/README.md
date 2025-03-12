# React Performance Monitor Example

This project demonstrates the features of the React Performance Monitor library. It includes various components with intentional performance issues to showcase how the library can help identify and fix performance problems.

> **Note:** There may be some discrepancies between the README documentation of the library and the actual implementation. The example code has been adjusted to work with the current implementation.

> **Important:** This library requires React 18.x. If you're using React 19 or another version, you may encounter hook-related errors. See the `FIX_REACT_VERSION.md` file for detailed instructions on resolving React version issues.

> **Context Issue:** There's an issue with the dashboard component using a different context than the monitoring provider. See the `CONTEXT_ISSUE.md` file for details on how we've worked around this issue.

## Components Included

1. **SlowComponent**: Artificially delays rendering by 50ms to simulate a slow component.
2. **UnnecessaryRenders**: Demonstrates a component that re-renders unnecessarily due to internal state changes.
3. **DataFetcher**: Shows network request monitoring with simulated API calls.
4. **MemoryComponent**: Creates a large number of items to demonstrate memory usage tracking.
5. **LazyComponent**: Demonstrates lazy loading and code splitting monitoring.

## Testing Features One by One

We'll implement and test the React Performance Monitor features one by one:

### Basic Setup (Current State)
- The app is set up with example components but without performance monitoring.

### Step 1: Basic Performance Monitoring
- Implement basic component render time tracking
- Monitor unnecessary renders

### Step 2: Network Request Monitoring
- Track API call performance
- Monitor request durations and status codes

### Step 3: Memory Usage Tracking
- Monitor heap size
- Track memory usage over time

### Step 4: Core Web Vitals
- Track FCP, LCP, CLS, and FID
- Monitor performance metrics

### Step 5: Performance Dashboard
- Visualize all metrics in a dashboard
- Analyze performance data

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Implementation Notes

Each feature will be implemented by uncommenting and configuring the relevant parts of the code. The comments in the code indicate where changes will be made for each feature.

## Performance Testing

To test performance issues:
- Click the "Increment Counter" button multiple times to trigger re-renders
- Toggle the Lazy Component to test lazy loading
- Click "Fetch Data" to test network performance
- Click "Add 1000 Items" to test memory usage
