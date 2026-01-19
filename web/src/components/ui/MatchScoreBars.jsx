/**
 * MatchScoreBars Component
 * Visual representation of match confidence (1-5 bars)
 */
import './MatchScoreBars.css';

export function MatchScoreBars({ score, max = 100 }) {
  const barCount = 5;
  const filledBars = Math.ceil((score / max) * barCount);

  return (
    <div className="match-score-bars">
      {Array.from({ length: barCount }).map((_, idx) => (
        <div
          key={idx}
          className={`match-score-bar ${idx < filledBars ? 'filled' : ''}`}
          style={{ height: `${((idx + 1) / barCount) * 24}px` }}
        />
      ))}
    </div>
  );
}
