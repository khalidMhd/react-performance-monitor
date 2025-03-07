import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  margin: 0;
  color: #1e293b;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.9em;
`;

const BoundaryList = styled.div`
  margin-top: 24px;
  max-height: 300px;
  overflow-y: auto;
`;

const BoundaryItem = styled.div<{ isActive: boolean }>`
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: ${props => props.isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #f8fafc;
  }
`;

const BoundaryName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const BoundaryMetrics = styled.div`
  display: flex;
  gap: 16px;
  color: #64748b;
  font-size: 0.9em;
`;

interface SuspenseBoundary {
  id: string;
  name: string;
  suspenseCount: number;
  avgSuspenseTime: number;
  isActive: boolean;
  lastSuspenseTime?: number;
  history: Array<{
    timestamp: number;
    duration: number;
  }>;
}

export const SuspenseMonitor: React.FC = () => {
  const [boundaries, setBoundaries] = useState<SuspenseBoundary[]>([]);
  const [totalSuspenses, setTotalSuspenses] = useState(0);
  const [avgSuspenseTime, setAvgSuspenseTime] = useState(0);

  useEffect(() => {
    // Mock data for demonstration
    const mockBoundaries: SuspenseBoundary[] = [
      {
        id: '1',
        name: 'DataLoader',
        suspenseCount: 5,
        avgSuspenseTime: 350,
        isActive: false,
        history: Array.from({ length: 5 }, (_, i) => ({
          timestamp: Date.now() - (i * 60000),
          duration: Math.random() * 500 + 100,
        })),
      },
      {
        id: '2',
        name: 'ImageGallery',
        suspenseCount: 3,
        avgSuspenseTime: 250,
        isActive: true,
        lastSuspenseTime: Date.now(),
        history: Array.from({ length: 3 }, (_, i) => ({
          timestamp: Date.now() - (i * 120000),
          duration: Math.random() * 400 + 100,
        })),
      },
    ];

    setBoundaries(mockBoundaries);
    setTotalSuspenses(mockBoundaries.reduce((sum, b) => sum + b.suspenseCount, 0));
    setAvgSuspenseTime(
      mockBoundaries.reduce((sum, b) => sum + (b.avgSuspenseTime * b.suspenseCount), 0) /
      mockBoundaries.reduce((sum, b) => sum + b.suspenseCount, 0)
    );
  }, []);

  const chartData = {
    labels: boundaries.flatMap(b => 
      b.history.map(h => new Date(h.timestamp).toLocaleTimeString())
    ),
    datasets: boundaries.map(boundary => ({
      label: boundary.name,
      data: boundary.history.map(h => h.duration),
      borderColor: boundary.isActive ? 'rgb(37, 99, 235)' : 'rgb(100, 116, 139)',
      tension: 0.1,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Suspense Duration Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Duration (ms)',
        },
      },
    },
  };

  return (
    <Container>
      <Header>
        <Title>Suspense Boundaries</Title>
      </Header>

      <Stats>
        <StatCard>
          <StatValue>{boundaries.length}</StatValue>
          <StatLabel>Active Boundaries</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalSuspenses}</StatValue>
          <StatLabel>Total Suspenses</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{avgSuspenseTime.toFixed(1)}ms</StatValue>
          <StatLabel>Average Suspense Time</StatLabel>
        </StatCard>
      </Stats>

      <Line data={chartData} options={chartOptions} />

      <BoundaryList>
        {boundaries.map(boundary => (
          <BoundaryItem key={boundary.id} isActive={boundary.isActive}>
            <BoundaryName>{boundary.name}</BoundaryName>
            <BoundaryMetrics>
              <span>{boundary.suspenseCount} suspenses</span>
              <span>{boundary.avgSuspenseTime.toFixed(1)}ms avg</span>
              {boundary.isActive && <span>Currently suspended</span>}
            </BoundaryMetrics>
          </BoundaryItem>
        ))}
      </BoundaryList>
    </Container>
  );
}; 