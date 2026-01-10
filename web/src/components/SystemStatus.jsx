import { useState, useEffect } from 'react';
import { Activity, Clock, Wifi, Cpu } from 'lucide-react';
import './SystemStatus.css';

export function SystemStatus() {
  const [metrics, setMetrics] = useState({
    ping: 12,
    uptime: '00:00:00',
    fps: 60,
    memory: '14%'
  });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const uptimeMs = now - startTime;
      const hours = Math.floor(uptimeMs / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((uptimeMs % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((uptimeMs % 60000) / 1000).toString().padStart(2, '0');

      // Simulate fluctuating metrics
      setMetrics(prev => ({
        ping: Math.floor(10 + Math.random() * 15),
        uptime: `${hours}:${minutes}:${seconds}`,
        fps: Math.floor(58 + Math.random() * 4),
        memory: `${Math.floor(12 + Math.random() * 4)}%`
      }));
      
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="system-status">
      <div className="system-status__group">
        <Activity size={12} className="system-status__icon pulse" />
        <span className="system-status__label">EST_LATENCY:</span>
        <span className="system-status__value">{metrics.ping}ms</span>
      </div>

      <div className="system-status__separator">|</div>

      <div className="system-status__group">
        <Wifi size={12} className="system-status__icon" />
        <span className="system-status__label">NET_STATUS:</span>
        <span className="system-status__value text-success">CONNECTED</span>
      </div>

      <div className="system-status__separator">|</div>

      <div className="system-status__group">
        <Cpu size={12} className="system-status__icon" />
        <span className="system-status__label">MEM_USAGE:</span>
        <span className="system-status__value">{metrics.memory}</span>
      </div>

      <div className="system-status__separator">|</div>

      <div className="system-status__group">
        <span className="system-status__label">UPTIME:</span>
        <span className="system-status__value">{metrics.uptime}</span>
      </div>

      <div className="system-status__separator">|</div>

      <div className="system-status__group">
        <Clock size={12} className="system-status__icon" />
        <span className="system-status__value">
          {time.toLocaleTimeString('en-US', { hour12: false })} UTC
        </span>
      </div>
    </div>
  );
}
