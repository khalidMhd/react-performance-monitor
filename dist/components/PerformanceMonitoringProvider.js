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
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { PerformanceMonitorProvider, usePerformanceMonitorContext } from './PerformanceMonitorContext';
import { PerformanceProvider, usePerformanceContext } from '../context/PerformanceContext';
/**
 * A combined provider that connects both PerformanceMonitorProvider and PerformanceProvider
 * This allows the PerformanceDashboard to work with metrics collected by PerformanceMonitorProvider
 *
 * @example
 * ```jsx
 * <PerformanceMonitoringProvider config={{ enabled: true, logToConsole: true }}>
 *   <App />
 *   {showDashboard && <PerformanceDashboard />}
 * </PerformanceMonitoringProvider>
 * ```
 */
export var PerformanceMonitoringProvider = function (_a) {
    var children = _a.children, config = _a.config, _b = _a.enableTracking, enableTracking = _b === void 0 ? true : _b;
    var finalConfig = __assign({ enabled: enableTracking, logToConsole: false, includeWarnings: true }, config);
    // IMPORTANT: The order of providers matters!
    // PerformanceProvider must be the outer provider because the bridge component
    // needs to access both contexts, and the PerformanceContext must be available first
    return (_jsx(PerformanceProvider, { children: _jsx(PerformanceMonitorProvider, { config: finalConfig, children: _jsx(PerformanceMonitorBridge, { children: children }) }) }));
};
/**
 * Bridge component that connects the two contexts by forwarding metrics
 * from PerformanceMonitorContext to PerformanceContext
 */
var PerformanceMonitorBridge = function (_a) {
    var children = _a.children;
    // Access both contexts
    var performanceContext = usePerformanceContext();
    var monitorContext = usePerformanceMonitorContext();
    useEffect(function () {
        if (!performanceContext || !monitorContext)
            return;
        // Subscribe to metrics from PerformanceMonitorContext and forward them to PerformanceContext
        var unsubscribe = monitorContext.subscribe({
            onMetricUpdate: function (metric) {
                performanceContext.updateMetrics(metric.componentName, {
                    renderCount: metric.renderCount,
                    mountTime: metric.mountTime,
                    updateTimes: metric.updateTimes,
                    lastRenderTime: metric.lastRenderTime,
                    totalRenderTime: metric.totalRenderTime,
                    unnecessaryRenders: metric.unnecessaryRenders
                });
            },
            onReset: function () {
                // Handle reset if needed
                performanceContext.resetMetrics();
            }
        });
        return unsubscribe;
    }, [performanceContext, monitorContext]);
    return _jsx(_Fragment, { children: children });
};
// Create a context-safe version of the HOC
var createSafeHOC = function (Component, displayName, trackingFunction) {
    var SafeComponent = function (props) {
        try {
            return trackingFunction(props);
        }
        catch (error) {
            console.warn("Performance tracking not available for ".concat(displayName, ": ").concat(error));
            return _jsx(Component, __assign({}, props));
        }
    };
    SafeComponent.displayName = "WithPerformanceTracking(".concat(displayName, ")");
    return SafeComponent;
};
/**
 * Higher-Order Component that wraps a component to track its performance metrics
 *
 * @example
 * ```jsx
 * const MyTrackedComponent = withPerformanceTracking(MyComponent, 'MyComponent');
 * ```
 *
 * @param Component The component to wrap
 * @param componentName Optional custom name for the component (defaults to Component.displayName or Component.name)
 */
