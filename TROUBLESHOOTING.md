# React Performance Monitor Troubleshooting Guide

This guide addresses common issues you might encounter when using the React Performance Monitor library and provides solutions to help you resolve them.

## Common Issues and Solutions

### Error: "usePerformanceContext must be used within a PerformanceProvider"

**Problem**: This error occurs when a component tries to access the performance context outside of the `PerformanceProvider`.

**Solutions**:

1. **Check Provider Wrapping**: Ensure your application is properly wrapped with the `PerformanceMonitoringProvider` component:

   ```jsx
   import { PerformanceMonitoringProvider } from 'react-perf-mon';

   function App() {
     return (
       <PerformanceMonitoringProvider config={...}>
         {/* Your application */}
       </PerformanceMonitoringProvider>
     );
   }
   ```

2. **Check Component Hierarchy**: Make sure that any components using performance hooks or the dashboard are children of the `PerformanceMonitoringProvider`.

3. **Check for Multiple Providers**: Avoid using multiple instances of `PerformanceMonitoringProvider` in your application. Use a single provider at the top level.

4. **Update Library Version**: Ensure you're using the latest version of the library, as provider order issues may have been fixed in newer versions.

### Dashboard Not Showing Any Metrics

**Problem**: The performance dashboard is rendering but doesn't display any metrics.

**Solutions**:

1. **Check Tracking Implementation**: Ensure your components are properly tracked using either the HOC or hook approach:

   ```jsx
   // HOC approach
   export default withPerformanceTracking(MyComponent, 'MyComponent');

   // Hook approach
   useTrackPerformance('MyComponent');
   ```

2. **Verify Configuration**: Check that performance monitoring is enabled in your configuration:

   ```jsx
   <PerformanceMonitoringProvider
     config={{
       enabled: true,
       // other options
     }}
   >
   ```

3. **Generate Metrics**: Interact with your tracked components to generate metrics. The dashboard only shows data for components that have rendered.

4. **Check Console for Errors**: Look for any errors in the console that might indicate issues with the performance monitoring.

5. **Component Names**: Ensure you're providing unique and consistent component names when tracking.

### Performance Impact on Application

**Problem**: The performance monitoring is causing noticeable slowdowns in your application.

**Solutions**:

1. **Selective Tracking**: Only track components you're interested in monitoring rather than every component:

   ```jsx
   // Track only specific components
   const ImportantComponent = withPerformanceTracking(MyComponent, 'ImportantComponent');
   
   // Don't track less important components
   const LessImportantComponent = (props) => <div>...</div>;
   ```

2. **Exclude Frequently Updating Components**: Use the `excludeComponents` option to exclude components that update very frequently:

   ```jsx
   <PerformanceMonitoringProvider
     config={{
       excludeComponents: ['FrequentlyUpdatingComponent', 'AnimationComponent'],
     }}
   >
   ```

3. **Development-Only Monitoring**: Enable monitoring only in development environments:

   ```jsx
   <PerformanceMonitoringProvider
     config={{
       enabled: process.env.NODE_ENV === 'development',
     }}
   >
   ```

4. **Conditional Dashboard**: Only render the dashboard when needed:

   ```jsx
   {showDashboard && <PerformanceDashboard />}
   ```

### Issues with Lazy-Loaded Components

**Problem**: Metrics for lazy-loaded components are not being tracked correctly.

**Solutions**:

1. **Correct Wrapping Order**: Ensure you're wrapping the component with performance tracking before lazy-loading it:

   ```jsx
   // Create your component
   const MyLazyComponentContent = () => <div>I'm lazy loaded!</div>;

   // First wrap with performance tracking
   const TrackedLazyComponent = withPerformanceTracking(MyLazyComponentContent, 'LazyComponent');

   // Then create lazy component
   const LazyComponent = React.lazy(() => 
     Promise.resolve({ default: TrackedLazyComponent })
   );
   ```

2. **Check Suspense Boundaries**: Make sure your lazy components are properly wrapped with Suspense:

   ```jsx
   <Suspense fallback={<div>Loading...</div>}>
     <LazyComponent />
   </Suspense>
   ```

3. **Component Name Consistency**: Ensure the component name used in tracking matches what you're filtering for in the dashboard.

### Hook Approach Not Working

**Problem**: The `useTrackPerformance` hook is not tracking component performance correctly.

