import { useMemo } from 'react';
import { BookOpen, Database, Tag } from 'lucide-react';
import { ResultCategory } from './ResultCategory';
import './SearchResults.css';

/**
 * SearchResults - Display categorized search results with visual categorization
 */
export function SearchResults({ results, query, onSelectResult }) {
  // Categorize results
  const categorized = useMemo(() => {
    if (!results) return null;

    const categories = {
      words: [],
      entities: [],
      domains: []
    };

    // Group results by type
    results.forEach(result => {
      if (result.type === 'word') {
        categories.words.push(result);
      } else if (result.type === 'entity') {
        categories.entities.push(result);
      } else if (result.type === 'domain') {
        categories.domains.push(result);
      }
    });

    return categories;
  }, [results]);

  if (!categorized) return null;

  const totalResults = (categorized.words?.length || 0) + 
                      (categorized.entities?.length || 0) + 
                      (categorized.domains?.length || 0);

  if (totalResults === 0) return null;

  return (
    <div className="search-results">
      <div className="search-results__header">
        <h3 className="search-results__title">
          Search Results
          {query && <span className="search-results__query"> for "{query}"</span>}
        </h3>
        <span className="search-results__count">{totalResults} results</span>
      </div>

      <div className="search-results__categories">
        {/* Words Category */}
        {categorized.words.length > 0 && (
          <ResultCategory
            name="Words"
            count={categorized.words.length}
            icon={BookOpen}
            color="cyan"
            defaultExpanded={true}
          >
            <div className="search-results__list">
              {categorized.words.map((word, index) => (
                <ResultItem
                  key={word.id || index}
                  result={word}
                  type="word"
                  onClick={() => onSelectResult?.(word)}
                />
              ))}
            </div>
          </ResultCategory>
        )}

        {/* Entities Category */}
        {categorized.entities.length > 0 && (
          <ResultCategory
            name="Entities"
            count={categorized.entities.length}
            icon={Database}
            color="purple"
            defaultExpanded={categorized.words.length === 0}
          >
            <div className="search-results__list">
              {categorized.entities.map((entity, index) => (
                <ResultItem
                  key={entity.id || index}
                  result={entity}
                  type="entity"
                  onClick={() => onSelectResult?.(entity)}
                />
              ))}
            </div>
          </ResultCategory>
        )}

        {/* Domains Category */}
        {categorized.domains.length > 0 && (
          <ResultCategory
            name="Domains"
            count={categorized.domains.length}
            icon={Tag}
            color="magenta"
            defaultExpanded={categorized.words.length === 0 && categorized.entities.length === 0}
          >
            <div className="search-results__list">
              {categorized.domains.map((domain, index) => (
                <ResultItem
                  key={domain.id || index}
                  result={domain}
                  type="domain"
                  onClick={() => onSelectResult?.(domain)}
                />
              ))}
            </div>
          </ResultCategory>
        )}
      </div>
    </div>
  );
}

/**
 * ResultItem - Individual result card
 */
function ResultItem({ result, type, onClick }) {
  const getResultContent = () => {
    switch (type) {
      case 'word':
        return {
          title: result.word || result.name,
          subtitle: result.phonetic || result.syllables ? `${result.syllables || '?'} syllables` : '',
          description: result.definition?.substring(0, 100) || result.rhymeFamily || '',
          icon: '📝'
        };
      
      case 'entity':
        return {
          title: result.name,
          subtitle: result.domain || result.category || '',
          description: result.one_liner || result.description?.substring(0, 100) || '',
          icon: '🎯'
        };
      
      case 'domain':
        return {
          title: result.name,
          subtitle: result.category || 'Domain',
          description: result.description?.substring(0, 100) || '',
          icon: '🏷️'
        };
      
      default:
        return {
          title: result.name,
          subtitle: '',
          description: '',
          icon: '📄'
        };
    }
  };

  const content = getResultContent();

  return (
    <button
      className={`result-item result-item--${type}`}
      onClick={onClick}
    >
      <div className="result-item__icon">{content.icon}</div>
      <div className="result-item__content">
        <div className="result-item__title">{content.title}</div>
        {content.subtitle && (
          <div className="result-item__subtitle">{content.subtitle}</div>
        )}
        {content.description && (
          <div className="result-item__description">{content.description}</div>
        )}
      </div>
    </button>
  );
}
