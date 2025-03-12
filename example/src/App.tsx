import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import './App.css';

// Import the performance monitoring components
import { 
  PerformanceMonitoringProvider, 
  PerformanceDashboard,
  withPerformanceTracking
} from 'react-perf-mon';

interface DataItem {
  id: number;
  title: string;
}

// Simulated data fetching
const fetchData = (): Promise<DataItem[]> => new Promise(resolve => 
  setTimeout(() => resolve([
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' },
  ]), 1500)
);

// Lazy loaded component content
const LazyComponentContent = () => {
  return (
    <div className="lazy-component">
      <h2>Lazy Loaded Component</h2>
      <p>This component was loaded lazily after a delay.</p>
    </div>
  );
};

// Wrap with performance tracking
const TrackedLazyComponentContent = withPerformanceTracking(LazyComponentContent, 'LazyComponent');

// Lazy loaded component
const LazyComponent = React.lazy(() =>
  new Promise<{ default: React.ComponentType }>(resolve =>
    setTimeout(() =>
      // Simulating a lazy-loaded component
      resolve({
        default: TrackedLazyComponentContent
      }),
      2000
    )
  )
);

// Component with intentional performance issues
const SlowComponentBase = ({ count, delay = 50 }: { count: number; delay?: number }) => {
  // Simulate slow rendering
  const startTime = performance.now();
  while (performance.now() - startTime < delay) {
    // Artificial delay
  }

  return (
    <div className="slow-component">
      <h2>Slow Component ({delay}ms delay)</h2>
      <p>Count: {count}</p>
    </div>
  );
};

// Wrap with performance tracking
const SlowComponent = withPerformanceTracking(SlowComponentBase, 'SlowComponent');

