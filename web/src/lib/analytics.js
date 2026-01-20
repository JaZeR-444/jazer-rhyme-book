/**
 * Analytics Library
 * Tracks user activity and generates statistics
 */

const STORAGE_KEY = 'jazer_analytics';

export class Analytics {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }

    return {
      wordsViewed: [],
      entitiesExplored: [],
      domainsVisited: [],
      studioSessions: [],
      searches: [],
      favorites: [],
      collections: [],
      dailyActivity: {},
      startDate: new Date().toISOString(),
    };
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  }

  // Track word view
  trackWordView(word) {
    const today = this.getToday();
    this.data.wordsViewed.push({
      word,
      timestamp: new Date().toISOString(),
      date: today,
    });
    this.updateDailyActivity(today, 'wordViews');
    this.saveData();
  }

  // Track entity exploration
  trackEntityView(entityName, domain) {
    const today = this.getToday();
    this.data.entitiesExplored.push({
      entity: entityName,
      domain,
      timestamp: new Date().toISOString(),
      date: today,
    });
    this.updateDailyActivity(today, 'entityViews');
    this.saveData();
  }

  // Track domain visit
  trackDomainVisit(domain) {
    const today = this.getToday();
    this.data.domainsVisited.push({
      domain,
      timestamp: new Date().toISOString(),
      date: today,
    });
    this.updateDailyActivity(today, 'domainViews');
    this.saveData();
  }

  // Track studio session
  trackStudioSession(wordCount, duration) {
    const today = this.getToday();
    this.data.studioSessions.push({
      wordCount,
      duration,
      timestamp: new Date().toISOString(),
      date: today,
    });
    this.updateDailyActivity(today, 'studioSessions');
    this.saveData();
  }

  // Track search
  trackSearch(query, resultsCount) {
    const today = this.getToday();
    this.data.searches.push({
      query,
      resultsCount,
      timestamp: new Date().toISOString(),
      date: today,
    });
    this.updateDailyActivity(today, 'searches');
    this.saveData();
  }

  // Update daily activity
  updateDailyActivity(date, activityType) {
    if (!this.data.dailyActivity[date]) {
      this.data.dailyActivity[date] = {
        wordViews: 0,
        entityViews: 0,
        domainViews: 0,
        studioSessions: 0,
        searches: 0,
      };
    }
    this.data.dailyActivity[date][activityType]++;
  }

  // Get today's date string
  getToday() {
    return new Date().toISOString().split('T')[0];
  }

  // Get statistics
  getStats() {
    const uniqueWords = new Set(this.data.wordsViewed.map(w => w.word)).size;
    const uniqueEntities = new Set(this.data.entitiesExplored.map(e => e.entity)).size;
    const uniqueDomains = new Set(this.data.domainsVisited.map(d => d.domain)).size;
    const totalStudioWords = this.data.studioSessions.reduce((sum, s) => sum + s.wordCount, 0);
    const totalStudioTime = this.data.studioSessions.reduce((sum, s) => sum + s.duration, 0);

    return {
      totalWordViews: this.data.wordsViewed.length,
      uniqueWordsViewed: uniqueWords,
      totalEntityViews: this.data.entitiesExplored.length,
      uniqueEntitiesExplored: uniqueEntities,
      totalDomainViews: this.data.domainsVisited.length,
      uniqueDomainsVisited: uniqueDomains,
      totalStudioSessions: this.data.studioSessions.length,
      totalStudioWords,
      totalStudioTime,
      totalSearches: this.data.searches.length,
      totalFavorites: this.data.favorites.length,
      totalCollections: this.data.collections.length,
      memberSince: this.data.startDate,
    };
  }

  // Get activity calendar data
  getActivityCalendar(daysBack = 365) {
    const calendar = {};
    const today = new Date();

    for (let i = 0; i < daysBack; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const activity = this.data.dailyActivity[dateStr];
      if (activity) {
        const total = Object.values(activity).reduce((sum, val) => sum + val, 0);
        calendar[dateStr] = total;
      } else {
        calendar[dateStr] = 0;
      }
    }

    return calendar;
  }

  // Get domain distribution
  getDomainDistribution() {
    const distribution = {};
    this.data.domainsVisited.forEach(({ domain }) => {
      distribution[domain] = (distribution[domain] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Get weekly activity summary
  getWeeklySummary() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    return {
      wordsViewed: this.data.wordsViewed.filter(w => w.date >= weekAgoStr).length,
      entitiesExplored: this.data.entitiesExplored.filter(e => e.date >= weekAgoStr).length,
      domainsVisited: new Set(
        this.data.domainsVisited.filter(d => d.date >= weekAgoStr).map(d => d.domain)
      ).size,
      studioSessions: this.data.studioSessions.filter(s => s.date >= weekAgoStr).length,
      searches: this.data.searches.filter(s => s.date >= weekAgoStr).length,
    };
  }

  // Export data
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  exportCSV() {
    const rows = [
      ['Date', 'Word Views', 'Entity Views', 'Domain Views', 'Studio Sessions', 'Searches'],
    ];

    Object.entries(this.data.dailyActivity).forEach(([date, activity]) => {
      rows.push([
        date,
        activity.wordViews,
        activity.entityViews,
        activity.domainViews,
        activity.studioSessions,
        activity.searches,
      ]);
    });

    return rows.map(row => row.join(',')).join('\n');
  }

  // Clear all data
  clearData() {
    this.data = {
      wordsViewed: [],
      entitiesExplored: [],
      domainsVisited: [],
      studioSessions: [],
      searches: [],
      favorites: [],
      collections: [],
      dailyActivity: {},
      startDate: new Date().toISOString(),
    };
    this.saveData();
  }
}

// Singleton instance
export const analytics = new Analytics();
