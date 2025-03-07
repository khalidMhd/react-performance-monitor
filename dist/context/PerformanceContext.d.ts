import React from 'react';
import type { PerformanceContextValue } from '../types';
export declare const PerformanceProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const usePerformanceContext: () => PerformanceContextValue;
