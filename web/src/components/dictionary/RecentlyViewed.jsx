/**
 * RecentlyViewed Component
 * Horizontal scrollable list of recently viewed words
 */
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { useBrowsingHistory } from '../../contexts/BrowsingHistoryContext';
import './RecentlyViewed.css';

export function RecentlyViewed({ limit = 10 }) {
  const { getRecentWords } = useBrowsingHistory();
  const recentWords = getRecentWords(limit);

  if (recentWords.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <section className="recently-viewed">
      <div className="recently-viewed__header">
        <div className="recently-viewed__title-wrapper">
          <Clock size={20} className="recently-viewed__icon" />
          <h3 className="recently-viewed__title">Recently Viewed</h3>
        </div>
        <span className="recently-viewed__count">{recentWords.length} words</span>
      </div>

      <div className="recently-viewed__scroll-container">
        <div className="recently-viewed__list">
          {recentWords.map((item, idx) => (
            <Link
              key={`${item.word}-${idx}`}
              to={item.url}
              className="recently-viewed__item glass"
            >
              <div className="recently-viewed__item-header">
                <span className="recently-viewed__letter">{item.letter}</span>
                <span className="recently-viewed__time">
                  {formatTimeAgo(item.viewedAt)}
                </span>
              </div>
              <h4 className="recently-viewed__word">{item.word}</h4>
              <ArrowRight size={14} className="recently-viewed__arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
