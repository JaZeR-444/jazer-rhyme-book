/**
 * ShareCard.jsx
 * Generate shareable image cards of user stats
 */

import React, { useRef } from 'react';
import { Download, Share2 } from 'lucide-react';
import './ShareCard.css';

export default function ShareCard({ stats }) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    try {
      // Simple canvas-based screenshot
      const card = cardRef.current;
      if (!card) return;

      // You can integrate html-to-image library here for better results
      // For now, prompt user to screenshot manually
      alert('Right-click the card and select "Save image as..." to download');
    } catch (error) {
      console.error('Failed to download card:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My JaZeR Rhyme Book Stats',
      text: `I've explored ${stats.uniqueWordsViewed} unique words, ${stats.uniqueEntitiesExplored} entities, and written ${stats.totalStudioWords} words in the studio!`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.text + '\n' + shareData.url);
        alert('Stats copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="share-card">
      <h3 className="share-card__title">Share Your Stats</h3>
      
      <div ref={cardRef} className="share-card__content">
        <div className="share-card__header">
          <h2 className="share-card__heading">My JaZeR Rhyme Book Journey</h2>
          <p className="share-card__subheading">
            Member since {new Date(stats.memberSince).getFullYear()}
          </p>
        </div>

        <div className="share-card__stats">
          <div className="share-card__stat">
            <div className="share-card__stat-value">{stats.uniqueWordsViewed}</div>
            <div className="share-card__stat-label">Words Explored</div>
          </div>

          <div className="share-card__stat">
            <div className="share-card__stat-value">{stats.uniqueEntitiesExplored}</div>
            <div className="share-card__stat-label">Entities Discovered</div>
          </div>

          <div className="share-card__stat">
            <div className="share-card__stat-value">{stats.totalStudioWords}</div>
            <div className="share-card__stat-label">Words Written</div>
          </div>

          <div className="share-card__stat">
            <div className="share-card__stat-value">{stats.totalStudioSessions}</div>
            <div className="share-card__stat-label">Studio Sessions</div>
          </div>
        </div>

        <div className="share-card__footer">
          <p className="share-card__branding">JaZeR Rhyme Book</p>
        </div>
      </div>

      <div className="share-card__actions">
        <button onClick={handleShare} className="share-card__button share-card__button--primary">
          <Share2 size={16} />
          Share Stats
        </button>
        <button onClick={handleDownload} className="share-card__button">
          <Download size={16} />
          Download Card
        </button>
      </div>
    </div>
  );
}
