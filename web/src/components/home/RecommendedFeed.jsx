import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Clock, Heart } from 'lucide-react';
import { EntityCard } from '../EntityCard';
import { useBrowsingHistory } from '../../contexts/BrowsingHistoryContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSearchIndex } from '../../lib/hooks';
import {
  getPersonalizedRecommendations,
  getContentBasedRecommendations,
  diversifyRecommendations
} from '../../lib/recommendationEngine';
import './RecommendedFeed.css';

export function RecommendedFeed() {
  const { history } = useBrowsingHistory();
  const { favorites } = useFavorites();
  const { searchIndex } = useSearchIndex();

  // Memoize all recommendation logic to avoid heavy computations on every re-render
  const recommendations = useMemo(() => {
    if (!searchIndex || !searchIndex.entities || !searchIndex.words) {
      return {
        personalizedEntities: [],
        personalizedWords: [],
        contentBased: []
      };
    }

    // Get personalized recommendations based on browsing history
    const personalized = getPersonalizedRecommendations(
      history,
      searchIndex.entities,
      searchIndex.words,
      12
    );

    // Get content-based recommendations from favorites
    const favoriteWords = favorites.map(wordName =>
      searchIndex.words.find(w => w.name === wordName)
    ).filter(Boolean);

    const contentBased = getContentBasedRecommendations(
      favoriteWords,
      searchIndex.entities,
      8
    );

    // Diversify recommendations
    const diversifiedEntities = diversifyRecommendations(personalized.entities, 0.4);
    const diversifiedContent = diversifyRecommendations(contentBased, 0.3);

    return {
      personalizedEntities: diversifiedEntities,
      personalizedWords: personalized.words,
      contentBased: diversifiedContent
    };
  }, [history, favorites, searchIndex]);

  // Don't show if user has no history or favorites
  if (history.length === 0 && favorites.length === 0) {
    return null;
  }

  const hasRecommendations =
    recommendations.personalizedEntities.length > 0 ||
    recommendations.personalizedWords.length > 0 ||
    recommendations.contentBased.length > 0;

  if (!hasRecommendations) {
    return null;
  }

  return (
    <div className="recommended-feed" role="region" aria-label="Personalized Recommendations">
      {/* History-Based Recommendations */}
      {recommendations.personalizedEntities.length > 0 && (
        <section className="recommended-section" aria-labelledby="browsing-heading">
          <div className="recommended-section__header">
            <div className="recommended-section__title">
              <Clock size={20} aria-hidden="true" />
              <h2 id="browsing-heading">Based on Your Browsing</h2>
            </div>
            <p className="recommended-section__subtitle">
              Entities similar to what you've explored
            </p>
          </div>

          <div className="recommended-grid">
            {recommendations.personalizedEntities.slice(0, 6).map(entity => (
              <EntityCard key={entity.id} entity={entity} domain={entity.domain} />
            ))}
          </div>
        </section>
      )}

      {/* Favorite-Based Words */}
      {recommendations.personalizedWords.length > 0 && (
        <section className="recommended-section" aria-labelledby="liked-words-heading">
          <div className="recommended-section__header">
            <div className="recommended-section__title">
              <Sparkles size={20} aria-hidden="true" />
              <h2 id="liked-words-heading">Words You Might Like</h2>
            </div>
            <p className="recommended-section__subtitle">
              Based on your word preferences
            </p>
          </div>

          <div className="recommended-words-grid">
            {recommendations.personalizedWords.slice(0, 8).map(word => (
              <Link
                key={word.name}
                to={`/dictionary/${word.letter}/${word.name}`}
                className="recommended-word-card"
                aria-label={`Recommended word: ${word.name}`}
              >
                <div className="recommended-word-card__content">
                  <span className="recommended-word-name">{word.name}</span>
                  <div className="recommended-word-meta">
                    {word.syllables && (
                      <span className="recommended-word-syllables">
                        {word.syllables} syl
                      </span>
                    )}
                    {word.letter && (
                      <span className="recommended-word-letter">
                        Letter {word.letter}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Content-Based Recommendations */}
      {recommendations.contentBased.length > 0 && (
        <section className="recommended-section" aria-labelledby="liked-content-heading">
          <div className="recommended-section__header">
            <div className="recommended-section__title">
              <Heart size={20} aria-hidden="true" />
              <h2 id="liked-content-heading">Because You Liked</h2>
            </div>
            <p className="recommended-section__subtitle">
              Similar to your favorite words
            </p>
          </div>

          <div className="recommended-grid">
            {recommendations.contentBased.slice(0, 4).map(entity => (
              <EntityCard key={entity.id} entity={entity} domain={entity.domain} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}