import React from 'react';
import { render, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { PerformanceProvider, usePerformanceContext } from '../context/PerformanceContext';

describe('usePerformanceMonitor', () => {
  let nowValue = 0;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    nowValue = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => nowValue);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const TestComponent = ({ data }: { data: string }) => {
    usePerformanceMonitor({
      componentName: 'TestComponent',
      dependencies: [data],
    });
    return <div>{data}</div>;
  };

  const MetricsDisplay = () => {
    const { metrics } = usePerformanceContext();
    return <div data-testid="metrics">{JSON.stringify(metrics)}</div>;
  };

  it('should track initial mount time', () => {
    const { getByTestId } = render(
      <PerformanceProvider>
        <TestComponent data="test" />
        <MetricsDisplay />
      </PerformanceProvider>
    );

    // Simulate time passing during mount
    nowValue = 10;
    act(() => {
      jest.advanceTimersByTime(1);
    });

    const metricsElement = getByTestId('metrics');
    const metrics = JSON.parse(metricsElement.textContent || '');
    const componentMetrics = metrics.components.TestComponent;

    expect(componentMetrics).toBeTruthy();
    expect(componentMetrics.mountTime).toBe(10);
    expect(componentMetrics.renderCount).toBe(1);
    expect(componentMetrics.updateTimes).toEqual([]);
  });

  it('should track updates and detect unnecessary renders', () => {
    const { getByTestId, rerender } = render(
      <PerformanceProvider>
        <TestComponent data="test" />
        <MetricsDisplay />
      </PerformanceProvider>
    );

    // Initial mount
    nowValue = 10;
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Update with new data
    nowValue = 20;
    rerender(
      <PerformanceProvider>
        <TestComponent data="updated" />
        <MetricsDisplay />
      </PerformanceProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1);
    });

    // Update with same data (unnecessary render)
    nowValue = 30;
    rerender(
      <PerformanceProvider>
        <TestComponent data="updated" />
        <MetricsDisplay />
      </PerformanceProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1);
    });

    const metricsElement = getByTestId('metrics');
    const metrics = JSON.parse(metricsElement.textContent || '');
    const componentMetrics = metrics.components.TestComponent;

    expect(componentMetrics.renderCount).toBe(3);
    expect(componentMetrics.updateTimes).toHaveLength(2);
    expect(componentMetrics.unnecessaryRenders).toBe(1);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Unnecessary render detected in TestComponent')
    );
  });

  it('should respect excludeComponents config', () => {
    const { getByTestId } = render(
      <PerformanceProvider>
        <TestComponent data="test" />
        <MetricsDisplay />
      </PerformanceProvider>
    );

    const metricsElement = getByTestId('metrics');
    let metrics = JSON.parse(metricsElement.textContent || '');
    expect(metrics.components.TestComponent).toBeTruthy();

    // Update config to exclude TestComponent
    const TestConfigUpdater = () => {
      const { setConfig } = usePerformanceContext();
      React.useEffect(() => {
        setConfig({ excludeComponents: ['TestComponent'] });
      }, [setConfig]);
      return null;
    };

    render(
      <PerformanceProvider>
        <TestConfigUpdater />
        <TestComponent data="test" />
        <MetricsDisplay />
      </PerformanceProvider>
    );

    metrics = JSON.parse(getByTestId('metrics').textContent || '');
    expect(metrics.components.TestComponent).toBeFalsy();
  });

  it('should track slow renders', () => {
    nowValue = 0;

    render(
      <PerformanceProvider>
        <TestComponent data="test" />
      </PerformanceProvider>
    );

    // Simulate a slow render
    nowValue = 50;
    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Slow mount detected in TestComponent: 50.00ms')
    );
  });
}); 