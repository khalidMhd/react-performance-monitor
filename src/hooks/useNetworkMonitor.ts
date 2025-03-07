import { useEffect, useRef } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';
import type { NetworkRequest } from '../types';

interface UseNetworkMonitorOptions {
  componentName: string;
}

export const useNetworkMonitor = ({ componentName }: UseNetworkMonitorOptions) => {
  const { updateMetrics } = usePerformanceContext();
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

        updateMetrics(componentName, {
          networkRequests: (prev) => [...(prev || []), { requests: [networkRequest] }],
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

        updateMetrics(componentName, {
          networkRequests: (prev) => [...(prev || []), { requests: [networkRequest] }],
        });

        throw error;
      }
    };

    global.fetch = fetchWithMetrics as typeof fetch;

    return () => {
      global.fetch = currentFetch;
    };
  }, [componentName, updateMetrics]);

  return null;
}; 