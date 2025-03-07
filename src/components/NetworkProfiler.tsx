import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { usePerformanceContext } from '../context/PerformanceContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { NetworkRequest } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const RequestList = styled.div`
  margin-top: 1rem;
`;

const RequestItem = styled.div<{ status: number }>`
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.25rem;
  background: ${props => props.status >= 400 ? 'rgba(220, 38, 38, 0.1)' : 'transparent'};
`;

const StatusBadge = styled.span<{ status: number }>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background: ${props => {
    if (props.status >= 500) return 'rgba(220, 38, 38, 0.1)';
    if (props.status >= 400) return 'rgba(234, 179, 8, 0.1)';
    return 'rgba(34, 197, 94, 0.1)';
  }};
  color: ${props => {
    if (props.status >= 500) return '#dc2626';
    if (props.status >= 400) return '#eab308';
    return '#22c55e';
  }};
`;

const DurationBadge = styled.span<{ duration: number }>`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  background: ${props => {
    if (props.duration > 1000) return 'rgba(220, 38, 38, 0.1)';
    if (props.duration > 500) return 'rgba(234, 179, 8, 0.1)';
    return 'rgba(34, 197, 94, 0.1)';
  }};
  color: ${props => {
    if (props.duration > 1000) return '#dc2626';
    if (props.duration > 500) return '#eab308';
    return '#22c55e';
  }};
`;

export const NetworkProfiler: React.FC = () => {
  const { metrics } = usePerformanceContext();
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    // Collect all network requests from all components
    const allRequests = Object.values(metrics.components)
      .filter(component => component.networkRequests)
      .flatMap(component => component.networkRequests || [])
      .flatMap(networkMetrics => networkMetrics.requests)
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first

    setRequests(allRequests);
  }, [metrics]);

  const chartData = {
    labels: requests.map(req => new Date(req.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Request Duration (ms)',
        data: requests.map(req => req.duration),
        backgroundColor: requests.map(req => 
          req.duration > 1000 ? 'rgba(220, 38, 38, 0.5)' :
          req.duration > 500 ? 'rgba(234, 179, 8, 0.5)' :
          'rgba(34, 197, 94, 0.5)'
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Network Request Durations',
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
      <h3>Network Requests</h3>
      <Bar data={chartData} options={chartOptions} />
      <RequestList>
        {requests.map((request, index) => (
          <RequestItem key={index} status={typeof request.status === 'number' ? request.status : 500}>
            <div>
              <strong>{request.method}</strong> {request.url}
            </div>
            <div>
              <StatusBadge status={typeof request.status === 'number' ? request.status : 500}>
                {request.status}
              </StatusBadge>
              <DurationBadge duration={request.duration}>
                {request.duration.toFixed(2)}ms
              </DurationBadge>
            </div>
          </RequestItem>
        ))}
      </RequestList>
    </Container>
  );
}; 