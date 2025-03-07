import React, { useMemo } from 'react';
import { usePerformanceContext } from '../context/PerformanceContext';
import type { ComponentMetrics } from '../types';
import { PerformanceExport } from './PerformanceExport';
import { BundleAnalyzer } from './BundleAnalyzer';
import { DependencyTracker } from './DependencyTracker';
import { DebugMode } from './DebugMode';
import { NetworkProfiler } from './NetworkProfiler';
import { SuspenseMonitor } from './SuspenseMonitor';
import styled from '@emotion/styled';

const MetricCardContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 8px;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2563eb;
  margin: 8px 0;
`;

const MetricDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => (
  <MetricCardContainer>
    <h3>{title}</h3>
    <MetricValue>{value}</MetricValue>
    {description && <MetricDescription>{description}</MetricDescription>}
  </MetricCardContainer>
);

const TableContainer = styled.div`
  margin: 16px 0;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  background: #f8fafc;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

interface ComponentTableProps {
  components: Record<string, ComponentMetrics>;
}

const ComponentTable: React.FC<ComponentTableProps> = ({ components }) => {
  const sortedComponents = useMemo(() => {
    return Object.values(components).sort((a, b) => b.totalRenderTime - a.totalRenderTime);
  }, [components]);

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Component</Th>
            <Th>Render Count</Th>
            <Th>Mount Time (ms)</Th>
            <Th>Total Render Time (ms)</Th>
            <Th>Unnecessary Renders</Th>
            <Th>Avg Update Time (ms)</Th>
          </tr>
        </thead>
        <tbody>
          {sortedComponents.map(metrics => (
            <Tr key={metrics.componentName}>
              <Td>{metrics.componentName}</Td>
              <Td>{metrics.renderCount}</Td>
              <Td>{metrics.mountTime.toFixed(2)}</Td>
              <Td>{metrics.totalRenderTime.toFixed(2)}</Td>
              <Td>{metrics.unnecessaryRenders}</Td>
              <Td>
                {metrics.updateTimes.length
                  ? (metrics.updateTimes.reduce((a, b) => a + b, 0) / metrics.updateTimes.length).toFixed(2)
                  : '-'}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const Alert = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  margin-bottom: 24px;
  border-radius: 4px;
`;

const ConfigSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
`;

const Pre = styled.pre`
  margin: 0;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  overflow-x: auto;
`;

export const PerformanceDashboard: React.FC = () => {
  const { metrics, config, resetMetrics } = usePerformanceContext();
  const componentCount = Object.keys(metrics.components).length;

  const totalUnnecessaryRenders = useMemo(() => {
    return Object.values(metrics.components).reduce(
      (total, metrics) => total + metrics.unnecessaryRenders,
      0
    );
  }, [metrics.components]);

  const averageMountTime = useMemo(() => {
    const mountTimes = Object.values(metrics.components).map(m => m.mountTime);
    return mountTimes.length
      ? (mountTimes.reduce((a, b) => a + b, 0) / mountTimes.length).toFixed(2)
      : '0';
  }, [metrics.components]);

  return (
    <DashboardContainer>
      <Header>
        <h2>Performance Metrics</h2>
        <ResetButton onClick={resetMetrics}>Reset Metrics</ResetButton>
      </Header>

      <MetricsGrid>
        <MetricCard
          title="Components Tracked"
          value={componentCount}
          description="Number of components being monitored"
        />
        <MetricCard
          title="Total Render Time"
          value={`${metrics.totalRenderTime.toFixed(2)}ms`}
          description="Cumulative render time across all components"
        />
        <MetricCard
          title="Unnecessary Renders"
          value={totalUnnecessaryRenders}
          description="Total number of renders that could have been avoided"
        />
        <MetricCard
          title="Average Mount Time"
          value={`${averageMountTime}ms`}
          description="Average time taken for components to mount"
        />
      </MetricsGrid>

      {metrics.slowestComponent && (
        <Alert>
          Slowest Component: {metrics.slowestComponent} (
          {metrics.components[metrics.slowestComponent].totalRenderTime.toFixed(2)}ms)
        </Alert>
      )}

      <ComponentTable components={metrics.components} />
      
      <PerformanceExport />
      
      <NetworkProfiler />
      
      <SuspenseMonitor />
      
      <DependencyTracker />
      
      <BundleAnalyzer />
      
      <DebugMode />

      <ConfigSection>
        <h3>Current Configuration</h3>
        <Pre>{JSON.stringify(config, null, 2)}</Pre>
      </ConfigSection>
    </DashboardContainer>
  );
}; 