import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { PerformanceProvider, usePerformanceContext } from '../context/PerformanceContext';
var TestConsumer = function () {
    var _a = usePerformanceContext(), metrics = _a.metrics, config = _a.config, setConfig = _a.setConfig, resetMetrics = _a.resetMetrics;
    return (_jsxs("div", { children: [_jsx("div", { "data-testid": "metrics", children: JSON.stringify(metrics) }), _jsx("div", { "data-testid": "config", children: JSON.stringify(config) }), _jsx("button", { "data-testid": "reset-btn", onClick: resetMetrics, children: "Reset" }), _jsx("button", { "data-testid": "config-btn", onClick: function () { return setConfig({ enableLogging: false }); }, children: "Update Config" })] }));
};
describe('PerformanceContext', function () {
    it('should provide default metrics and config', function () {
        var getByTestId = render(_jsx(PerformanceProvider, { children: _jsx(TestConsumer, {}) })).getByTestId;
        var metricsElement = getByTestId('metrics');
        var configElement = getByTestId('config');
        var metrics = JSON.parse(metricsElement.textContent || '');
        var config = JSON.parse(configElement.textContent || '');
        expect(metrics).toEqual({
            components: {},
            totalMounts: 0,
            totalUpdates: 0,
            totalRenderTime: 0,
            slowestComponent: null,
            unnecessaryRenderCount: 0,
        });
        expect(config).toEqual({
            enableLogging: true,
            renderWarningThreshold: 16,
            mountWarningThreshold: 100,
            unnecessaryRenderWarningThreshold: 5,
            excludeComponents: [],
            logLevel: 'warn',
        });
    });
    it('should update config when setConfig is called', function () {
        var getByTestId = render(_jsx(PerformanceProvider, { children: _jsx(TestConsumer, {}) })).getByTestId;
        var configBtn = getByTestId('config-btn');
        act(function () {
            configBtn.click();
        });
        var configElement = getByTestId('config');
        var config = JSON.parse(configElement.textContent || '');
        expect(config.enableLogging).toBe(false);
    });
    it('should reset metrics when resetMetrics is called', function () {
        var getByTestId = render(_jsx(PerformanceProvider, { children: _jsx(TestConsumer, {}) })).getByTestId;
        var resetBtn = getByTestId('reset-btn');
        act(function () {
            resetBtn.click();
        });
        var metricsElement = getByTestId('metrics');
        var metrics = JSON.parse(metricsElement.textContent || '');
        expect(metrics).toEqual({
            components: {},
            totalMounts: 0,
            totalUpdates: 0,
            totalRenderTime: 0,
            slowestComponent: null,
            unnecessaryRenderCount: 0,
        });
    });
    it('should throw error when used outside provider', function () {
        var consoleError = jest.spyOn(console, 'error').mockImplementation(function () { });
        expect(function () {
            render(_jsx(TestConsumer, {}));
        }).toThrow('usePerformanceContext must be used within a PerformanceProvider');
        consoleError.mockRestore();
    });
});
