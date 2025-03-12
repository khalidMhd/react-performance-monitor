import React, { useMemo } from 'react';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';
import { Line } from 'react-chartjs-2';
import styled from '@emotion/styled';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ComponentMetrics } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

const Charts = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChartContainer = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
`;

const ChartTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
`;

export const PerformanceExport: React.FC = () => {
  const { getAllMetrics } = usePerformanceMonitorContext();
  
  // Convert metrics from monitor context to the format needed for charts
  const components = useMemo<Record<string, ComponentMetrics>>(() => {
    const allMetrics = getAllMetrics();
    const result: Record<string, ComponentMetrics> = {};
    
    Object.entries(allMetrics).forEach(([name, metric]) => {
      result[name] = {
        componentName: name,
        renderCount: metric.renderCount,
        mountTime: metric.mountTime,
        updateTimes: metric.updateTimes || [],
        lastRenderTime: metric.lastRenderTime,
        totalRenderTime: metric.totalRenderTime,
        unnecessaryRenders: metric.unnecessaryRenders || 0
      };
    });
    
    return result;
  }, [getAllMetrics]);

  const exportToJSON = () => {
    const dataStr = JSON.stringify(components, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-metrics-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const componentsArray = Object.values(components);
    const headers = ['Component', 'Render Count', 'Mount Time', 'Total Render Time', 'Unnecessary Renders', 'Avg Update Time'];
    const rows = componentsArray.map(comp => [
      comp.componentName,
      comp.renderCount,
      comp.mountTime.toFixed(2),
      comp.totalRenderTime.toFixed(2),
      comp.unnecessaryRenders,
      comp.updateTimes.length
        ? (comp.updateTimes.reduce((a, b) => a + b, 0) / comp.updateTimes.length).toFixed(2)
        : '0'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-metrics-${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Prepare data for render time chart
  const renderTimeChartData = {
    labels: Object.keys(components),
    datasets: [
      {
        label: 'Total Render Time (ms)',
        data: Object.values(components).map(comp => comp.totalRenderTime),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Mount Time (ms)',
        data: Object.values(components).map(comp => comp.mountTime),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for render count chart
  const renderCountChartData = {
    labels: Object.keys(components),
    datasets: [
      {
        label: 'Render Count',
        data: Object.values(components).map(comp => comp.renderCount),
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
      },
      {
        label: 'Unnecessary Renders',
        data: Object.values(components).map(comp => comp.unnecessaryRenders),
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <ExportButtons>
        <Button onClick={exportToJSON}>Export to JSON</Button>
        <Button onClick={exportToCSV}>Export to CSV</Button>
      </ExportButtons>

      <Charts>
        <ChartContainer>
          <ChartTitle>Render Times</ChartTitle>
          <Line data={renderTimeChartData} options={chartOptions} />
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Render Counts</ChartTitle>
          <Line data={renderCountChartData} options={chartOptions} />
        </ChartContainer>
      </Charts>
    </Container>
  );
}; 