import { useEffect, useRef } from 'react';
import { usePerformanceMonitorContext } from '../components/PerformanceMonitorContext';
export var useMemoryMonitor = function (componentName, interval) {
    if (interval === void 0) { interval = 5000; }
    var updateMemoryMetrics = usePerformanceMonitorContext().updateMemoryMetrics;
    var intervalRef = useRef();
    useEffect(function () {
        // Check if performance.memory is available (Chrome only)
        if (!performance.memory) {
            console.warn('Memory monitoring is only available in Chrome');
            return;
        }
        var trackMemory = function () {
            var memory = performance.memory;
            var metrics = {
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                totalJSHeapSize: memory.totalJSHeapSize,
                usedJSHeapSize: memory.usedJSHeapSize,
                timestamp: Date.now(),
            };
            updateMemoryMetrics(metrics);
        };
        // Take initial snapshot
        trackMemory();
        // Set up interval for tracking
        intervalRef.current = window.setInterval(trackMemory, interval);
        // Cleanup
        return function () {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [componentName, interval, updateMemoryMetrics]);
    return {
        takeSnapshot: function () {
            if (!performance.memory) {
                console.warn('Memory monitoring is only available in Chrome');
                return;
            }
            var memory = performance.memory;
            return {
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                totalJSHeapSize: memory.totalJSHeapSize,
                usedJSHeapSize: memory.usedJSHeapSize,
                timestamp: Date.now(),
            };
        },
    };
};
