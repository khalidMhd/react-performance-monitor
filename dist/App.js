var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect, Suspense } from 'react';
import { PerformanceMonitorProvider } from './components/PerformanceMonitorContext';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import styled from '@emotion/styled';
// Simulated data fetching
var fetchData = function () { return new Promise(function (_resolve) { return setTimeout(function () { return _resolve([
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' },
]); }, 1500); }); };
// Lazy loaded component
var LazyList = React.lazy(function () {
    return new Promise(function (_resolve) {
        return setTimeout(function () {
            return import('./components/LazyList/index')
                .then(function (module) { return ({ default: module.default }); });
        }, 2000);
    });
});
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 20px;\n  max-width: 800px;\n  margin: 0 auto;\n"], ["\n  padding: 20px;\n  max-width: 800px;\n  margin: 0 auto;\n"])));
var Button = styled.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 8px 16px;\n  margin: 8px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"], ["\n  padding: 8px 16px;\n  margin: 8px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n\n  &:hover {\n    background: #1d4ed8;\n  }\n"])));
var Counter = React.memo(function (_a) {
    var count = _a.count, onIncrement = _a.onIncrement;
    console.log('Counter rendered');
    return (_jsxs("div", { children: [_jsxs("h2", { children: ["Counter: ", count] }), _jsx(Button, { onClick: onIncrement, children: "Increment" })] }));
});
var DataFetcher = function () {
    var _a = useState([]), data = _a[0], setData = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var fetchMore = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, fetchData()];
                case 1:
                    newData = _a.sent();
                    setData(function (prev) { return __spreadArray(__spreadArray([], prev, true), newData, true); });
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Data Fetcher" }), _jsx(Button, { onClick: fetchMore, disabled: loading, children: loading ? 'Loading...' : 'Fetch More' }), _jsx("ul", { children: data.map(function (item) { return (_jsx("li", { children: item.title }, item.id)); }) })] }));
};
var HeavyComponent = function () {
    var _a = useState([]), items = _a[0], setItems = _a[1];
    var addItem = function () {
        // Simulate heavy computation
        var start = performance.now();
        while (performance.now() - start < 100) {
            // Busy wait for 100ms
        }
        setItems(function (prev) { return __spreadArray(__spreadArray([], prev, true), [prev.length], false); });
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Heavy Component" }), _jsx(Button, { onClick: addItem, children: "Add Item (Slow)" }), _jsx("ul", { children: items.map(function (item) { return (_jsxs("li", { children: ["Item ", item] }, item)); }) })] }));
};
var App = function () {
    var _a = useState(0), count = _a[0], setCount = _a[1];
    var _b = useState(false), showLazy = _b[0], setShowLazy = _b[1];
    useEffect(function () {
        // Simulate unnecessary renders
        var interval = setInterval(function () {
            setCount(function (c) { return c; });
        }, 2000);
        return function () { return clearInterval(interval); };
    }, []);
    return (_jsx(PerformanceMonitorProvider, { children: _jsxs(Container, { children: [_jsx("h1", { children: "Performance Monitor Test App" }), _jsx(PerformanceDashboard, {}), _jsx(Counter, { count: count, onIncrement: function () { return setCount(function (c) { return c + 1; }); } }), _jsx(DataFetcher, {}), _jsx(HeavyComponent, {}), _jsx(Button, { onClick: function () { return setShowLazy(!showLazy); }, children: "Toggle Lazy Component" }), showLazy && (_jsx(Suspense, { fallback: _jsx("div", { children: "Loading lazy component..." }), children: _jsx(LazyList, {}) }))] }) }));
};
export default App;
var templateObject_1, templateObject_2;
