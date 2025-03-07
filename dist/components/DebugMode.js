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
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePerformanceContext } from '../context/PerformanceContext';
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
    var _a = usePerformanceContext(), metrics = _a.metrics, config = _a.config, setConfig = _a.setConfig;
    var _b = useState(false), isRecording = _b[0], setIsRecording = _b[1];
    var _c = useState([]), logs = _c[0], setLogs = _c[1];
    var _d = useState(''), selectedComponent = _d[0], setSelectedComponent = _d[1];
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
            var component = selectedComponent || Object.keys(metrics.components)[0];
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
    }, [isRecording, selectedComponent, metrics.components]);
    return (_jsxs(Container, { children: [_jsx(Title, { children: "Debug Mode" }), _jsxs(ControlGroup, { children: [_jsx(Label, { children: "Select Component to Debug" }), _jsxs(Select, { value: selectedComponent, onChange: function (e) { return setSelectedComponent(e.target.value); }, children: [_jsx("option", { value: "", children: "All Components" }), Object.keys(metrics.components).map(function (name) { return (_jsx("option", { value: name, children: name }, name)); })] }), _jsx(Label, { children: "Warning Thresholds" }), _jsx(Input, { type: "number", placeholder: "Render Warning Threshold (ms)", value: config.renderWarningThreshold, onChange: function (e) { return setConfig({ renderWarningThreshold: Number(e.target.value) }); } }), _jsx(Input, { type: "number", placeholder: "Mount Warning Threshold (ms)", value: config.mountWarningThreshold, onChange: function (e) { return setConfig({ mountWarningThreshold: Number(e.target.value) }); } })] }), _jsx(Button, { onClick: startRecording, disabled: isRecording, children: "Start Recording" }), _jsx(Button, { onClick: stopRecording, disabled: !isRecording, children: "Stop Recording" }), _jsx(Button, { onClick: clearLogs, children: "Clear Logs" }), _jsxs(LogContainer, { children: [logs.map(function (log) { return (_jsxs(LogEntry, { type: log.type, children: ["[", new Date(log.timestamp).toLocaleTimeString(), "] ", log.component, ": ", log.message] }, log.id)); }), logs.length === 0 && (_jsx(LogEntry, { type: "info", children: "No logs yet. Start recording to capture component activity." }))] })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
