import { Card, Badge, Button } from '../components/ui';
import { Database, Code, Cpu, ExternalLink } from 'lucide-react';
import './About.css';

export function About() {
  return (
    <div className="about-page">
      <div className="about-page__header">
        <h1 className="about-page__title">The Mainframe</h1>
        <p className="about-page__tagline">
          A living ecosystem for creative intelligence, master flow, and structured knowledge.
        </p>
      </div>

      <div className="about-grid">
        <Card className="about-card">
          <div className="about-accent" />
          <Database size={32} className="mb-4 text-accent-primary" />
          <h3>Knowledge Hub</h3>
          <p>
            Solving the problem of fragmented creative knowledge. 
            Centralized, validated, and AI-ready data for lyrics, culture, and concepts.
          </p>
        </Card>

        <Card className="about-card">
          <div className="about-accent" style={{ background: 'var(--gradient-secondary)' }} />
          <Code size={32} className="mb-4 text-accent-secondary" />
          <h3>Modern Stack</h3>
          <p>
            Built with React 19, Vite 7, and GSAP. 
            Engineered for performance, animations, and seamless user experience.
          </p>
        </Card>

        <Card className="about-card">
          <div className="about-accent" style={{ background: 'linear-gradient(90deg, #FF0080, #7928CA)' }} />
          <Cpu size={32} className="mb-4" style={{ color: '#FF0080' }} />
          <h3>AI Integration</h3>
          <p>
            Designed as a high-fidelity data source for training personal AI assistants 
            and enhancing creative workflows.
          </p>
        </Card>
      </div>

      <div className="about-footer">
        <h2>Open Source Intelligence</h2>
        <p className="text-secondary max-w-lg mx-auto mb-8">
          This project represents the convergence of music, technology, and information architecture.
          Created by JaZeR.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button variant="outline" onClick={() => window.open('https://github.com/StartHereEng/jazer-rhyme-book', '_blank')}>
            <ExternalLink size={16} className="mr-2" />
            View on GitHub
          </Button>
        </div>

        <div className="about-badges">
          <Badge variant="outline">v1.0.0</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="secondary">2026</Badge>
        </div>
      </div>
    </div>
  );
}
