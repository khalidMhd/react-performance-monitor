export declare const useMemoryMonitor: (componentName: string, interval?: number) => {
    takeSnapshot: () => {
        jsHeapSizeLimit: any;
        totalJSHeapSize: any;
        usedJSHeapSize: any;
        timestamp: number;
    } | undefined;
};
