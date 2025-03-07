import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock performance.now() for consistent testing
const mockNow = jest.spyOn(performance, 'now');
let nowValue = 0;

// Use a more efficient mock implementation
mockNow.mockImplementation(() => nowValue);

// Global test setup
beforeAll(() => {
  // Suppress React warning messages during tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Reset mocks and timers before each test
beforeEach(() => {
  nowValue = 0;
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  jest.restoreAllMocks();
}); 