import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button, EmptyState } from '../components/ui';
import './ContentPage.css';

export function NotFound() {
  return (
    <div className="content-page">
      <EmptyState
        icon={<AlertCircle size={64} />}
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
        <Link to="/">
          <Button variant="primary" icon={<Home size={20} />}>
            Go Home
          </Button>
        </Link>
        <Link to="/domains">
          <Button variant="secondary">
            Browse Domains
          </Button>
        </Link>
      </div>
    </div>
  );
}
