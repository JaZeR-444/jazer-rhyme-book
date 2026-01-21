import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';
import { BookOpen, Heart, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { LoadingState, EmptyState } from '../components/ui';
import { Autocomplete } from '../components/ui/Autocomplete';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import { RecentlyViewed } from '../components/dictionary/RecentlyViewed';
import { WordOfDay } from '../components/dictionary/WordOfDay';
import { ContextualSuggestions } from '../components/dictionary/ContextualSuggestions';
import { useDictionaryLetters, useSearchIndex } from '../lib/hooks';
import { useFavorites } from '../contexts/FavoritesContext';
import { analyzeDictionarySearch } from '../lib/analyzeDictionarySearch';
import './Dictionary.css';

export function Dictionary() {
  usePageTitle('Dictionary');
  const navigate = useNavigate();
  const { letters, loading, error } = useDictionaryLetters();
  const { favoritesCount } = useFavorites();
  const { searchIndex } = useSearchIndex();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [semanticResults, setSemanticResults] = useState([]);
  const [syllableFilter, setSyllableFilter] = useState(null); // null, '1', '2', '3+'
  const [isSpinning, setIsSpinning] = useState(false);

  const [lastSurpriseIndex, setLastSurpriseIndex] = useState(null);

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim() || !searchIndex) {
        setSemanticResults([]);
        setIsSearching(false);
        return;
      }

      // If query is long enough, try semantic search
      if (searchQuery.length > 2) {
        setIsSearching(true);
        // Simple client-side re-implementation of the analysis logic
        // Ideally this logic should be shared in a utility
        const results = analyzeDictionarySearch(searchQuery, searchIndex, syllableFilter);
        setSemanticResults(results);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchIndex, syllableFilter]);

  const handleSurpriseMe = () => {
    if (!searchIndex || !searchIndex.words || searchIndex.words.length === 0) return;

    setIsSpinning(true);

    setTimeout(() => {
      let randomIndex;
      let attempts = 0;
      
      // Try to find a new word different from the last one
      do {
        randomIndex = Math.floor(Math.random() * searchIndex.words.length);
        attempts++;
      } while (randomIndex === lastSurpriseIndex && attempts < 5);

      setLastSurpriseIndex(randomIndex);
      const randomWord = searchIndex.words[randomIndex];

      if (randomWord && randomWord.letter && randomWord.name) {
        navigate(`/dictionary/${randomWord.letter}/${randomWord.name}`);
      }
      setIsSpinning(false);
    }, 500);
  };

  if (loading) {
    return <LoadingState message="Loading dictionary..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<BookOpen size={48} />}
        title="Error Loading Dictionary"
        description={error.message}
      />
    );
  }

  return (
    <div className="dictionary-page" role="main" aria-label="Dictionary - Browse and search hip-hop terminology">
      <div className="dictionary-hero" aria-label="Dictionary header and search">
        <div className="dictionary-hero__content">
          <h1 className="dictionary-page__title">
            <span className="text-gradient">Rap Dictionary</span>
          </h1>
          <p className="dictionary-page__description">
            Your ultimate guide to hip-hop terminology, slang, and technical vocabulary.
          </p>
          
          <div className="dictionary-search-container">
            <Autocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={(result) => navigate(result.link)}
              searchIndex={searchIndex?.words || []}
              placeholder="Search concepts like 'Gravitational forces'..."
            />
          </div>

          {favoritesCount > 0 && (
            <Link to="/dictionary/favorites" className="dictionary-page__favorites-btn glass">
              <Heart size={18} className="text-accent" fill="currentColor" />
              <span>View {favoritesCount} Favorite Words</span>
            </Link>
          )}

          {/* Quick Filters Bar */}
          <div className="dictionary-quick-filters">
            <div className="quick-filters-header">
              <Filter size={16} aria-hidden="true" />
              <span>Quick Filters</span>
            </div>
            <div className="quick-filters-buttons" role="group" aria-label="Syllable count filters">
              <button
                type="button"
                className={`filter-chip ${syllableFilter === '1' ? 'active' : ''}`}
                onClick={() => setSyllableFilter(syllableFilter === '1' ? null : '1')}
                aria-pressed={syllableFilter === '1'}
              >
                1 Syllable
              </button>
              <button
                type="button"
                className={`filter-chip ${syllableFilter === '2' ? 'active' : ''}`}
                onClick={() => setSyllableFilter(syllableFilter === '2' ? null : '2')}
                aria-pressed={syllableFilter === '2'}
              >
                2 Syllables
              </button>
              <button
                type="button"
                className={`filter-chip ${syllableFilter === '3+' ? 'active' : ''}`}
                onClick={() => setSyllableFilter(syllableFilter === '3+' ? null : '3+')}
                aria-pressed={syllableFilter === '3+'}
              >
                3+ Syllables
              </button>
              {syllableFilter && (
                <button
                  type="button"
                  className="filter-chip clear"
                  onClick={() => setSyllableFilter(null)}
                  aria-label="Clear filters"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Surprise Me Button */}
          <button
            type="button"
            className={`dictionary-surprise-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={handleSurpriseMe}
            disabled={isSpinning || !searchIndex}
          >
            <Sparkles size={18} aria-hidden="true" />
            <span>Surprise Me</span>
            <RefreshCw size={14} className="refresh-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Semantic Search Results */}
      {searchQuery && (
        <section className="dictionary-search-results" aria-label="Search results for words matching your query">
          <div className="section-header">
            <h3 className="section-title">
              {semanticResults.length > 0 ? 'Recommended Words' : 'No matches found'}
            </h3>
            {isSearching && <span className="search-loading">Analyzing...</span>}
          </div>

          {isSearching && <SkeletonGrid count={8} variant="grid" />}

          {!isSearching && semanticResults.length > 0 && (
            <div className="semantic-grid">
              {semanticResults.map((item, idx) => (
                <Link 
                  key={`${item.name}-${idx}`} 
                  to={item.link}
                  className="semantic-card glass"
                >
                  <div className="semantic-card__header">
                    <span className="semantic-card__title">{item.name}</span>
                    <Sparkles size={14} className="text-accent" />
                  </div>
                  <div className="semantic-card__match">
                    {item.matchedKeyword}
                  </div>
                  <p className="semantic-card__preview">
                    {item.notes ? (item.notes.length > 80 ? item.notes.substring(0, 80) + '...' : item.notes) : 'View entry'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Default View (Hidden when searching) */}
      {!searchQuery && (
        <>
          {/* Word of the Day */}
          <section className="dictionary-featured" aria-label="Featured word of the day">
            <WordOfDay />
          </section>

          {/* Recently Viewed */}
          <section aria-label="Recently viewed words - Words you've recently looked up">
            <RecentlyViewed limit={10} />
          </section>

          {/* Contextual Suggestions */}
          <section aria-label="Contextual suggestions - Words recommended based on your activity">
            <ContextualSuggestions limit={6} />
          </section>

          <section className="dictionary-grid-section" aria-label="Browse by letter - Find words starting with a specific letter">
            <h3 className="section-title">Browse by Letter</h3>
            <div className="dictionary-page__letters">
              {letters.map(letter => (
                <Link
                  key={letter}
                  to={`/dictionary/${letter}`}
                  className="letter-card glass"
                >
                  <div className="letter-card__content">
                    <span className="letter-card__letter">{letter}</span>
                    <span className="letter-card__label">View</span>
                  </div>
                  <div className="letter-card__bg"></div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Dictionary;
