import { Card, MarkdownRenderer, Badge } from '../components/ui';
import './ContentPage.css';

const aboutContent = `
# About

**JaZeR Master Flow Knowledge Hub** is a living creative ecosystem and structured knowledge base designed for modern creators and AI systems.

## Project Vision

This hub solves a critical problem: **fragmented creative knowledge**. Whether you're writing lyrics, training AI models, researching connections between music and culture, or building creative applications, you need organized, validated, AI-friendly data at your fingertips.

## Technology Stack

- **Frontend**: React 19 + Vite 7
- **Animations**: GSAP
- **Routing**: React Router
- **Search**: Fuse.js
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: react-syntax-highlighter

## License & Usage

This is a **personal creative project** by JaZeR. All content proprietary.

### Usage Rights

✅ Personal use for creative projects

✅ AI training for personal assistants

✅ Educational purposes with attribution

❌ Commercial use without permission

❌ Redistribution without permission

## Attribution

\`\`\`
JaZeR Master Flow Knowledge Hub
Created by JaZeR | 2026
\`\`\`

## Version

**1.0.0** — Active Development
`;

export function About() {
  return (
    <div className="content-page">
      <div className="content-page__header">
        <h1 className="content-page__title">About</h1>
        <p className="content-page__subtitle">
          Project information, license, and attribution
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
          <Badge variant="primary">v1.0.0</Badge>
          <Badge variant="success">Active</Badge>
        </div>
      </div>
      <Card className="content-page__content">
        <MarkdownRenderer content={aboutContent} />
      </Card>
    </div>
  );
}
