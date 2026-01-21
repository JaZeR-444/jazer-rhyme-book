/**
 * Achievement Definitions
 * Configuration for all available achievements
 */

export const ACHIEVEMENTS = {
  FIRST_FAVORITE: {
    id: 'first_favorite',
    name: 'First Favorite',
    description: 'Save your first favorite word',
    icon: '⭐',
    points: 10,
    category: 'exploration',
    requirement: { type: 'favoriteCount', count: 1 }
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
