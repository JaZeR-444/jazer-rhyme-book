import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Link2, ExternalLink } from 'lucide-react';
import { Breadcrumbs, LoadingState, EmptyState, Badge, Card } from '../components/ui';
import { useEntity } from '../lib/hooks';
import './EntityDetail.css';

export function EntityDetail() {
  const { domainId, entityId } = useParams();
  const { entity, loading, error } = useEntity(domainId, entityId);

  const domainName = domainId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (loading) {
    return <LoadingState message="Loading entity..." />;
  }

  if (error || !entity) {
    return (
      <div className="entity-detail">
        <EmptyState
          title="Entity Not Found"
          description="The entity you're looking for doesn't exist or couldn't be loaded."
          action={() => window.history.back()}
          actionLabel="Go Back"
        />
      </div>
    );
  }

  return (
    <div className="entity-detail">
      <div className="entity-detail__header">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Domains', path: '/domains' },
          { label: domainName, path: `/domains/${domainId}` },
          { label: entity.name, path: `/entities/${domainId}/${entityId}` }
        ]} />

        <div className="entity-detail__title-row">
          <Link to={`/domains/${domainId}`} className="entity-detail__back">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="entity-detail__title">{entity.name}</h1>
            {entity.aliases && entity.aliases.length > 0 && (
              <p className="entity-detail__aliases">
                Also known as: {entity.aliases.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="entity-detail__content">
        <div className="entity-detail__main">
          {entity.one_liner && (
            <Card className="entity-detail__card">
              <div className="entity-detail__section">
                <h2 className="entity-detail__section-title">Overview</h2>
                <p className="entity-detail__one-liner">{entity.one_liner}</p>
              </div>
            </Card>
          )}

          {entity.angles && entity.angles.length > 0 && (
            <Card className="entity-detail__card">
              <div className="entity-detail__section">
                <h2 className="entity-detail__section-title">Creative Angles</h2>
                <ul className="entity-detail__list">
                  {entity.angles.map((angle, idx) => (
                    <li key={idx}>{angle}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {entity.bar_seeds && entity.bar_seeds.length > 0 && (
            <Card className="entity-detail__card">
              <div className="entity-detail__section">
                <h2 className="entity-detail__section-title">Bar Seeds</h2>
                <div className="entity-detail__seeds">
                  {entity.bar_seeds.map((seed, idx) => (
                    <Badge key={idx} variant="purple">{seed}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Domain-specific fields */}
          {entity.genre && (
            <Card className="entity-detail__card">
              <div className="entity-detail__section">
                <h2 className="entity-detail__section-title">Genres</h2>
                <div className="entity-detail__seeds">
                  {entity.genre.map((g, idx) => (
                    <Badge key={idx}>{g}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {entity.signature_songs && (
            <Card className="entity-detail__card">
              <div className="entity-detail__section">
                <h2 className="entity-detail__section-title">Signature Songs</h2>
                <ul className="entity-detail__list">
                  {entity.signature_songs.map((song, idx) => (
                    <li key={idx}>{song}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </div>

        <div className="entity-detail__sidebar">
          <Card className="entity-detail__meta">
            <div className="entity-detail__meta-item">
              <Tag size={16} />
              <span className="entity-detail__meta-label">Type:</span>
              <Badge variant="primary">{entity.type}</Badge>
            </div>

            {entity.era && (
              <div className="entity-detail__meta-item">
                <Calendar size={16} />
                <span className="entity-detail__meta-label">Era:</span>
                <span className="entity-detail__meta-value">{entity.era}</span>
              </div>
            )}

            {entity.tags && entity.tags.length > 0 && (
              <div className="entity-detail__meta-item entity-detail__meta-item--column">
                <div className="entity-detail__meta-header">
                  <Tag size={16} />
                  <span className="entity-detail__meta-label">Tags:</span>
                </div>
                <div className="entity-detail__tags">
                  {entity.tags.map((tag, idx) => (
                    <Badge key={idx} size="sm">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {entity.related_ids && entity.related_ids.length > 0 && (
              <div className="entity-detail__meta-item entity-detail__meta-item--column">
                <div className="entity-detail__meta-header">
                  <Link2 size={16} />
                  <span className="entity-detail__meta-label">Related:</span>
                </div>
                <div className="entity-detail__related">
                  {entity.related_ids.map((relatedId, idx) => (
                    <Link
                      key={idx}
                      to={`/entities/${domainId}/${relatedId}`}
                      className="entity-detail__related-link"
                    >
                      {relatedId}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {entity.sources && entity.sources.length > 0 && (
              <div className="entity-detail__meta-item entity-detail__meta-item--column">
                <div className="entity-detail__meta-header">
                  <ExternalLink size={16} />
                  <span className="entity-detail__meta-label">Sources:</span>
                </div>
                <div className="entity-detail__sources">
                  {entity.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url || source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="entity-detail__source-link"
                    >
                      {source.title || source}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
