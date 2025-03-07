import React, { useState, useEffect, Suspense } from 'react';
import { PerformanceMonitorProvider } from './components/PerformanceMonitorContext';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import styled from '@emotion/styled';

interface DataItem {
  id: number;
  title: string;
}

// Simulated data fetching
const fetchData = (): Promise<DataItem[]> => new Promise(_resolve => setTimeout(() => _resolve([
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
  { id: 3, title: 'Item 3' },
]), 1500));

// Lazy loaded component
const LazyList = React.lazy(() =>
  new Promise(_resolve =>
    setTimeout(() =>
      import('./components/LazyList/index')
        .then(module => ({ default: module.default })),
      2000
    )
  )
);

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

const Counter = React.memo(({ count, onIncrement }: { count: number; onIncrement: () => void }) => {
  console.log('Counter rendered');
  return (
    <div>
      <h2>Counter: {count}</h2>
      <Button onClick={onIncrement}>Increment</Button>
    </div>
  );
});

const DataFetcher = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMore = async () => {
    setLoading(true);
    const newData = await fetchData();
    setData(prev => [...prev, ...newData]);
    setLoading(false);
  };

  return (
    <div>
      <h2>Data Fetcher</h2>
      <Button onClick={fetchMore} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch More'}
      </Button>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

const HeavyComponent = () => {
  const [items, setItems] = useState<number[]>([]);

  const addItem = () => {
    // Simulate heavy computation
    const start = performance.now();
    while (performance.now() - start < 100) {
      // Busy wait for 100ms
    }
    setItems(prev => [...prev, prev.length]);
  };

  return (
    <div>
      <h2>Heavy Component</h2>
      <Button onClick={addItem}>Add Item (Slow)</Button>
      <ul>
        {items.map(item => (
          <li key={item}>Item {item}</li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [count, setCount] = useState(0);
  const [showLazy, setShowLazy] = useState(false);

  useEffect(() => {
    // Simulate unnecessary renders
    const interval = setInterval(() => {
      setCount(c => c);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PerformanceMonitorProvider>
      <Container>
        <h1>Performance Monitor Test App</h1>
        <PerformanceDashboard />
        
        <Counter
          count={count}
          onIncrement={() => setCount(c => c + 1)}
        />

        <DataFetcher />
        
        <HeavyComponent />

        <Button onClick={() => setShowLazy(!showLazy)}>
          Toggle Lazy Component
        </Button>

        {showLazy && (
          <Suspense fallback={<div>Loading lazy component...</div>}>
            <LazyList />
          </Suspense>
        )}
      </Container>
    </PerformanceMonitorProvider>
  );
};

export default App; 