import { Link } from 'react-router-dom';
import { Database, BookOpen, Search, Code, Zap, Globe } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { Logo } from '../components/common/Logo';
import { useDomains, useDictionaryLetters } from '../lib/hooks';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useRef } from 'react';
import './Home.css';

export function Home() {
  const { domains } = useDomains();
  const { letters } = useDictionaryLetters();
  const heroRef = useRef();
  const featuresRef = useRef();

  useGSAP(() => {
    // Logo entrance animation
    gsap.from(heroRef.current.querySelector('.hero__logo'), {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'power3.out'
    });

    // Hero text animation - staggered entrance
    gsap.from(heroRef.current.querySelectorAll('.hero__title, .hero__subtitle, .hero__actions'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.3,
      ease: 'power3.out'
    });

    // Features animation
    gsap.from(featuresRef.current.querySelectorAll('.feature-card'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top 80%'
      }
    });
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero__content">
          <div className="hero__logo">
            <Logo variant="icon" size="large" className="hero-logo-img" />
          </div>
          <h1 className="hero__title">
            <span className="hero__title-gradient">Master Flow</span>
            <br />
            <span className="hero__title-accent">Knowledge Hub</span>
          </h1>
          <p className="hero__subtitle">
            The Ultimate AI-Powered Creative Arsenal for Lyricists, Writers, and Knowledge Seekers
          </p>
          <div className="hero__actions">
            <Link to="/domains">
              <Button size="lg" variant="primary" icon={<Database size={20} />}>
                Explore Domains
              </Button>
            </Link>
            <Link to="/dictionary">
              <Button size="lg" variant="secondary" icon={<BookOpen size={20} />}>
                Browse Dictionary
              </Button>
            </Link>
          </div>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <div className="stat__value">{domains.length}+</div>
            <div className="stat__label">Domains</div>
          </div>
          <div className="stat">
            <div className="stat__value">{letters.length}</div>
            <div className="stat__label">Dictionary Letters</div>
          </div>
          <div className="stat">
            <div className="stat__value">1000s</div>
            <div className="stat__label">Entities</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef}>
        <h2 className="features__title">What Makes It Special</h2>
        <div className="features__grid">
          <Card className="feature-card" hover glow>
            <div className="feature-card__icon">
              <Database size={32} />
            </div>
            <h3 className="feature-card__title">25+ Domains</h3>
            <p className="feature-card__description">
              Music, lingo, tech, culture, and more — all interconnected through intelligent tagging and relations.
            </p>
          </Card>

          <Card className="feature-card" hover glow>
            <div className="feature-card__icon">
              <BookOpen size={32} />
            </div>
            <h3 className="feature-card__title">A-Z Dictionary</h3>
            <p className="feature-card__description">
              Complete rhyme bank with contextual definitions, usage examples, and cultural context.
            </p>
          </Card>

          <Card className="feature-card" hover glow>
            <div className="feature-card__icon">
              <Zap size={32} />
            </div>
            <h3 className="feature-card__title">AI-Optimized</h3>
            <p className="feature-card__description">
              Structured JSON validated with schemas, perfect for Claude, Gemini, and other LLMs.
            </p>
          </Card>

          <Card className="feature-card" hover glow>
            <div className="feature-card__icon">
              <Code size={32} />
            </div>
            <h3 className="feature-card__title">Quality Assured</h3>
            <p className="feature-card__description">
              Automated validation with JSON Schema and metadata rules ensure data integrity.
            </p>
          </Card>

          <Card className="feature-card" hover glow>
            <div className="feature-card__icon">
              <Globe size={32} />
            </div>
            <h3 className="feature-card__title">Cross-Domain Relations</h3>
            <p className="feature-card__description">
              Semantic connections link entities across domains for deep knowledge graphs.
            </p>
          </Card>

          <Card className="feature-card" hover glow>
            <div className="feature-card__icon">
              <Search size={32} />
            </div>
            <h3 className="feature-card__title">Fast Search</h3>
            <p className="feature-card__description">
              Client-side search across all entities and dictionary with tag and domain filtering.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <Card className="cta__card" variant="glass">
          <h2 className="cta__title">Ready to Explore?</h2>
          <p className="cta__description">
            Dive into 25+ knowledge domains or search through thousands of words in the rhyme dictionary.
          </p>
          <div className="cta__actions">
            <Link to="/search">
              <Button variant="primary" icon={<Search size={20} />}>
                Start Searching
              </Button>
            </Link>
            <Link to="/architecture">
              <Button variant="ghost">Learn More</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
