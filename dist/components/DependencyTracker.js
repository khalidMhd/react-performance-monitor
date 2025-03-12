var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import styled from '@emotion/styled';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"], ["\n  margin-top: 24px;\n  padding: 16px;\n  background: #fff;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n"])));
var Title = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"], ["\n  margin: 0 0 16px 0;\n  color: #1e293b;\n"])));
var DependencyTree = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-family: monospace;\n"], ["\n  font-family: monospace;\n"])));
var TreeNode = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 4px 0;\n  padding-left: ", "px;\n  display: flex;\n  align-items: center;\n"], ["\n  padding: 4px 0;\n  padding-left: ", "px;\n  display: flex;\n  align-items: center;\n"])), function (props) { return props.depth * 20; });
var NodeIcon = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-right: 8px;\n  color: ", ";\n"], ["\n  margin-right: 8px;\n  color: ", ";\n"])), function (props) { return props.isParent ? '#2563eb' : '#64748b'; });
var NodeContent = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  gap: 8px;\n"], ["\n  display: flex;\n  align-items: center;\n  gap: 8px;\n"])));
var ComponentName = styled.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-weight: 500;\n"], ["\n  font-weight: 500;\n"])));
var RenderInfo = styled.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: #64748b;\n  font-size: 0.9em;\n"], ["\n  color: #64748b;\n  font-size: 0.9em;\n"])));
var WarningBadge = styled.span(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  background: #fef3c7;\n  color: #92400e;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 0.8em;\n"], ["\n  background: #fef3c7;\n  color: #92400e;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 0.8em;\n"])));
var buildDependencyTree = function (components) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // This is a mock implementation. In a real app, you would:
    // 1. Use React DevTools to get the component tree
    // 2. Track parent-child relationships during renders
    // 3. Use static analysis of imports/exports
    return [
        {
            name: 'App',
            renderCount: ((_a = components['App']) === null || _a === void 0 ? void 0 : _a.renderCount) || 0,
            unnecessaryRenders: ((_b = components['App']) === null || _b === void 0 ? void 0 : _b.unnecessaryRenders) || 0,
            totalRenderTime: ((_c = components['App']) === null || _c === void 0 ? void 0 : _c.totalRenderTime) || 0,
            children: [
                {
                    name: 'PerformanceDashboard',
                    renderCount: ((_d = components['PerformanceDashboard']) === null || _d === void 0 ? void 0 : _d.renderCount) || 0,
                    unnecessaryRenders: ((_e = components['PerformanceDashboard']) === null || _e === void 0 ? void 0 : _e.unnecessaryRenders) || 0,
                    totalRenderTime: ((_f = components['PerformanceDashboard']) === null || _f === void 0 ? void 0 : _f.totalRenderTime) || 0,
                    children: [
                        {
                            name: 'MetricCard',
                            renderCount: ((_g = components['MetricCard']) === null || _g === void 0 ? void 0 : _g.renderCount) || 0,
                            unnecessaryRenders: ((_h = components['MetricCard']) === null || _h === void 0 ? void 0 : _h.unnecessaryRenders) || 0,
                            totalRenderTime: ((_j = components['MetricCard']) === null || _j === void 0 ? void 0 : _j.totalRenderTime) || 0,
                            children: [],
                        },
                        {
                            name: 'ComponentTable',
                            renderCount: ((_k = components['ComponentTable']) === null || _k === void 0 ? void 0 : _k.renderCount) || 0,
                            unnecessaryRenders: ((_l = components['ComponentTable']) === null || _l === void 0 ? void 0 : _l.unnecessaryRenders) || 0,
                            totalRenderTime: ((_m = components['ComponentTable']) === null || _m === void 0 ? void 0 : _m.totalRenderTime) || 0,
                            children: [],
                        },
                    ],
                },
            ],
        },
    ];
};
var RenderNode = function (_a) {
    var node = _a.node, depth = _a.depth;
    var hasChildren = node.children.length > 0;
    return (_jsxs(_Fragment, { children: [_jsxs(TreeNode, { depth: depth, children: [_jsx(NodeIcon, { isParent: hasChildren, children: hasChildren ? '▼' : '•' }), _jsxs(NodeContent, { children: [_jsx(ComponentName, { children: node.name }), _jsxs(RenderInfo, { children: ["(", node.renderCount, " renders, ", node.totalRenderTime.toFixed(2), "ms)"] }), node.unnecessaryRenders > 0 && (_jsxs(WarningBadge, { children: [node.unnecessaryRenders, " unnecessary"] }))] })] }), node.children.map(function (child) { return (_jsx(RenderNode, { node: child, depth: depth + 1 }, child.name)); })] }));
};
export var DependencyTracker = function () {
    var getAllMetrics = usePerformanceMonitorContext().getAllMetrics;
    // Convert metrics from monitor context to the format needed for dependency tracking
    var components = useMemo(function () {
        var allMetrics = getAllMetrics();
        var result = {};
        Object.entries(allMetrics).forEach(function (_a) {
            var name = _a[0], metric = _a[1];
            result[name] = {
                renderCount: metric.renderCount,
                unnecessaryRenders: metric.unnecessaryRenders || 0,
                totalRenderTime: metric.totalRenderTime
            };
        });
        return result;
    }, [getAllMetrics]);
    var dependencyTree = buildDependencyTree(components);
    return (_jsxs(Container, { children: [_jsx(Title, { children: "Component Dependencies" }), _jsx(DependencyTree, { children: dependencyTree.map(function (node) { return (_jsx(RenderNode, { node: node, depth: 0 }, node.name)); }) })] }));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
