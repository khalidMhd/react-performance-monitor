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
import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"], ["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"])));
var Title = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"], ["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"])));
var ControlGroup = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 16px;\n"], ["\n  margin-bottom: 16px;\n"])));
var Label = styled.label(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: block;\n  margin-bottom: 8px;\n  color: #475569;\n"], ["\n  display: block;\n  margin-bottom: 8px;\n  color: #475569;\n"])));
var Select = styled.select(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: 100%;\n  padding: 8px;\n  border: 1px solid #e2e8f0;\n  border-radius: 4px;\n  margin-bottom: 16px;\n"], ["\n  width: 100%;\n  padding: 8px;\n  border: 1px solid #e2e8f0;\n  border-radius: 4px;\n  margin-bottom: 16px;\n"])));
var Input = styled.input(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: 100%;\n  padding: 8px;\n  border: 1px solid #e2e8f0;\n  border-radius: 4px;\n  margin-bottom: 16px;\n"], ["\n  width: 100%;\n  padding: 8px;\n  border: 1px solid #e2e8f0;\n  border-radius: 4px;\n  margin-bottom: 16px;\n"])));
var LogContainer = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  background: #1e293b;\n  color: #e2e8f0;\n  padding: 16px;\n  border-radius: 4px;\n  font-family: monospace;\n  max-height: 300px;\n  overflow-y: auto;\n"], ["\n  background: #1e293b;\n  color: #e2e8f0;\n  padding: 16px;\n  border-radius: 4px;\n  font-family: monospace;\n  max-height: 300px;\n  overflow-y: auto;\n"])));
var LogEntry = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  margin: 4px 0;\n  padding: 4px 8px;\n  border-radius: 2px;\n  background: ", ";\n  color: ", ";\n"], ["\n  margin: 4px 0;\n  padding: 4px 8px;\n  border-radius: 2px;\n  background: ", ";\n  color: ", ";\n"])), function (props) {
    switch (props.type) {
        case 'error': return 'rgba(220, 38, 38, 0.1)';
        case 'warn': return 'rgba(245, 158, 11, 0.1)';
        default: return 'transparent';
    }
}, function (props) {
    switch (props.type) {
        case 'error': return '#ef4444';
        case 'warn': return '#f59e0b';
        default: return '#e2e8f0';
    }
});
var Button = styled.button(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  margin-right: 8px;\n  margin-bottom: 16px;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n\n  &:disabled {\n    background: #94a3b8;\n    cursor: not-allowed;\n  }\n"], ["\n  padding: 8px 16px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  margin-right: 8px;\n  margin-bottom: 16px;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n\n  &:disabled {\n    background: #94a3b8;\n    cursor: not-allowed;\n  }\n"])));
export var DebugMode = function () {
    var _a = usePerformanceMonitorContext(), getConfig = _a.getConfig, getAllMetrics = _a.getAllMetrics;
    var config = getConfig();
    // Convert metrics from monitor context to the format needed for debug mode
    var components = useMemo(function () {
        var allMetrics = getAllMetrics();
        return Object.entries(allMetrics).map(function (_a) {
            var name = _a[0], metric = _a[1];
            return ({
                name: name,
                renderCount: metric.renderCount,
                mountTime: metric.mountTime,
                totalRenderTime: metric.totalRenderTime,
                unnecessaryRenders: metric.unnecessaryRenders || 0
            });
        });
    }, [getAllMetrics]);
    var _b = useState(false), isRecording = _b[0], setIsRecording = _b[1];
    var _c = useState([]), logs = _c[0], setLogs = _c[1];
    var _d = useState(''), selectedComponent = _d[0], setSelectedComponent = _d[1];
    var _e = useState('all'), logFilter = _e[0], setLogFilter = _e[1];
    var startRecording = function () {
        setIsRecording(true);
        setLogs([]);
        // In a real implementation, this would:
        // 1. Start capturing React DevTools events
        // 2. Monitor network requests
        // 3. Track state changes
        // 4. Profile renders
    };
    var stopRecording = function () {
        setIsRecording(false);
    };
    var clearLogs = function () {
        setLogs([]);
    };
    // Mock log generation for demonstration
    React.useEffect(function () {
        if (!isRecording)
            return;
        var interval = setInterval(function () {
            var component = selectedComponent || Object.keys(components)[0];
            if (!component)
                return;
            var types = ['info', 'warn', 'error'];
            var type = types[Math.floor(Math.random() * types.length)];
            var messages = {
                info: [
                    'Component rendered',
                    'Props updated',
                    'State changed',
                    'Effect triggered',
                ],
                warn: [
                    'Unnecessary render detected',
                    'Large component tree update',
                    'Slow render time',
                ],
                error: [
                    'Failed to update state',
                    'Render error',
                    'Effect cleanup failed',
                ],
            };
            setLogs(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{
                    id: Date.now(),
                    timestamp: Date.now(),
                    type: type,
                    component: component,
                    message: messages[type][Math.floor(Math.random() * messages[type].length)],
                }], false); });
        }, 2000);
        return function () { return clearInterval(interval); };
    }, [isRecording, selectedComponent, components]);
    return (_jsxs(Container, { children: [_jsx(Title, { children: "Debug Mode" }), _jsxs(ControlGroup, { children: [_jsx(Label, { children: "Select Component to Debug" }), _jsxs(Select, { value: selectedComponent, onChange: function (e) { return setSelectedComponent(e.target.value); }, children: [_jsx("option", { value: "", children: "All Components" }), components.map(function (name) { return (_jsx("option", { value: name.name, children: name.name }, name.name)); })] }), _jsx(Label, { children: "Filter Logs" }), _jsxs(Select, { value: logFilter, onChange: function (e) { return setLogFilter(e.target.value); }, children: [_jsx("option", { value: "all", children: "All Logs" }), _jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "warn", children: "Warnings" }), _jsx("option", { value: "error", children: "Errors" })] })] }), _jsx(Button, { onClick: startRecording, disabled: isRecording, children: "Start Recording" }), _jsx(Button, { onClick: stopRecording, disabled: !isRecording, children: "Stop Recording" }), _jsx(Button, { onClick: clearLogs, children: "Clear Logs" }), _jsxs(LogContainer, { children: [logs
                        .filter(function (log) { return !selectedComponent || log.component === selectedComponent; })
                        .filter(function (log) { return logFilter === 'all' || log.type === logFilter; })
                        .map(function (log) { return (_jsxs(LogEntry, { type: log.type, children: ["[", new Date(log.timestamp).toLocaleTimeString(), "] ", log.component, ": ", log.message] }, log.id)); }), logs.length === 0 && (_jsx(LogEntry, { type: "info", children: "No logs yet. Start recording to capture component activity." }))] })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
