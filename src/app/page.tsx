'use client'
import React, { useEffect, useRef, useState } from 'react'

const HomePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const particlesContainerRef = useRef<HTMLDivElement | null>(null)

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Active section detection
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

  // Premium particle system
  useEffect(() => {
    const container = particlesContainerRef.current
    if (!container) return

    let particleCount = 0
    const maxParticles = 40
    const isMobile = window.innerWidth <= 768
    const intervalMs = isMobile ? 500 : 150

    function createParticle() {
      if (particleCount >= maxParticles || !container) return
      const particle = document.createElement('div')
      particle.className = 'particle-orb'
      
      const colors = [
        'linear-gradient(135deg, rgba(251, 191, 36, 0.8) 0%, rgba(245, 158, 11, 0.4) 100%)',
        'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(124, 58, 237, 0.4) 100%)',
        'linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(219, 39, 119, 0.4) 100%)',
        'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.4) 100%)'
      ]
      
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 12 + 6
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}vw`
      particle.style.animationDuration = `${Math.random() * 6 + 8}s`
      particle.style.animationDelay = `${Math.random() * 3}s`
      container.appendChild(particle)
      particleCount++
      
      setTimeout(() => {
        if (particle.parentElement) particle.remove()
        particleCount--
      }, 15000)
    }

    const intervalId = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? window.setInterval(createParticle, intervalMs)
      : null

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  // IntersectionObserver for staggered animations
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = { 
      threshold: 0.1, 
      rootMargin: '0px 0px -100px 0px' 
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap');
        
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
          overflow-x: hidden;
        }

        /* Premium Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 35%, #8b5cf6 70%, #3b82f6 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 8s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Glassmorphism */
        .glass-premium {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(32px) saturate(180%);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(139, 92, 246, 0.08);
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%);
          backdrop-filter: blur(24px) saturate(200%);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(139, 92, 246, 0.12);
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6, #3b82f6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover::before {
          opacity: 1;
        }

        /* Premium Button */
        .btn-premium {
          position: relative;
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%);
          background-size: 200% 200%;
          box-shadow: 0 12px 48px rgba(236, 72, 153, 0.35), 0 4px 16px rgba(245, 158, 11, 0.25);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .btn-premium::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.8s ease;
        }

        .btn-premium:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 24px 72px rgba(236, 72, 153, 0.45), 0 8px 24px rgba(245, 158, 11, 0.35);
          background-position: 100% 50%;
        }

        .btn-premium:hover::before {
          transform: translateX(100%) skewX(-15deg);
        }

        .btn-premium:active {
          transform: translateY(-3px) scale(1.01);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 48px rgba(139, 92, 246, 0.15);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 24px 72px rgba(139, 92, 246, 0.25);
          border-color: rgba(139, 92, 246, 0.4);
          background: rgba(255, 255, 255, 1);
        }

        /* Reveal Animations */
        .reveal {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-left {
          opacity: 0;
          transform: translateX(-80px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-left.animate-in {
          opacity: 1;
          transform: translateX(0);
        }

        .reveal-right {
          opacity: 0;
          transform: translateX(80px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-right.animate-in {
          opacity: 1;
          transform: translateX(0);
        }

        .reveal-scale {
          opacity: 0;
          transform: scale(0.92);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-scale.animate-in {
          opacity: 1;
          transform: scale(1);
        }

        /* Stagger delay for cards */
        .reveal:nth-child(1) { transition-delay: 0s; }
        .reveal:nth-child(2) { transition-delay: 0.1s; }
        .reveal:nth-child(3) { transition-delay: 0.2s; }
        .reveal:nth-child(4) { transition-delay: 0.3s; }

        /* Premium Animations */
        @keyframes float-elegant {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(2deg); }
          66% { transform: translateY(-18px) rotate(-2deg); }
        }

        .float-elegant {
          animation: float-elegant 10s ease-in-out infinite;
        }

        @keyframes pulse-premium {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.12); }
        }

        .pulse-premium {
          animation: pulse-premium 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes particle-rise {
          to { 
            transform: translateY(-130vh) rotate(360deg); 
            opacity: 0; 
          }
        }

        .particle-orb {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          pointer-events: none;
          animation: particle-rise linear forwards;
          filter: blur(3px);
          box-shadow: 0 0 20px currentColor;
        }

        /* Premium Backgrounds */
        .bg-hero {
          background: 
            radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, #ffffff 0%, #fefdfb 100%);
        }

        .bg-section-light {
          background: linear-gradient(180deg, #ffffff 0%, #fdfbf8 50%, #ffffff 100%);
        }

        .bg-section-accent {
          background: 
            radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.06) 0%, transparent 50%),
            linear-gradient(180deg, #ffffff 0%, #faf8ff 50%, #ffffff 100%);
        }

        /* Icon Gradient Backgrounds */
        .icon-gradient-amber {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 12px 32px rgba(251, 191, 36, 0.3);
        }

        .icon-gradient-purple {
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.3);
        }

        .icon-gradient-pink {
          background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
          box-shadow: 0 12px 32px rgba(236, 72, 153, 0.3);
        }

        .icon-gradient-blue {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.3);
        }

        /* Hover Effects */
        .hover-float {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-float:hover {
          transform: translateY(-12px) scale(1.02);
        }

        .icon-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-hover:hover {
          transform: scale(1.15) rotate(5deg);
        }

        /* Premium Typography */
        .font-display {
          font-family: 'Syne', sans-serif;
        }

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        /* Section Dividers */
        .divider-elegant {
          height: 120px;
          background: linear-gradient(to bottom, 
            transparent 0%, 
            rgba(139, 92, 246, 0.03) 20%,
            rgba(236, 72, 153, 0.03) 50%,
            rgba(139, 92, 246, 0.03) 80%,
            transparent 100%);
        }

        /* Header Effects */
        .header-premium {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-scrolled {
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(139, 92, 246, 0.08);
        }

        /* Active Nav Link */
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 80%;
          height: 3px;
          background: linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6);
          border-radius: 2px;
          transition: transform 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        /* Video Container */
        .video-wrapper {
          position: relative;
          border-radius: 2rem;
          overflow: hidden;
        }

        .video-wrapper::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6, #3b82f6);
          border-radius: inherit;
          opacity: 0.6;
          z-index: -1;
        }

        .video-wrapper:hover::before {
          opacity: 1;
        }

        /* Testimonial Cards */
        .testimonial-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
          backdrop-filter: blur(24px);
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 24px 72px rgba(0, 0, 0, 0.08);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-card:hover {
          transform: translateY(-16px) scale(1.02);
          box-shadow: 0 36px 96px rgba(139, 92, 246, 0.2);
        }

        /* Badge */
        .badge-verified {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .gradient-text {
            font-size: 2.25rem;
          }
          
          .particle-orb {
            filter: blur(2px);
          }
        }

        /* Smooth Transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>

      {/* Particles */}
      <div ref={particlesContainerRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Header */}
      <header className={`glass-premium header-premium fixed top-0 left-0 right-0 z-50 ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <a href="#" className="text-3xl sm:text-4xl font-black gradient-text tracking-tight font-display">
                Shramic
              </a>
            </div>

            <nav className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a 
                  href="#for-workers" 
                  className={`nav-link text-gray-700 hover:text-amber-600 px-4 py-2 text-sm font-bold ${activeSection === 'for-workers' ? 'active' : ''}`}
                >
                  For Workers
                </a>
                <a 
                  href="#for-employers" 
                  className={`nav-link text-gray-700 hover:text-purple-600 px-4 py-2 text-sm font-bold ${activeSection === 'for-employers' ? 'active' : ''}`}
                >
                  For Employers
                </a>
                <a 
                  href="#why-shramic" 
                  className={`nav-link text-gray-700 hover:text-pink-600 px-4 py-2 text-sm font-bold ${activeSection === 'why-shramic' ? 'active' : ''}`}
                >
                  Why Shramic?
                </a>
                <a 
                  href="#testimonials" 
                  className={`nav-link text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-bold ${activeSection === 'testimonials' ? 'active' : ''}`}
                >
                  Testimonials
                </a>
              </div>
            </nav>

            <div className="hidden md:block">
              <a href="#cta" className="btn-premium text-white px-8 py-3 rounded-full text-sm font-bold">
                Get Started
              </a>
            </div>

            <div className="flex md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
                className="glass-premium p-2 rounded-xl text-gray-700 hover:text-purple-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass-premium">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <a href="#for-workers" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 font-bold">
                For Workers
              </a>
              <a href="#for-employers" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-bold">
                For Employers
              </a>
              <a href="#why-shramic" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-bold">
                Why Shramic?
              </a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-bold">
                Testimonials
              </a>
              <a href="#cta" onClick={() => setMobileOpen(false)} className="btn-premium block text-center text-white px-4 py-3 rounded-full font-bold mt-2">
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl pulse-premium" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl pulse-premium" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl pulse-premium" style={{ animationDelay: '4s' }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black gradient-text leading-tight mb-8 reveal font-display tracking-tight">
                Building India's Most Trusted Workforce.
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto reveal leading-relaxed font-medium" style={{ transitionDelay: '0.2s' }}>
                We connect thoroughly verified, skilled workers with quality employers. Find a reliable job. Hire a dependable team.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 reveal" style={{ transitionDelay: '0.4s' }}>
                <a href="#for-workers" className="w-full sm:w-auto btn-premium text-white px-12 py-5 rounded-full font-bold text-lg">
                  Find a Job
                </a>
                <a href="#for-employers" className="w-full sm:w-auto btn-secondary text-gray-800 px-12 py-5 rounded-full font-bold text-lg">
                  Post a Job
                </a>
              </div>
            </div>

            <div className="mt-24 reveal-scale float-elegant" style={{ transitionDelay: '0.6s' }}>
              <div className="relative max-w-6xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 rounded-3xl blur-3xl opacity-40 pulse-premium" />
                <div className="video-wrapper relative">
                  <video
                    className="rounded-3xl shadow-2xl mx-auto relative z-10 w-full"
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
          </div>
        </section>

        <div className="divider-elegant" />

        {/* For Workers Section */}
        <section id="for-workers" className="py-32 bg-section-light relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black gradient-text reveal mb-6 font-display tracking-tight">
                आपकी मेहनत, आपका सम्मान।
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 reveal font-bold" style={{ transitionDelay: '0.1s' }}>
                सुरक्षित नौकरी, सही दाम। (Your Hard Work, Your Respect.)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Verified Jobs Only',
                  body: 'Apply with confidence. We vet every company for safety, reliability, and fair treatment. Say goodbye to fake jobs.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  gradient: 'icon-gradient-purple',
                },
                {
                  title: 'No Middlemen, No Fees',
                  body: 'Connect directly with HR. Shramic is always 100% free for workers. You keep the full salary you earn.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  gradient: 'icon-gradient-blue',
                },
                {
                  title: 'Build Your Career',
                  body: 'Access free, certified courses to learn new skills and qualify for higher-paying roles on our platform.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  gradient: 'icon-gradient-pink',
                },
                {
                  title: 'Financial Security',
                  body: 'Build your verified work history to unlock access to fair-interest loans and insurance from partner banks.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                  gradient: 'icon-gradient-amber',
                },
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className="glass-card p-10 rounded-3xl hover-float reveal"
                >
                  <div className={`${card.gradient} text-white rounded-2xl h-20 w-20 flex items-center justify-center mb-8 icon-hover`}>
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-elegant" />

        {/* For Employers Section */}
        <section id="for-employers" className="py-32 bg-section-accent relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black gradient-text reveal mb-6 font-display tracking-tight">
                End the Revolving Door. Hire Talent That Stays.
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 reveal font-bold" style={{ transitionDelay: '0.1s' }}>
                Access a pre-verified, skilled, and motivated workforce.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: '360° Verification',
                  body: 'Go beyond a basic ID check. Background screening, skill validation, and reference checks.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Reduce Attrition',
                  body: 'Hire motivated workers vetted for long-term fit. Save hiring & training costs.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Access a Skilled Pipeline',
                  body: 'Filter candidates with certified skills ready to be productive.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  title: 'Simplified Compliance',
                  body: 'All workers are guided to secure necessary documentation for compliant employment.',
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  ),
                },
              ].map((c, i) => (
                <div 
                  key={i} 
                  className="glass-card p-10 rounded-3xl hover-float reveal"
                >
                  <div className="icon-gradient-blue text-white rounded-2xl h-20 w-20 flex items-center justify-center mb-8 icon-hover">
                    {c.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{c.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider-elegant" />

        {/* Why Shramic Section */}
        <section id="why-shramic" className="py-32 bg-section-light relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2 reveal-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-3xl blur-3xl opacity-40 pulse-premium" />
                  <div className="video-wrapper relative">
                    <video
                      className="rounded-3xl shadow-2xl relative z-10 w-full"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src="/qt.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 reveal-right text-center lg:text-left">
                <span className="gradient-text font-black uppercase tracking-wider text-base mb-4 inline-block">Our Philosophy</span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text mt-2 mb-8 leading-tight font-display tracking-tight">
                  Quality Over Quantity. Reliability Over Speed.
                </h2>
                <div className="space-y-6 text-lg md:text-xl leading-relaxed">
                  <p className="text-gray-700 font-medium">Other job portals are built for volume. They connect millions, but the chaos and uncertainty of the informal market remain. The result is a cycle of high attrition, persistent skill gaps, and endless hiring.</p>
                  <p className="text-amber-600 font-black text-xl md:text-2xl">Shramic is different. We are a curated ecosystem, not a digital crowd.</p>
                  <p className="text-gray-700 font-medium">We believe one great, dependable hire is infinitely more valuable than ten fast, uncertain ones. Our rigorous verification and unwavering commitment to worker well-being create a virtuous cycle: respected workers are motivated, and motivated workers build great companies.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-elegant" />

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 bg-section-accent relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black gradient-text reveal mb-6 font-display tracking-tight">
                Trusted by Workers and Employers
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 reveal font-bold" style={{ transitionDelay: '0.1s' }}>
                Real stories from the Shramic community.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="testimonial-card p-12 rounded-3xl reveal">
                <div className="flex items-start mb-8">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-70" />
                    <img className="w-24 h-24 rounded-2xl object-cover relative z-10" src="https://placehold.co/100x100/f59e0b/FFFFFF?text=RK" alt="Ramesh Kumar" />
                    <div className="badge-verified absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white z-20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <p className="font-black text-3xl text-gray-900 tracking-tight">Ramesh Kumar</p>
                    <p className="text-amber-600 text-lg font-bold mt-1">Skilled Electrician</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-xl leading-relaxed font-medium">
                  "Before Shramic, finding work was stressful and relied on contractors who took a cut. With Shramic, I found a safe job directly with a good company. For the first time, I have a PF account and feel like I have a real career."
                </p>
              </div>

              <div className="testimonial-card p-12 rounded-3xl reveal" style={{ transitionDelay: '0.2s' }}>
                <div className="flex items-start mb-8">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-70" />
                    <img className="w-24 h-24 rounded-2xl object-cover relative z-10" src="https://placehold.co/100x100/8b5cf6/FFFFFF?text=PS" alt="Priya Sharma" />
                    <div className="badge-verified absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white z-20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <p className="font-black text-3xl text-gray-900 tracking-tight">Priya Sharma</p>
                    <p className="text-purple-600 text-lg font-bold mt-1">HR Manager, ABC Logistics</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-xl leading-relaxed font-medium">
                  "The quality of candidates from Shramic is unmatched. The verification is thorough, which saves us time and reduces risk. Our attrition in the warehouse department is down by over 40% since we started using the platform exclusively."
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-elegant" />

        {/* Final CTA Section */}
        <section id="cta" className="py-32 bg-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl pulse-premium" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl pulse-premium" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl pulse-premium" style={{ animationDelay: '4s' }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black gradient-text mb-10 reveal font-display tracking-tight">
              Ready to Build a Better Future of Work?
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 mb-14 max-w-5xl mx-auto reveal leading-relaxed font-medium" style={{ transitionDelay: '0.1s' }}>
              Join the ecosystem of trust. Whether you're looking for a dependable job or a reliable team, start your journey with Shramic today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 reveal" style={{ transitionDelay: '0.2s' }}>
              <a href="#for-workers" className="w-full sm:w-auto btn-premium text-white px-14 py-6 rounded-full font-bold text-xl">
                Find Your Next Job
              </a>
              <a href="#for-employers" className="w-full sm:w-auto btn-secondary text-gray-800 px-14 py-6 rounded-full font-bold text-xl">
                Hire Your Next Star
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-premium border-t-2 border-purple-200">
        <div className="container mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-4xl font-black gradient-text mb-4 font-display">Shramic</h3>
              <p className="text-gray-700 text-lg font-medium leading-relaxed">Building India's Most Trusted Workforce.</p>
            </div>

            <div>
              <h4 className="font-black text-purple-600 tracking-wider uppercase mb-6 text-base">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#for-workers" className="text-gray-600 hover:text-amber-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">For Workers</a></li>
                <li><a href="#for-employers" className="text-gray-600 hover:text-purple-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">For Employers</a></li>
                <li><a href="#why-shramic" className="text-gray-600 hover:text-pink-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">Why Shramic?</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-purple-600 tracking-wider uppercase mb-6 text-base">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-amber-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-purple-600 tracking-wider uppercase mb-6 text-base">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-amber-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 text-base font-medium hover:translate-x-1 inline-block transition-transform">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t-2 border-purple-200 text-center">
            <p className="text-gray-600 text-base font-medium">&copy; 2024 Shramic Networks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default HomePage