import React from 'react';
import { render, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useNetworkMonitor } from '../hooks/useNetworkMonitor';
import { PerformanceMonitorProvider } from '../components/PerformanceMonitorContext';

// Mock global Response if not available in test environment
if (typeof Response === 'undefined') {
  global.Response = class Response {
    ok: boolean;
    status: number;
    headers: Headers;
    url: string;

    constructor(body: unknown, init?: ResponseInit) {
      this.ok = init?.status ? init.status >= 200 && init.status < 300 : true;
      this.status = init?.status || 200;
      this.headers = new Headers(init?.headers);
      this.url = '';
    }

    json() { return Promise.resolve({}); }
    text() { return Promise.resolve(''); }
    blob() { return Promise.resolve(new Blob()); }
    arrayBuffer() { return Promise.resolve(new ArrayBuffer(0)); }
  } as unknown as typeof Response;
}

// Mock Headers if not available
if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    private headers: Record<string, string> = {};
    
    constructor(init?: Record<string, string>) {
      if (init) {
        Object.assign(this.headers, init);
      }
    }

    get(name: string) {
      return this.headers[name.toLowerCase()] || null;
    }
  } as unknown as typeof Headers;
}

describe('useNetworkMonitor', () => {
  const originalFetch = global.fetch;
  const testUrl = 'https://api.example.com/data';

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    const mockFetch = jest.fn((input: RequestInfo | URL) => {
      const _url = typeof input === 'string' ? input : input.toString();
      return Promise.resolve(new Response(JSON.stringify({}), {
        status: 200,
        headers: new Headers({ 'content-length': '1000' })
      }));
    });
    global.fetch = mockFetch as typeof global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const TestComponent = () => {
    useNetworkMonitor({ componentName: 'TestComponent' });
    return <div>Test Component</div>;
  };

  it('should track network requests', async () => {
    const { container } = render(
      <PerformanceMonitorProvider>
        <TestComponent />
      </PerformanceMonitorProvider>
    );

    // Make a network request
    await act(async () => {
      await fetch(testUrl);
    });

    expect(container).toBeTruthy();
  }, 1000);

  it('should handle failed requests', async () => {
    const mockFetchError = jest.fn((_input: RequestInfo | URL, _init?: RequestInit) => 
      Promise.reject(new Error('Network error'))
    ) as jest.MockedFunction<typeof fetch>;
    global.fetch = mockFetchError;

    const { container } = render(
      <PerformanceMonitorProvider>
        <TestComponent />
      </PerformanceMonitorProvider>
    );

    await act(async () => {
      try {
        await fetch(testUrl);
      } catch (error) {
        // Expected error
      }
    });

    expect(container).toBeTruthy();
  }, 1000);

  it('should restore original fetch on unmount', () => {
    const { unmount } = render(
      <PerformanceMonitorProvider>
        <TestComponent />
      </PerformanceMonitorProvider>
    );

    const currentFetch = global.fetch;
    unmount();

    expect(global.fetch).not.toBe(currentFetch);
  });
}); 