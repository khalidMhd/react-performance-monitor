var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1rem;\n  background: white;\n  border-radius: 0.5rem;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n"], ["\n  padding: 1rem;\n  background: white;\n  border-radius: 0.5rem;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n"])));
var RequestList = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-top: 1rem;\n"], ["\n  margin-top: 1rem;\n"])));
var RequestItem = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 0.5rem;\n  margin: 0.5rem 0;\n  border-radius: 0.25rem;\n  background: ", ";\n"], ["\n  padding: 0.5rem;\n  margin: 0.5rem 0;\n  border-radius: 0.25rem;\n  background: ", ";\n"])), function (props) { return props.status >= 400 ? 'rgba(220, 38, 38, 0.1)' : 'transparent'; });
var StatusBadge = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  font-size: 0.875rem;\n  background: ", ";\n  color: ", ";\n"], ["\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  font-size: 0.875rem;\n  background: ", ";\n  color: ", ";\n"])), function (props) {
    if (props.status >= 500)
        return 'rgba(220, 38, 38, 0.1)';
    if (props.status >= 400)
        return 'rgba(234, 179, 8, 0.1)';
    return 'rgba(34, 197, 94, 0.1)';
}, function (props) {
    if (props.status >= 500)
        return '#dc2626';
    if (props.status >= 400)
        return '#eab308';
    return '#22c55e';
});
var DurationBadge = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  font-size: 0.875rem;\n  background: ", ";\n  color: ", ";\n"], ["\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  font-size: 0.875rem;\n  background: ", ";\n  color: ", ";\n"])), function (props) {
    if (props.duration > 1000)
        return 'rgba(220, 38, 38, 0.1)';
    if (props.duration > 500)
        return 'rgba(234, 179, 8, 0.1)';
    return 'rgba(34, 197, 94, 0.1)';
}, function (props) {
    if (props.duration > 1000)
        return '#dc2626';
    if (props.duration > 500)
        return '#eab308';
    return '#22c55e';
});
export var NetworkProfiler = function () {
    var networkMetrics = usePerformanceMonitorContext().networkMetrics;
    var _a = useState([]), requests = _a[0], setRequests = _a[1];
    useEffect(function () {
        // Use the network requests directly from the context
        setRequests(networkMetrics.requests || []);
    }, [networkMetrics]);
    var chartData = {
        labels: requests.map(function (req) { return new Date(req.timestamp).toLocaleTimeString(); }),
        datasets: [
            {
                label: 'Request Duration (ms)',
                data: requests.map(function (req) { return req.duration; }),
                backgroundColor: requests.map(function (req) {
                    return req.duration > 1000 ? 'rgba(220, 38, 38, 0.5)' :
                        req.duration > 500 ? 'rgba(234, 179, 8, 0.5)' :
                            'rgba(34, 197, 94, 0.5)';
                }),
            },
        ],
    };
    var chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Network Request Durations',
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
    return (_jsxs(Container, { children: [_jsx("h3", { children: "Network Requests" }), _jsx(Bar, { data: chartData, options: chartOptions }), _jsx(RequestList, { children: requests.map(function (request, index) { return (_jsxs(RequestItem, { status: typeof request.status === 'number' ? request.status : 500, children: [_jsxs("div", { children: [_jsx("strong", { children: request.method }), " ", request.url] }), _jsxs("div", { children: [_jsx(StatusBadge, { status: typeof request.status === 'number' ? request.status : 500, children: request.status }), _jsxs(DurationBadge, { duration: request.duration, children: [request.duration.toFixed(2), "ms"] })] })] }, index)); }) })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
