import React from 'react';
import { render, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { PerformanceProvider, usePerformanceContext } from '../context/PerformanceContext';

const TestConsumer = () => {
  const { metrics, config, setConfig, resetMetrics } = usePerformanceContext();
  
  return (
    <div>
      <div data-testid="metrics">{JSON.stringify(metrics)}</div>
      <div data-testid="config">{JSON.stringify(config)}</div>
      <button 
        data-testid="reset-btn" 
        onClick={resetMetrics}
      >
        Reset
      </button>
      <button 
        data-testid="config-btn" 
        onClick={() => setConfig({ enableLogging: false })}
      >
        Update Config
      </button>
    </div>
  );
};

describe('PerformanceContext', () => {
  it('should provide default metrics and config', () => {
    const { getByTestId } = render(
      <PerformanceProvider>
        <TestConsumer />
      </PerformanceProvider>
    );

    const metricsElement = getByTestId('metrics');
    const configElement = getByTestId('config');

    const metrics = JSON.parse(metricsElement.textContent || '');
    const config = JSON.parse(configElement.textContent || '');

    expect(metrics).toEqual({
      components: {},
      totalMounts: 0,
      totalUpdates: 0,
      totalRenderTime: 0,
      slowestComponent: null,
      unnecessaryRenderCount: 0,
    });

    expect(config).toEqual({
      enableLogging: true,
      renderWarningThreshold: 16,
      mountWarningThreshold: 100,
      unnecessaryRenderWarningThreshold: 5,
      excludeComponents: [],
      logLevel: 'warn',
    });
  });

  it('should update config when setConfig is called', () => {
    const { getByTestId } = render(
      <PerformanceProvider>
        <TestConsumer />
      </PerformanceProvider>
    );

    const configBtn = getByTestId('config-btn');
    act(() => {
      configBtn.click();
    });

    const configElement = getByTestId('config');
    const config = JSON.parse(configElement.textContent || '');
    expect(config.enableLogging).toBe(false);
  });

  it('should reset metrics when resetMetrics is called', () => {
    const { getByTestId } = render(
      <PerformanceProvider>
        <TestConsumer />
      </PerformanceProvider>
    );

    const resetBtn = getByTestId('reset-btn');
    act(() => {
      resetBtn.click();
    });

    const metricsElement = getByTestId('metrics');
    const metrics = JSON.parse(metricsElement.textContent || '');
    expect(metrics).toEqual({
      components: {},
      totalMounts: 0,
      totalUpdates: 0,
      totalRenderTime: 0,
      slowestComponent: null,
      unnecessaryRenderCount: 0,
    });
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('usePerformanceContext must be used within a PerformanceProvider');
    
    consoleError.mockRestore();
  });
}); 