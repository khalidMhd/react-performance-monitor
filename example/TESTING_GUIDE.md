# React Performance Monitor Testing Guide

This guide walks you through testing each feature of the React Performance Monitor library using the example application.

> **Note:** There may be some discrepancies between the documentation and the actual implementation. The example code has been adjusted to work with the current implementation.

## Prerequisites

1. **Important: React Version Compatibility**
   
   The library requires React 18.x. If you encounter hook-related errors, please see the `FIX_REACT_VERSION.md` file for detailed instructions on resolving React version issues.

2. Make sure you have installed the dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Feature 1: Basic Performance Monitoring

### What to Test

1. **Component Render Times**:
   - Click the "Show Performance Dashboard" button
   - Observe the render times for each component
   - Click "Increment Counter" several times and watch how render times change

2. **Unnecessary Renders**:
   - Wait for about 10-20 seconds
   - Notice that UnnecessaryRenders component keeps re-rendering due to its internal state
   - Check the Performance Dashboard for unnecessary render warnings

3. **Mount/Unmount Times**:
   - Toggle the "Show Lazy Component" button
   - Observe the mount time in the dashboard
   - Toggle it off and observe the unmount time

### Expected Results

- The SlowComponent should show higher render times (around 50ms)
- UnnecessaryRenders should trigger warnings for unnecessary renders
- The dashboard should show accurate mount/unmount times for components

## Feature 2: Network Request Monitoring

### What to Test

1. **API Call Performance**:
   - Click the "Fetch Data" button in the DataFetcher component
   - Observe the network request metrics in the dashboard

2. **Multiple Requests**:
   - Click "Fetch Data" multiple times
   - Check how the dashboard tracks multiple requests

### Expected Results

- The dashboard should show request duration (around 1500ms)
- Status codes should be displayed (200 for successful requests)
- Multiple requests should be tracked separately

## Feature 3: Memory Usage Tracking

### What to Test

1. **Memory Growth**:
   - Click "Add 1000 Items" in the MemoryComponent
   - Observe memory usage metrics in the dashboard
   - Click it multiple times to see memory growth

2. **Memory Warnings**:
   - Continue adding items until memory warnings appear
   - Check if the dashboard shows memory usage warnings

### Expected Results

- Memory usage should increase with each click
- The dashboard should show memory metrics
- Warnings should appear if memory usage exceeds thresholds

## Feature 4: Core Web Vitals

### What to Test

1. **Performance Metrics**:
   - Check the Core Web Vitals section in the dashboard
   - Observe FCP, LCP, CLS, and FID metrics

2. **Refresh Testing**:
   - Refresh the page and observe how metrics are captured
   - Try slowing down your network (in Chrome DevTools) and refresh again

### Expected Results

- The dashboard should display all Core Web Vitals metrics
- Metrics should update on page refresh
- Slower network should affect loading metrics

## Feature 5: Advanced Features

### What to Test

1. **Component Lifecycle**:
   - Toggle components on and off
   - Check the lifecycle section in the dashboard

2. **Performance Recommendations**:
   - Look for optimization suggestions in the dashboard
   - Check if recommendations are relevant to the performance issues

3. **Export Functionality**:
   - Test the export feature in the dashboard
   - Verify that the exported data contains all metrics

### Expected Results

- Component lifecycle should be accurately tracked
- Recommendations should address the intentional performance issues
- Exported data should be complete and well-formatted

## Troubleshooting

If you encounter any issues:

1. Check the browser console for errors
2. Verify that the library is properly installed
3. Make sure the PerformanceMonitorProvider is correctly configured
4. Try refreshing the page or restarting the development server 