import { useEffect, useRef } from 'react';
import { usePerformanceMonitorContext } from '../components/PerformanceMonitorContext';
import type { NetworkRequest } from '../types';

interface UseNetworkMonitorOptions {
  componentName: string;
}

export const useNetworkMonitor = ({ componentName }: UseNetworkMonitorOptions) => {
  const { updateNetworkMetrics } = usePerformanceMonitorContext();
  const originalFetch = useRef<typeof fetch>(global.fetch);

  useEffect(() => {
    const currentFetch = originalFetch.current;
    const fetchWithMetrics = async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = performance.now();
      const url = typeof input === 'string' ? input : input.toString();

      try {
        const response = await currentFetch(input, init);
        const duration = performance.now() - startTime;

        const networkRequest: NetworkRequest = {
          url,
          method: init?.method || 'GET',
          duration,
          status: response.status,
          timestamp: Date.now(),
        };

        updateNetworkMetrics({
          requests: [networkRequest]
        });

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        const networkRequest: NetworkRequest = {
          url,
          method: init?.method || 'GET',
          duration,
          status: 'error',
          timestamp: Date.now(),
          error: error instanceof Error ? error.message : 'Unknown error',
        };

        updateNetworkMetrics({
          requests: [networkRequest]
        });

        throw error;
      }
    };

    global.fetch = fetchWithMetrics as typeof fetch;

    return () => {
      global.fetch = currentFetch;
    };
  }, [componentName, updateNetworkMetrics]);

  return null;
}; 