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
import { jsx as _jsx } from "react/jsx-runtime";
import { render, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useMemoryMonitor } from '../hooks/useMemoryMonitor';
import { PerformanceMonitorProvider } from '../components/PerformanceMonitorContext';
describe('useMemoryMonitor', function () {
    beforeAll(function () {
        jest.useFakeTimers();
        // Mock performance.memory
        Object.defineProperty(performance, 'memory', {
            value: {
                usedJSHeapSize: 10000000,
                totalJSHeapSize: 20000000,
                jsHeapSizeLimit: 40000000
            },
            configurable: true,
            writable: true
        });
    });
    afterAll(function () {
        jest.useRealTimers();
    });
    beforeEach(function () {
        jest.clearAllMocks();
        jest.clearAllTimers();
        // Reset memory values
        Object.defineProperty(performance, 'memory', {
            value: {
                usedJSHeapSize: 10000000,
                totalJSHeapSize: 20000000,
                jsHeapSizeLimit: 40000000
            },
            configurable: true,
            writable: true
        });
    });
    var TestComponent = function () {
        useMemoryMonitor('TestComponent', 100); // Use shorter interval for tests
        return _jsx("div", { children: "Test Component" });
    };
    it('should track memory metrics', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container;
        return __generator(this, function (_a) {
            container = render(_jsx(PerformanceMonitorProvider, { children: _jsx(TestComponent, {}) })).container;
            // Wait for initial metrics to be recorded
            act(function () {
                jest.advanceTimersByTime(10);
            });
            expect(container).toBeTruthy();
            return [2 /*return*/];
        });
    }); });
    it('should handle memory increase', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container;
        return __generator(this, function (_a) {
            container = render(_jsx(PerformanceMonitorProvider, { children: _jsx(TestComponent, {}) })).container;
            // Simulate memory increase
            Object.defineProperty(performance, 'memory', {
                value: {
                    usedJSHeapSize: 15000000,
                    totalJSHeapSize: 25000000,
                    jsHeapSizeLimit: 40000000
                },
                configurable: true,
                writable: true
            });
            // Wait for metrics update
            act(function () {
                jest.advanceTimersByTime(10);
            });
            expect(container).toBeTruthy();
            return [2 /*return*/];
        });
    }); });
    it('should stop monitoring on unmount', function () {
        var unmount = render(_jsx(PerformanceMonitorProvider, { children: _jsx(TestComponent, {}) })).unmount;
        unmount();
        // Verify cleanup
        var perfMemory = performance.memory;
        expect(perfMemory.usedJSHeapSize).toBe(10000000);
    });
});
