
import { AchievementTracker } from './src/lib/achievements.js';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// Test 1: Load with no data (fresh start)
console.log('--- Test 1: Fresh Start ---');
const tracker1 = new AchievementTracker();
console.log('Initial Version:', tracker1.getProgress().version); // Expect undefined currently
console.log('Initial DomainsVisited:', tracker1.getProgress().domainsVisited);

// Test 2: Save and Load
console.log('\n--- Test 2: Save and Load ---');
tracker1.track('domainVisited', { domain: 'tech' });
console.log('Progress after visit:', tracker1.getProgress());
// Create new tracker to simulate reload
const tracker2 = new AchievementTracker();
console.log('Loaded Progress:', tracker2.getProgress());

// Test 3: Load corrupted data
console.log('\n--- Test 3: Corrupted Data ---');
localStorage.setItem('jazer_achievements', '{ "broken": json }'); 
const tracker3 = new AchievementTracker();
console.log('Recovered from corruption:', tracker3.getProgress());

// Test 4: Load legacy data (no version)
console.log('\n--- Test 4: Legacy Data ---');
localStorage.setItem('jazer_achievements', JSON.stringify({
  wordsViewed: 10,
  domainsVisited: ['music'],
  studioSessions: 5
}));
const tracker4 = new AchievementTracker();
console.log('Legacy Data Loaded:', tracker4.getProgress());
