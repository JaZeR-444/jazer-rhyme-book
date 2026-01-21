import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import './DictionaryNav.css';

/**
 * DictionaryNav - A-Z navigation for the dictionary
 */
export function DictionaryNav({ letters = [], className = '' }) {
  const { letter: currentLetter } = useParams();
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // Use provided letters or fallback to full alphabet
  const navLetters = letters.length > 0 ? letters : alphabet;

  return (
    <nav className={`dictionary-nav ${className}`} aria-label="Dictionary alphabet navigation">
      <div className="dictionary-nav__container">
        {navLetters.map((l) => {
          const isSelected = currentLetter?.toUpperCase() === l.toUpperCase();
          return (
            <Link
              key={l}
              to={`/dictionary/${l.toUpperCase()}`}
              className={`dictionary-nav__link ${isSelected ? 'is-active' : ''}`}
              aria-current={isSelected ? 'page' : undefined}
            >
              {l}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

DictionaryNav.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string
};
