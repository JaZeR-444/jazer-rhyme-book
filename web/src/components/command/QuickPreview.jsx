import { useMemo } from 'react';
import { BookOpen, Database, Tag, Sparkles } from 'lucide-react';
import './QuickPreview.css';

/**
 * QuickPreview - Shows preview of selected search result
 */
export function QuickPreview({ item, visible = true }) {
  const preview = useMemo(() => {
    if (!item) return null;

    switch (item.type) {
      case 'word':
        return {
          title: item.word || item.name,
          subtitle: item.syllables ? `${item.syllables} syllables` : 'Dictionary Entry',
          icon: <BookOpen size={24} />,
          fields: [
            item.phonetic && { label: 'Pronunciation', value: item.phonetic },
            item.rhymeFamily && { label: 'Rhyme Family', value: item.rhymeFamily },
            item.definition && { label: 'Definition', value: item.definition.substring(0, 120) + '...' }
          ].filter(Boolean)
        };

      case 'entity':
        return {
          title: item.name,
          subtitle: item.type || 'Entity',
          icon: <Database size={24} />,
          fields: [
            item.domain && { label: 'Domain', value: item.domain },
            item.category && { label: 'Category', value: item.category },
            item.one_liner && { label: 'Description', value: item.one_liner },
            item.tags && item.tags.length > 0 && { 
              label: 'Tags', 
              value: item.tags.slice(0, 3).join(', ') + (item.tags.length > 3 ? '...' : '')
            }
          ].filter(Boolean)
        };

      case 'domain':
        return {
          title: item.name,
          subtitle: 'Knowledge Domain',
          icon: <Tag size={24} />,
          fields: [
            item.category && { label: 'Category', value: item.category },
            item.description && { label: 'Description', value: item.description },
            item.entityCount && { label: 'Entities', value: `${item.entityCount} items` }
          ].filter(Boolean)
        };

      case 'nav':
        return {
          title: item.name,
          subtitle: 'Navigation',
          icon: item.icon || <Sparkles size={24} />,
          fields: [
            { label: 'Path', value: item.path }
          ]
        };

      case 'cmd':
        return {
          title: item.name,
          subtitle: 'System Command',
          icon: item.icon || <Sparkles size={24} />,
          fields: [
            item.description && { label: 'Action', value: item.description }
          ].filter(Boolean)
        };

      default:
        return null;
    }
  }, [item]);

  if (!visible || !preview) return null;

  return (
    <div className="quick-preview">
      <div className="quick-preview__header">
        <div className="quick-preview__icon">
          {preview.icon}
        </div>
        <div className="quick-preview__title-group">
          <h3 className="quick-preview__title">{preview.title}</h3>
          <p className="quick-preview__subtitle">{preview.subtitle}</p>
        </div>
      </div>

      {preview.fields.length > 0 && (
        <div className="quick-preview__fields">
          {preview.fields.map((field, index) => (
            <div key={index} className="quick-preview__field">
              <span className="quick-preview__label">{field.label}:</span>
              <span className="quick-preview__value">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="quick-preview__footer">
        <span className="quick-preview__hint">
          Press <kbd>Enter</kbd> to open
        </span>
      </div>
    </div>
  );
}
