import { Link } from 'react-router-dom';
import { Home, Search, BookOpen } from 'lucide-react';
import { Button } from '../components/ui';
import { usePageTitle } from '../lib/usePageTitle';
import './NotFound.css';

export function NotFound() {
  usePageTitle('404 Not Found');
  return (
    <div className="system-breach" role="main" aria-label="404 Page not found error page">
      <div className="system-breach__content">
        <h1 className="system-breach__title" data-text="404 SYSTEM ERROR">404 SYSTEM ERROR</h1>
        <div className="system-breach__diagnostic">
          <p>{`> ERROR_CODE: PAGE_NOT_FOUND`}</p>
          <p>{`> SECTOR: UNKNOWN`}</p>
          <p>{`> STATUS: CORRUPTED`}</p>
        </div>
        <p className="system-breach__message">
          The requested data packet could not be retrieved from the mainframe.
          Navigation capability has been compromised in this sector.
        </p>
        <div className="system-breach__actions">
          <Link to="/">
            <Button variant="primary" aria-label="Return to home page">
              <Home size={18} aria-hidden="true" />
              <span>INITIATE SYSTEM REBOOT</span>
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="secondary" aria-label="Go to search page">
              <Search size={18} aria-hidden="true" />
              <span>ACCESS SEARCH</span>
            </Button>
          </Link>
          <Link to="/dictionary">
            <Button variant="outline" aria-label="Go to dictionary">
              <BookOpen size={18} aria-hidden="true" />
              <span>BROWSE DICTIONARY</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="scanline"></div>
    </div>
  );
}


export default NotFound;
