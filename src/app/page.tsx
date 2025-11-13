'use client'
import React, { useEffect, useRef, useState } from 'react'

const HomePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = ['for-workers', 'for-employers', 'why-shramic', 'testimonials']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // IntersectionObserver for animations
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    const els = document.querySelectorAll<HTMLElement>('.reveal')
    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Smooth scrolling
  useEffect(() => {
    const handler = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement
      const href = a.getAttribute('href') ?? ''
      if (!href.startsWith('#')) return
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return
      e.preventDefault()
      const header = document.querySelector('header')
      const headerHeight = header ? header.getBoundingClientRect().height : 0
      const top = target.offsetTop - headerHeight
      window.scrollTo({ top, behavior: 'smooth' })
      setMobileOpen(false)
    }

    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    links.forEach((link) => link.addEventListener('click', handler))

    return () => {
      links.forEach((link) => link.removeEventListener('click', handler))
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #ffffff;
          color: #1e293b;
          overflow-x: hidden;
        }

        /* Brand Colors */
        .text-brand-primary { color: #1e40af; }
        .text-brand-secondary { color: #0369a1; }
        .text-brand-accent { color: #f59e0b; }
        .bg-brand-primary { background: #1e40af; }
        .bg-brand-light { background: #eff6ff; }
        .border-brand { border-color: #3b82f6; }

        /* Typography */
        .font-display {
          font-family: 'Poppins', sans-serif;
        }

        /* Trust Badge */
        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f0fdf4;
          border: 1px solid #86efac;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          color: #15803d;
        }

        /* Glass Effect */
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 36px rgba(30, 64, 175, 0.15);
          border-color: #3b82f6;
        }

        /* Buttons */
        .btn-primary {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          font-weight: 700;
          padding: 14px 32px;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(30, 64, 175, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(30, 64, 175, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #1e40af;
          font-weight: 700;
          padding: 14px 32px;
          border-radius: 12px;
          border: 2px solid #1e40af;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #eff6ff;
          transform: translateY(-2px);
        }

        /* Header */
        .header-main {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .header-scrolled {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .nav-link {
          position: relative;
          color: #475569;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #1e40af;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 3px;
          background: #1e40af;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        /* Reveal Animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal:nth-child(1) { transition-delay: 0s; }
        .reveal:nth-child(2) { transition-delay: 0.1s; }
        .reveal:nth-child(3) { transition-delay: 0.2s; }
        .reveal:nth-child(4) { transition-delay: 0.3s; }

        /* Icon Backgrounds */
        .icon-bg-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .icon-bg-cyan {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
        }

        .icon-bg-amber {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }

        .icon-bg-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        /* Stats Section */
        .stat-card {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #93c5fd;
          padding: 24px;
          border-radius: 16px;
          text-align: center;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 900;
          color: #1e40af;
          font-family: 'Poppins', sans-serif;
        }

        .stat-label {
          font-size: 1rem;
          color: #475569;
          font-weight: 600;
          margin-top: 8px;
        }

        /* Video Container */
        .video-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        /* Testimonial Card */
        .testimonial-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 36px rgba(30, 64, 175, 0.15);
        }

        /* Badge */
        .verified-badge {
          position: absolute;
          bottom: -8px;
          right: -8px;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Section Backgrounds */
        .bg-pattern {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.03) 0%, transparent 50%);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stat-number { font-size: 2rem; }
        }

        /* Feature Icon Hover */
        .feature-icon {
          transition: transform 0.3s ease;
        }

        .glass-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }

        /* Company Info Badge */
        .company-badge {
          display: inline-block;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }
      `}</style>

      {/* Header */}
      <header className={`header-main fixed top-0 left-0 right-0 z-50 ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - replace /logo.png with your actual logo path */}
            <a href="#" className="flex items-center gap-3 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Shramic Networks" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback text logo */}
              <div className="hidden">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-black text-brand-primary font-display tracking-tight whitespace-nowrap">
                      Shramic Networks
                    </div>
                    <div className="company-badge text-xs -mt-1">Est. 2025</div>
                  </div>
                </div>
              </div>
            </a>

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#for-workers" className={`nav-link text-sm whitespace-nowrap ${activeSection === 'for-workers' ? 'active' : ''}`}>
                For Workers
              </a>
              <a href="#for-employers" className={`nav-link text-sm whitespace-nowrap ${activeSection === 'for-employers' ? 'active' : ''}`}>
                For Employers
              </a>
              <a href="#why-shramic" className={`nav-link text-sm whitespace-nowrap ${activeSection === 'why-shramic' ? 'active' : ''}`}>
                Why Us
              </a>
              <a href="#testimonials" className={`nav-link text-sm whitespace-nowrap ${activeSection === 'testimonials' ? 'active' : ''}`}>
                Reviews
              </a>
            </nav>

            <div className="hidden lg:block flex-shrink-0">
              <a href="#cta" className="btn-primary whitespace-nowrap">
                Get Started
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex lg:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <a href="#for-workers" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-brand-primary font-semibold">
                For Workers
              </a>
              <a href="#for-employers" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-brand-primary font-semibold">
                For Employers
              </a>
              <a href="#why-shramic" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-brand-primary font-semibold">
                Why Us
              </a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-brand-primary font-semibold">
                Reviews
              </a>
              <a href="#cta" onClick={() => setMobileOpen(false)} className="btn-primary block text-center mt-2">
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-pattern">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-6 reveal">
                <span className="trust-badge">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Trusted by 10,000+ Workers & 500+ Companies
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-primary mb-6 reveal font-display leading-tight">
                India's Most Trusted<br />Blue-Collar Job Platform
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto reveal leading-relaxed">
                Connecting verified skilled workers with quality employers. Find reliable work. Build dependable teams.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 reveal">
                <a href="#for-workers" className="w-full sm:w-auto btn-primary px-8 py-4 text-lg">
                  Find Jobs
                </a>
                <a href="#for-employers" className="w-full sm:w-auto btn-secondary px-8 py-4 text-lg">
                  Hire Workers
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto reveal">
                <div className="stat-card">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Workers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Companies</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>

            <div className="mt-20 max-w-5xl mx-auto reveal">
              <div className="video-container">
                <video
                  className="w-full"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/emp1.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* For Workers Section */}
        <section id="for-workers" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-primary reveal mb-4 font-display">
                आपकी मेहनत, आपका सम्मान
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 reveal font-semibold">
                Secure Jobs. Fair Wages. Verified Companies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Verified Jobs',
                  body: 'Every company is thoroughly vetted for safety and reliability. No fake jobs, no fraud.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  gradient: 'icon-bg-blue',
                },
                {
                  title: '100% Free',
                  body: 'Zero fees for workers. Connect directly with employers and keep your full salary.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  gradient: 'icon-bg-green',
                },
                {
                  title: 'Skill Training',
                  body: 'Access free certified courses to upgrade your skills and earn more.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  gradient: 'icon-bg-cyan',
                },
                {
                  title: 'Financial Benefits',
                  body: 'Build verified work history to access loans, insurance, and PF benefits.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                  gradient: 'icon-bg-amber',
                },
              ].map((card, idx) => (
                <div key={idx} className="glass-card p-8 rounded-2xl reveal">
                  <div className={`${card.gradient} text-white rounded-xl h-16 w-16 flex items-center justify-center mb-6 feature-icon shadow-lg`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Employers Section */}
        <section id="for-employers" className="py-20 md:py-28 bg-brand-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-primary reveal mb-4 font-display">
                Hire Reliable Workers. Reduce Turnover.
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 reveal font-semibold">
                Access verified, skilled talent ready to join your team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Complete Verification',
                  body: 'Background checks, skill validation, and reference verification for every worker.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Lower Attrition',
                  body: 'Hire motivated workers vetted for long-term fit. Save on hiring and training costs.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Skilled Pipeline',
                  body: 'Access workers with certified skills, ready to be productive from day one.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  title: 'Easy Compliance',
                  body: 'All documentation guidance provided for compliant and hassle-free hiring.',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  ),
                },
              ].map((c, i) => (
                <div key={i} className="glass-card p-8 rounded-2xl reveal">
                  <div className="icon-bg-blue text-white rounded-xl h-16 w-16 flex items-center justify-center mb-6 feature-icon shadow-lg">
                    {c.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{c.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Shramic Section */}
        <section id="why-shramic" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="w-full lg:w-1/2 reveal">
                <div className="video-container">
                  <video
                    className="w-full"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="/qt.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              <div className="w-full lg:w-1/2 reveal">
                <div className="inline-block bg-blue-100 text-brand-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
                  OUR MISSION
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-primary mb-6 font-display leading-tight">
                  Quality Over Quantity. Trust Over Speed.
                </h2>
                <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                  <p>Traditional job platforms focus on volume, connecting millions without solving the core challenges of India's blue-collar workforce - trust, verification, and stability.</p>
                  <p className="font-bold text-brand-primary text-xl">Shramic Networks is different. We are a verified ecosystem built on trust.</p>
                  <p>We believe one reliable worker is worth more than ten uncertain hires. Our thorough verification process and commitment to worker dignity creates a positive cycle: respected workers stay longer, motivated teams build stronger companies.</p>
                  <div className="pt-4">
                    <a href="#cta" className="btn-primary inline-block">
                      Join Our Network
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-28 bg-brand-light">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-primary reveal mb-4 font-display">
                Trusted by Workers & Employers
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 reveal font-semibold">
                Real stories from our community.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="testimonial-card reveal">
                <div className="flex items-start mb-6">
                  <div className="relative flex-shrink-0">
                    <img className="w-20 h-20 rounded-xl object-cover border-2 border-blue-200" src="https://placehold.co/100x100/3b82f6/FFFFFF?text=RK" alt="Ramesh Kumar" />
                    <div className="verified-badge">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-xl text-gray-900">Ramesh Kumar</p>
                    <p className="text-brand-primary font-semibold">Skilled Electrician</p>
                    <p className="text-sm text-gray-500 mt-1">Mumbai, Maharashtra</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "पहले काम ढूंढना बहुत मुश्किल था। Shramic के ज़रिए मुझे एक अच्छी कंपनी में नौकरी मिली। अब मेरे पास PF account भी है और मैं अपने परिवार का अच्छे से ख्याल रख पा रहा हूं।"
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="testimonial-card reveal">
                <div className="flex items-start mb-6">
                  <div className="relative flex-shrink-0">
                    <img className="w-20 h-20 rounded-xl object-cover border-2 border-blue-200" src="https://placehold.co/100x100/0891b2/FFFFFF?text=PS" alt="Priya Sharma" />
                    <div className="verified-badge">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-xl text-gray-900">Priya Sharma</p>
                    <p className="text-brand-primary font-semibold">HR Manager</p>
                    <p className="text-sm text-gray-500 mt-1">ABC Logistics Pvt Ltd</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The quality of candidates from Shramic Networks is exceptional. Their verification process is thorough and saves us significant time. Our warehouse attrition has decreased by 40% since we started exclusively hiring through this platform."
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-primary mb-6 reveal font-display">
                Ready to Build a Better Future?
              </h2>
              <p className="text-xl sm:text-2xl text-gray-600 mb-10 reveal leading-relaxed">
                Join thousands of workers and employers who trust Shramic Networks for reliable employment connections.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 reveal">
                <a href="#for-workers" className="w-full sm:w-auto btn-primary px-10 py-4 text-lg">
                  I'm Looking for Work
                </a>
                <a href="#for-employers" className="w-full sm:w-auto btn-secondary px-10 py-4 text-lg">
                  I Want to Hire
                </a>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm">
                  <strong className="text-gray-700">Shramic Networks Private Limited</strong> • Registered 2025 • CIN: [Registration Number]
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-black text-brand-primary font-display">Shramic</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">India's trusted platform for blue-collar employment.</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#for-workers" className="text-gray-600 hover:text-brand-primary text-sm">For Workers</a></li>
                <li><a href="#for-employers" className="text-gray-600 hover:text-brand-primary text-sm">For Employers</a></li>
                <li><a href="#why-shramic" className="text-gray-600 hover:text-brand-primary text-sm">Why Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-brand-primary text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-primary text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-primary text-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-brand-primary text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-primary text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-primary text-sm">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              &copy; 2025 Shramic Networks Private Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default HomePage