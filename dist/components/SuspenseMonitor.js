var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend, } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"], ["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"])));
var Header = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n"])));
var Title = styled.h3(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n  color: #1e293b;\n"], ["\n  margin: 0;\n  color: #1e293b;\n"])));
var Stats = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n  margin-bottom: 24px;\n"], ["\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n  margin-bottom: 24px;\n"])));
var StatCard = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 12px;\n  background: #f8fafc;\n  border-radius: 6px;\n  text-align: center;\n"], ["\n  padding: 12px;\n  background: #f8fafc;\n  border-radius: 6px;\n  text-align: center;\n"])));
var StatValue = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 24px;\n  font-weight: bold;\n  color: #2563eb;\n  margin-bottom: 4px;\n"], ["\n  font-size: 24px;\n  font-weight: bold;\n  color: #2563eb;\n  margin-bottom: 4px;\n"])));
var StatLabel = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: #64748b;\n  font-size: 0.9em;\n"], ["\n  color: #64748b;\n  font-size: 0.9em;\n"])));
var BoundaryList = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  margin-top: 24px;\n  max-height: 300px;\n  overflow-y: auto;\n"], ["\n  margin-top: 24px;\n  max-height: 300px;\n  overflow-y: auto;\n"])));
var BoundaryItem = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding: 12px;\n  border-bottom: 1px solid #eee;\n  background: ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n\n  &:hover {\n    background: #f8fafc;\n  }\n"], ["\n  padding: 12px;\n  border-bottom: 1px solid #eee;\n  background: ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n\n  &:hover {\n    background: #f8fafc;\n  }\n"])), function (props) { return props.isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent'; });
var BoundaryName = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  font-weight: 500;\n  color: #1e293b;\n"], ["\n  font-weight: 500;\n  color: #1e293b;\n"])));
var BoundaryMetrics = styled.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  display: flex;\n  gap: 16px;\n  color: #64748b;\n  font-size: 0.9em;\n"], ["\n  display: flex;\n  gap: 16px;\n  color: #64748b;\n  font-size: 0.9em;\n"])));
export var SuspenseMonitor = function () {
    var _a = useState([]), boundaries = _a[0], setBoundaries = _a[1];
    var _b = useState(0), totalSuspenses = _b[0], setTotalSuspenses = _b[1];
    var _c = useState(0), avgSuspenseTime = _c[0], setAvgSuspenseTime = _c[1];
    useEffect(function () {
        // Mock data for demonstration
        var mockBoundaries = [
            {
                id: '1',
                name: 'DataLoader',
                suspenseCount: 5,
                avgSuspenseTime: 350,
                isActive: false,
                history: Array.from({ length: 5 }, function (_, i) { return ({
                    timestamp: Date.now() - (i * 60000),
                    duration: Math.random() * 500 + 100,
                }); }),
            },
            {
                id: '2',
                name: 'ImageGallery',
                suspenseCount: 3,
                avgSuspenseTime: 250,
                isActive: true,
                lastSuspenseTime: Date.now(),
                history: Array.from({ length: 3 }, function (_, i) { return ({
                    timestamp: Date.now() - (i * 120000),
                    duration: Math.random() * 400 + 100,
                }); }),
            },
        ];
        setBoundaries(mockBoundaries);
        setTotalSuspenses(mockBoundaries.reduce(function (sum, b) { return sum + b.suspenseCount; }, 0));
        setAvgSuspenseTime(mockBoundaries.reduce(function (sum, b) { return sum + (b.avgSuspenseTime * b.suspenseCount); }, 0) /
            mockBoundaries.reduce(function (sum, b) { return sum + b.suspenseCount; }, 0));
    }, []);
    var chartData = {
        labels: boundaries.flatMap(function (b) {
            return b.history.map(function (h) { return new Date(h.timestamp).toLocaleTimeString(); });
        }),
        datasets: boundaries.map(function (boundary) { return ({
            label: boundary.name,
            data: boundary.history.map(function (h) { return h.duration; }),
            borderColor: boundary.isActive ? 'rgb(37, 99, 235)' : 'rgb(100, 116, 139)',
            tension: 0.1,
        }); }),
    };
    var chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Suspense Duration Over Time',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Duration (ms)',
                },
            },
        },
    };
    return (_jsxs(Container, { children: [_jsx(Header, { children: _jsx(Title, { children: "Suspense Boundaries" }) }), _jsxs(Stats, { children: [_jsxs(StatCard, { children: [_jsx(StatValue, { children: boundaries.length }), _jsx(StatLabel, { children: "Active Boundaries" })] }), _jsxs(StatCard, { children: [_jsx(StatValue, { children: totalSuspenses }), _jsx(StatLabel, { children: "Total Suspenses" })] }), _jsxs(StatCard, { children: [_jsxs(StatValue, { children: [avgSuspenseTime.toFixed(1), "ms"] }), _jsx(StatLabel, { children: "Average Suspense Time" })] })] }), _jsx(Line, { data: chartData, options: chartOptions }), _jsx(BoundaryList, { children: boundaries.map(function (boundary) { return (_jsxs(BoundaryItem, { isActive: boundary.isActive, children: [_jsx(BoundaryName, { children: boundary.name }), _jsxs(BoundaryMetrics, { children: [_jsxs("span", { children: [boundary.suspenseCount, " suspenses"] }), _jsxs("span", { children: [boundary.avgSuspenseTime.toFixed(1), "ms avg"] }), boundary.isActive && _jsx("span", { children: "Currently suspended" })] })] }, boundary.id)); }) })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
