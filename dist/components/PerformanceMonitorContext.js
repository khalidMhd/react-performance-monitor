var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useRef, useCallback, useState } from 'react';
var initialNetworkMetrics = {
    requests: []
};
var initialMemoryMetrics = {
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0,
    timestamp: Date.now()
};
var PerformanceMonitorContext = createContext(null);
export var PerformanceMonitorProvider = function (_a) {
    var children = _a.children, _b = _a.config, config = _b === void 0 ? {} : _b;
    var subscribersRef = useRef(new Set());
    var configRef = useRef(__assign({ enabled: true, logToConsole: true, includeWarnings: true }, config));
    var _c = useState(initialNetworkMetrics), networkMetrics = _c[0], setNetworkMetrics = _c[1];
    var _d = useState(initialMemoryMetrics), memoryMetrics = _d[0], setMemoryMetrics = _d[1];
    var emitWarning = useCallback(function (warning) {
        subscribersRef.current.forEach(function (subscriber) {
            var _a;
            (_a = subscriber.onWarning) === null || _a === void 0 ? void 0 : _a.call(subscriber, warning);
        });
    }, []);
    var recordMetric = useCallback(function (metric) {
        var _a;
        if (!configRef.current.enabled)
            return;
        // Check if component is excluded
        if ((_a = configRef.current.excludeComponents) === null || _a === void 0 ? void 0 : _a.includes(metric.componentName)) {
            return;
        }
        // Notify subscribers
        subscribersRef.current.forEach(function (subscriber) {
            subscriber.onMetricUpdate(metric);
        });
        // Check thresholds and emit warnings
        if (configRef.current.includeWarnings && configRef.current.thresholds) {
            var thresholds = configRef.current.thresholds;
            if (thresholds.maxRenderCount && metric.renderCount > thresholds.maxRenderCount) {
                emitWarning({
                    componentName: metric.componentName,
                    type: 'render-count',
                    value: metric.renderCount,
                    threshold: thresholds.maxRenderCount,
                    timestamp: Date.now(),
                });
            }
            if (thresholds.maxMountTime && metric.mountTime > thresholds.maxMountTime) {
                emitWarning({
                    componentName: metric.componentName,
                    type: 'mount-time',
                    value: metric.mountTime,
                    threshold: thresholds.maxMountTime,
                    timestamp: Date.now(),
                });
            }
        }
        // Log to console if enabled
        if (configRef.current.logToConsole) {
            console.log("[Performance Monitor] ".concat(metric.componentName, ":"), metric);
        }
    }, [emitWarning]);
    var subscribe = useCallback(function (subscriber) {
        subscribersRef.current.add(subscriber);
        return function () {
            subscribersRef.current.delete(subscriber);
        };
    }, []);
    var getConfig = useCallback(function () { return configRef.current; }, []);
    var updateNetworkMetrics = useCallback(function (metrics) {
        setNetworkMetrics(metrics);
    }, []);
    var updateMemoryMetrics = useCallback(function (metrics) {
        setMemoryMetrics(metrics);
    }, []);
    var contextValue = {
        recordMetric: recordMetric,
        subscribe: subscribe,
        getConfig: getConfig,
        networkMetrics: networkMetrics,
        memoryMetrics: memoryMetrics,
        updateNetworkMetrics: updateNetworkMetrics,
        updateMemoryMetrics: updateMemoryMetrics
    };
    return (_jsx(PerformanceMonitorContext.Provider, { value: contextValue, children: children }));
};
export var usePerformanceMonitorContext = function () {
    var context = useContext(PerformanceMonitorContext);
    if (!context) {
        throw new Error('usePerformanceMonitorContext must be used within a PerformanceMonitorProvider');
    }
    return context;
};
