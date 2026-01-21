import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { X, Sparkles, Plus, Loader, Info } from 'lucide-react';
import { Button } from './ui';
import { useSearchIndex } from '../lib/hooks';
import './ConceptRecommender.css';

export function ConceptRecommender({ isOpen, onClose, onAddToBoard }) {
  const [concept, setConcept] = useState('');
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { searchIndex, loading: indexLoading } = useSearchIndex();

  const handleAnalyze = () => {
    if (!concept.trim() || !searchIndex) return;

    setIsAnalyzing(true);

    // Simulate analysis delay for UX and to not freeze UI if heavy
    setTimeout(() => {
      const recommendations = analyzeConcept(concept, searchIndex);
      setResults(recommendations);
      setIsAnalyzing(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="concept-recommender-overlay">
      <div className="concept-recommender">
        <div className="concept-recommender__header">
          <div className="concept-recommender__title">
            <Sparkles className="text-accent" size={24} />
            <h2>Concept Recommender</h2>
          </div>
          <button className="concept-recommender__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="concept-recommender__body">
          <div className="recommender-input-section">
            <textarea
              className="recommender-textarea"
              placeholder="Paste your song concept, verse draft, or ideas here... (e.g. 'This song is about the struggle of 90s hip hop in New York...')"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              autoFocus
            />
            <div className="recommender-actions">
              <Button 
                onClick={handleAnalyze} 
                disabled={!concept.trim() || indexLoading || isAnalyzing}
                variant="primary"
              >
                {isAnalyzing ? (
                  <>
                    <Loader size={16} className="spin-icon" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Get Recommendations
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="recommender-results">
            {results.length > 0 ? (
              <>
                <div className="recommender-results-title">
                  Recommended Entities & Words ({results.length})
                </div>
                {results.map((item, idx) => (
                  <div key={`${item._type}-${item.id || item.name}-${idx}`} className="recommendation-card">
                    <div className="recommendation-info">
                      <div className="recommendation-info__title">{item.name || item.title}</div>
                      <div className="recommendation-info__context">
                        {item._type === 'entity' ? `Entity • ${item.domain}` : 'Dictionary Word'}
                      </div>
                      {item.matchedKeyword && (
                        <div className="recommendation-info__match">
                          Matched "{item.matchedKeyword}"
                        </div>
                      )}
                    </div>
                    <button 
                      className="recommendation-add-btn"
                      onClick={() => onAddToBoard(item)}
                      title="Add to Board"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <div className="recommender-empty">
                {indexLoading ? (
                  <>
                    <Loader size={32} className="spin-icon text-accent" />
                    <p>Loading knowledge base...</p>
                  </>
                ) : (
                  <>
                    <Info size={32} />
                    <p>{concept && !isAnalyzing ? "No specific recommendations found. Try adding more detail." : "Enter a concept above to find relevant words and entities."}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Recommendation Logic --

function analyzeConcept(text, index) {
  if (!text || !index) return [];

  // 1. Tokenize input text (remove common stop words)
  const stopWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'is', 'are', 'was', 'were', 'it', 'that', 'this']);
  const tokens = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2 && !stopWords.has(t));
  
  const uniqueTokens = [...new Set(tokens)];
  const recommendations = [];
  const seenIds = new Set();

  // 2. Score Entities
  index.entities.forEach(entity => {
    let score = 0;
    let matchedKeyword = null;

    // Check name
    const nameLower = (entity.name || entity.title || '').toLowerCase();
    
    // Exact name match in tokens?
    if (uniqueTokens.some(t => nameLower.includes(t))) {
      score += 10;
      matchedKeyword = 'Name Match';
    }

    // Tag match?
    if (entity.tags) {
      const tagMatch = entity.tags.find(tag => uniqueTokens.includes(tag.toLowerCase()));
      if (tagMatch) {
        score += 5;
        matchedKeyword = matchedKeyword || `Tag: ${tagMatch}`;
      }
    }

    // Description match?
    if (entity.description) {
      const descLower = entity.description.toLowerCase();
      const tokenMatches = uniqueTokens.filter(t => descLower.includes(t));
      if (tokenMatches.length > 0) {
        score += tokenMatches.length * 1;
        matchedKeyword = matchedKeyword || `Context: ${tokenMatches[0]}`;
      }
    }

    if (score > 0) {
      recommendations.push({
        ...entity,
        score,
        matchedKeyword,
        title: entity.title || entity.name, // Ensure title exists
        subtitle: entity.type || entity.domain,
        notes: entity.description,
        link: `/domain/${entity.domain}/entity/${entity.id}` // Construct link
      });
      seenIds.add(entity.id || entity.name);
    }
  });

  // 3. Score Dictionary Words with Rich Metadata
  // Now we can search against definition (d), rap definition (rd), and synonyms (syn)
  index.words.forEach(word => {
    if (seenIds.has(word.name)) return;
    
    let score = 0;
    let matchedKeyword = null;

    // Direct name match
    const nameLower = word.name.toLowerCase();
    if (uniqueTokens.includes(nameLower)) {
      // If the word itself appears, give it a score but lower than entities
      // We might want to find related words, not just the word itself
      score += 2;
      matchedKeyword = 'Direct Match';
    }

    // Check Definition (d)
    if (word.d) {
      const defLower = word.d.toLowerCase();
      // Find overlap count
      const matches = uniqueTokens.filter(t => defLower.includes(t));
      if (matches.length > 0) {
        score += matches.length * 2; // Weight definitions heavier
        matchedKeyword = matchedKeyword || `Matches definition: "${matches[0]}"`;
      }
    }

    // Check Rap Definition (rd) - High value
    if (word.rd) {
      const rdLower = word.rd.toLowerCase();
      const matches = uniqueTokens.filter(t => rdLower.includes(t));
      if (matches.length > 0) {
        score += matches.length * 3; // Rap definition matches are very relevant
        matchedKeyword = matchedKeyword || `Matches rap context: "${matches[0]}"`;
      }
    }

    // Check Synonyms (syn)
    if (word.syn && Array.isArray(word.syn)) {
      word.syn.forEach(syn => {
        const synLower = syn.toLowerCase();
        if (uniqueTokens.includes(synLower)) {
          score += 4; // Synonym match is excellent
          matchedKeyword = matchedKeyword || `Synonym for "${syn}"`;
        }
      });
    }

    // Check Tags (t)
    if (word.t && Array.isArray(word.t)) {
      word.t.forEach(tag => {
        const tagLower = tag.toLowerCase();
        if (uniqueTokens.includes(tagLower)) {
          score += 3;
          matchedKeyword = matchedKeyword || `Tag: "${tag}"`;
        }
      });
    }

    if (score > 0) {
      recommendations.push({
        ...word,
        score,
        matchedKeyword,
        title: word.name,
        subtitle: 'Dictionary Word',
        notes: word.rd || word.d || 'No definition available',
        link: `/dictionary/${word.letter}/${word.name}`
      });
      seenIds.add(word.name);
    }
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 30); // Top 30
}

ConceptRecommender.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddToBoard: PropTypes.func.isRequired
};
