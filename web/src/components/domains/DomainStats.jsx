/**
 * DomainStats.jsx
 * 
 * Domain statistics dashboard showing entity counts, popular tags, era charts
 */

import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Tag, Hash, Star, Clock } from 'lucide-react';
import './DomainStats.css';

const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

export default function DomainStats({ 
  domainData, 
  entities = [],
  showCharts = true,
  compact = false 
}) {
  const stats = useMemo(() => {
    if (!entities || entities.length === 0) {
      return {
        totalEntities: 0,
        tagDistribution: [],
        eraDistribution: [],
        complexityDistribution: [],
        topTags: [],
        averageComplexity: 0,
        entityTypes: []
      };
    }

    // Filter entities for this domain if specified
    const domainEntities = domainData ? 
      entities.filter(entity => entity.domain === domainData.name) : 
      entities;

    // Tag distribution
    const tagCounts = {};
    domainEntities.forEach(entity => {
      if (entity.tags) {
        entity.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const tagDistribution = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Era distribution
    const eraCounts = {};
    domainEntities.forEach(entity => {
      if (entity.era) {
        eraCounts[entity.era] = (eraCounts[entity.era] || 0) + 1;
      }
    });

    const eraDistribution = Object.entries(eraCounts)
      .sort((a, b) => {
        // Sort eras chronologically
        const eraOrder = ['Classic', '90s', '2000s', '2010s', 'Modern', 'Contemporary'];
        const aIndex = eraOrder.indexOf(a[0]);
        const bIndex = eraOrder.indexOf(b[0]);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      })
      .map(([era, count]) => ({ era, count }));

    // Complexity distribution
    const complexityCounts = { Simple: 0, Medium: 0, Complex: 0, Expert: 0 };
    let totalComplexity = 0;
    let complexityCount = 0;

    domainEntities.forEach(entity => {
      if (entity.complexity) {
        const level = getComplexityLevel(entity.complexity);
        complexityCounts[level]++;
        totalComplexity += entity.complexity;
        complexityCount++;
      }
    });

    const complexityDistribution = Object.entries(complexityCounts)
      .filter(([, count]) => count > 0)
      .map(([level, count]) => ({ level, count }));

    // Entity type distribution
    const typeCounts = {};
    domainEntities.forEach(entity => {
      if (entity.type) {
        typeCounts[entity.type] = (typeCounts[entity.type] || 0) + 1;
      } else {
        typeCounts['General'] = (typeCounts['General'] || 0) + 1;
      }
    });

    const entityTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));

    return {
      totalEntities: domainEntities.length,
      tagDistribution,
      eraDistribution,
      complexityDistribution,
      topTags: tagDistribution.slice(0, 5),
      averageComplexity: complexityCount > 0 ? totalComplexity / complexityCount : 0,
      entityTypes
    };
  }, [domainData, entities]);

  const getComplexityLevel = (complexity) => {
    if (complexity <= 2) return 'Simple';
    if (complexity <= 4) return 'Medium';
    if (complexity <= 7) return 'Complex';
    return 'Expert';
  };

  if (compact) {
    return (
      <div className="domain-stats domain-stats--compact">
        <div className="stats-grid">
          <div className="stat-item">
            <Hash size={16} className="stat-icon" />
            <span className="stat-value">{stats.totalEntities}</span>
            <span className="stat-label">Entities</span>
          </div>
          
          <div className="stat-item">
            <Tag size={16} className="stat-icon" />
            <span className="stat-value">{stats.tagDistribution.length}</span>
            <span className="stat-label">Tags</span>
          </div>
          
          <div className="stat-item">
            <Star size={16} className="stat-icon" />
            <span className="stat-value">{stats.averageComplexity.toFixed(1)}</span>
            <span className="stat-label">Avg Complexity</span>
          </div>
        </div>
        
        {stats.topTags.length > 0 && (
          <div className="top-tags-compact">
            {stats.topTags.map(({ tag, count }) => (
              <span key={tag} className="tag-pill">
                {tag} ({count})
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="domain-stats">
      <div className="stats-header">
        <h3>
          {domainData ? `${domainData.name} Statistics` : 'Domain Statistics'}
        </h3>
        <div className="stats-summary">
          <TrendingUp size={16} className="summary-icon" />
          <span>{stats.totalEntities} entities across {stats.eraDistribution.length} eras</span>
        </div>
      </div>

      <div className="overview-stats">
        <div className="overview-card">
          <div className="overview-icon">
            <Hash size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-value">{stats.totalEntities}</span>
            <span className="overview-label">Total Entities</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Tag size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-value">{stats.tagDistribution.length}</span>
            <span className="overview-label">Unique Tags</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Calendar size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-value">{stats.eraDistribution.length}</span>
            <span className="overview-label">Eras Covered</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Star size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-value">{stats.averageComplexity.toFixed(1)}</span>
            <span className="overview-label">Avg Complexity</span>
          </div>
        </div>
      </div>

      {showCharts && (
        <div className="charts-section">
          {/* Tag Distribution Chart */}
          {stats.tagDistribution.length > 0 && (
            <div className="chart-card">
              <h4>
                <Tag size={16} />
                Popular Tags
              </h4>
              <div className="bar-chart">
                {stats.tagDistribution.map(({ tag, count }, index) => {
                  const maxCount = stats.tagDistribution[0]?.count || 1;
                  const percentage = (count / maxCount) * 100;
                  
                  return (
                    <div key={tag} className="bar-item">
                      <span className="bar-label">{tag}</span>
                      <div className="bar-track">
                        <div 
                          className="bar-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                          }}
                        ></div>
                      </div>
                      <span className="bar-value">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Era Distribution Chart */}
          {stats.eraDistribution.length > 0 && (
            <div className="chart-card">
              <h4>
                <Clock size={16} />
                Era Distribution
              </h4>
              <div className="pie-chart">
                {stats.eraDistribution.map(({ era, count }, index) => {
                  const percentage = (count / stats.totalEntities) * 100;
                  
                  return (
                    <div key={era} className="pie-item">
                      <div 
                        className="pie-color"
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      ></div>
                      <span className="pie-label">{era}</span>
                      <span className="pie-value">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Entity Types Chart */}
          {stats.entityTypes.length > 1 && (
            <div className="chart-card">
              <h4>
                <Hash size={16} />
                Entity Types
              </h4>
              <div className="horizontal-bar-chart">
                {stats.entityTypes.map(({ type, count }, index) => {
                  const percentage = (count / stats.totalEntities) * 100;
                  
                  return (
                    <div key={type} className="horizontal-bar-item">
                      <span className="horizontal-bar-label">{type}</span>
                      <div className="horizontal-bar-track">
                        <div 
                          className="horizontal-bar-fill"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                          }}
                        ></div>
                      </div>
                      <span className="horizontal-bar-value">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Complexity Distribution */}
          {stats.complexityDistribution.length > 0 && (
            <div className="chart-card">
              <h4>
                <Star size={16} />
                Complexity Levels
              </h4>
              <div className="complexity-bars">
                {stats.complexityDistribution.map(({ level, count }, index) => (
                  <div key={level} className="complexity-bar-container">
                    <span className="complexity-label">{level}</span>
                    <div className="complexity-bar-track">
                      <div 
                        className="complexity-bar-fill"
                        style={{
                          width: `${(count / stats.totalEntities) * 100}%`,
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                        }}
                      ></div>
                    </div>
                    <span className="complexity-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Tags List */}
      {stats.topTags.length > 0 && (
        <div className="top-tags-section">
          <h4>Most Popular Tags</h4>
          <div className="tags-list">
            {stats.topTags.map(({ tag, count }, index) => (
              <div key={tag} className="tag-item">
                <span className="tag-rank">#{index + 1}</span>
                <span className="tag-name">{tag}</span>
                <span className="tag-count">{count} entities</span>
                <div 
                  className="tag-progress"
                  style={{
                    width: `${(count / stats.topTags[0].count) * 100}%`
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}