/**
 * Smart Recommendation Engine
 * Provides personalized content recommendations based on:
 * - Browsing history
 * - Favorites
 * - Tag/domain similarity
 * - Phonetic similarity
 */

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(setA, setB) {
  if (!setA || !setB || setA.length === 0 || setB.length === 0) {
    return 0;
  }

  const intersection = setA.filter(item => setB.includes(item)).length;
  const union = new Set([...setA, ...setB]).size;

  return intersection / union;
}

/**
 * Calculate entity similarity based on tags, domain, and era
 */
export function calculateEntitySimilarity(entityA, entityB) {
  let score = 0;

  // Same domain = +30 points
  if (entityA.domain === entityB.domain) {
    score += 30;
  }

  // Same era = +20 points
  if (entityA.era && entityB.era && entityA.era === entityB.era) {
    score += 20;
  }

  // Tag overlap using Jaccard similarity = up to 50 points
  if (entityA.tags && entityB.tags) {
    const tagSimilarity = jaccardSimilarity(entityA.tags, entityB.tags);
    score += tagSimilarity * 50;
  }

  return score;
}

/**
 * Calculate word similarity based on phonetics, syllables, and rhymes
 */
export function calculateWordSimilarity(wordA, wordB, getRhymeData) {
  let score = 0;

  // Same syllable count = +30 points
  if (wordA.syllables && wordB.syllables && wordA.syllables === wordB.syllables) {
    score += 30;
  }

  // Check if they rhyme
  if (getRhymeData) {
    const rhymesA = getRhymeData(wordA.name);
    if (rhymesA && rhymesA.perfect) {
      const rhymesList = rhymesA.perfect.map(r => r.word.toLowerCase());
      if (rhymesList.includes(wordB.name.toLowerCase())) {
        score += 50; // Perfect rhyme = +50 points
      }
    }
  }

  // Check synonym overlap
  if (wordA.syn && wordB.syn) {
    const synSimilarity = jaccardSimilarity(wordA.syn, wordB.syn);
    score += synSimilarity * 20;
  }

  return score;
}

/**
 * Get similar entities based on a reference entity
 */
export function getSimilarEntities(referenceEntity, allEntities, limit = 10) {
  if (!referenceEntity || !allEntities || allEntities.length === 0) {
    return [];
  }

  const similarities = allEntities
    .filter(entity => entity.id !== referenceEntity.id) // Exclude self
    .map(entity => ({
      entity,
      score: calculateEntitySimilarity(referenceEntity, entity)
    }))
    .filter(item => item.score > 0) // Only keep items with similarity
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, limit); // Take top N

  return similarities.map(item => item.entity);
}

/**
 * Get similar words based on a reference word
 */