export function withPerformanceTracking(Component, componentName) {
    var displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
    var TrackingComponent = function (props) {
        var _a;
        var _b = usePerformanceMonitorContext(), recordMetric = _b.recordMetric, getConfig = _b.getConfig;
        var renderStartTime = useRef(0);
        var isFirstRender = useRef(true);
        var renderCount = useRef(0);
        var totalRenderTime = useRef(0);
        var updateTimes = useRef([]);
        var mountTime = useRef(0);
        var unnecessaryRenders = useRef(0);
        var prevProps = useRef(null);
        var shouldTrack = useRef(true);
        // Check if tracking is enabled
        var config = getConfig();
        shouldTrack.current = config.enabled !== false && !((_a = config.excludeComponents) === null || _a === void 0 ? void 0 : _a.includes(displayName));
        // Before render
        renderStartTime.current = performance.now();
        // Check if props have changed
        var hasPropsChanged = function () {
            if (!prevProps.current)
                return true;
            var prevEntries = Object.entries(prevProps.current);
            var currentEntries = Object.entries(props);
            if (prevEntries.length !== currentEntries.length)
                return true;
            for (var _i = 0, currentEntries_1 = currentEntries; _i < currentEntries_1.length; _i++) {
                var _a = currentEntries_1[_i], key = _a[0], value = _a[1];
                if (prevProps.current[key] !== value)
                    return true;
            }
            return false;
        };
        // After render
        useEffect(function () {
            if (!shouldTrack.current)
                return;
            var renderTime = performance.now() - renderStartTime.current;
            renderCount.current += 1;
            totalRenderTime.current += renderTime;
            if (isFirstRender.current) {
                // First render (mount)
                mountTime.current = renderTime;
                isFirstRender.current = false;
            }
            else {
                // Update render
                updateTimes.current.push(renderTime);
                // Check if props changed
                var propsChanged = hasPropsChanged();
                if (!propsChanged) {
                    unnecessaryRenders.current += 1;
                }
            }
            // Record the metric
            recordMetric({
                componentName: displayName,
                renderCount: renderCount.current,
                mountTime: mountTime.current,
                updateTimes: updateTimes.current,
                lastRenderTime: renderTime,
                totalRenderTime: totalRenderTime.current,
                unnecessaryRenders: unnecessaryRenders.current,
                timestamp: Date.now()
            });
            // Update prevProps for next comparison
            prevProps.current = __assign({}, props);
        });
        return _jsx(Component, __assign({}, props));
    };
    return createSafeHOC(Component, displayName, TrackingComponent);
}
/**
 * Hook to use performance tracking in a functional component
 *
 * @example
 * ```jsx
 * const MyComponent = () => {
 *   useTrackPerformance('MyComponent');
 *   return <div>Hello World</div>;
 * };
 * ```
 *
 * @param componentName The name of the component
 */
export function useTrackPerformance(componentName) {
    var _a;
    var contextAvailable = true;
    var recordMetric = null;
    var config = { enabled: false };
    try {
        var context = usePerformanceMonitorContext();
        recordMetric = context.recordMetric;
        config = context.getConfig();
    }
    catch (error) {
        contextAvailable = false;
        console.warn("Performance tracking not available for ".concat(componentName, ": ").concat(error));
    }
    var renderStartTime = useRef(performance.now());
    var isFirstRender = useRef(true);
    var renderCount = useRef(0);
    var totalRenderTime = useRef(0);
    var updateTimes = useRef([]);
    var mountTime = useRef(0);
    var shouldTrack = useRef(contextAvailable);
    // Check if tracking is enabled
    shouldTrack.current = contextAvailable &&
        config.enabled !== false &&
        !((_a = config.excludeComponents) === null || _a === void 0 ? void 0 : _a.includes(componentName));
    useEffect(function () {
        if (!shouldTrack.current || !recordMetric)
            return;
        var renderTime = performance.now() - renderStartTime.current;
        renderCount.current += 1;
        totalRenderTime.current += renderTime;
        if (isFirstRender.current) {
            // First render (mount)
            mountTime.current = renderTime;
            isFirstRender.current = false;
        }
        else {
            // Update render
            updateTimes.current.push(renderTime);
        }
        // Record the metric
        recordMetric({
            componentName: componentName,
            renderCount: renderCount.current,
            mountTime: mountTime.current,
            updateTimes: updateTimes.current,
            lastRenderTime: renderTime,
            totalRenderTime: totalRenderTime.current,
            unnecessaryRenders: 0, // Can't detect unnecessary renders with a hook
            timestamp: Date.now()
        });
        // Reset the render start time for the next render
        renderStartTime.current = performance.now();
    });
}
