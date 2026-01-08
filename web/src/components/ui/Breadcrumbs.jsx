import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumbs__item">
            {index < items.length - 1 ? (
              <>
                <Link to={item.path} className="breadcrumbs__link">
                  {item.label}
                </Link>
                <ChevronRight className="breadcrumbs__separator" size={16} />
              </>
            ) : (
              <span className="breadcrumbs__current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