export function getSimilarWords(referenceWord, allWords, getRhymeData, limit = 10) {
  if (!referenceWord || !allWords || allWords.length === 0) {
    return [];
  }

  const similarities = allWords
    .filter(word => word.name !== referenceWord.name) // Exclude self
    .map(word => ({
      word,
      score: calculateWordSimilarity(referenceWord, word, getRhymeData)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return similarities.map(item => item.word);
}

/**
 * Get personalized recommendations based on browsing history
 */
export function getPersonalizedRecommendations(history, allEntities, allWords, limit = 20) {
  if (!history || history.length === 0) {
    return {
      entities: [],
      words: []
    };
  }

  // Analyze user's browsing patterns
  const viewedDomains = new Set();
  const viewedTags = new Set();
  const viewedEras = new Set();
  const viewedSyllables = new Set();

  history.forEach(item => {
    if (item.domain) viewedDomains.add(item.domain);
    if (item.tags) item.tags.forEach(tag => viewedTags.add(tag));
    if (item.era) viewedEras.add(item.era);
    if (item.syllables) viewedSyllables.add(item.syllables);
  });

  // Score entities based on user preferences
  const scoredEntities = allEntities
    .filter(entity => !history.find(h => h.id === entity.id)) // Exclude already viewed
    .map(entity => {
      let score = 0;

      // Prefer same domains
      if (entity.domain && viewedDomains.has(entity.domain)) {
        score += 30;
      }

      // Prefer overlapping tags
      if (entity.tags) {
        const tagOverlap = entity.tags.filter(tag => viewedTags.has(tag)).length;
        score += tagOverlap * 10;
      }

      // Prefer same era
      if (entity.era && viewedEras.has(entity.era)) {
        score += 20;
      }

      return { entity, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Score words based on user preferences
  const scoredWords = allWords
    .filter(word => !history.find(h => h.name === word.name))
    .map(word => {
      let score = 0;

      // Prefer same syllable counts
      if (word.syllables && viewedSyllables.has(word.syllables)) {
        score += 30;
      }

      // Random boost for diversity
      score += Math.random() * 10;

      return { word, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    entities: scoredEntities.map(item => item.entity),
    words: scoredWords.map(item => item.word)
  };
}

/**
 * Get trending items based on view counts
 */
export function getTrendingItems(viewCounts, allItems, limit = 10) {
  if (!viewCounts || Object.keys(viewCounts).length === 0) {
    // Return random popular items if no view data
    return allItems
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  const itemsWithCounts = allItems.map(item => ({
    item,
    count: viewCounts[item.id || item.name] || 0
  }));

  return itemsWithCounts
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(item => item.item);
}

/**
 * Get a random item for "Surprise Me" functionality
 */
export function getRandomItem(items) {
  if (!items || items.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

/**
 * Get daily picks (consistent for the day)
 */
export function getDailyPicks(allItems, date = new Date()) {
  if (!allItems || allItems.length === 0) {
    return [];
  }

  // Use date as seed for consistent daily picks
  const dateString = date.toISOString().split('T')[0];
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);

  // Pseudo-random selection based on date
  const shuffled = [...allItems].sort((a, b) => {
    const hashA = (seed + (a.id || a.name).length) % 100;
    const hashB = (seed + (b.id || b.name).length) % 100;
    return hashA - hashB;
  });

  return shuffled.slice(0, 3); // Return top 3 for the day
}

/**
 * Calculate content-based recommendations using TF-IDF-like approach
 */
export function getContentBasedRecommendations(favoriteItems, allItems, limit = 10) {
  if (!favoriteItems || favoriteItems.length === 0) {
    return [];
  }

  // Build a profile of user's favorites
  const favoriteTerms = new Set();
  const favoriteDomains = new Set();
  const favoriteTags = new Set();

  favoriteItems.forEach(item => {
    // Extract terms from name and description
    if (item.name) {
      item.name.toLowerCase().split(/\s+/).forEach(term => favoriteTerms.add(term));
    }
    if (item.one_liner) {
      item.one_liner.toLowerCase().split(/\s+/).forEach(term => favoriteTerms.add(term));
    }
    if (item.domain) favoriteDomains.add(item.domain);
    if (item.tags) item.tags.forEach(tag => favoriteTags.add(tag));
  });

  // Score all items based on profile
  const scored = allItems
    .filter(item => !favoriteItems.find(fav => (fav.id || fav.name) === (item.id || item.name)))
    .map(item => {
      let score = 0;

      // Check term overlap
      const itemTerms = [
        ...(item.name ? item.name.toLowerCase().split(/\s+/) : []),
        ...(item.one_liner ? item.one_liner.toLowerCase().split(/\s+/) : [])
      ];

      const termOverlap = itemTerms.filter(term => favoriteTerms.has(term)).length;
      score += termOverlap * 5;

      // Domain match
      if (item.domain && favoriteDomains.has(item.domain)) {
        score += 20;
      }

      // Tag overlap
      if (item.tags) {
        const tagOverlap = item.tags.filter(tag => favoriteTags.has(tag)).length;
        score += tagOverlap * 15;
      }

      return { item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(item => item.item);
}

/**
 * Diversify recommendations to avoid echo chamber
 */
export function diversifyRecommendations(recommendations, diversity = 0.3) {
  if (!recommendations || recommendations.length <= 3) {
    return recommendations;
  }

  const diversified = [];
  const seenDomains = new Set();
  const seenTags = new Set();

  for (const item of recommendations) {
    const domainSeen = item.domain && seenDomains.has(item.domain);
    const tagsSeen = item.tags && item.tags.some(tag => seenTags.has(tag));

    // Include item if it's diverse enough or we're not being too strict
    if (!domainSeen || !tagsSeen || Math.random() > diversity) {
      diversified.push(item);
      if (item.domain) seenDomains.add(item.domain);
      if (item.tags) item.tags.forEach(tag => seenTags.add(tag));
    }
  }

  return diversified;
}
