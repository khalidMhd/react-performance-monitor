var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';
import { PerformanceExport } from './PerformanceExport';
import { BundleAnalyzer } from './BundleAnalyzer';
import { DependencyTracker } from './DependencyTracker';
import { DebugMode } from './DebugMode';
import { NetworkProfiler } from './NetworkProfiler';
import { SuspenseMonitor } from './SuspenseMonitor';
import styled from '@emotion/styled';
var MetricCardContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: #fff;\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  margin: 8px;\n"], ["\n  background: #fff;\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  margin: 8px;\n"])));
var MetricValue = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 24px;\n  font-weight: bold;\n  color: #2563eb;\n  margin: 8px 0;\n"], ["\n  font-size: 24px;\n  font-weight: bold;\n  color: #2563eb;\n  margin: 8px 0;\n"])));
var MetricDescription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 14px;\n  color: #666;\n"], ["\n  font-size: 14px;\n  color: #666;\n"])));
var MetricCard = function (_a) {
    var title = _a.title, value = _a.value, description = _a.description;
    return (_jsxs(MetricCardContainer, { children: [_jsx("h3", { children: title }), _jsx(MetricValue, { children: value }), description && _jsx(MetricDescription, { children: description })] }));
};
var TableContainer = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin: 16px 0;\n  overflow-x: auto;\n"], ["\n  margin: 16px 0;\n  overflow-x: auto;\n"])));
var Table = styled.table(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: 100%;\n  border-collapse: collapse;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"], ["\n  width: 100%;\n  border-collapse: collapse;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"])));
var Th = styled.th(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n  background: #f8fafc;\n  font-weight: 600;\n"], ["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n  background: #f8fafc;\n  font-weight: 600;\n"])));
var Td = styled.td(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n"], ["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n"])));
var Tr = styled.tr(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  &:hover {\n    background: #f8fafc;\n  }\n"], ["\n  &:hover {\n    background: #f8fafc;\n  }\n"])));
var ComponentTable = function (_a) {
    var components = _a.components;
    var sortedComponents = useMemo(function () {
        return Object.values(components).sort(function (a, b) { return b.totalRenderTime - a.totalRenderTime; });
    }, [components]);
    return (_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx(Th, { children: "Component" }), _jsx(Th, { children: "Render Count" }), _jsx(Th, { children: "Mount Time (ms)" }), _jsx(Th, { children: "Total Render Time (ms)" }), _jsx(Th, { children: "Unnecessary Renders" }), _jsx(Th, { children: "Avg Update Time (ms)" })] }) }), _jsx("tbody", { children: sortedComponents.map(function (metrics) { return (_jsxs(Tr, { children: [_jsx(Td, { children: metrics.componentName }), _jsx(Td, { children: metrics.renderCount }), _jsx(Td, { children: metrics.mountTime.toFixed(2) }), _jsx(Td, { children: metrics.totalRenderTime.toFixed(2) }), _jsx(Td, { children: metrics.unnecessaryRenders }), _jsx(Td, { children: metrics.updateTimes.length
                                    ? (metrics.updateTimes.reduce(function (a, b) { return a + b; }, 0) / metrics.updateTimes.length).toFixed(2)
                                    : '-' })] }, metrics.componentName)); }) })] }) }));
};
var DashboardContainer = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n"], ["\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n"])));
var Header = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n"])));
var ResetButton = styled.button(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"], ["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"])));
var MetricsGrid = styled.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 24px;\n"], ["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 24px;\n"])));
var Alert = styled.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  background: #fef3c7;\n  border-left: 4px solid #f59e0b;\n  padding: 12px 16px;\n  margin-bottom: 24px;\n  border-radius: 4px;\n"], ["\n  background: #fef3c7;\n  border-left: 4px solid #f59e0b;\n  padding: 12px 16px;\n  margin-bottom: 24px;\n  border-radius: 4px;\n"])));
var ConfigSection = styled.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  margin-top: 24px;\n  padding: 16px;\n  background: #f8fafc;\n  border-radius: 8px;\n"], ["\n  margin-top: 24px;\n  padding: 16px;\n  background: #f8fafc;\n  border-radius: 8px;\n"])));
var Pre = styled.pre(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  margin: 0;\n  padding: 12px;\n  background: #fff;\n  border-radius: 4px;\n  overflow-x: auto;\n"], ["\n  margin: 0;\n  padding: 12px;\n  background: #fff;\n  border-radius: 4px;\n  overflow-x: auto;\n"])));
export var PerformanceDashboard = function () {
    var _a = usePerformanceContext(), metrics = _a.metrics, config = _a.config, resetMetrics = _a.resetMetrics;
    var componentCount = Object.keys(metrics.components).length;
    var totalUnnecessaryRenders = useMemo(function () {
        return Object.values(metrics.components).reduce(function (total, metrics) { return total + metrics.unnecessaryRenders; }, 0);
    }, [metrics.components]);
    var averageMountTime = useMemo(function () {
        var mountTimes = Object.values(metrics.components).map(function (m) { return m.mountTime; });
        return mountTimes.length
            ? (mountTimes.reduce(function (a, b) { return a + b; }, 0) / mountTimes.length).toFixed(2)
            : '0';
    }, [metrics.components]);
    return (_jsxs(DashboardContainer, { children: [_jsxs(Header, { children: [_jsx("h2", { children: "Performance Metrics" }), _jsx(ResetButton, { onClick: resetMetrics, children: "Reset Metrics" })] }), _jsxs(MetricsGrid, { children: [_jsx(MetricCard, { title: "Components Tracked", value: componentCount, description: "Number of components being monitored" }), _jsx(MetricCard, { title: "Total Render Time", value: "".concat(metrics.totalRenderTime.toFixed(2), "ms"), description: "Cumulative render time across all components" }), _jsx(MetricCard, { title: "Unnecessary Renders", value: totalUnnecessaryRenders, description: "Total number of renders that could have been avoided" }), _jsx(MetricCard, { title: "Average Mount Time", value: "".concat(averageMountTime, "ms"), description: "Average time taken for components to mount" })] }), metrics.slowestComponent && (_jsxs(Alert, { children: ["Slowest Component: ", metrics.slowestComponent, " (", metrics.components[metrics.slowestComponent].totalRenderTime.toFixed(2), "ms)"] })), _jsx(ComponentTable, { components: metrics.components }), _jsx(PerformanceExport, {}), _jsx(NetworkProfiler, {}), _jsx(SuspenseMonitor, {}), _jsx(DependencyTracker, {}), _jsx(BundleAnalyzer, {}), _jsx(DebugMode, {}), _jsxs(ConfigSection, { children: [_jsx("h3", { children: "Current Configuration" }), _jsx(Pre, { children: JSON.stringify(config, null, 2) })] })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
