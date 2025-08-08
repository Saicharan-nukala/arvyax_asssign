import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Transform Your Mind",
      subtitle: "Discover inner peace through guided meditation",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Heal Your Body",
      subtitle: "Personalized wellness sessions for physical health",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Find Your Balance",
      subtitle: "Create harmony between mind, body, and spirit",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: "🧘‍♀️",
      title: "Guided Meditation",
      description: "Access thousands of meditation sessions designed by wellness experts."
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your wellness journey with detailed analytics and insights."
    },
    {
      icon: "🎯",
      title: "Personal Goals",
      description: "Set and achieve your wellness goals with our smart recommendation system."
    },
    {
      icon: "🌱",
      title: "Mindful Living",
      description: "Learn practical techniques for incorporating mindfulness into daily life."
    },
    {
      icon: "💪",
      title: "Physical Wellness",
      description: "Combine mental and physical exercises for complete wellbeing."
    },
    {
      icon: "🤝",
      title: "Community Support",
      description: "Connect with like-minded individuals on similar wellness journeys."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Executive",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      text: "Arvyax has completely transformed my approach to wellness. The personalized sessions fit perfectly into my busy schedule."
    },
    {
      name: "Michael Chen",
      role: "Software Developer", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      text: "The auto-save feature ensures I never lose my progress. It's like having a personal wellness coach available 24/7."
    },
    {
      name: "Emily Rodriguez",
      role: "Yoga Instructor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80", 
      text: "As a wellness professional, I recommend Arvyax to all my clients. The platform is intuitive and incredibly effective."
    }
  ];

  return (
    <main className="home">
      {/* Hero Section with Slider */}
      <section className="hero-slider">
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-actions">
                  <Link to="/register" className="cta-primary">
                    Start Your Journey
                  </Link>
                  <Link to="#features" className="cta-secondary">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="slider-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Arvyax Wellness?</h2>
            <p className="section-subtitle">
              Comprehensive tools and features designed to support your wellness journey
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Sessions Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">User Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Real stories from people who transformed their lives with Arvyax
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Life?</h2>
            <p className="cta-subtitle">
              Join thousands of users who have already started their wellness journey with Arvyax
            </p>
            <Link to="/register" className="cta-button">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/arvyax-logo.png" alt="Arvyax" className="footer-logo" />
              <p className="footer-description">
                Empowering individuals to achieve optimal wellness through technology and mindfulness.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h3>Product</h3>
                <Link to="/features">Features</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/testimonials">Testimonials</Link>
              </div>
              <div className="footer-column">
                <h3>Company</h3>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/careers">Careers</Link>
              </div>
              <div className="footer-column">
                <h3>Support</h3>
                <Link to="/help">Help Center</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Arvyax Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
