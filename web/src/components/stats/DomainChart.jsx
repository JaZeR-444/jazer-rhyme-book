/**
 * DomainChart.jsx
 * Visual chart showing domain visit distribution
 */

import React, { useMemo } from 'react';
import './DomainChart.css';

export default function DomainChart({ domainData }) {
  const total = useMemo(() => {
    return domainData.reduce((sum, d) => sum + d.count, 0);
  }, [domainData]);

  const sortedData = useMemo(() => {
    return [...domainData].sort((a, b) => b.count - a.count).slice(0, 10);
  }, [domainData]);

  const colors = [
    '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
    '#ef4444', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899',
  ];

  return (
    <div className="domain-chart">
      <div className="domain-chart__header">
        <h3 className="domain-chart__title">Domain Distribution</h3>
        <p className="domain-chart__subtitle">Top {sortedData.length} domains visited</p>
      </div>

      <div className="domain-chart__list">
        {sortedData.map(({ domain, count }, index) => {
          const percentage = ((count / total) * 100).toFixed(1);
          
          return (
            <div key={domain} className="domain-chart__item">
              <div className="domain-chart__item-header">
                <div className="domain-chart__item-info">
                  <div 
                    className="domain-chart__color-indicator"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="domain-chart__domain">{domain}</span>
                </div>
                <div className="domain-chart__item-stats">
                  <span className="domain-chart__count">{count}</span>
                  <span className="domain-chart__percentage">{percentage}%</span>
                </div>
              </div>
              
              <div className="domain-chart__bar">
                <div 
                  className="domain-chart__bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length]
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="domain-chart__summary">
        <p className="domain-chart__total">
          Total visits across <strong>{domainData.length}</strong> domains
        </p>
      </div>
    </div>
  );
}
