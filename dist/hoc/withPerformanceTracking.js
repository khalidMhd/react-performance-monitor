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
import { useEffect, useRef } from 'react';
import { usePerformanceMonitorContext } from '../components/PerformanceMonitorContext';
/**
 * Higher-Order Component that wraps a component to track its performance metrics
 * @param Component The component to wrap
 * @param componentName Optional custom name for the component (defaults to Component.displayName or Component.name)
 */
export function withPerformanceTracking(Component, componentName) {
    var displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
    var WrappedComponent = function (props) {
        var recordMetric = usePerformanceMonitorContext().recordMetric;
        var renderStartTime = useRef(0);
        var isFirstRender = useRef(true);
        var renderCount = useRef(0);
        var totalRenderTime = useRef(0);
        var updateTimes = useRef([]);
        var mountTime = useRef(0);
        var unnecessaryRenders = useRef(0);
        var prevProps = useRef(null);
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
        // Before render
        renderStartTime.current = performance.now();
        // After render
        useEffect(function () {
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
    WrappedComponent.displayName = "WithPerformanceTracking(".concat(displayName, ")");
    return WrappedComponent;
}
export default withPerformanceTracking;
