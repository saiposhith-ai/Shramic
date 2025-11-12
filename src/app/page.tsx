'use client'
import React, { useEffect, useRef, useState } from 'react'

const HomePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const particlesContainerRef = useRef<HTMLDivElement | null>(null)

  // Particle generator
  useEffect(() => {
    const container = particlesContainerRef.current
    if (!container) return

    let particleCount = 0
    const maxParticles = 25
    const isMobile = window.innerWidth <= 768
    const intervalMs = isMobile ? 800 : 250

    function createParticle() {
      if (particleCount >= maxParticles || !container) return
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full pointer-events-none animate-rise'
      particle.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.4) 50%, transparent 70%)'
      particle.style.filter = 'blur(1px)'
      const size = Math.random() * 8 + 3
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}vw`
      particle.style.animationDuration = `${Math.random() * 4 + 5}s`
      particle.style.animationDelay = `${Math.random() * 2}s`
      container.appendChild(particle)
      particleCount++
      setTimeout(() => {
        if (particle.parentElement) particle.remove()
        particleCount--
      }, 10000)
    }

    const intervalId = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? window.setInterval(createParticle, intervalMs)
      : null

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
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
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const els = document.querySelectorAll<HTMLElement>('.fade-in, .slide-in-left, .slide-in-right')
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

  // Video controls
  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video'))
    const overlays = Array.from(document.querySelectorAll<HTMLElement>('.video-overlay'))

    const listeners: Array<{
      element: Element
      type: string
      fn: EventListenerOrEventListenerObject
    }> = []

    videos.forEach((video, idx) => {
      const overlay = overlays[idx]
      const toggle = () => {
        try {
          if (video.paused) {
            const p = video.play()
            if (p) p.catch(() => {})
          } else {
            video.pause()
          }
        } catch {}
      }

      if (overlay) {
        overlay.addEventListener('click', toggle)
        listeners.push({ element: overlay, type: 'click', fn: toggle })
      }
      video.addEventListener('click', toggle)
      listeners.push({ element: video, type: 'click', fn: toggle })

      const onPlay = () => {
        if (overlay) {
          overlay.style.opacity = '0'
          overlay.style.pointerEvents = 'none'
        }
      }
      const onPauseOrEnd = () => {
        if (overlay) {
          overlay.style.opacity = '1'
          overlay.style.pointerEvents = 'auto'
        }
      }

      video.addEventListener('play', onPlay)
      video.addEventListener('pause', onPauseOrEnd)
      video.addEventListener('ended', onPauseOrEnd)

      listeners.push({ element: video, type: 'play', fn: onPlay })
      listeners.push({ element: video, type: 'pause', fn: onPauseOrEnd })
      listeners.push({ element: video, type: 'ended', fn: onPauseOrEnd })
    })

    return () => {
      listeners.forEach((l) => l.element.removeEventListener(l.type, l.fn))
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .hero-gradient {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 25%, #fbbf24 50%, #ec4899 75%, #8b5cf6 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .text-glow {
          text-shadow: 0 0 30px rgba(217, 119, 6, 0.6), 0 0 50px rgba(251, 191, 36, 0.4);
        }

        .glass {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .glass-strong {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(139, 92, 246, 0.25);
        }

        .btn-ripple {
          position: relative;
          overflow: hidden;
        }

        .btn-ripple::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-ripple:hover::before {
          width: 300px;
          height: 300px;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-in-left {
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .slide-in-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .slide-in-right {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .slide-in-right.visible {
          opacity: 1;
          transform: translateX(0);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        .animate-pulse-ring {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes rise {
          to { transform: translateY(-100vh); opacity: 0; }
        }

        .animate-rise {
          animation: rise linear forwards;
        }

        .gradient-amber {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .gradient-purple-pink {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
        }

        .gradient-blue-purple {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        }

        .bg-gradient-hero {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fbbf24 50%, #f59e0b 75%, #d97706 100%);
        }

        .bg-gradient-light {
          background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #fce7f3 100%);
        }

        .bg-gradient-accent {
          background: linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 50%, #fae8ff 100%);
        }

        .video-overlay {
          transition: opacity 0.3s ease;
        }

        .accent-border {
          border: 3px solid;
          border-image: linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b) 1;
        }
      `}</style>

      {/* Particles */}
      <div ref={particlesContainerRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex-shrink-0">
              <a href="#" className="text-2xl sm:text-3xl font-black text-glow hero-gradient tracking-tight">
                Shramic
              </a>
            </div>

            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
                <a href="#for-workers" className="text-gray-700 hover:text-amber-600 px-2 lg:px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 hover:bg-amber-100">
                  For Workers
                </a>
                <a href="#for-employers" className="text-gray-700 hover:text-purple-600 px-2 lg:px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 hover:bg-purple-100">
                  For Employers
                </a>
                <a href="#why-shramic" className="text-gray-700 hover:text-pink-600 px-2 lg:px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 hover:bg-pink-100">
                  Why Shramic?
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 hover:bg-blue-100">
                  Testimonials
                </a>
              </div>
            </nav>

            <div className="hidden md:block">
              <a href="#cta" className="gradient-amber text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full text-sm font-bold btn-ripple relative z-10 shadow-lg shadow-amber-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300">
                Get Started
              </a>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-expanded={mobileOpen}
                aria-label="Open main menu"
                className="glass inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass">
              <a href="#for-workers" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-bold transition-all duration-300">
                For Workers
              </a>
              <a href="#for-employers" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-bold transition-all duration-300">
                For Employers
              </a>
              <a href="#why-shramic" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-bold transition-all duration-300">
                Why Shramic?
              </a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-bold transition-all duration-300">
                Testimonials
              </a>
              <a href="#cta" onClick={() => setMobileOpen(false)} className="gradient-amber text-white block px-3 py-3 rounded-full text-base font-bold text-center mt-2 btn-ripple">
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 md:pb-32 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-transparent to-blue-500/30 animate-pulse-ring" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black hero-gradient leading-tight mb-4 sm:mb-6 fade-in tracking-tight">
                Building India's Most Trusted Workforce.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 mb-8 sm:mb-12 max-w-3xl mx-auto fade-in leading-relaxed font-bold tracking-tight">
                We connect thoroughly verified, skilled workers with quality employers. Find a reliable job. Hire a dependable team.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 fade-in">
                <a href="#for-workers" className="w-full sm:w-auto gradient-amber text-white px-6 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg btn-ripple shadow-2xl shadow-amber-500/50 hover:-translate-y-1 hover:shadow-amber-500/60 transition-all duration-300 relative z-10">
                  Find a Job
                </a>
                <a href="#for-employers" className="w-full sm:w-auto glass text-gray-800 px-6 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg btn-ripple shadow-2xl hover:-translate-y-1 hover:shadow-purple-500/30 transition-all duration-300 relative z-10">
                  Post a Job
                </a>
              </div>
            </div>

            <div className="mt-12 sm:mt-20 fade-in animate-float">
              <div className="relative max-w-5xl mx-auto">
                <div className="absolute inset-0 bg-purple-500 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-40 animate-pulse-ring" />
                <div className="video-container relative">
                  <video
                    className="rounded-2xl sm:rounded-3xl shadow-2xl mx-auto relative z-10 accent-border w-full"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://placehold.co/1400x700/8b5cf6/ffffff?text=Loading+Video"
                  >
                    <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 video-overlay">
                  <button className="bg-white/90 backdrop-blur-sm rounded-full p-4 sm:p-6 hover:bg-white transition-all duration-300 group shadow-xl" aria-label="Play video">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

        {/* For Workers */}
        <section id="for-workers" className="py-16 sm:py-24 md:py-32 bg-gradient-light relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient fade-in mb-4 tracking-tight">
                आपकी मेहनत, आपका सम्मान।
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 fade-in font-bold tracking-tight">
                सुरक्षित नौकरी, सही दाम। (Your Hard Work, Your Respect. Secure Job, Fair Price.)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  title: 'Verified Jobs Only',
                  body: 'Apply with confidence. We vet every company for safety, reliability, and fair treatment. Say goodbye to fake jobs.',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  gradient: 'gradient-purple-pink',
                },
                {
                  title: 'No Middlemen, No Fees',
                  body: 'Connect directly with HR. Shramic is always 100% free for workers. You keep the full salary you earn.',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  gradient: 'gradient-blue-purple',
                },
                {
                  title: 'Build Your Career',
                  body: 'Access free, certified courses to learn new skills and qualify for higher-paying roles on our platform.',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  gradient: 'gradient-purple-pink',
                },
                {
                  title: 'Financial Security',
                  body: 'Build your verified work history to unlock access to fair-interest loans and insurance from partner banks.',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                  gradient: 'gradient-blue-purple',
                },
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className="glass-strong p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-3 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 fade-in relative overflow-hidden" 
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div className={`${card.gradient} text-white rounded-xl sm:rounded-2xl h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mb-4 sm:mb-6 shadow-xl`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-semibold">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent transform rotate-180" />

        {/* For Employers */}
        <section id="for-employers" className="py-16 sm:py-24 md:py-32 bg-gradient-accent relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient fade-in mb-4 tracking-tight">
                End the Revolving Door. Hire Talent That Stays.
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 fade-in font-bold tracking-tight">
                Access a pre-verified, skilled, and motivated workforce.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  title: '360° Verification',
                  body: 'Go beyond a basic ID check. Background screening, skill validation, and reference checks.',
                },
                {
                  title: 'Reduce Attrition',
                  body: 'Hire motivated workers vetted for long-term fit. Save hiring & training costs.',
                },
                {
                  title: 'Access a Skilled Pipeline',
                  body: 'Filter candidates with certified skills ready to be productive.',
                },
                {
                  title: 'Simplified Compliance',
                  body: 'All workers are guided to secure necessary documentation for compliant employment.',
                },
              ].map((c, i) => (
                <div 
                  key={i} 
                  className="glass-strong p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-3 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 fade-in relative overflow-hidden" 
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="gradient-blue-purple text-white rounded-xl sm:rounded-2xl h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center mb-4 sm:mb-6 shadow-xl">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">{c.title}</h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-semibold">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

        {/* Why Shramic */}
        <section id="why-shramic" className="py-16 sm:py-24 md:py-32 bg-gradient-light relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
              <div className="w-full lg:w-1/2 slide-in-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-30" />
                  <div className="video-container relative">
                    <video
                      className="rounded-2xl sm:rounded-3xl shadow-2xl relative z-10 accent-border w-full"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster="https://placehold.co/800x600/ec4899/ffffff?text=Loading+Video"
                    >
                      <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
                    </video>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 video-overlay">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 sm:p-4 hover:bg-white transition-all duration-300 group shadow-xl" aria-label="Play video">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 slide-in-right text-center lg:text-left" style={{ transitionDelay: '0.2s' }}>
                <span className="text-purple-600 font-black uppercase tracking-wider text-sm sm:text-lg">Our Philosophy</span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient mt-4 mb-4 sm:mb-6 leading-tight tracking-tight">
                  Quality Over Quantity. Reliability Over Speed.
                </h2>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl leading-relaxed">
                  <p className="text-gray-800 font-semibold">Other job portals are built for volume. They connect millions, but the chaos and uncertainty of the informal market remain. The result is a cycle of high attrition, persistent skill gaps, and endless hiring.</p>
                  <p className="text-amber-700 font-black text-lg sm:text-xl md:text-2xl">Shramic is different. We are a curated ecosystem, not a digital crowd.</p>
                  <p className="text-gray-800 font-semibold">We believe one great, dependable hire is infinitely more valuable than ten fast, uncertain ones. Our rigorous verification and unwavering commitment to worker well-being create a virtuous cycle: respected workers are motivated, and motivated workers build great companies. We're not just filling positions; we're building the foundation of a more reliable workforce.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent transform rotate-180" />

        {/* Testimonials */}
        <section id="testimonials" className="py-16 sm:py-24 md:py-32 bg-gradient-accent relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient fade-in mb-4 tracking-tight">
                Trusted by Workers and Employers
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 fade-in font-bold tracking-tight">
                Real stories from the Shramic community.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <div className="glass-strong p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl fade-in hover:-translate-y-3 hover:scale-105 hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border-2 border-purple-500/20">
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover accent-border" src="https://placehold.co/100x100/f59e0b/FFFFFF?text=RK" alt="Worker photo" />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-white shadow-lg" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-xl sm:text-2xl text-gray-900 tracking-tight">Ramesh Kumar</p>
                    <p className="text-amber-700 text-base sm:text-lg font-bold">Skilled Electrician</p>
                  </div>
                </div>
                <p className="text-gray-800 italic text-base sm:text-lg md:text-xl leading-relaxed text-center sm:text-left font-semibold">
                  "Before Shramic, finding work was stressful and relied on contractors who took a cut. With Shramic, I found a safe job directly with a good company. For the first time, I have a PF account and feel like I have a real career."
                </p>
              </div>

              <div className="glass-strong p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl fade-in hover:-translate-y-3 hover:scale-105 hover:shadow-purple-500/25 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border-2 border-purple-500/20">
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    <img className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover accent-border" src="https://placehold.co/100x100/8b5cf6/FFFFFF?text=PS" alt="Employer photo" />
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow-lg" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-xl sm:text-2xl text-gray-900 tracking-tight">Priya Sharma</p>
                    <p className="text-purple-700 text-base sm:text-lg font-bold">HR Manager, ABC Logistics</p>
                  </div>
                </div>
                <p className="text-gray-800 italic text-base sm:text-lg md:text-xl leading-relaxed text-center sm:text-left font-semibold">
                  "The quality of candidates from Shramic is unmatched. The verification is thorough, which saves us time and reduces risk. Our attrition in the warehouse department is down by over 40% since we started using the platform exclusively."
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

        {/* Final CTA */}
        <section id="cta" className="py-16 sm:py-24 md:py-32 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-70">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-transparent to-blue-500/30 animate-pulse-ring" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient mb-6 sm:mb-8 fade-in tracking-tight">
              Ready to Build a Better Future of Work?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 mb-8 sm:mb-12 max-w-3xl mx-auto fade-in leading-relaxed font-bold tracking-tight">
              Join the ecosystem of trust. Whether you're looking for a dependable job or a reliable team, start your journey with Shramic today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 fade-in">
              <a href="#for-workers" className="w-full sm:w-auto gradient-amber text-white px-8 sm:px-12 py-4 sm:py-6 rounded-full font-bold text-lg sm:text-xl btn-ripple shadow-2xl shadow-amber-500/50 hover:-translate-y-1 hover:shadow-amber-500/60 transition-all duration-300 relative z-10">
                Find Your Next Job
              </a>
              <a href="#for-employers" className="w-full sm:w-auto glass text-gray-800 px-8 sm:px-12 py-4 sm:py-6 rounded-full font-bold text-lg sm:text-xl btn-ripple shadow-2xl hover:-translate-y-1 hover:shadow-purple-500/30 transition-all duration-300 relative z-10">
                Hire Your Next Star
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass border-t-2 border-purple-300">
        <div className="container mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-2xl sm:text-3xl font-black hero-gradient mb-3 sm:mb-4">Shramic</h3>
              <p className="text-gray-800 text-base sm:text-lg font-bold">Building India's Most Trusted Workforce.</p>
            </div>

            <div>
              <h4 className="font-black text-purple-700 tracking-wider uppercase mb-4 sm:mb-6 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#for-workers" className="text-gray-700 hover:text-amber-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">For Workers</a></li>
                <li><a href="#for-employers" className="text-gray-700 hover:text-purple-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">For Employers</a></li>
                <li><a href="#why-shramic" className="text-gray-700 hover:text-pink-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">Why Shramic?</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-purple-700 tracking-wider uppercase mb-4 sm:mb-6 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-gray-700 hover:text-amber-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">About Us</a></li>
                <li><a href="#" className="text-gray-700 hover:text-purple-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">Careers</a></li>
                <li><a href="#" className="text-gray-700 hover:text-pink-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-purple-700 tracking-wider uppercase mb-4 sm:mb-6 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#" className="text-gray-700 hover:text-amber-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-700 hover:text-purple-600 transition-colors duration-300 text-sm sm:text-lg font-semibold">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-purple-300 text-center text-gray-700">
            <p className="text-sm sm:text-lg font-bold">&copy; 2024 Shramic Networks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default HomePage