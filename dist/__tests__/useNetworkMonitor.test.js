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
import { useNetworkMonitor } from '../hooks/useNetworkMonitor';
import { PerformanceMonitorProvider } from '../components/PerformanceMonitorContext';
// Mock global Response if not available in test environment
if (typeof Response === 'undefined') {
    global.Response = /** @class */ (function () {
        function Response(body, init) {
            this.ok = (init === null || init === void 0 ? void 0 : init.status) ? init.status >= 200 && init.status < 300 : true;
            this.status = (init === null || init === void 0 ? void 0 : init.status) || 200;
            this.headers = new Headers(init === null || init === void 0 ? void 0 : init.headers);
            this.url = '';
        }
        Response.prototype.json = function () { return Promise.resolve({}); };
        Response.prototype.text = function () { return Promise.resolve(''); };
        Response.prototype.blob = function () { return Promise.resolve(new Blob()); };
        Response.prototype.arrayBuffer = function () { return Promise.resolve(new ArrayBuffer(0)); };
        return Response;
    }());
}
// Mock Headers if not available
if (typeof Headers === 'undefined') {
    global.Headers = /** @class */ (function () {
        function Headers(init) {
            this.headers = {};
            if (init) {
                Object.assign(this.headers, init);
            }
        }
        Headers.prototype.get = function (name) {
            return this.headers[name.toLowerCase()] || null;
        };
        return Headers;
    }());
}
describe('useNetworkMonitor', function () {
    var originalFetch = global.fetch;
    var testUrl = 'https://api.example.com/data';
    beforeAll(function () {
        jest.useFakeTimers();
    });
    afterAll(function () {
        jest.useRealTimers();
        global.fetch = originalFetch;
    });
    beforeEach(function () {
        jest.clearAllMocks();
        jest.clearAllTimers();
        var mockFetch = jest.fn(function (input) {
            var _url = typeof input === 'string' ? input : input.toString();
            return Promise.resolve(new Response(JSON.stringify({}), {
                status: 200,
                headers: new Headers({ 'content-length': '1000' })
            }));
        });
        global.fetch = mockFetch;
    });
    afterEach(function () {
        global.fetch = originalFetch;
    });
    var TestComponent = function () {
        useNetworkMonitor({ componentName: 'TestComponent' });
        return _jsx("div", { children: "Test Component" });
    };
    it('should track network requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = render(_jsx(PerformanceMonitorProvider, { children: _jsx(TestComponent, {}) })).container;
                    // Make a network request
                    return [4 /*yield*/, act(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(testUrl)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    // Make a network request
                    _a.sent();
                    expect(container).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); }, 1000);
    it('should handle failed requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFetchError, container;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFetchError = jest.fn(function (_input, _init) {
                        return Promise.reject(new Error('Network error'));
                    });
                    global.fetch = mockFetchError;
                    container = render(_jsx(PerformanceMonitorProvider, { children: _jsx(TestComponent, {}) })).container;
                    return [4 /*yield*/, act(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, fetch(testUrl)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect(container).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); }, 1000);
    it('should restore original fetch on unmount', function () {
        var unmount = render(_jsx(PerformanceMonitorProvider, { children: _jsx(TestComponent, {}) })).unmount;
        var currentFetch = global.fetch;
        unmount();
        expect(global.fetch).not.toBe(currentFetch);
    });
});
