var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
import styled from '@emotion/styled';
var DashboardContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  color: #333;\n  background-color: #f9f9f9;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n"], ["\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  color: #333;\n  background-color: #f9f9f9;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n"])));
var Header = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n  border-bottom: 1px solid #eee;\n  padding-bottom: 16px;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n  border-bottom: 1px solid #eee;\n  padding-bottom: 16px;\n"])));
var Title = styled.h1(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 24px;\n  margin: 0;\n  color: #2563eb;\n"], ["\n  font-size: 24px;\n  margin: 0;\n  color: #2563eb;\n"])));
var ResetButton = styled.button(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"], ["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 14px;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"])));
var MetricsGrid = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 24px;\n"], ["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n  margin-bottom: 24px;\n"])));
var MetricCardContainer = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  background: #fff;\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n  transition: transform 0.2s ease;\n\n  &:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n  }\n"], ["\n  background: #fff;\n  border-radius: 8px;\n  padding: 16px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n  transition: transform 0.2s ease;\n\n  &:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n  }\n"])));
var MetricValue = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 24px;\n  font-weight: bold;\n  color: #2563eb;\n  margin: 8px 0;\n"], ["\n  font-size: 24px;\n  font-weight: bold;\n  color: #2563eb;\n  margin: 8px 0;\n"])));
var MetricDescription = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  font-size: 14px;\n  color: #666;\n"], ["\n  font-size: 14px;\n  color: #666;\n"])));
var TableContainer = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin: 16px 0;\n  overflow-x: auto;\n"], ["\n  margin: 16px 0;\n  overflow-x: auto;\n"])));
var Table = styled.table(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  width: 100%;\n  border-collapse: collapse;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n"], ["\n  width: 100%;\n  border-collapse: collapse;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);\n"])));
var Th = styled.th(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n  background: #f8fafc;\n  font-weight: 600;\n  color: #4b5563;\n"], ["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n  background: #f8fafc;\n  font-weight: 600;\n  color: #4b5563;\n"])));
var Td = styled.td(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n"], ["\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eee;\n"])));
var Tr = styled.tr(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  &:hover {\n    background: #f8fafc;\n  }\n"], ["\n  &:hover {\n    background: #f8fafc;\n  }\n"])));
var Alert = styled.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  background: #fef3c7;\n  border-left: 4px solid #f59e0b;\n  padding: 12px 16px;\n  margin-bottom: 24px;\n  border-radius: 4px;\n  font-size: 14px;\n  color: #92400e;\n"], ["\n  background: #fef3c7;\n  border-left: 4px solid #f59e0b;\n  padding: 12px 16px;\n  margin-bottom: 24px;\n  border-radius: 4px;\n  font-size: 14px;\n  color: #92400e;\n"])));
var NoDataMessage = styled.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  text-align: center;\n  padding: 40px;\n  color: #6b7280;\n  font-size: 16px;\n"], ["\n  text-align: center;\n  padding: 40px;\n  color: #6b7280;\n  font-size: 16px;\n"])));
var MetricCard = function (_a) {
    var title = _a.title, value = _a.value, description = _a.description;
    return (_jsxs(MetricCardContainer, { children: [_jsx("h3", { children: title }), _jsx(MetricValue, { children: value }), description && _jsx(MetricDescription, { children: description })] }));
};
var ComponentTable = function (_a) {
    var components = _a.components;
    var sortedComponents = useMemo(function () {
        return Object.values(components).sort(function (a, b) { return b.totalRenderTime - a.totalRenderTime; });
    }, [components]);
    if (sortedComponents.length === 0) {
        return _jsx(NoDataMessage, { children: "No component metrics available yet. Interact with the application to generate metrics." });
    }
    return (_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx(Th, { children: "Component" }), _jsx(Th, { children: "Render Count" }), _jsx(Th, { children: "Mount Time (ms)" }), _jsx(Th, { children: "Total Render Time (ms)" }), _jsx(Th, { children: "Unnecessary Renders" }), _jsx(Th, { children: "Avg Update Time (ms)" })] }) }), _jsx("tbody", { children: sortedComponents.map(function (metrics) { return (_jsxs(Tr, { children: [_jsx(Td, { children: metrics.componentName }), _jsx(Td, { children: metrics.renderCount }), _jsx(Td, { children: metrics.mountTime.toFixed(2) }), _jsx(Td, { children: metrics.totalRenderTime.toFixed(2) }), _jsx(Td, { children: metrics.unnecessaryRenders }), _jsx(Td, { children: metrics.updateTimes.length
                                    ? (metrics.updateTimes.reduce(function (a, b) { return a + b; }, 0) / metrics.updateTimes.length).toFixed(2)
                                    : '-' })] }, metrics.componentName)); }) })] }) }));
};
/**
 * A dashboard component that displays performance metrics for React components.
 * This component must be used within a PerformanceProvider context.
 */
export var PerformanceDashboard = function () {
    var _a = usePerformanceMonitorContext(), getAllMetrics = _a.getAllMetrics, resetAllMetrics = _a.resetAllMetrics, getConfig = _a.getConfig;
    var _b = useState(''), filter = _b[0], setFilter = _b[1];
    // Get current metrics
    var metrics = getAllMetrics();
    var config = getConfig();
    // Calculate derived metrics
    var componentCount = Object.keys(metrics).length;
    var totalRenderCount = Object.values(metrics).reduce(function (sum, m) { return sum + m.renderCount; }, 0);
    var totalRenderTime = Object.values(metrics).reduce(function (sum, m) { return sum + m.totalRenderTime; }, 0);
    var unnecessaryRenderCount = Object.values(metrics).reduce(function (sum, m) { return sum + m.unnecessaryRenders; }, 0);
    // Filter components based on search
    var filteredComponents = useMemo(function () {
        if (!filter)
            return metrics;
        var lowerFilter = filter.toLowerCase();
        return Object.entries(metrics).reduce(function (acc, _a) {
            var name = _a[0], metric = _a[1];
            if (name.toLowerCase().includes(lowerFilter)) {
                acc[name] = metric;
            }
            return acc;
        }, {});
    }, [metrics, filter]);
    if (!config.enabled) {
        return (_jsx(DashboardContainer, { children: _jsx(Alert, { children: "Performance monitoring is currently disabled." }) }));
    }
    return (_jsxs(DashboardContainer, { children: [_jsxs(Header, { children: [_jsx(Title, { children: "Performance Dashboard" }), _jsx(ResetButton, { onClick: resetAllMetrics, children: "Reset Metrics" })] }), _jsxs(MetricsGrid, { children: [_jsx(MetricCard, { title: "Components Tracked", value: componentCount, description: "Number of components being monitored" }), _jsx(MetricCard, { title: "Total Renders", value: totalRenderCount, description: "Total number of render operations" }), _jsx(MetricCard, { title: "Total Render Time", value: "".concat(totalRenderTime.toFixed(2), "ms"), description: "Cumulative rendering time" }), _jsx(MetricCard, { title: "Unnecessary Renders", value: unnecessaryRenderCount, description: "Renders that could have been avoided" })] }), componentCount > 0 && (_jsx("div", { style: { marginBottom: '16px' }, children: _jsx("input", { type: "text", placeholder: "Filter components...", value: filter, onChange: function (e) { return setFilter(e.target.value); }, style: {
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        width: '100%',
                        fontSize: '14px'
                    } }) })), _jsx(ComponentTable, { components: filteredComponents })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
