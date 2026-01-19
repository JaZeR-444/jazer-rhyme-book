import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Filter, Sparkles, RefreshCw } from 'lucide-react';
import { LoadingState, EmptyState } from '../components/ui';
import { Autocomplete } from '../components/ui/Autocomplete';
import { SkeletonGrid } from '../components/ui/SkeletonCard';
import { RecentlyViewed } from '../components/dictionary/RecentlyViewed';
import { WordOfDay } from '../components/dictionary/WordOfDay';
import { ContextualSuggestions } from '../components/dictionary/ContextualSuggestions';
import { useDictionaryLetters, useSearchIndex } from '../lib/hooks';
import { useFavorites } from '../lib/FavoritesContext';
import { getRhymeScheme } from '../lib/rhymeFinder';
import './Dictionary.css';

export function Dictionary() {
  const navigate = useNavigate();
  const { letters, loading, error } = useDictionaryLetters();
  const { favoritesCount } = useFavorites();
  const { searchIndex } = useSearchIndex();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [semanticResults, setSemanticResults] = useState([]);
  const [syllableFilter, setSyllableFilter] = useState(null); // null, '1', '2', '3+'
  const [isSpinning, setIsSpinning] = useState(false);

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
      const randomIndex = Math.floor(Math.random() * searchIndex.words.length);
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
    <div className="dictionary-page">
      <div className="dictionary-hero">
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
              <Filter size={16} />
              <span>Quick Filters</span>
            </div>
            <div className="quick-filters-buttons">
              <button
                className={`filter-chip ${syllableFilter === '1' ? 'active' : ''}`}
                onClick={() => setSyllableFilter(syllableFilter === '1' ? null : '1')}
              >
                1 Syllable
              </button>
              <button
                className={`filter-chip ${syllableFilter === '2' ? 'active' : ''}`}
                onClick={() => setSyllableFilter(syllableFilter === '2' ? null : '2')}
              >
                2 Syllables
              </button>
              <button
                className={`filter-chip ${syllableFilter === '3+' ? 'active' : ''}`}
                onClick={() => setSyllableFilter(syllableFilter === '3+' ? null : '3+')}
              >
                3+ Syllables
              </button>
              {syllableFilter && (
                <button
                  className="filter-chip clear"
                  onClick={() => setSyllableFilter(null)}
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Surprise Me Button */}
          <button
            className={`dictionary-surprise-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={handleSurpriseMe}
            disabled={isSpinning || !searchIndex}
          >
            <Sparkles size={18} />
            <span>Surprise Me</span>
            <RefreshCw size={14} className="refresh-icon" />
          </button>
        </div>
      </div>

      {/* Semantic Search Results */}
      {searchQuery && (
        <section className="dictionary-search-results">
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
          <section className="dictionary-featured">
            <WordOfDay />
          </section>

          {/* Recently Viewed */}
          <RecentlyViewed limit={10} />

          {/* Contextual Suggestions */}
          <ContextualSuggestions limit={6} />

          <section className="dictionary-grid-section">
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

// Reusing logic from ConceptRecommender but tuned for search
function analyzeDictionarySearch(text, index, syllableFilter = null) {
  try {
    if (!text || !index) return [];

    if (!index || !index.words) return [];
    
    // 1. Tokenize
    const stopWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'is', 'are', 'was', 'were', 'it', 'that', 'this', 'force']);
    const tokens = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.has(t));
    
    const uniqueTokens = [...new Set(tokens)];
    const results = [];
    const seenIds = new Set();
  
    index.words.forEach(word => {
      try {
        if (seenIds.has(word.name)) return;
        let score = 0;
        let matchedKeyword = null;
    
        // Direct name match
        const nameLower = (word.name || '').toLowerCase();
        if (uniqueTokens.includes(nameLower) || nameLower.includes(text.toLowerCase())) {
            score += 10;
            matchedKeyword = 'Direct Match';
        }
    
        // Definition match
        if (word.d) {
            const defLower = word.d.toLowerCase();
            const matches = uniqueTokens.filter(t => defLower.includes(t));
            if (matches.length > 0) {
                score += matches.length * 3;
                matchedKeyword = matchedKeyword || `Matches: "${matches[0]}"`;
            }
        }
    
        // Rap Definition match
        if (word.rd) {
            const rdLower = word.rd.toLowerCase();
            const matches = uniqueTokens.filter(t => rdLower.includes(t));
            if (matches.length > 0) {
                score += matches.length * 4;
                matchedKeyword = matchedKeyword || `Matches rap context: "${matches[0]}"`;
            }
        }
        
        // Synonyms match
        if (word.syn && Array.isArray(word.syn)) {
            word.syn.forEach(syn => {
                if (uniqueTokens.includes(syn.toLowerCase())) {
                    score += 5;
                    matchedKeyword = matchedKeyword || `Synonym: "${syn}"`;
                }
            });
        }
    
        if (score > 0) {
            // Apply syllable filter if active
            if (syllableFilter) {
                const wordSyllables = word.syllables || getRhymeScheme(word.name).syllables;

                if (syllableFilter === '1' && wordSyllables !== 1) return;
                if (syllableFilter === '2' && wordSyllables !== 2) return;
                if (syllableFilter === '3+' && wordSyllables < 3) return;
            }

            results.push({
                name: word.name,
                link: `/dictionary/${word.letter}/${word.name}`,
                matchedKeyword,
                score,
                notes: word.rd || word.d || ''
            });
            seenIds.add(word.name);
        }
      } catch (innerErr) {
        // Skip problem word
      }
    });
  
    return results.sort((a, b) => b.score - a.score).slice(0, 20);
  } catch (err) {
    console.error('Search analysis failed:', err);
    return [];
  }
}
