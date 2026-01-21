import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '../ui';
import { useSearchIndex } from '../../lib/hooks';
import { getDailyPicks } from '../../lib/recommendationEngine';
import './DailyDigest.css';

export function DailyDigest() {
  const { searchIndex } = useSearchIndex();
  const [dailyPicks, setDailyPicks] = useState({
    word: null,
    entity: null,
    tag: null
  });

  // Memoize trending tags to avoid recomputing on every render
  const trendingTags = useMemo(() => {
    if (!searchIndex || !searchIndex.entities) return [];

    const tagCounts = {};
    searchIndex.entities.forEach(entity => {
      if (entity.tags) {
        entity.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [searchIndex]);

  useEffect(() => {
    if (!searchIndex || !searchIndex.entities || !searchIndex.words) {
      return;
    }

    const today = new Date();

    // Get daily word (deterministic based on date)
    const dailyWords = getDailyPicks(searchIndex.words, today);
    const wordOfDay = dailyWords[0];

    // Get daily entity (deterministic based on date)
    const dailyEntities = getDailyPicks(searchIndex.entities, today);
    const entityOfDay = dailyEntities[0];

    // Pick one of the top 5 tags based on day of week
    const dayOfWeek = today.getDay();
    const trendingTag = trendingTags.length > 0 ? trendingTags[dayOfWeek % trendingTags.length] : null;

    setDailyPicks({
      word: wordOfDay,
      entity: entityOfDay,
      tag: trendingTag ? { name: trendingTag[0], count: trendingTag[1] } : null
    });
  }, [searchIndex, trendingTags]);

  if (!dailyPicks.word && !dailyPicks.entity) {
    return null;
  }

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="daily-digest" aria-labelledby="digest-heading">
      <div className="daily-digest__header">
        <div className="daily-digest__title">
          <Calendar size={24} aria-hidden="true" />
          <h2 id="digest-heading">Daily Digest</h2>
        </div>
        <p className="daily-digest__date">{formatDate()}</p>
      </div>

      <div className="daily-digest__grid">
        {/* Word of the Day */}
        {dailyPicks.word && (
          <Link
            to={`/dictionary/${dailyPicks.word.letter}/${dailyPicks.word.name}`}
            className="digest-card"
            aria-label={`Word of the Day: ${dailyPicks.word.name}`}
          >
            <Card className="digest-card__content" hover>
              <div className="digest-card__badge">
                <Star size={16} aria-hidden="true" />
                <span>Word of the Day</span>
              </div>

              <h3 className="digest-card__title">{dailyPicks.word.name}</h3>

              {dailyPicks.word.rd && (
                <p className="digest-card__description">
                  {dailyPicks.word.rd.length > 120
                    ? dailyPicks.word.rd.substring(0, 120) + '...'
                    : dailyPicks.word.rd}
                </p>
              )}

              {dailyPicks.word.syllables && (
                <div className="digest-card__meta">
                  <span>{dailyPicks.word.syllables} syllables</span>
                  <span aria-hidden="true">•</span>
                  <span>Letter {dailyPicks.word.letter}</span>
                </div>
              )}

              <div className="digest-card__cta" aria-hidden="true">
                <span>Explore word</span>
                <ArrowRight size={16} />
              </div>
            </Card>
          </Link>
        )}

        {/* Entity of the Day */}
        {dailyPicks.entity && (
          <Link
            to={`/entities/${dailyPicks.entity.domain}/${dailyPicks.entity.id}`}
            className="digest-card"
            aria-label={`Entity of the Day: ${dailyPicks.entity.name}`}
          >
            <Card className="digest-card__content" hover>
              <div className="digest-card__badge digest-card__badge--secondary">
                <Star size={16} aria-hidden="true" />
                <span>Entity of the Day</span>
              </div>

              <h3 className="digest-card__title">{dailyPicks.entity.name}</h3>

              {dailyPicks.entity.one_liner && (
                <p className="digest-card__description">
                  {dailyPicks.entity.one_liner.length > 120
                    ? dailyPicks.entity.one_liner.substring(0, 120) + '...'
                    : dailyPicks.entity.one_liner}
                </p>
              )}

              <div className="digest-card__meta">
                <span>{dailyPicks.entity.domain}</span>
                {dailyPicks.entity.era && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span>{dailyPicks.entity.era}</span>
                  </>
                )}
              </div>

              <div className="digest-card__cta" aria-hidden="true">
                <span>Explore entity</span>
                <ArrowRight size={16} />
              </div>
            </Card>
          </Link>
        )}

        {/* Trending Tag of the Week */}
        {dailyPicks.tag && (
          <Link
            to={`/search?tag=${encodeURIComponent(dailyPicks.tag.name)}`}
            className="digest-card"
            aria-label={`Trending Tag: #${dailyPicks.tag.name}`}
          >
            <Card className="digest-card__content" hover>
              <div className="digest-card__badge digest-card__badge--trending">
                <TrendingUp size={16} aria-hidden="true" />
                <span>Trending This Week</span>
              </div>

              <h3 className="digest-card__title">#{dailyPicks.tag.name}</h3>

              <p className="digest-card__description">
                Explore {dailyPicks.tag.count} entities tagged with "{dailyPicks.tag.name}"
              </p>

              <div className="digest-card__meta">
                <span>{dailyPicks.tag.count} items</span>
              </div>

              <div className="digest-card__cta" aria-hidden="true">
                <span>Browse tag</span>
                <ArrowRight size={16} />
              </div>
            </Card>
          </Link>
        )}
      </div>
    </section>
  );
}