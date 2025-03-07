var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useEffect, useRef } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';
export var usePerformanceMonitor = function (_a) {
    var componentName = _a.componentName, _b = _a.dependencies, dependencies = _b === void 0 ? [] : _b;
    var _c = usePerformanceContext(), updateMetrics = _c.updateMetrics, config = _c.config;
    var renderStartTime = useRef(0);
    var isFirstRender = useRef(true);
    var prevDependencies = useRef([]);
    useEffect(function () {
        var _a;
        if ((_a = config.excludeComponents) === null || _a === void 0 ? void 0 : _a.includes(componentName)) {
            return;
        }
        var renderTime = performance.now() - renderStartTime.current;
        if (isFirstRender.current) {
            // Handle mount
            updateMetrics(componentName, {
                mountTime: renderTime,
                renderCount: 1,
                lastRenderTime: renderTime,
                totalRenderTime: renderTime,
            });
            if (config.enableLogging && renderTime > (config.mountWarningThreshold || 100)) {
                console.warn("[React Performance Monitor] Slow mount detected in ".concat(componentName, ": ").concat(renderTime.toFixed(2), "ms"));
            }
            isFirstRender.current = false;
        }
        else {
            // Handle update
            var hasChanged_1 = dependencies.some(function (dep, index) { return !Object.is(dep, prevDependencies.current[index]); });
            updateMetrics(componentName, {
                renderCount: function (prev) { return prev + 1; },
                updateTimes: function (prev) { return __spreadArray(__spreadArray([], prev, true), [renderTime], false); },
                lastRenderTime: renderTime,
                totalRenderTime: function (prev) { return prev + renderTime; },
                unnecessaryRenders: function (prev) { return hasChanged_1 ? prev : prev + 1; },
            });
            if (config.enableLogging) {
                if (renderTime > (config.renderWarningThreshold || 16)) {
                    console.warn("[React Performance Monitor] Slow render detected in ".concat(componentName, ": ").concat(renderTime.toFixed(2), "ms"));
                }
                if (!hasChanged_1) {
                    console.warn("[React Performance Monitor] Unnecessary render detected in ".concat(componentName));
                }
            }
        }
        prevDependencies.current = dependencies;
    }, [componentName, dependencies, config, updateMetrics]);
    // Set render start time before each render
    renderStartTime.current = performance.now();
    return null;
};
export default usePerformanceMonitor;
