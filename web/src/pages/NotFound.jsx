import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import './NotFound.css';

export function NotFound() {
  return (
    <div className="system-breach">
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
            <Button variant="primary">INITIATE SYSTEM REBOOT</Button>
          </Link>
        </div>
      </div>
      <div className="scanline"></div>
    </div>
  );
}
