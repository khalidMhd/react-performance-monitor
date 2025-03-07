import React, { useState, useEffect, useRef } from 'react';
import { usePerformanceMonitorContext, PerformanceDashboard } from './lib/PerformanceMonitor';
import './App.css';
import { PerformanceMonitorProvider } from './lib/PerformanceMonitor';

// Test component with all monitoring features
const TestComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { recordMetric, recordNetworkMetric } = usePerformanceMonitorContext();
  const renderStartTime = useRef(performance.now());
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    const mountEndTime = performance.now();
    mountTime.current = mountEndTime - renderStartTime.current;
    console.log(`[TestComponent] Mount time: ${mountTime.current.toFixed(2)}ms`);
  }, []);

  const incrementCount = () => {
    const startTime = performance.now();
    setCount(prev => prev + 1);
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    recordMetric({
      componentName: 'TestComponent',
      renderCount: count + 1,
      mountTime: mountTime.current || 0,
      updateTimes: [renderTime],
      lastRenderTime: renderTime,
      totalRenderTime: renderTime,
      unnecessaryRenders: 0,
      timestamp: Date.now(),
      lifecycle: {
        mountTime: mountTime.current || 0,
        updateTimes: [renderTime],
        unmountTime: undefined,
        parentComponent: undefined,
        childComponents: [],
        renderCount: count + 1,
        lastRenderTime: renderTime
      }
    });

    console.log(`[TestComponent] Render time: ${renderTime.toFixed(2)}ms`);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      const endTime = performance.now();
      const duration = endTime - startTime;

      recordNetworkMetric({
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'GET',
        duration,
        status: response.status,
        timestamp: Date.now()
      });

      console.log(`[TestComponent] Network request duration: ${duration.toFixed(2)}ms`);
      setData(data);
    } catch (error) {
      console.error('[TestComponent] Network request failed:', error);
      recordNetworkMetric({
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        method: 'GET',
        duration: performance.now() - startTime,
        status: 500,
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="component-card">
      <h2>Test Component</h2>
      <div className="button-group">
        <button className="button button-primary" onClick={incrementCount}>
          Increment Count
        </button>
        <button 
          className="button button-success" 
          onClick={fetchData}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>
      <div className="data-display">
        <p>Count: {count}</p>
        {data && (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
      <div className="component-stats">
        <p>Mount Time: {mountTime.current?.toFixed(2)}ms</p>
        <p>Render Count: {count}</p>
      </div>
    </div>
  );
};

// Heavy component to test memory usage
const HeavyComponent: React.FC = () => {
  const [items, setItems] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { recordMetric } = usePerformanceMonitorContext();
  const renderStartTime = useRef(performance.now());
  const mountTime = useRef<number | null>(null);

  useEffect(() => {
    const mountEndTime = performance.now();
    mountTime.current = mountEndTime - renderStartTime.current;
    console.log(`[HeavyComponent] Mount time: ${mountTime.current.toFixed(2)}ms`);
  }, []);

  const addItems = () => {
    setIsAdding(true);
    const startTime = performance.now();
    
    // Simulate heavy computation
    const newItems = Array.from({ length: 10000 }, (_, i) => i);
    
    // Record memory usage if available
    const memoryUsage = performance.memory ? {
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / (1024 * 1024),
      totalJSHeapSize: performance.memory.totalJSHeapSize / (1024 * 1024),
      usedJSHeapSize: performance.memory.usedJSHeapSize / (1024 * 1024)
    } : undefined;

    setItems(prev => [...prev, ...newItems]);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    recordMetric({
      componentName: 'HeavyComponent',
      renderCount: items.length + 10000,
      mountTime: mountTime.current || 0,
      updateTimes: [renderTime],
      lastRenderTime: renderTime,
      totalRenderTime: renderTime,
      unnecessaryRenders: 0,
      timestamp: Date.now(),
      memoryUsage,
      lifecycle: {
        mountTime: mountTime.current || 0,
        updateTimes: [renderTime],
        unmountTime: undefined,
        parentComponent: undefined,
        childComponents: [],
        renderCount: items.length + 10000,
        lastRenderTime: renderTime
      }
    });

    console.log(`[HeavyComponent] Added 10,000 items. Render time: ${renderTime.toFixed(2)}ms`);
    if (memoryUsage) {
      console.log(`[HeavyComponent] Memory usage: ${memoryUsage.usedJSHeapSize.toFixed(2)}MB`);
    }
    
    setIsAdding(false);
  };

  return (
    <div className="component-card">
      <h2>Heavy Component</h2>
      <div className="button-group">
        <button 
          className="button button-warning" 
          onClick={addItems}
          disabled={isAdding}
        >
          {isAdding ? 'Adding Items...' : 'Add 10,000 Items'}
        </button>
      </div>
      <div className="data-display">
        <p>Total Items: {items.length.toLocaleString()}</p>
        <p>Batches: {Math.ceil(items.length / 10000)}</p>
      </div>
      <div className="component-stats">
        <p>Mount Time: {mountTime.current?.toFixed(2)}ms</p>
        <p>Last Render Time: {performance.now() - renderStartTime.current}ms</p>
        {performance.memory && (
          <p>Memory Usage: {(performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)}MB</p>
        )}
      </div>
    </div>
  );
};

// Component to test unnecessary renders
const UnnecessaryRenderComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [unusedState, setUnusedState] = useState(0);
  const { recordMetric } = usePerformanceMonitorContext();
  const renderStartTime = useRef(performance.now());
  const mountTime = useRef<number | null>(null);
  const prevCount = useRef(count);
  const unnecessaryRenders = useRef(0);

  useEffect(() => {
    const mountEndTime = performance.now();
    mountTime.current = mountEndTime - renderStartTime.current;
    console.log(`[UnnecessaryRenderComponent] Mount time: ${mountTime.current.toFixed(2)}ms`);
  }, []);

  useEffect(() => {
    // Check for unnecessary renders
    if (prevCount.current === count) {
      unnecessaryRenders.current += 1;
    }
    prevCount.current = count;

    const renderTime = performance.now() - renderStartTime.current;
    recordMetric({
      componentName: 'UnnecessaryRenderComponent',
      renderCount: count,
      mountTime: mountTime.current || 0,
      updateTimes: [renderTime],
      lastRenderTime: renderTime,
      totalRenderTime: renderTime,
      unnecessaryRenders: unnecessaryRenders.current,
      timestamp: Date.now(),
      lifecycle: {
        mountTime: mountTime.current || 0,
        updateTimes: [renderTime],
        unmountTime: undefined,
        parentComponent: undefined,
        childComponents: [],
        renderCount: count,
        lastRenderTime: renderTime
      }
    });

    console.log(`[UnnecessaryRenderComponent] Render time: ${renderTime.toFixed(2)}ms, Unnecessary renders: ${unnecessaryRenders.current}`);
  }, [count, recordMetric]);

  const updateCount = () => {
    const startTime = performance.now();
    setCount(prev => prev + 1);
    renderStartTime.current = startTime;
  };

  const updateUnusedState = () => {
    const startTime = performance.now();
    setUnusedState(prev => prev + 1);
    renderStartTime.current = startTime;
  };

  return (
    <div className="component-card">
      <h2>Unnecessary Render Test</h2>
      <div className="button-group">
        <button className="button button-primary" onClick={updateCount}>
          Update Count: {count}
        </button>
        <button className="button button-warning" onClick={updateUnusedState}>
          Update Unused State: {unusedState}
        </button>
      </div>
      <div className="data-display">
        <p>Count: {count}</p>
        <p>Unused State: {unusedState}</p>
      </div>
      <div className="component-stats">
        <p>Mount Time: {mountTime.current?.toFixed(2)}ms</p>
        <p>Unnecessary Renders: {unnecessaryRenders.current}</p>
        <p>Last Render Time: {performance.now() - renderStartTime.current}ms</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <PerformanceMonitorProvider>
      <div className="App">
        <header className="App-header">
          <div className="dashboard-header">
            <h1>React Performance Monitor Example</h1>
          </div>
          
          <div className="test-components">
            <TestComponent />
            <HeavyComponent />
            <UnnecessaryRenderComponent />
          </div>

          <PerformanceDashboard />
        </header>
      </div>
    </PerformanceMonitorProvider>
  );
}

export default App;
