import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { render, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { PerformanceProvider, usePerformanceContext } from '../context/PerformanceContext';
describe('usePerformanceMonitor', function () {
    var nowValue = 0;
    beforeAll(function () {
        jest.useFakeTimers();
    });
    afterAll(function () {
        jest.useRealTimers();
    });
    beforeEach(function () {
        nowValue = 0;
        jest.spyOn(performance, 'now').mockImplementation(function () { return nowValue; });
        jest.spyOn(console, 'warn').mockImplementation(function () { });
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    var TestComponent = function (_a) {
        var data = _a.data;
        usePerformanceMonitor({
            componentName: 'TestComponent',
            dependencies: [data],
        });
        return _jsx("div", { children: data });
    };
    var MetricsDisplay = function () {
        var metrics = usePerformanceContext().metrics;
        return _jsx("div", { "data-testid": "metrics", children: JSON.stringify(metrics) });
    };
    it('should track initial mount time', function () {
        var getByTestId = render(_jsxs(PerformanceProvider, { children: [_jsx(TestComponent, { data: "test" }), _jsx(MetricsDisplay, {})] })).getByTestId;
        // Simulate time passing during mount
        nowValue = 10;
        act(function () {
            jest.advanceTimersByTime(1);
        });
        var metricsElement = getByTestId('metrics');
        var metrics = JSON.parse(metricsElement.textContent || '');
        var componentMetrics = metrics.components.TestComponent;
        expect(componentMetrics).toBeTruthy();
        expect(componentMetrics.mountTime).toBe(10);
        expect(componentMetrics.renderCount).toBe(1);
        expect(componentMetrics.updateTimes).toEqual([]);
    });
    it('should track updates and detect unnecessary renders', function () {
        var _a = render(_jsxs(PerformanceProvider, { children: [_jsx(TestComponent, { data: "test" }), _jsx(MetricsDisplay, {})] })), getByTestId = _a.getByTestId, rerender = _a.rerender;
        // Initial mount
        nowValue = 10;
        act(function () {
            jest.advanceTimersByTime(1);
        });
        // Update with new data
        nowValue = 20;
        rerender(_jsxs(PerformanceProvider, { children: [_jsx(TestComponent, { data: "updated" }), _jsx(MetricsDisplay, {})] }));
        act(function () {
            jest.advanceTimersByTime(1);
        });
        // Update with same data (unnecessary render)
        nowValue = 30;
        rerender(_jsxs(PerformanceProvider, { children: [_jsx(TestComponent, { data: "updated" }), _jsx(MetricsDisplay, {})] }));
        act(function () {
            jest.advanceTimersByTime(1);
        });
        var metricsElement = getByTestId('metrics');
        var metrics = JSON.parse(metricsElement.textContent || '');
        var componentMetrics = metrics.components.TestComponent;
        expect(componentMetrics.renderCount).toBe(3);
        expect(componentMetrics.updateTimes).toHaveLength(2);
        expect(componentMetrics.unnecessaryRenders).toBe(1);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Unnecessary render detected in TestComponent'));
    });
    it('should respect excludeComponents config', function () {
        var getByTestId = render(_jsxs(PerformanceProvider, { children: [_jsx(TestComponent, { data: "test" }), _jsx(MetricsDisplay, {})] })).getByTestId;
        var metricsElement = getByTestId('metrics');
        var metrics = JSON.parse(metricsElement.textContent || '');
        expect(metrics.components.TestComponent).toBeTruthy();
        // Update config to exclude TestComponent
        var TestConfigUpdater = function () {
            var setConfig = usePerformanceContext().setConfig;
            React.useEffect(function () {
                setConfig({ excludeComponents: ['TestComponent'] });
            }, [setConfig]);
            return null;
        };
        render(_jsxs(PerformanceProvider, { children: [_jsx(TestConfigUpdater, {}), _jsx(TestComponent, { data: "test" }), _jsx(MetricsDisplay, {})] }));
        metrics = JSON.parse(getByTestId('metrics').textContent || '');
        expect(metrics.components.TestComponent).toBeFalsy();
    });
    it('should track slow renders', function () {
        nowValue = 0;
        render(_jsx(PerformanceProvider, { children: _jsx(TestComponent, { data: "test" }) }));
        // Simulate a slow render
        nowValue = 50;
        act(function () {
            jest.advanceTimersByTime(1);
        });
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Slow mount detected in TestComponent: 50.00ms'));
    });
});
