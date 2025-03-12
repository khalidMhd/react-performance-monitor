import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { usePerformanceMonitorContext } from './PerformanceMonitorContext';

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

const ControlGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #475569;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const LogContainer = styled.div`
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 4px;
  font-family: monospace;
  max-height: 300px;
  overflow-y: auto;
`;

const LogEntry = styled.div<{ type: 'info' | 'warn' | 'error' }>`
  margin: 4px 0;
  padding: 4px 8px;
  border-radius: 2px;
  background: ${props => {
    switch (props.type) {
      case 'error': return 'rgba(220, 38, 38, 0.1)';
      case 'warn': return 'rgba(245, 158, 11, 0.1)';
      default: return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      default: return '#e2e8f0';
    }
  }};
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 16px;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

interface LogMessage {
  id: number;
  timestamp: number;
  type: 'info' | 'warn' | 'error';
  component: string;
  message: string;
}

export const DebugMode: React.FC = () => {
  const { getConfig, getAllMetrics } = usePerformanceMonitorContext();
  const config = getConfig();
  
  // Convert metrics from monitor context to the format needed for debug mode
  const components = useMemo(() => {
    const allMetrics = getAllMetrics();
    return Object.entries(allMetrics).map(([name, metric]) => ({
      name,
      renderCount: metric.renderCount,
      mountTime: metric.mountTime,
      totalRenderTime: metric.totalRenderTime,
      unnecessaryRenders: metric.unnecessaryRenders || 0
    }));
  }, [getAllMetrics]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  const startRecording = () => {
    setIsRecording(true);
    setLogs([]);
    // In a real implementation, this would:
    // 1. Start capturing React DevTools events
    // 2. Monitor network requests
    // 3. Track state changes
    // 4. Profile renders
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Mock log generation for demonstration
  React.useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      const component = selectedComponent || Object.keys(components)[0];
      if (!component) return;

      const types: Array<'info' | 'warn' | 'error'> = ['info', 'warn', 'error'];
      const type = types[Math.floor(Math.random() * types.length)];
      const messages = {
        info: [
          'Component rendered',
          'Props updated',
          'State changed',
          'Effect triggered',
        ],
        warn: [
          'Unnecessary render detected',
          'Large component tree update',
          'Slow render time',
        ],
        error: [
          'Failed to update state',
          'Render error',
          'Effect cleanup failed',
        ],
      };

      setLogs(prev => [...prev, {
        id: Date.now(),
        timestamp: Date.now(),
        type,
        component,
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
      }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording, selectedComponent, components]);

  return (
    <Container>
      <Title>Debug Mode</Title>
      
      <ControlGroup>
        <Label>Select Component to Debug</Label>
        <Select
          value={selectedComponent}
          onChange={(e) => setSelectedComponent(e.target.value)}
        >
          <option value="">All Components</option>
          {components.map(name => (
            <option key={name.name} value={name.name}>{name.name}</option>
          ))}
        </Select>

        <Label>Filter Logs</Label>
        <Select
          value={logFilter}
          onChange={(e) => setLogFilter(e.target.value as any)}
        >
          <option value="all">All Logs</option>
          <option value="info">Info</option>
          <option value="warn">Warnings</option>
          <option value="error">Errors</option>
        </Select>
      </ControlGroup>

      <Button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </Button>
      <Button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </Button>
      <Button onClick={clearLogs}>
        Clear Logs
      </Button>

      <LogContainer>
        {logs
          .filter(log => !selectedComponent || log.component === selectedComponent)
          .filter(log => logFilter === 'all' || log.type === logFilter)
          .map(log => (
            <LogEntry key={log.id} type={log.type}>
              [{new Date(log.timestamp).toLocaleTimeString()}] {log.component}: {log.message}
            </LogEntry>
          ))}
        {logs.length === 0 && (
          <LogEntry type="info">
            No logs yet. Start recording to capture component activity.
          </LogEntry>
        )}
      </LogContainer>
    </Container>
  );
}; 