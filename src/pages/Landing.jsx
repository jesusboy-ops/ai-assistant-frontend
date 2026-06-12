import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import {
  ChatBubbleOutline as ChatIcon,
  TaskAlt as TaskIcon,
  Language as TranslateIcon,
  Description as DocIcon,
  Calculate as MathIcon,
  MailOutline as EmailIcon,
  Psychology as BrainIcon,
  TrendingUp as TrendIcon,
  Security as LockIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';
import '../styles/landing.css';

const FEATURES = [
  { icon: <ChatIcon fontSize="large" />, title: 'AI Chat Assistant', desc: 'Intelligent conversations that understand context and execute tasks automatically.' },
  { icon: <TaskIcon fontSize="large" />, title: 'Smart Task Management', desc: 'Create, organize, and track tasks with AI-powered scheduling and reminders.' },
  { icon: <TranslateIcon fontSize="large" />, title: 'Language Tools', desc: 'Instant translation and dictionary lookup with pronunciation guides.' },
  { icon: <DocIcon fontSize="large" />, title: 'Document Analysis', desc: 'Extract key insights and summaries from any document in seconds.' },
  { icon: <MathIcon fontSize="large" />, title: 'Problem Solver', desc: 'Solve mathematical equations with detailed step-by-step explanations.' },
  { icon: <EmailIcon fontSize="large" />, title: 'Email Generator', desc: 'Craft professional emails with AI assistance in multiple tones and styles.' },
];

const SOLUTIONS = [
  { icon: <BrainIcon fontSize="large" />, title: 'Adaptive Learning', desc: 'Improves over time based on real-world interactions, becoming smarter with every use.' },
  { icon: <TrendIcon fontSize="large" />, title: 'Predictive AI', desc: 'Stay ahead with intelligent suggestions that anticipate your next move.' },
  { icon: <LockIcon fontSize="large" />, title: 'Enterprise Security', desc: 'Bank-grade encryption and privacy controls keep your data safe at all times.' },
  { icon: <SparkleIcon fontSize="large" />, title: 'Intuitive Interface', desc: 'No setup required. Get started in seconds with a clean, modern experience.' },
];

const FEATURE_ROUTES = {
  'AI Chat Assistant': '/features/ai-chat',
  'Smart Task Management': '/features/task-management',
  'Language Tools': '/features/language-tools',
  'Document Analysis': '/features/document-analysis',
  'Problem Solver': '/features/problem-solver',
  'Email Generator': '/features/email-generator',
};

export default function Landing() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <div className="nav-logo-icon"><SparkleIcon fontSize="inherit" /></div>
            <span className="nav-logo-text">SPARK</span>
          </div>

          {!isMobile && (
            <div className="nav-links-pill">
              {['About', 'Solutions', 'Why Spark', 'Pricing'].map(l => (
                <span key={l} className="nav-link">{l}</span>
              ))}
            </div>
          )}

          {!isMobile ? (
            <div className="nav-ctas">
              <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-accent" onClick={() => navigate('/signup')}>Get Started</button>
            </div>
          ) : (
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        {isMobile && menuOpen && (
          <div className="nav-mobile-menu">
            {['About', 'Solutions', 'Why Spark'].map(l => (
              <span key={l} className="mobile-link">{l}</span>
            ))}
            <button className="btn-ghost-full" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Sign In</button>
            <button className="btn-accent-full" onClick={() => { navigate('/signup'); setMenuOpen(false); }}>Get Started</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow-top" />

        <span className="hero-star star-1"><SparkleIcon fontSize="inherit" /></span>
        <span className="hero-star star-2"><SparkleIcon fontSize="inherit" /></span>
        <span className="hero-star star-3"><SparkleIcon fontSize="inherit" /></span>
        <span className="hero-star star-4"><SparkleIcon fontSize="inherit" /></span>
        <span className="hero-star star-5"><SparkleIcon fontSize="inherit" /></span>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-POWERED PRODUCTIVITY SUITE
          </div>

          <h1 className="hero-title">
            Work Smarter<br />
            with Better<br />
            Outcomes
          </h1>

          <p className="hero-sub">
            Adapting, learning, and evolving with your needs —<br />
            Spark AI grows smarter every day.
          </p>

          <div className="hero-actions">
            <button className="btn-accent btn-lg" onClick={() => navigate('/signup')}>Try Now</button>
            <button className="btn-outline btn-lg" onClick={() => navigate('/login')}>Sign In</button>
          </div>

          <div className="hero-trust">
            <div className="hero-stars">★★★★★</div>
            <span className="hero-trust-text">Trusted by hundreds of companies</span>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      <section className="section solutions-section">
        <div className="section-grid" />
        <div className="container">
          <div className="section-header-left">
            <span className="section-label">SOLUTIONS</span>
            <h2 className="section-title">Spark agents for<br />your work</h2>
          </div>
          <div className="cards-4">
            {SOLUTIONS.map((s, i) => (
              <div key={i} className="card-base">
                <div className="card-icon-box">{s.icon}</div>
                <h3 className="card-title">{s.title}</h3>
                <p className="card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">POWERFUL FEATURES</span>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-sub">Comprehensive AI tools designed to streamline your workflow and boost productivity</p>
          </div>
          <div className="cards-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-base card-hover" onClick={() => navigate(FEATURE_ROUTES[f.title] || '/signup')}>
                <div className="card-row">
                  <div className="card-icon-box">{f.icon}</div>
                  <div>
                    <h3 className="card-title">{f.title}</h3>
                    <p className="card-desc">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="cta-glow" />
        <div className="section-grid" />
        <div className="container cta-inner">
          <span className="hero-star cta-star"><SparkleIcon fontSize="inherit" /></span>
          <h2 className="cta-title">Ready to work<br />smarter?</h2>
          <p className="cta-sub">Join thousands of teams already using Spark AI to boost their productivity.</p>
          <div className="hero-actions">
            <button className="btn-accent btn-lg" onClick={() => navigate('/signup')}>Get Started Free</button>
            <button className="btn-outline btn-lg" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="container footer-inner">
          <div className="nav-logo">
            <div className="nav-logo-icon"><SparkleIcon fontSize="inherit" /></div>
            <span className="nav-logo-text">SPARK</span>
          </div>
          <span className="footer-copy">© 2026 Spark AI. All rights reserved.</span>
          <div className="footer-links">
            {['Privacy', 'Terms', 'Contact'].map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
