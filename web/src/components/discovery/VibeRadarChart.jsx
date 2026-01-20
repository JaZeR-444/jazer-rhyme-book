/**
 * VibeRadarChart.jsx
 * 
 * Radar chart visualization for comparing "vibe" metrics between two words
 * Uses word attributes to create multi-dimensional comparison
 */

import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import './VibeRadarChart.css';

const VIBE_METRICS = {
  complexity: {
    label: 'Complexity',
    calculate: (word) => {
      const syllableScore = (word.syllables || 1) * 20;
      const tagScore = (word.t?.length || 0) * 15;
      return Math.min(100, syllableScore + tagScore);
    }
  },
  versatility: {
    label: 'Versatility',
    calculate: (word) => {
      const synonymScore = (word.syn?.length || 0) * 20;
      const tagScore = (word.t?.length || 0) * 10;
      return Math.min(100, synonymScore + tagScore);
    }
  },
  intensity: {
    label: 'Intensity',
    calculate: (word) => {
      const hasRapDef = word.rd ? 30 : 0;
      const isShort = word.name.length <= 5 ? 30 : 0;
      const hasTag = word.t?.includes('aggressive') || word.t?.includes('intense') ? 40 : 0;
      return hasRapDef + isShort + hasTag;
    }
  },
  flow: {
    label: 'Flow',
    calculate: (word) => {
      const syllableFlow = word.syllables === 2 ? 40 : word.syllables === 1 ? 30 : 20;
      const rhymeability = word.rhyme ? 40 : 20;
      return syllableFlow + rhymeability;
    }
  },
  creativity: {
    label: 'Creativity',
    calculate: (word) => {
      const rapDefScore = word.rd ? 50 : 0;
      const uniqueScore = word.name.length > 8 ? 30 : 20;
      return rapDefScore + uniqueScore;
    }
  },
  impact: {
    label: 'Impact',
    calculate: (word) => {
      const lengthScore = word.name.length <= 6 ? 40 : 20;
      const strongTags = word.t?.filter(t => 
        ['power', 'strong', 'bold', 'intense'].includes(t.toLowerCase())
      ).length || 0;
      return lengthScore + (strongTags * 20);
    }
  }
};

export default function VibeRadarChart({ word1, word2 }) {
  const chartData = useMemo(() => {
    if (!word1 || !word2) return [];

    return Object.entries(VIBE_METRICS).map(([key, metric]) => ({
      metric: metric.label,
      [word1.name]: metric.calculate(word1),
      [word2.name]: metric.calculate(word2)
    }));
  }, [word1, word2]);

  if (!word1 || !word2) {
    return (
      <div className="vibe-radar-empty">
        <p>Select two words to compare their vibes</p>
      </div>
    );
  }

  return (
    <div className="vibe-radar-chart">
      <div className="vibe-radar-header">
        <h3>Vibe Comparison</h3>
        <p className="vibe-radar-subtitle">
          Multi-dimensional analysis of word characteristics
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
          />
          <Radar
            name={word1.name}
            dataKey={word1.name}
            stroke="#FF6B6B"
            fill="#FF6B6B"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name={word2.name}
            dataKey={word2.name}
            stroke="#4ECDC4"
            fill="#4ECDC4"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '10px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="vibe-metrics-legend">
        {Object.entries(VIBE_METRICS).map(([key, metric]) => (
          <div key={key} className="metric-info">
            <span className="metric-label">{metric.label}</span>
            <div className="metric-bars">
              <div 
                className="metric-bar metric-bar--word1"
                style={{ width: `${metric.calculate(word1)}%` }}
              >
                {metric.calculate(word1)}
              </div>
              <div 
                className="metric-bar metric-bar--word2"
                style={{ width: `${metric.calculate(word2)}%` }}
              >
                {metric.calculate(word2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
