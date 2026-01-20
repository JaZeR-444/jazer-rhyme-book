import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Link2, ExternalLink, Sparkles, Pin } from 'lucide-react';
import { Breadcrumbs, LoadingState, EmptyState, Badge, Card, CopyButton } from '../components/ui';
import { useEntity } from '../lib/hooks';
import { findEntitiesByIds } from '../lib/data/knowledgeHub';
import { useWorkspace } from '../lib/WorkspaceContext';
import { useKeyboardShortcuts } from '../lib/useKeyboardShortcuts';
import { SimilarEntities } from '../components/SimilarEntities';
import './EntityDetail.css';

export function EntityDetail() {
  const { domainId, entityId } = useParams();
  const { entity, loading, error } = useEntity(domainId, entityId);
  const { addItem, isPinned } = useWorkspace();

  const domainName = domainId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Resolve related entities with cross-domain support
  const relatedEntities = entity?.related_ids
    ? findEntitiesByIds(entity.related_ids)
    : [];

  const handlePin = () => {
    if (entity) {
      addItem({
        id: entity.id,
        type: 'entity',
        title: entity.name,
        subtitle: entity.one_liner,
        link: `/entities/${domainId}/${entityId}`,
        domainId
      });
    }
  };

  const pinned = entity ? isPinned(entity.id, 'entity') : false;

  // Page-specific keyboard shortcuts
  useKeyboardShortcuts({
    'p': handlePin,
  }, !loading && !error && entity); // Only enable when entity is loaded

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
          <div className="entity-detail__title-content">
            <h1 className="entity-detail__title">{entity.name}</h1>
            {entity.aliases && entity.aliases.length > 0 && (
              <p className="entity-detail__aliases">
                Also known as: {entity.aliases.join(', ')}
              </p>
            )}
          </div>
          <button
            className={`entity-detail__pin-btn ${pinned ? 'is-pinned' : ''}`}
            onClick={handlePin}
            title={pinned ? 'Pinned to Verse Board' : 'Pin to Verse Board'}
          >
            <Pin size={18} />
            {pinned ? 'Pinned' : 'Pin'}
          </button>
        </div>
      </div>

      <div className="entity-detail__content">
        <div className="entity-detail__main">
          {entity.one_liner && (
            <Card className="entity-detail__card">
              <div className="entity-detail__section">
                <div className="entity-detail__section-header">
                  <h2 className="entity-detail__section-title">Overview</h2>
                  <CopyButton text={entity.one_liner} label="Copy" size="xs" />
                </div>
                <p className="entity-detail__one-liner">{entity.one_liner}</p>
              </div>
            </Card>
          )}

          {entity.angles && entity.angles.length > 0 && (
            <Card className="entity-detail__card">
              <div className="entity-detail__section">
                <div className="entity-detail__section-header">
                  <h2 className="entity-detail__section-title">Creative Angles</h2>
                  <CopyButton
                    text={entity.angles.join('\n')}
                    label="Copy All"
                    size="xs"
                  />
                </div>
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
                <div className="entity-detail__section-header">
                  <h2 className="entity-detail__section-title">Bar Seeds</h2>
                  <CopyButton
                    text={entity.bar_seeds.join(', ')}
                    label="Copy All"
                    size="xs"
                  />
                </div>
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
                  <span className="entity-detail__meta-label">Related Entities:</span>
                </div>
                <div className="entity-detail__related-grid">
                  {relatedEntities.map(({ entity: relEnt, domain: relDomain }, idx) => (
                    <Link
                      key={idx}
                      to={`/entities/${relDomain}/${relEnt.id}`}
                      className="entity-detail__related-card"
                    >
                      <div className="entity-detail__related-name">{relEnt.name}</div>
                      <Badge size="xs" variant="secondary">{relDomain}</Badge>
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

      <SimilarEntities currentEntity={entity} currentDomain={domainId} />
    </div>
  );
}


export default EntityDetail;
