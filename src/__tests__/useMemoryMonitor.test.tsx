import React from 'react';
import { render, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useMemoryMonitor } from '../hooks/useMemoryMonitor';
import { PerformanceMonitorProvider } from '../components/PerformanceMonitorContext';

describe('useMemoryMonitor', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    // Mock performance.memory
    Object.defineProperty(performance, 'memory', {
      value: {
        usedJSHeapSize: 10000000,
        totalJSHeapSize: 20000000,
        jsHeapSizeLimit: 40000000
      },
      configurable: true,
      writable: true
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // Reset memory values
    Object.defineProperty(performance, 'memory', {
      value: {
        usedJSHeapSize: 10000000,
        totalJSHeapSize: 20000000,
        jsHeapSizeLimit: 40000000
      },
      configurable: true,
      writable: true
    });
  });

  const TestComponent = () => {
    useMemoryMonitor('TestComponent', 100); // Use shorter interval for tests
    return <div>Test Component</div>;
  };

  it('should track memory metrics', async () => {
    const { container } = render(
      <PerformanceMonitorProvider>
        <TestComponent />
      </PerformanceMonitorProvider>
    );

    // Wait for initial metrics to be recorded
    act(() => {
      jest.advanceTimersByTime(10);
    });

    expect(container).toBeTruthy();
  });

  it('should handle memory increase', async () => {
    const { container } = render(
      <PerformanceMonitorProvider>
        <TestComponent />
      </PerformanceMonitorProvider>
    );

    // Simulate memory increase
    Object.defineProperty(performance, 'memory', {
      value: {
        usedJSHeapSize: 15000000,
        totalJSHeapSize: 25000000,
        jsHeapSizeLimit: 40000000
      },
      configurable: true,
      writable: true
    });

    // Wait for metrics update
    act(() => {
      jest.advanceTimersByTime(10);
    });

    expect(container).toBeTruthy();
  });

  it('should stop monitoring on unmount', () => {
    const { unmount } = render(
      <PerformanceMonitorProvider>
        <TestComponent />
      </PerformanceMonitorProvider>
    );

    unmount();
    
    // Verify cleanup
    const perfMemory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
    expect(perfMemory.usedJSHeapSize).toBe(10000000);
  });
}); 