// Component with unnecessary re-renders
const UnnecessaryRendersBase = ({ updateCount }: { updateCount: number }) => {
  const [localState, setLocalState] = useState(0);

  // This will cause unnecessary re-renders
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalState(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // This creates a new object on every render, causing child components to re-render
  const data = { count: localState };

  return (
    <div className="unnecessary-renders">
      <h2>Component with Unnecessary Renders</h2>
      <p>Local State: {localState}</p>
      <p>Parent Update Count: {updateCount}</p>
      <ChildComponent data={data} />
    </div>
  );
};

// Wrap with performance tracking
const UnnecessaryRenders = withPerformanceTracking(UnnecessaryRendersBase, 'UnnecessaryRenders');

// Child component that re-renders unnecessarily
const ChildComponentBase = ({ data }: { data: { count: number } }) => {
  console.log('ChildComponent rendered');
  return (
    <div className="child-component">
      <p>Child component (should use React.memo with proper deps)</p>
      <p>Count from parent: {data.count}</p>
    </div>
  );
};

// Wrap with performance tracking
const ChildComponent = withPerformanceTracking(React.memo(ChildComponentBase), 'ChildComponent');

// Network request component
const DataFetcherBase = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  const fetchMore = async () => {
    setLoading(true);
    const newData = await fetchData();
    setData(prev => [...prev, ...newData]);
    setLoading(false);
    setFetchCount(prev => prev + 1);
  };

  // Simulate multiple network requests
  const fetchMultiple = async () => {
    setLoading(true);
    for (let i = 0; i < 3; i++) {
      const newData = await fetchData();
      setData(prev => [...prev, ...newData]);
    }
    setLoading(false);
    setFetchCount(prev => prev + 3);
  };

  return (
    <div className="data-fetcher">
      <h2>Network Request Component</h2>
      <div className="button-group">
        <button onClick={fetchMore} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
        <button onClick={fetchMultiple} disabled={loading}>
          Fetch Multiple
        </button>
      </div>
      <p>Total fetches: {fetchCount}</p>
      <ul>
        {data.map((item, index) => (
          <li key={`${item.id}-${index}`}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

// Wrap with performance tracking
const DataFetcher = withPerformanceTracking(DataFetcherBase, 'DataFetcher');

// Memory intensive component
const MemoryComponentBase = () => {
  const [items, setItems] = useState<number[]>([]);
  const [leakedArrays, setLeakedArrays] = useState<number>(0);
  
  // This array is intentionally stored in a closure to simulate a memory leak
  const leakedReferences: any[] = [];

  const addManyItems = () => {
    // Add a large number of items to potentially stress memory
    setItems(prev => [...prev, ...Array(1000).fill(0).map((_, i) => prev.length + i)]);
  };

  const simulateMemoryLeak = () => {
    // Create a large array and store it in our leaked references
    const largeArray = new Array(10000).fill(0).map((_, i) => ({ id: i, data: `Item ${i}` }));
    leakedReferences.push(largeArray);
    setLeakedArrays(leakedReferences.length);
  };

  const clearItems = () => {
    setItems([]);
  };

  return (
    <div className="memory-component">
      <h2>Memory Intensive Component</h2>
      <div className="button-group">
        <button onClick={addManyItems}>Add 1000 Items</button>
        <button onClick={simulateMemoryLeak}>Simulate Memory Leak</button>
        <button onClick={clearItems}>Clear Items</button>
      </div>
      <p>Total items: {items.length}</p>
      <p>Leaked arrays: {leakedArrays}</p>
      <div className="items-container">
        {items.slice(0, 10).map(item => (
          <span key={item} className="item-box">{item}</span>
        ))}
        {items.length > 10 && <span>...and {items.length - 10} more</span>}
      </div>
    </div>
  );
};

// Wrap with performance tracking
const MemoryComponent = withPerformanceTracking(MemoryComponentBase, 'MemoryComponent');

// Component that demonstrates proper and improper use of hooks
const HooksDemoBase = ({ count }: { count: number }) => {
  // Proper use of useMemo
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += (i * count) % 2;
    }
    return result;
  }, [count]);

  // Proper use of useCallback
  const memoizedCallback = useCallback(() => {
    console.log('Memoized callback called');
    return count * 2;
  }, [count]);

  // Improper use of useCallback (dependencies missing)
  const [localState, setLocalState] = useState(0);
  const badCallback = useCallback(() => {
    console.log('Bad callback called');
    return count * localState; // localState should be in deps array
  }, [count, localState]); // Fixed: Added localState to deps

  return (
    <div className="hooks-demo">
      <h2>Hooks Usage Demo</h2>
      <p>Count: {count}</p>
      <p>Expensive calculation result: {expensiveValue}</p>
      <p>Local state: {localState}</p>
      <button onClick={() => setLocalState(prev => prev + 1)}>
        Increment Local State
      </button>
      <p>Memoized callback result: {memoizedCallback()}</p>
      <p>Bad callback result: {badCallback()}</p>
    </div>
  );
};

// Wrap with performance tracking
const HooksDemo = withPerformanceTracking(HooksDemoBase, 'HooksDemo');

function App() {
  const [count, setCount] = useState(0);
  const [showLazy, setShowLazy] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [slowComponentDelay, setSlowComponentDelay] = useState(50);

  // This will cause unnecessary re-renders at the app level
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c);  // Setting to same value causes re-render
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const increaseDelay = () => {
    setSlowComponentDelay(prev => Math.min(prev + 50, 500));
  };

  const decreaseDelay = () => {
    setSlowComponentDelay(prev => Math.max(prev - 50, 0));
  };

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
        },
        excludeComponents: []
      }}
      enableTracking={true}
    >
      <div className="App">
        <header className="App-header">
          <h1>React Performance Monitor Demo</h1>
          <p>
            This app demonstrates various performance scenarios that can be monitored.
          </p>
        </header>

        <div className="controls">
          <button onClick={() => setCount(c => c + 1)}>
            Increment Counter ({count})
          </button>
          <button onClick={() => setShowLazy(!showLazy)}>
            {showLazy ? 'Hide' : 'Show'} Lazy Component
          </button>
          <button onClick={() => setShowDashboard(!showDashboard)}>
            {showDashboard ? 'Hide' : 'Show'} Performance Dashboard
          </button>
          <div className="delay-controls">
            <button onClick={decreaseDelay}>Decrease Delay</button>
            <span>Slow Component Delay: {slowComponentDelay}ms</span>
            <button onClick={increaseDelay}>Increase Delay</button>
          </div>
        </div>

        <div className="components-grid">
          <SlowComponent count={count} delay={slowComponentDelay} />
          <UnnecessaryRenders updateCount={count} />
          <DataFetcher />
          <MemoryComponent />
          <HooksDemo count={count} />
          
          {showLazy && (
            <Suspense fallback={<div className="loading">Loading lazy component...</div>}>
              <LazyComponent />
            </Suspense>
          )}
        </div>

        {showDashboard && <PerformanceDashboard />}
      </div>
    </PerformanceMonitoringProvider>
  );
}

export default App;
