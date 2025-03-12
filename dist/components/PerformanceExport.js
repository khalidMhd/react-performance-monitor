var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
import { Line } from 'react-chartjs-2';
import styled from '@emotion/styled';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"], ["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"])));
var ExportButtons = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  gap: 12px;\n  margin-bottom: 24px;\n"], ["\n  display: flex;\n  gap: 12px;\n  margin-bottom: 24px;\n"])));
var Button = styled.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"], ["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"])));
var Charts = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n\n  @media (min-width: 1024px) {\n    grid-template-columns: 1fr 1fr;\n  }\n"], ["\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 24px;\n\n  @media (min-width: 1024px) {\n    grid-template-columns: 1fr 1fr;\n  }\n"])));
var ChartContainer = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  background: #f8fafc;\n  padding: 16px;\n  border-radius: 8px;\n"], ["\n  background: #f8fafc;\n  padding: 16px;\n  border-radius: 8px;\n"])));
var ChartTitle = styled.h3(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"], ["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"])));
export var PerformanceExport = function () {
    var getAllMetrics = usePerformanceMonitorContext().getAllMetrics;
    // Convert metrics from monitor context to the format needed for charts
    var components = useMemo(function () {
        var allMetrics = getAllMetrics();
        var result = {};
        Object.entries(allMetrics).forEach(function (_a) {
            var name = _a[0], metric = _a[1];
            result[name] = {
                componentName: name,
                renderCount: metric.renderCount,
                mountTime: metric.mountTime,
                updateTimes: metric.updateTimes || [],
                lastRenderTime: metric.lastRenderTime,
                totalRenderTime: metric.totalRenderTime,
                unnecessaryRenders: metric.unnecessaryRenders || 0
            };
        });
        return result;
    }, [getAllMetrics]);
    var exportToJSON = function () {
        var dataStr = JSON.stringify(components, null, 2);
        var dataBlob = new Blob([dataStr], { type: 'application/json' });
        var url = URL.createObjectURL(dataBlob);
        var link = document.createElement('a');
        link.href = url;
        link.download = "performance-metrics-".concat(new Date().toISOString(), ".json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    var exportToCSV = function () {
        var componentsArray = Object.values(components);
        var headers = ['Component', 'Render Count', 'Mount Time', 'Total Render Time', 'Unnecessary Renders', 'Avg Update Time'];
        var rows = componentsArray.map(function (comp) { return [
            comp.componentName,
            comp.renderCount,
            comp.mountTime.toFixed(2),
            comp.totalRenderTime.toFixed(2),
            comp.unnecessaryRenders,
            comp.updateTimes.length
                ? (comp.updateTimes.reduce(function (a, b) { return a + b; }, 0) / comp.updateTimes.length).toFixed(2)
                : '0'
        ]; });
        var csvContent = __spreadArray([
            headers.join(',')
        ], rows.map(function (row) { return row.join(','); }), true).join('\n');
        var dataBlob = new Blob([csvContent], { type: 'text/csv' });
        var url = URL.createObjectURL(dataBlob);
        var link = document.createElement('a');
        link.href = url;
        link.download = "performance-metrics-".concat(new Date().toISOString(), ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    // Prepare data for render time chart
    var renderTimeChartData = {
        labels: Object.keys(components),
        datasets: [
            {
                label: 'Total Render Time (ms)',
                data: Object.values(components).map(function (comp) { return comp.totalRenderTime; }),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Mount Time (ms)',
                data: Object.values(components).map(function (comp) { return comp.mountTime; }),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
        ],
    };
    // Prepare data for render count chart
    var renderCountChartData = {
        labels: Object.keys(components),
        datasets: [
            {
                label: 'Render Count',
                data: Object.values(components).map(function (comp) { return comp.renderCount; }),
                borderColor: 'rgb(53, 162, 235)',
                tension: 0.1,
            },
            {
                label: 'Unnecessary Renders',
                data: Object.values(components).map(function (comp) { return comp.unnecessaryRenders; }),
                borderColor: 'rgb(255, 159, 64)',
                tension: 0.1,
            },
        ],
    };
    var chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    return (_jsxs(Container, { children: [_jsxs(ExportButtons, { children: [_jsx(Button, { onClick: exportToJSON, children: "Export to JSON" }), _jsx(Button, { onClick: exportToCSV, children: "Export to CSV" })] }), _jsxs(Charts, { children: [_jsxs(ChartContainer, { children: [_jsx(ChartTitle, { children: "Render Times" }), _jsx(Line, { data: renderTimeChartData, options: chartOptions })] }), _jsxs(ChartContainer, { children: [_jsx(ChartTitle, { children: "Render Counts" }), _jsx(Line, { data: renderCountChartData, options: chartOptions })] })] })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
