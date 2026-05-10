import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/aurora-landing.css';

function AuroraTrailsLanding() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);

      // Detect visible elements for scroll animations
      const elements = document.querySelectorAll('.scroll-fade');
      const newVisibleElements = new Set();

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          newVisibleElements.add(el);
          el.classList.add('visible');
        }
      });

      setVisibleElements(newVisibleElements);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🤖',
      title: 'AI Itinerary Generator',
      description: 'Let our advanced AI create personalized itineraries based on your preferences and interests.',
      color: 'cyan'
    },
    {
      icon: '🗺️',
      title: 'Interactive World Map',
      description: 'Explore destinations with our animated, interactive global map experience.',
      color: 'purple'
    },
    {
      icon: '🎭',
      title: 'Mood-Based Planning',
      description: 'Select your travel mood and get curated experiences tailored to your vibe.',
      color: 'cyan'
    },
    {
      icon: '💰',
      title: 'Smart Budget Estimator',
      description: 'Get accurate cost predictions for flights, hotels, food, and activities.',
      color: 'purple'
    },
    {
      icon: '🌦️',
      title: 'Weather & Travel Insights',
      description: 'Real-time weather data and travel information for informed planning.',
      color: 'cyan'
    },
    {
      icon: '📋',
      title: 'Smart Trip Timeline',
      description: 'Visual timeline that organizes your entire trip from start to finish.',
      color: 'purple'
    },
    {
      icon: '👥',
      title: 'Group Expense Splitter',
      description: 'Seamlessly split costs and settle expenses with your travel companions.',
      color: 'cyan'
    },
    {
      icon: '✨',
      title: 'AI Recommendations',
      description: 'Intelligent suggestions for hidden gems and local experiences.',
      color: 'purple'
    }
  ];

  const howItWorks = [
    {
      number: '01',
      title: 'Share Your Vision',
      description: 'Tell us your destination, dates, budget, and travel style preferences.'
    },
    {
      number: '02',
      title: 'AI Planning Magic',
      description: 'Our intelligent system analyzes millions of data points to craft your perfect itinerary.'
    },
    {
      number: '03',
      title: 'Customize & Refine',
      description: 'Adjust activities, budget allocation, and timeline to match your exact preferences.'
    },
    {
      number: '04',
      title: 'Explore & Book',
      description: 'Browse integrated bookings for flights, hotels, and experiences all in one place.'
    }
  ];

  return (
    <div className="aurora-landing">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="logo">
              ✨ Aurora Trails
            </div>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#testimonials">Testimonials</a>
            </div>
            <div className="nav-actions">
              <button className="btn btn-secondary btn-sm">Sign In</button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/layout')}
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="aurora-canvas"></div>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="container">
            <div className="hero-text fade-in">
              <h1 className="hero-title">
                Plan journeys beyond <span className="text-gradient">destinations</span>
              </h1>
              <p className="hero-subtitle">
                AI-powered travel planning for unforgettable experiences. Discover, plan, and explore the world smarter.
              </p>
              <div className="hero-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  <span>🚀</span> Start Exploring
                </button>
                <button className="btn btn-secondary">
                  <span>📹</span> Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="hero-stats fade-in fade-in-delay-1">
                <div className="stat">
                  <div className="stat-number">150K+</div>
                  <div className="stat-label">Happy Travelers</div>
                </div>
                <div className="stat">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Destinations</div>
                </div>
                <div className="stat">
                  <div className="stat-number">2.3M+</div>
                  <div className="stat-label">Trips Planned</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual fade-in fade-in-delay-2">
              <div className="hero-card glass glass-hover">
                <div className="card-header">
                  <span className="card-title">Tokyo, Japan</span>
                  <span className="card-badge">🌟 Trending</span>
                </div>
                <div className="card-body">
                  <div className="trip-info">
                    <div className="trip-detail">
                      <span className="label">Duration</span>
                      <span className="value">7 Days</span>
                    </div>
                    <div className="trip-detail">
                      <span className="label">Budget</span>
                      <span className="value">$2,500</span>
                    </div>
                    <div className="trip-detail">
                      <span className="label">Best Time</span>
                      <span className="value">Mar-May</span>
                    </div>
                  </div>
                  <div className="card-activities">
                    <div className="activity-tag">🏯 Cultural</div>
                    <div className="activity-tag">🍜 Food Tour</div>
                    <div className="activity-tag">🌃 Night Out</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section section-alt">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Powerful Features for Modern Travelers</h2>
            <p>Everything you need to plan the perfect journey, powered by artificial intelligence.</p>
          </div>

          <div className="grid grid-4 mt-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card glass glass-hover scroll-fade fade-in fade-in-delay-${(index % 4) + 1}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`feature-icon glow-${feature.color}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-link">
                  Learn more →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section">
        <div className="container">
          <div className="section-header fade-in text-center">
            <h2>How Aurora Trails Works</h2>
            <p>Four simple steps to your dream vacation</p>
          </div>

          <div className="timeline mt-4">
            {howItWorks.map((step, index) => (
              <div 
                key={index}
                className={`timeline-step scroll-fade fade-in fade-in-delay-${(index % 4) + 1}`}
              >
                <div className="timeline-marker">
                  <span className="step-number">{step.number}</span>
                  {index < howItWorks.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-content glass glass-hover">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section section-alt">
        <div className="container">
          <div className="section-header fade-in text-center">
            <h2>Loved by Travelers Worldwide</h2>
            <p>Join thousands of happy explorers who've transformed their travel planning</p>
          </div>

          <div className="grid grid-3 mt-4">
            {[
              {
                name: 'Sarah Chen',
                role: 'Adventure Seeker',
                quote: 'Aurora Trails saved me hours of research. The AI recommendations were spot-on!',
                avatar: '👩‍💼'
              },
              {
                name: 'Marcus Johnson',
                role: 'Budget Traveler',
                quote: 'The budget estimator helped me plan an amazing 2-week trip without overspending.',
                avatar: '👨‍💻'
              },
              {
                name: 'Elena Rodriguez',
                role: 'Group Leader',
                quote: 'Our family loved coordinating with the group expense splitter. Zero conflicts!',
                avatar: '👩‍🦱'
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-card glass glass-hover scroll-fade fade-in fade-in-delay-${(index % 3) + 1}`}
              >
                <div className="testimonial-header">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div className="testimonial-meta">
                    <div className="name">{testimonial.name}</div>
                    <div className="role">{testimonial.role}</div>
                  </div>
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content fade-in text-center">
            <h2>Ready to Explore the World?</h2>
            <p>Start planning your next adventure with Aurora Trails AI</p>
            <button 
              className="btn btn-primary btn-large mt-2"
              onClick={() => navigate('/dashboard')}
            >
              <span>✨</span> Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Aurora Trails</h4>
              <p>Making travel planning magical with AI.</p>
            </div>
            <div className="footer-section">
              <h5>Product</h5>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Company</h5>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h5>Legal</h5>
              <ul>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#terms">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Aurora Trails. All rights reserved.</p>
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuroraTrailsLanding;
