import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import './MarkdownRenderer.css';

/**
 * CodeBlock - Syntax-highlighted code block with copy functionality
 * @param {Object} props - Component props
 * @param {boolean} props.inline - Whether the code is inline
 * @param {string} props.className - CSS class name
 * @param {React.ReactNode} props.children - Code content
 */
function CodeBlock({ node, inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  if (!inline && match) {
    return (
      <div className="code-block" role="group" aria-label={`${match[1]} code block`}>
        <div className="code-block__header">
          <span className="code-block__language" aria-label="Programming language">
            {match[1]}
          </span>
          <button
            className="code-block__copy"
            onClick={handleCopy}
            aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
            aria-live="polite"
          >
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

/**
 * MarkdownRenderer - Safe markdown rendering with GFM support and syntax highlighting
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.sanitize - Whether to sanitize HTML (default: true)
 */
export function MarkdownRenderer({ 
  content, 
  className = '', 
  sanitize = true 
}) {
  // Build plugins array
  const remarkPlugins = [remarkGfm];
  const sanitizeSchema = sanitize ? {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      code: [...(defaultSchema.attributes?.code || []), ['className']],
      pre: [...(defaultSchema.attributes?.pre || []), ['className']],
      span: [...(defaultSchema.attributes?.span || []), ['className']],
      div: [...(defaultSchema.attributes?.div || []), ['className']],
      '*': [...(defaultSchema.attributes?.['*'] || []), ['className']]
    }
  } : null;
  const rehypePlugins = sanitize ? [[rehypeSanitize, sanitizeSchema]] : [];

  return (
    <div className={`markdown-renderer ${className}`} role="article">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          code: CodeBlock
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}

MarkdownRenderer.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
  sanitize: PropTypes.bool
};