**Solutions**:

1. **Switch to HOC Approach**: The HOC approach is generally more reliable:

   ```jsx
   // Instead of:
   const MyComponent = () => {
     useTrackPerformance('MyComponent');
     return <div>...</div>;
   };

   // Use:
   const MyComponent = () => <div>...</div>;
   export default withPerformanceTracking(MyComponent, 'MyComponent');
   ```

2. **Hook Rules**: Ensure you're following the Rules of Hooks. The `useTrackPerformance` hook must be called at the top level of your component.

3. **Check for Conditional Rendering**: Don't use the hook inside conditional statements:

   ```jsx
   // Incorrect
   if (condition) {
     useTrackPerformance('MyComponent'); // This will cause errors
   }

   // Correct
   useTrackPerformance('MyComponent');
   if (condition) {
     // conditional logic
   }
   ```

4. **Library Version**: Ensure you're using the latest version of the library, as hook-related issues may have been fixed.

### TypeScript Type Errors

**Problem**: TypeScript is reporting type errors related to the library.

**Solutions**:

1. **Check TypeScript Version**: Ensure you're using a compatible TypeScript version (4.0 or higher recommended).

2. **Import Types**: Import types from the library when needed:

   ```typescript
   import { PerformanceMetric, PerformanceWarning } from 'react-perf-mon';
   ```

3. **Component Props**: When using the HOC with TypeScript, you may need to specify component props:

   ```typescript
   interface MyComponentProps {
     name: string;
   }

   const MyComponent: React.FC<MyComponentProps> = ({ name }) => {
     return <div>Hello, {name}!</div>;
   };

   export default withPerformanceTracking<MyComponentProps>(MyComponent, 'MyComponent');
   ```

4. **Update Library**: Ensure you're using the latest version of the library, which may include improved TypeScript definitions.

### Dashboard Styling Issues

**Problem**: The dashboard doesn't look right or has styling conflicts with your application.

**Solutions**:

1. **CSS Isolation**: The dashboard uses CSS-in-JS with unique class names to avoid conflicts, but if you're experiencing issues, you can wrap it in a container with specific styles:

   ```jsx
   <div className="performance-dashboard-container" style={{ isolation: 'isolate' }}>
     <PerformanceDashboard />
   </div>
   ```

2. **Z-Index**: If the dashboard is appearing behind other elements, adjust its z-index:

   ```jsx
   <PerformanceDashboard style={{ zIndex: 9999 }} />
   ```

3. **Custom Styling**: You can pass custom styles to the dashboard:

   ```jsx
   <PerformanceDashboard 
     style={{ 
       backgroundColor: '#f5f5f5',
       border: '1px solid #ddd',
       borderRadius: '8px'
     }} 
   />
   ```

4. **Position**: Adjust the position of the dashboard:

   ```jsx
   <PerformanceDashboard position="bottom-right" />
   ```

### Metrics Reset Unexpectedly

**Problem**: Performance metrics are being reset unexpectedly.

**Solutions**:

1. **Check for Provider Remounts**: The `PerformanceMonitoringProvider` should not be remounted frequently. Ensure it's placed high in your component tree where it won't be affected by re-renders.

2. **Stable Config**: Provide a stable configuration object to avoid unnecessary re-renders:

   ```jsx
   // Bad: Creates a new object on every render
   <PerformanceMonitoringProvider config={{ enabled: true }} />

   // Good: Use a stable reference
   const config = useMemo(() => ({ enabled: true }), []);
   <PerformanceMonitoringProvider config={config} />
   ```

3. **Manual Reset**: If you're manually resetting metrics, ensure it's not happening unintentionally:

   ```jsx
   const { resetMetrics } = usePerformanceContext();
   
   // Only call when needed
   const handleReset = () => resetMetrics();
   ```

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. **Check the Console**: Look for any error messages or warnings in your browser's console.

2. **Minimal Reproduction**: Create a minimal reproduction of the issue to help isolate the problem.

3. **Library Version**: Ensure you're using the latest version of the library.

4. **Report an Issue**: If you believe you've found a bug, please report it on the GitHub repository with:
   - A clear description of the issue
   - Steps to reproduce
   - Expected vs. actual behavior
   - Your environment details (React version, browser, etc.)
   - A minimal code example if possible 