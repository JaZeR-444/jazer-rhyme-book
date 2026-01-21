/**
 * Stats.jsx
 * Statistics dashboard page showing user activity and analytics
 */

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Award, Clock } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { analytics } from '../lib/analytics';
import ActivityCalendar from '../components/stats/ActivityCalendar';
import DomainChart from '../components/stats/DomainChart';
import ShareCard from '../components/stats/ShareCard';
import './Stats.css';

export default function Stats() {
  usePageTitle('Statistics');
  const [stats, setStats] = useState(null);
  const [activityData, setActivityData] = useState({});
  const [domainData, setDomainData] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState(null);

  useEffect(() => {
    const loadedStats = analytics.getStats();
    const loadedActivityData = analytics.getActivityCalendar(365);
    const loadedDomainData = analytics.getDomainDistribution();
    const loadedWeeklySummary = analytics.getWeeklySummary();

    setStats(loadedStats);
    setActivityData(loadedActivityData);
    setDomainData(loadedDomainData);
    setWeeklySummary(loadedWeeklySummary);
  }, []);

  const formatDuration = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(milliseconds / (1000 * 60));
    return `${minutes}m`;
  };

  if (!stats) {
    return (
      <div className="stats-page">
        <div className="stats-page__loading">Loading your statistics...</div>
      </div>
    );
  }

  return (
    <div className="stats-page" role="main" aria-label="Statistics - View your activity and analytics">
      <header className="stats-page__header">
        <div className="stats-page__header-content">
          <h1 className="stats-page__title">Your Statistics</h1>
          <p className="stats-page__subtitle">
            Member since {new Date(stats.memberSince).toLocaleDateString()}
          </p>
        </div>
        <BarChart3 className="stats-page__header-icon" size={40} />
      </header>

      {/* Key Metrics Grid */}
      <div className="stats-page__metrics">
        <div className="stat-card">
          <div className="stat-card__icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.uniqueWordsViewed.toLocaleString()}</div>
            <div className="stat-card__label">Unique Words</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon">
            <Award size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.uniqueEntitiesExplored.toLocaleString()}</div>
            <div className="stat-card__label">Entities Explored</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.totalStudioWords.toLocaleString()}</div>
            <div className="stat-card__label">Words Written</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon">
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{formatDuration(stats.totalStudioTime)}</div>
            <div className="stat-card__label">Studio Time</div>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      {weeklySummary && (
        <div className="stats-page__weekly">
          <h2 className="stats-page__section-title">This Week</h2>
          <div className="stats-page__weekly-grid">
            <div className="weekly-stat">
              <span className="weekly-stat__value">{weeklySummary.wordsViewed}</span>
              <span className="weekly-stat__label">Words Viewed</span>
            </div>
            <div className="weekly-stat">
              <span className="weekly-stat__value">{weeklySummary.entitiesExplored}</span>
              <span className="weekly-stat__label">Entities</span>
            </div>
            <div className="weekly-stat">
              <span className="weekly-stat__value">{weeklySummary.domainsVisited}</span>
              <span className="weekly-stat__label">Domains</span>
            </div>
            <div className="weekly-stat">
              <span className="weekly-stat__value">{weeklySummary.searches}</span>
              <span className="weekly-stat__label">Searches</span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Calendar */}
      <div className="stats-page__section">
        <ActivityCalendar activityData={activityData} daysToShow={365} />
      </div>

      {/* Domain Distribution */}
      {domainData.length > 0 && (
        <div className="stats-page__section">
          <DomainChart domainData={domainData} />
        </div>
      )}

      {/* Share Card */}
      <div className="stats-page__section">
        <ShareCard stats={stats} />
      </div>

      {/* Additional Stats */}
      <div className="stats-page__additional">
        <h2 className="stats-page__section-title">All Time Stats</h2>
        <div className="stats-page__additional-grid">
          <div className="additional-stat">
            <span className="additional-stat__label">Total Word Views</span>
            <span className="additional-stat__value">{stats.totalWordViews.toLocaleString()}</span>
          </div>
          <div className="additional-stat">
            <span className="additional-stat__label">Total Entity Views</span>
            <span className="additional-stat__value">{stats.totalEntityViews.toLocaleString()}</span>
          </div>
          <div className="additional-stat">
            <span className="additional-stat__label">Total Domain Visits</span>
            <span className="additional-stat__value">{stats.totalDomainViews.toLocaleString()}</span>
          </div>
          <div className="additional-stat">
            <span className="additional-stat__label">Studio Sessions</span>
            <span className="additional-stat__value">{stats.totalStudioSessions.toLocaleString()}</span>
          </div>
          <div className="additional-stat">
            <span className="additional-stat__label">Total Searches</span>
            <span className="additional-stat__value">{stats.totalSearches.toLocaleString()}</span>
          </div>
          <div className="additional-stat">
            <span className="additional-stat__label">Unique Domains</span>
            <span className="additional-stat__value">{stats.uniqueDomainsVisited.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
