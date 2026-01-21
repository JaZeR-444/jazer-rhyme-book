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

  const getDailyIndex = (items, date, salt = 0) => {
    if (!items || items.length === 0) return -1;
    // Use year + month + day as seed for daily consistency
    const dayKey = (date.getFullYear() * 1000) + (date.getMonth() * 100) + date.getDate();
    return (dayKey + salt) % items.length;
  };

  useEffect(() => {
    // Get a date-based word of the day
    if (words && words.length > 0) {
      const index = getDailyIndex(words, new Date(), 3);
      setWordOfDay(words[index]);
    }
  }, [words]);

  useEffect(() => {
    // Get a date-based trending entity
    const entities = getRandomEntities(50);
    if (entities && entities.length > 0) {
      const index = getDailyIndex(entities, new Date(), 7);
      setFeaturedEntity(entities[index]);
    }
  }, []);

  useEffect(() => {
    // Get a date-based featured domain
    if (domains && domains.length > 0) {
      const featuredDomains = domains.filter(d =>
        ['music', 'lingo', 'people', 'tech'].includes(d.id || d)
      );
      const domainPool = featuredDomains.length > 0 ? featuredDomains : domains;
      const index = getDailyIndex(domainPool, new Date(), 11);
      const domain = domainPool[index];
      setFeaturedDomain(typeof domain === 'string' ? { id: domain, name: domain } : domain);
    }
  }, [domains]);

  if (!wordOfDay && !featuredEntity && !featuredDomain) {
    return null;
  }

  const getDomainName = (d) => {
    if (!d) return '';
    const name = d.name || d.id || d;
    return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <section className="featured-content" aria-labelledby="featured-heading">
      <div className="featured-content__header">
        <Sparkles size={24} className="text-accent-primary" aria-hidden="true" />
        <h2 id="featured-heading" className="featured-content__title">Featured Today</h2>
      </div>

      <div className="featured-content__grid">
        {/* Word of the Day */}
        {wordOfDay && (
          <Card className="featured-item word-of-day" hover>
            <div className="featured-item__badge">
              <Star size={14} aria-hidden="true" />
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
                aria-label={`View word of the day: ${wordOfDay.name}`}
              >
                View Word <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </Card>
        )}

        {/* Trending Entity */}
        {featuredEntity && (
          <Card className="featured-item trending-entity" hover>
            <div className="featured-item__badge trending">
              <TrendingUp size={14} aria-hidden="true" />
              <span>Trending</span>
            </div>
            <h3 className="featured-item__title">{featuredEntity.name || featuredEntity.id}</h3>
            <p className="featured-item__description">
              {featuredEntity.one_liner || featuredEntity.description || 'Explore this entity'}
            </p>
            <Link
              to={`/entities/${featuredEntity.domain}/${featuredEntity.id}`}
              className="featured-item__link"
              aria-label={`View trending entity: ${featuredEntity.name}`}
            >
              View Entity <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Card>
        )}

        {/* Featured Domain */}
        {featuredDomain && (
          <Card className="featured-item featured-domain" hover>
            <div className="featured-item__badge featured">
              <Sparkles size={14} aria-hidden="true" />
              <span>Featured</span>
            </div>
            <h3 className="featured-item__title">
              {featuredDomain.emoji} {getDomainName(featuredDomain)}
            </h3>
            <p className="featured-item__description">
              {featuredDomain.description || `Explore the ${getDomainName(featuredDomain)} domain`}
            </p>
            <Link
              to={`/domains/${featuredDomain.id}`}
              className="featured-item__link"
              aria-label={`Browse featured domain: ${getDomainName(featuredDomain)}`}
            >
              Browse Domain <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Card>
        )}
      </div>
    </section>
  );
}