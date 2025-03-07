import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
// Mock performance.now() for consistent testing
var mockNow = jest.spyOn(performance, 'now');
var nowValue = 0;
// Use a more efficient mock implementation
mockNow.mockImplementation(function () { return nowValue; });
// Global test setup
beforeAll(function () {
    // Suppress React warning messages during tests
    jest.spyOn(console, 'error').mockImplementation(function () { });
    jest.spyOn(console, 'warn').mockImplementation(function () { });
});
// Reset mocks and timers before each test
beforeEach(function () {
    nowValue = 0;
    jest.clearAllMocks();
});
// Clean up after all tests
afterAll(function () {
    jest.restoreAllMocks();
});
