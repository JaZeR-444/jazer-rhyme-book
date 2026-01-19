import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { Card } from '../ui';
import { useDictionaryIndex, useDomains } from '../../lib/hooks';
import { getRandomEntities } from '../../lib/data/knowledgeHub';
import './FeaturedContent.css';

export function FeaturedContent() {
  const { words } = useDictionaryIndex();
  const { domains } = useDomains();
  const [wordOfDay, setWordOfDay] = useState(null);
  const [featuredEntity, setFeaturedEntity] = useState(null);
  const [featuredDomain, setFeaturedDomain] = useState(null);

  useEffect(() => {
    // Get a "word of the day" (random for now, could be based on date)
    if (words && words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setWordOfDay(words[randomIndex]);
    }
  }, [words]);

  useEffect(() => {
    // Get a random trending entity
    const [randomEntity] = getRandomEntities(1);
    if (randomEntity) {
      setFeaturedEntity(randomEntity);
    }
  }, []);

  useEffect(() => {
    // Get a featured domain
    if (domains && domains.length > 0) {
      const featuredDomains = domains.filter(d =>
        ['music-production', 'hip-hop-culture', 'rap-terminology'].includes(d.id)
      );
      const randomIndex = Math.floor(Math.random() * (featuredDomains.length || domains.length));
      setFeaturedDomain(featuredDomains[randomIndex] || domains[randomIndex]);
    }
  }, [domains]);

  if (!wordOfDay && !featuredEntity && !featuredDomain) {
    return null;
  }

  return (
    <section className="featured-content">
      <div className="featured-content__header">
        <Sparkles size={24} className="text-accent-primary" />
        <h2 className="featured-content__title">Featured Today</h2>
      </div>

      <div className="featured-content__grid">
        {/* Word of the Day */}
        {wordOfDay && (
          <Card className="featured-item word-of-day" hover>
            <div className="featured-item__badge">
              <Star size={14} />
              <span>Word of Day</span>
            </div>
            <h3 className="featured-item__title">{wordOfDay.name}</h3>
            <p className="featured-item__description">
              {wordOfDay.rd || wordOfDay.d || 'Explore this word in the dictionary'}
            </p>
            {wordOfDay.letter && (
              <Link
                to={`/dictionary/${wordOfDay.letter}/${wordOfDay.name}`}
                className="featured-item__link"
              >
                View Word <ArrowRight size={16} />
              </Link>
            )}
          </Card>
        )}

        {/* Trending Entity */}
        {featuredEntity && (
          <Card className="featured-item trending-entity" hover>
            <div className="featured-item__badge trending">
              <TrendingUp size={14} />
              <span>Trending</span>
            </div>
            <h3 className="featured-item__title">{featuredEntity.name || featuredEntity.id}</h3>
            <p className="featured-item__description">
              {featuredEntity.one_liner || featuredEntity.description || 'Explore this entity'}
            </p>
            <Link
              to={`/entities/${featuredEntity.domain}/${featuredEntity.id}`}
              className="featured-item__link"
            >
              View Entity <ArrowRight size={16} />
            </Link>
          </Card>
        )}

        {/* Featured Domain */}
        {featuredDomain && (
          <Card className="featured-item featured-domain" hover>
            <div className="featured-item__badge featured">
              <Sparkles size={14} />
              <span>Featured</span>
            </div>
            <h3 className="featured-item__title">
              {featuredDomain.emoji} {featuredDomain.name}
            </h3>
            <p className="featured-item__description">
              {featuredDomain.description || `Explore the ${featuredDomain.name} domain`}
            </p>
            <Link
              to={`/entities/${featuredDomain.id}`}
              className="featured-item__link"
            >
              Browse Domain <ArrowRight size={16} />
            </Link>
          </Card>
        )}
      </div>
    </section>
  );
}
