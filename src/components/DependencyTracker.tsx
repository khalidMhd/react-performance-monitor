import React, { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
import type { ComponentMetrics as ComponentMetricsType } from '../types';

const Container = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
`;

const DependencyTree = styled.div`
  font-family: monospace;
`;

const TreeNode = styled.div<{ depth: number }>`
  padding: 4px 0;
  padding-left: ${props => props.depth * 20}px;
  display: flex;
  align-items: center;
`;

const NodeIcon = styled.span<{ isParent: boolean }>`
  margin-right: 8px;
  color: ${props => props.isParent ? '#2563eb' : '#64748b'};
`;

const NodeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ComponentName = styled.span`
  font-weight: 500;
`;

const RenderInfo = styled.span`
  color: #64748b;
  font-size: 0.9em;
`;

const WarningBadge = styled.span`
  background: #fef3c7;
  color: #92400e;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
`;

interface DependencyNode {
  name: string;
  children: DependencyNode[];
  renderCount: number;
  unnecessaryRenders: number;
  totalRenderTime: number;
}

interface ComponentMetrics {
  renderCount: number;
  unnecessaryRenders: number;
  totalRenderTime: number;
}

const buildDependencyTree = (components: Record<string, ComponentMetrics>): DependencyNode[] => {
  // This is a mock implementation. In a real app, you would:
  // 1. Use React DevTools to get the component tree
  // 2. Track parent-child relationships during renders
  // 3. Use static analysis of imports/exports
  return [
    {
      name: 'App',
      renderCount: components['App']?.renderCount || 0,
      unnecessaryRenders: components['App']?.unnecessaryRenders || 0,
      totalRenderTime: components['App']?.totalRenderTime || 0,
      children: [
        {
          name: 'PerformanceDashboard',
          renderCount: components['PerformanceDashboard']?.renderCount || 0,
          unnecessaryRenders: components['PerformanceDashboard']?.unnecessaryRenders || 0,
          totalRenderTime: components['PerformanceDashboard']?.totalRenderTime || 0,
          children: [
            {
              name: 'MetricCard',
              renderCount: components['MetricCard']?.renderCount || 0,
              unnecessaryRenders: components['MetricCard']?.unnecessaryRenders || 0,
              totalRenderTime: components['MetricCard']?.totalRenderTime || 0,
              children: [],
            },
            {
              name: 'ComponentTable',
              renderCount: components['ComponentTable']?.renderCount || 0,
              unnecessaryRenders: components['ComponentTable']?.unnecessaryRenders || 0,
              totalRenderTime: components['ComponentTable']?.totalRenderTime || 0,
              children: [],
            },
          ],
        },
      ],
    },
  ];
};

const RenderNode: React.FC<{ node: DependencyNode; depth: number }> = ({ node, depth }) => {
  const hasChildren = node.children.length > 0;
  
  return (
    <>
      <TreeNode depth={depth}>
        <NodeIcon isParent={hasChildren}>{hasChildren ? '▼' : '•'}</NodeIcon>
        <NodeContent>
          <ComponentName>{node.name}</ComponentName>
          <RenderInfo>
            ({node.renderCount} renders, {node.totalRenderTime.toFixed(2)}ms)
          </RenderInfo>
          {node.unnecessaryRenders > 0 && (
            <WarningBadge>
              {node.unnecessaryRenders} unnecessary
            </WarningBadge>
          )}
        </NodeContent>
      </TreeNode>
      {node.children.map(child => (
        <RenderNode key={child.name} node={child} depth={depth + 1} />
      ))}
    </>
  );
};

export const DependencyTracker: React.FC = () => {
  const { getAllMetrics } = usePerformanceMonitorContext();
  
  // Convert metrics from monitor context to the format needed for dependency tracking
  const components = useMemo<Record<string, ComponentMetrics>>(() => {
    const allMetrics = getAllMetrics();
    const result: Record<string, ComponentMetrics> = {};
    
    Object.entries(allMetrics).forEach(([name, metric]) => {
      result[name] = {
        renderCount: metric.renderCount,
        unnecessaryRenders: metric.unnecessaryRenders || 0,
        totalRenderTime: metric.totalRenderTime
      };
    });
    
    return result;
  }, [getAllMetrics]);
  
  const dependencyTree = buildDependencyTree(components);

  return (
    <Container>
      <Title>Component Dependencies</Title>
      <DependencyTree>
        {dependencyTree.map(node => (
          <RenderNode key={node.name} node={node} depth={0} />
        ))}
      </DependencyTree>
    </Container>
  );
}; 