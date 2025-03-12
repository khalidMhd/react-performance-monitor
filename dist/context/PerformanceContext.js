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
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
var defaultMetrics = {
    components: {},
    totalMounts: 0,
    totalUpdates: 0,
    totalRenderTime: 0,
    slowestComponent: null,
    unnecessaryRenderCount: 0,
};
var defaultConfig = {
    enableLogging: true,
    renderWarningThreshold: 16, // ms
    mountWarningThreshold: 100, // ms
    unnecessaryRenderWarningThreshold: 5,
    excludeComponents: [],
    logLevel: 'warn',
};
var PerformanceContext = createContext(null);
function resolveUpdate(update, prevValue) {
    if (typeof update === 'function') {
        return update(prevValue);
    }
    return update;
}
function resolveMetricUpdate(key, update, prevValue) {
    return resolveUpdate(update, prevValue);
}
function findSlowestComponent(components) {
    return Object.entries(components).reduce(function (slowest, _a) {
        var name = _a[0], metrics = _a[1];
        if (!slowest || metrics.totalRenderTime > components[slowest].totalRenderTime) {
            return name;
        }
        return slowest;
    }, null);
}
// Calculate total render time across all components
function calculateTotalRenderTime(components) {
    return Object.values(components).reduce(function (total, component) {
        return total + component.totalRenderTime;
    }, 0);
}
export var PerformanceProvider = function (_a) {
    var children = _a.children;
    var _b = useState(defaultMetrics), metrics = _b[0], setMetrics = _b[1];
    var _c = useState(defaultConfig), config = _c[0], setConfigState = _c[1];
    var updateMetrics = useCallback(function (componentName, metricUpdate) {
        setMetrics(function (prevMetrics) {
            var _a;
            // Get or create component metrics
            var componentMetrics = prevMetrics.components[componentName] || {
                componentName: componentName,
                renderCount: 0,
                mountTime: 0,
                updateTimes: [],
                lastRenderTime: 0,
                unnecessaryRenders: 0,
                totalRenderTime: 0,
            };
            // Create new metrics object with updates
            var updatedComponentMetrics = __assign({}, componentMetrics);
            var updates = Object.entries(metricUpdate);
            // Apply all updates in a single pass
            for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                var _b = updates_1[_i], key = _b[0], update = _b[1];
                if (update !== undefined) {
                    var currentValue = componentMetrics[key];
                    updatedComponentMetrics[key] = resolveMetricUpdate(key, update, currentValue);
                }
            }
            // Create new components object
            var updatedComponents = __assign(__assign({}, prevMetrics.components), (_a = {}, _a[componentName] = updatedComponentMetrics, _a));
            // Find slowest component
            var slowestComponent = findSlowestComponent(updatedComponents);
            // Calculate total render time across all components
            var totalRenderTime = calculateTotalRenderTime(updatedComponents);
            // Return new metrics state
            return __assign(__assign({}, prevMetrics), { components: updatedComponents, slowestComponent: slowestComponent, totalRenderTime: totalRenderTime });
        });
    }, []);
    var resetMetrics = useCallback(function () {
        setMetrics(defaultMetrics);
    }, []);
    var setConfig = useCallback(function (newConfig) {
        setConfigState(function (prev) { return (__assign(__assign({}, prev), newConfig)); });
    }, []);
    // Memoize context value to prevent unnecessary re-renders
    var contextValue = useMemo(function () { return ({
        metrics: metrics,
        config: config,
        updateMetrics: updateMetrics,
        resetMetrics: resetMetrics,
        setConfig: setConfig,
    }); }, [metrics, config, updateMetrics, resetMetrics, setConfig]);
    return (_jsx(PerformanceContext.Provider, { value: contextValue, children: children }));
};
export var usePerformanceContext = function () {
    var context = useContext(PerformanceContext);
    if (!context) {
        throw new Error('usePerformanceContext must be used within a PerformanceProvider');
    }
    return context;
};
