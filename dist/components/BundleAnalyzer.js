var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"], ["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"])));
var Title = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"], ["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"])));
var ChartContainer = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  max-width: 600px;\n  margin: 0 auto;\n"], ["\n  max-width: 600px;\n  margin: 0 auto;\n"])));
var ModuleList = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-top: 24px;\n  max-height: 300px;\n  overflow-y: auto;\n"], ["\n  margin-top: 24px;\n  max-height: 300px;\n  overflow-y: auto;\n"])));
var ModuleItem = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  padding: 8px;\n  border-bottom: 1px solid #eee;\n\n  &:hover {\n    background: #f8fafc;\n  }\n"], ["\n  display: flex;\n  justify-content: space-between;\n  padding: 8px;\n  border-bottom: 1px solid #eee;\n\n  &:hover {\n    background: #f8fafc;\n  }\n"])));
var ModuleName = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  flex: 1;\n"], ["\n  flex: 1;\n"])));
var ModuleSize = styled.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: #666;\n  margin-left: 16px;\n"], ["\n  color: #666;\n  margin-left: 16px;\n"])));
export var BundleAnalyzer = function () {
    var _a = useState([]), modules = _a[0], setModules = _a[1];
    useEffect(function () {
        // In a real implementation, this would be replaced with actual bundle analysis
        // using tools like webpack-bundle-analyzer or source-map-explorer
        var mockModules = [
            { name: 'react', size: 120000 },
            { name: 'react-dom', size: 890000 },
            { name: 'chart.js', size: 450000 },
            { name: '@emotion/styled', size: 180000 },
            { name: 'app code', size: 250000 },
        ];
        setModules(mockModules);
    }, []);
    var formatSize = function (bytes) {
        if (bytes < 1024)
            return bytes + ' B';
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };
    var chartData = {
        labels: modules.map(function (m) { return m.name; }),
        datasets: [
            {
                data: modules.map(function (m) { return m.size; }),
                backgroundColor: [
                    '#2563eb',
                    '#16a34a',
                    '#dc2626',
                    '#ca8a04',
                    '#9333ea',
                ],
            },
        ],
    };
    var chartOptions = {
        plugins: {
            legend: {
                position: 'right',
            },
        },
    };
    var totalSize = modules.reduce(function (sum, module) { return sum + module.size; }, 0);
    return (_jsxs(Container, { children: [_jsx(Title, { children: "Bundle Size Analysis" }), _jsx(ChartContainer, { children: _jsx(Doughnut, { data: chartData, options: chartOptions }) }), _jsxs(ModuleList, { children: [modules
                        .sort(function (a, b) { return b.size - a.size; })
                        .map(function (module) { return (_jsxs(ModuleItem, { children: [_jsx(ModuleName, { children: module.name }), _jsxs(ModuleSize, { children: [formatSize(module.size), " (", ((module.size / totalSize) * 100).toFixed(1), "%)"] })] }, module.name)); }), _jsxs(ModuleItem, { children: [_jsx(ModuleName, { children: _jsx("strong", { children: "Total" }) }), _jsx(ModuleSize, { children: _jsx("strong", { children: formatSize(totalSize) }) })] })] })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
