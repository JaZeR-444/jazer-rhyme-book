/**
 * Achievement System
 * Tracks user progress and unlocks achievements
 */

export const ACHIEVEMENTS = {
  FIRST_FAVORITE: {
    id: 'first_favorite',
    name: 'First Favorite',
    description: 'Save your first favorite word',
    icon: '⭐',
    points: 10,
    category: 'exploration'
  },
  WORDSMITH: {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Explore 100 different words',
    icon: '📚',
    points: 50,
    category: 'exploration',
    requirement: { type: 'wordsViewed', count: 100 }
  },
  WORD_MASTER: {
    id: 'word_master',
    name: 'Word Master',
    description: 'Explore 500 different words',
    icon: '📖',
    points: 100,
    category: 'exploration',
    requirement: { type: 'wordsViewed', count: 500 }
  },
  DOMAIN_EXPLORER: {
    id: 'domain_explorer',
    name: 'Domain Explorer',
    description: 'Visit all 10 domains',
    icon: '🗺️',
    points: 75,
    category: 'exploration',
    requirement: { type: 'domainsVisited', count: 10 }
  },
  STUDIO_SESSIONS: {
    id: 'studio_sessions',
    name: 'Studio Regular',
    description: 'Use Writing Studio 20 times',
    icon: '🎙️',
    points: 100,
    category: 'writing',
    requirement: { type: 'studioSessions', count: 20 }
  },
  VERSE_WRITER: {
    id: 'verse_writer',
    name: 'Verse Writer',
    description: 'Write 500 words in studio',
    icon: '✍️',
    points: 75,
    category: 'writing',
    requirement: { type: 'wordsWritten', count: 500 }
  },
  VERSE_MASTER: {
    id: 'verse_master',
    name: 'Verse Master',
    description: 'Write 1000 words in studio',
    icon: '🏆',
    points: 150,
    category: 'writing',
    requirement: { type: 'wordsWritten', count: 1000 }
  },
  PROLIFIC_WRITER: {
    id: 'prolific_writer',
    name: 'Prolific Writer',
    description: 'Write 5000 words in studio',
    icon: '📝',
    points: 300,
    category: 'writing',
    requirement: { type: 'wordsWritten', count: 5000 }
  },
  DAILY_USER: {
    id: 'daily_user',
    name: 'Daily User',
    description: 'Visit 7 days in a row',
    icon: '📅',
    points: 100,
    category: 'engagement',
    requirement: { type: 'streakDays', count: 7 }
  },
  DEDICATED: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Visit 30 days in a row',
    icon: '🔥',
    points: 250,
    category: 'engagement',
    requirement: { type: 'streakDays', count: 30 }
  },
  COLLECTOR: {
    id: 'collector',
    name: 'Collector',
    description: 'Save 50 favorites',
    icon: '💎',
    points: 100,
    category: 'exploration',
    requirement: { type: 'favoriteCount', count: 50 }
  },
  RHYME_FINDER: {
    id: 'rhyme_finder',
    name: 'Rhyme Finder',
    description: 'Search for rhymes 100 times',
    icon: '🔍',
    points: 75,
    category: 'exploration',
    requirement: { type: 'rhymeSearches', count: 100 }
  }
};

export class AchievementTracker {
  constructor() {
    this.progress = this.loadProgress();
    this.listeners = [];
  }
  
  loadProgress() {
    const saved = localStorage.getItem('jazer_achievements');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        data.domainsVisited = new Set(data.domainsVisited || []);
        return data;
      } catch (e) {
        console.error('Failed to load achievements:', e);
      }
    }
    
    return {
      wordsViewed: 0,
      domainsVisited: new Set(),
      studioSessions: 0,
      wordsWritten: 0,
      streakDays: 0,
      lastVisit: null,
      favoriteCount: 0,
      rhymeSearches: 0,
      unlocked: [],
      totalPoints: 0
    };
  }
  
  saveProgress() {
    const toSave = {
      ...this.progress,
      domainsVisited: Array.from(this.progress.domainsVisited)
    };
    localStorage.setItem('jazer_achievements', JSON.stringify(toSave));
  }
  
  track(event, data = {}) {
    switch (event) {
      case 'wordViewed':
        this.progress.wordsViewed++;
        break;
      case 'domainVisited':
        this.progress.domainsVisited.add(data.domain);
        break;
      case 'studioSession':
        this.progress.studioSessions++;
        break;
      case 'wordsWritten':
        this.progress.wordsWritten += data.count;
        break;
      case 'favoriteAdded':
        this.progress.favoriteCount++;
        break;
      case 'rhymeSearch':
        this.progress.rhymeSearches++;
        break;
      case 'visit':
        this.updateStreak();
        break;
    }
    
    this.checkAchievements();
    this.saveProgress();
  }
  
  updateStreak() {
    const today = new Date().toDateString();
    const lastVisit = this.progress.lastVisit;
    
    if (lastVisit === today) return; // Already counted today
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastVisit === yesterdayStr) {
      this.progress.streakDays++;
    } else if (lastVisit !== today) {
      this.progress.streakDays = 1;
    }
    
    this.progress.lastVisit = today;
  }
  
  checkAchievements() {
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (this.progress.unlocked.includes(achievement.id)) return;
      
      if (this.meetsRequirement(achievement.requirement)) {
        this.unlock(achievement);
      }
    });
  }
  
  meetsRequirement(requirement) {
    if (!requirement) return true;
    
    const { type, count } = requirement;
    
    switch (type) {
      case 'wordsViewed':
        return this.progress.wordsViewed >= count;
      case 'domainsVisited':
        return this.progress.domainsVisited.size >= count;
      case 'studioSessions':
        return this.progress.studioSessions >= count;
      case 'wordsWritten':
        return this.progress.wordsWritten >= count;
      case 'streakDays':
        return this.progress.streakDays >= count;
      case 'favoriteCount':
        return this.progress.favoriteCount >= count;
      case 'rhymeSearches':
        return this.progress.rhymeSearches >= count;
      default:
        return false;
    }
  }
  
  unlock(achievement) {
    this.progress.unlocked.push(achievement.id);
    this.progress.totalPoints += achievement.points;
    this.listeners.forEach(listener => listener(achievement));
  }
  
  onUnlock(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
  
  getLevel() {
    return Math.floor(this.progress.totalPoints / 100) + 1;
  }
  
  getProgress() {
    return this.progress;
  }
  
  getUnlockedAchievements() {
    return this.progress.unlocked.map(id => 
      Object.values(ACHIEVEMENTS).find(a => a.id === id)
    ).filter(Boolean);
  }
  
  getLockedAchievements() {
    return Object.values(ACHIEVEMENTS).filter(
      a => !this.progress.unlocked.includes(a.id)
    );
  }
  
  getAchievementProgress(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement || !achievement.requirement) return null;
    
    const { type, count } = achievement.requirement;
    let current = 0;
    
    switch (type) {
      case 'wordsViewed':
        current = this.progress.wordsViewed;
        break;
      case 'domainsVisited':
        current = this.progress.domainsVisited.size;
        break;
      case 'studioSessions':
        current = this.progress.studioSessions;
        break;
      case 'wordsWritten':
        current = this.progress.wordsWritten;
        break;
      case 'streakDays':
        current = this.progress.streakDays;
        break;
      case 'favoriteCount':
        current = this.progress.favoriteCount;
        break;
      case 'rhymeSearches':
        current = this.progress.rhymeSearches;
        break;
    }
    
    return {
      current,
      required: count,
      percentage: Math.min(100, (current / count) * 100)
    };
  }
}

// Global singleton instance
export const achievementTracker = new AchievementTracker();
