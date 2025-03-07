import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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

const ChartContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ModuleList = styled.div`
  margin-top: 24px;
  max-height: 300px;
  overflow-y: auto;
`;

const ModuleItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f8fafc;
  }
`;

const ModuleName = styled.span`
  flex: 1;
`;

const ModuleSize = styled.span`
  color: #666;
  margin-left: 16px;
`;

interface BundleModule {
  name: string;
  size: number;
}

export const BundleAnalyzer: React.FC = () => {
  const [modules, setModules] = useState<BundleModule[]>([]);

  useEffect(() => {
    // In a real implementation, this would be replaced with actual bundle analysis
    // using tools like webpack-bundle-analyzer or source-map-explorer
    const mockModules: BundleModule[] = [
      { name: 'react', size: 120000 },
      { name: 'react-dom', size: 890000 },
      { name: 'chart.js', size: 450000 },
      { name: '@emotion/styled', size: 180000 },
      { name: 'app code', size: 250000 },
    ];
    setModules(mockModules);
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const chartData = {
    labels: modules.map(m => m.name),
    datasets: [
      {
        data: modules.map(m => m.size),
        backgroundColor: [
          '#2563eb',
          '#16a34a',
          '#dc2626',
          '#ca8a04',
          '#9333ea',
        ],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  const totalSize = modules.reduce((sum, module) => sum + module.size, 0);

  return (
    <Container>
      <Title>Bundle Size Analysis</Title>
      <ChartContainer>
        <Doughnut data={chartData} options={chartOptions} />
      </ChartContainer>
      <ModuleList>
        {modules
          .sort((a, b) => b.size - a.size)
          .map(module => (
            <ModuleItem key={module.name}>
              <ModuleName>{module.name}</ModuleName>
              <ModuleSize>
                {formatSize(module.size)} ({((module.size / totalSize) * 100).toFixed(1)}%)
              </ModuleSize>
            </ModuleItem>
          ))}
        <ModuleItem>
          <ModuleName><strong>Total</strong></ModuleName>
          <ModuleSize><strong>{formatSize(totalSize)}</strong></ModuleSize>
        </ModuleItem>
      </ModuleList>
    </Container>
  );
}; 