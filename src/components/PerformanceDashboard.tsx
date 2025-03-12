import React, { useMemo, useState } from 'react';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
import type { ComponentMetrics } from '../types';
import styled from '@emotion/styled';

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  color: #2563eb;
`;

const ResetButton = styled.button`
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

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

const MetricCardContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
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

const TableContainer = styled.div`
  margin: 16px 0;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  background: #f8fafc;
  font-weight: 600;
  color: #4b5563;
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

const Alert = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  margin-bottom: 24px;
  border-radius: 4px;
  font-size: 14px;
  color: #92400e;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
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

interface ComponentTableProps {
  components: Record<string, ComponentMetrics>;
}

const ComponentTable: React.FC<ComponentTableProps> = ({ components }) => {
  const sortedComponents = useMemo(() => {
    return Object.values(components).sort((a, b) => b.totalRenderTime - a.totalRenderTime);
  }, [components]);

  if (sortedComponents.length === 0) {
    return <NoDataMessage>No component metrics available yet. Interact with the application to generate metrics.</NoDataMessage>;
  }

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

/**
 * A dashboard component that displays performance metrics for React components.
 * This component must be used within a PerformanceProvider context.
 */
export const PerformanceDashboard: React.FC = () => {
  const { getAllMetrics, resetAllMetrics, getConfig } = usePerformanceMonitorContext();
  const [filter, setFilter] = useState('');

  // Get current metrics
  const metrics = getAllMetrics();
  const config = getConfig();

  // Calculate derived metrics
  const componentCount = Object.keys(metrics).length;
  const totalRenderCount = Object.values(metrics).reduce((sum, m) => sum + m.renderCount, 0);
  const totalRenderTime = Object.values(metrics).reduce((sum, m) => sum + m.totalRenderTime, 0);
  const unnecessaryRenderCount = Object.values(metrics).reduce((sum, m) => sum + m.unnecessaryRenders, 0);

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!filter) return metrics;
    const lowerFilter = filter.toLowerCase();
    return Object.entries(metrics).reduce((acc, [name, metric]) => {
      if (name.toLowerCase().includes(lowerFilter)) {
        acc[name] = metric;
      }
      return acc;
    }, {} as Record<string, ComponentMetrics>);
  }, [metrics, filter]);

  if (!config.enabled) {
    return (
      <DashboardContainer>
        <Alert>Performance monitoring is currently disabled.</Alert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Performance Dashboard</Title>
        <ResetButton onClick={resetAllMetrics}>Reset Metrics</ResetButton>
      </Header>

      <MetricsGrid>
        <MetricCard
          title="Components Tracked"
          value={componentCount}
          description="Number of components being monitored"
        />
        <MetricCard
          title="Total Renders"
          value={totalRenderCount}
          description="Total number of render operations"
        />
        <MetricCard
          title="Total Render Time"
          value={`${totalRenderTime.toFixed(2)}ms`}
          description="Cumulative rendering time"
        />
        <MetricCard
          title="Unnecessary Renders"
          value={unnecessaryRenderCount}
          description="Renders that could have been avoided"
        />
      </MetricsGrid>

      {componentCount > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Filter components..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '100%',
              fontSize: '14px'
            }}
          />
        </div>
      )}

      <ComponentTable components={filteredComponents} />
    </DashboardContainer>
  );
}; 