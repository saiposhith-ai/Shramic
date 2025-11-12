'use client'
import React, { useEffect, useRef, useState } from 'react'

const HomePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const particlesContainerRef = useRef<HTMLDivElement | null>(null)

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Enhanced particle generator with light theme
  useEffect(() => {
    const container = particlesContainerRef.current
    if (!container) return

    let particleCount = 0
    const maxParticles = 30
    const isMobile = window.innerWidth <= 768
    const intervalMs = isMobile ? 600 : 200

    function createParticle() {
      if (particleCount >= maxParticles || !container) return
      const particle = document.createElement('div')
      particle.className = 'absolute rounded-full pointer-events-none animate-rise'
      
      const colors = [
        'radial-gradient(circle, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 70%)',
        'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(124, 58, 237, 0.3) 50%, transparent 70%)',
        'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(219, 39, 119, 0.3) 50%, transparent 70%)',
        'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.3) 50%, transparent 70%)'
      ]
      
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      particle.style.filter = 'blur(2px)'
      const size = Math.random() * 10 + 4
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}vw`
      particle.style.animationDuration = `${Math.random() * 5 + 6}s`
      particle.style.animationDelay = `${Math.random() * 2}s`
      container.appendChild(particle)
      particleCount++
      setTimeout(() => {
        if (particle.parentElement) particle.remove()
        particleCount--
      }, 12000)
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
        }
      })
    }, observerOptions)

    const els = document.querySelectorAll<HTMLElement>('.fade-in, .slide-in-left, .slide-in-right, .scale-in')
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #fefefe;
        }

        .hero-gradient {
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 35%, #8b5cf6 70%, #3b82f6 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 6s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .text-glow {
          text-shadow: 0 0 40px rgba(251, 191, 36, 0.3), 0 0 80px rgba(236, 72, 153, 0.2);
        }

        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
        }

        .glass-strong {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(24px) saturate(200%);
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.1), 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .card-elegant {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 2px solid transparent;
          background-clip: padding-box;
          position: relative;
        }

        .card-elegant::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .card-elegant:hover::before {
          opacity: 1;
        }

        .btn-ripple {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .btn-ripple::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .btn-ripple:hover::before {
          width: 400px;
          height: 400px;
        }

        .btn-elegant {
          position: relative;
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
          box-shadow: 0 10px 40px rgba(236, 72, 153, 0.3), 0 4px 12px rgba(245, 158, 11, 0.2);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .btn-elegant:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 60px rgba(236, 72, 153, 0.4), 0 8px 24px rgba(245, 158, 11, 0.3);
        }

        .btn-elegant:active {
          transform: translateY(-2px) scale(0.98);
        }

        .fade-in {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-in-left {
          opacity: 0;
          transform: translateX(-80px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-in-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .slide-in-right {
          opacity: 0;
          transform: translateX(80px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-in-right.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .scale-in.visible {
          opacity: 1;
          transform: scale(1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-25px) rotate(1deg); }
          66% { transform: translateY(-15px) rotate(-1deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes rise {
          to { transform: translateY(-120vh); opacity: 0; }
        }

        .animate-rise {
          animation: rise linear forwards;
        }

        .gradient-amber {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
        }

        .gradient-purple-pink {
          background: linear-gradient(135deg, #a78bfa 0%, #c084fc 50%, #ec4899 100%);
        }

        .gradient-blue-purple {
          background: linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%);
        }

        .bg-gradient-hero {
          background: linear-gradient(180deg, 
            #fefefe 0%, 
            #fef3c7 15%, 
            #fde68a 30%, 
            #fef3c7 50%,
            #fefefe 100%);
          position: relative;
        }

        .bg-gradient-light {
          background: linear-gradient(180deg, #fefefe 0%, #fef9f3 50%, #fefefe 100%);
        }

        .bg-gradient-accent {
          background: linear-gradient(180deg, #fefefe 0%, #f5f3ff 30%, #fae8ff 70%, #fefefe 100%);
        }

        .video-overlay {
          transition: opacity 0.4s ease;
        }

        .accent-border {
          border: 3px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6) border-box;
        }

        .icon-bounce:hover {
          animation: bounce 0.6s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .hover-lift {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 70px rgba(139, 92, 246, 0.15), 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .section-divider {
          height: 100px;
          background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
        }

        .text-gradient-secondary {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 768px) {
          .hero-gradient {
            font-size: 2.5rem;
          }
        }

        .header-scrolled {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .playfair {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* Particles */}
      <div ref={particlesContainerRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Header */}
      <header className={`glass fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex-shrink-0">
              <a href="#" className="text-2xl sm:text-3xl font-black text-glow hero-gradient tracking-tight playfair">
                Shramic
              </a>
            </div>

            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2 lg:space-x-6">
                <a href="#for-workers" className="text-gray-700 hover:text-amber-600 px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50">
                  For Workers
                </a>
                <a href="#for-employers" className="text-gray-700 hover:text-purple-600 px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50">
                  For Employers
                </a>
                <a href="#why-shramic" className="text-gray-700 hover:text-pink-600 px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50">
                  Why Shramic?
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 lg:px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                  Testimonials
                </a>
              </div>
            </nav>

            <div className="hidden md:block">
              <a href="#cta" className="btn-elegant text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-full text-sm font-bold btn-ripple relative z-10">
                Get Started
              </a>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-expanded={mobileOpen}
                aria-label="Open main menu"
                className="glass inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass">
              <a href="#for-workers" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-xl text-base font-bold transition-all duration-300 hover:bg-amber-50">
                For Workers
              </a>
              <a href="#for-employers" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-xl text-base font-bold transition-all duration-300 hover:bg-purple-50">
                For Employers
              </a>
              <a href="#why-shramic" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-xl text-base font-bold transition-all duration-300 hover:bg-pink-50">
                Why Shramic?
              </a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-xl text-base font-bold transition-all duration-300 hover:bg-blue-50">
                Testimonials
              </a>
              <a href="#cta" onClick={() => setMobileOpen(false)} className="btn-elegant text-white block px-3 py-3 rounded-full text-base font-bold text-center mt-2 btn-ripple">
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-24 sm:pt-32 md:pt-40 pb-20 sm:pb-28 md:pb-36 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-40 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black hero-gradient leading-tight mb-6 sm:mb-8 fade-in tracking-tight playfair">
                Building India's Most Trusted Workforce.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 sm:mb-14 max-w-3xl mx-auto fade-in leading-relaxed font-medium">
                We connect thoroughly verified, skilled workers with quality employers. Find a reliable job. Hire a dependable team.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 fade-in">
                <a href="#for-workers" className="w-full sm:w-auto btn-elegant text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg btn-ripple relative z-10">
                  Find a Job
                </a>
                <a href="#for-employers" className="w-full sm:w-auto glass text-gray-800 px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg btn-ripple shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-10 hover:bg-white">
                  Post a Job
                </a>
              </div>
            </div>

            <div className="mt-16 sm:mt-24 fade-in animate-float">
              <div className="relative max-w-5xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 rounded-3xl sm:rounded-[2rem] blur-2xl sm:blur-3xl opacity-30 animate-pulse-glow" />
                <div className="video-container relative">
  <video
    className="rounded-3xl sm:rounded-[2rem] shadow-2xl mx-auto relative z-10 accent-border w-full"
    autoPlay
    muted
    loop
    playsInline
    poster="https://placehold.co/1400x700/8b5cf6/ffffff?text=Loading+Video"
  >
    <source src="/emp1.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>


                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 video-overlay">
                  <button className="glass-strong rounded-full p-5 sm:p-7 hover:scale-110 transition-all duration-300 group shadow-2xl" aria-label="Play video">
                    <svg className="w-10 h-10 sm:w-14 sm:h-14 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* For Workers */}
        <section id="for-workers" className="py-20 sm:py-28 md:py-36 bg-gradient-light relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient fade-in mb-4 tracking-tight playfair">
                आपकी मेहनत, आपका सम्मान।
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 fade-in font-semibold">
                सुरक्षित नौकरी, सही दाम। (Your Hard Work, Your Respect.)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  title: 'Verified Jobs Only',
                  body: 'Apply with confidence. We vet every company for safety, reliability, and fair treatment. Say goodbye to fake jobs.',
                  icon: (
                    <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  gradient: 'gradient-purple-pink',
                },
                {
                  title: 'No Middlemen, No Fees',
                  body: 'Connect directly with HR. Shramic is always 100% free for workers. You keep the full salary you earn.',
                  icon: (
                    <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  gradient: 'gradient-blue-purple',
                },
                {
                  title: 'Build Your Career',
                  body: 'Access free, certified courses to learn new skills and qualify for higher-paying roles on our platform.',
                  icon: (
                    <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  gradient: 'gradient-purple-pink',
                },
                {
                  title: 'Financial Security',
                  body: 'Build your verified work history to unlock access to fair-interest loans and insurance from partner banks.',
                  icon: (
                    <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                  gradient: 'gradient-blue-purple',
                },
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className="card-elegant p-7 sm:p-9 rounded-3xl hover-lift scale-in" 
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className={`${card.gradient} text-white rounded-2xl h-14 w-14 sm:h-18 sm:w-18 flex items-center justify-center mb-5 sm:mb-7 shadow-xl icon-bounce`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* For Employers */}
        <section id="for-employers" className="py-20 sm:py-28 md:py-36 bg-gradient-accent relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient fade-in mb-4 tracking-tight playfair">
                End the Revolving Door. Hire Talent That Stays.
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 fade-in font-semibold">
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
                  className="card-elegant p-7 sm:p-9 rounded-3xl hover-lift scale-in" 
                  style={{ transitionDelay: `${i * 0.15}s` }}
                >
                  <div className="gradient-blue-purple text-white rounded-2xl h-14 w-14 sm:h-18 sm:w-18 flex items-center justify-center mb-5 sm:mb-7 shadow-xl icon-bounce">
                    <svg className="w-7 h-7 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">{c.title}</h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Why Shramic */}
        <section id="why-shramic" className="py-20 sm:py-28 md:py-36 bg-gradient-light relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20">
              <div className="w-full lg:w-1/2 slide-in-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-3xl blur-3xl opacity-40 animate-pulse-glow" />
                  <div className="video-container relative">
                    <video
                      className="rounded-3xl sm:rounded-[2rem] shadow-2xl relative z-10 accent-border w-full"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster="https://placehold.co/800x600/ec4899/ffffff?text=Loading+Video"
                    >
                      <source src="/qt.mp4" type="video/mp4" />
                    </video>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 video-overlay">
                    <button className="glass-strong rounded-full p-4 sm:p-5 hover:scale-110 transition-all duration-300 group shadow-2xl" aria-label="Play video">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 slide-in-right text-center lg:text-left" style={{ transitionDelay: '0.2s' }}>
                <span className="text-gradient-secondary font-black uppercase tracking-wider text-sm sm:text-base mb-4 inline-block">Our Philosophy</span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient mt-2 mb-6 sm:mb-8 leading-tight tracking-tight playfair">
                  Quality Over Quantity. Reliability Over Speed.
                </h2>
                <div className="space-y-5 sm:space-y-7 text-base sm:text-lg md:text-xl leading-relaxed">
                  <p className="text-gray-700 font-medium">Other job portals are built for volume. They connect millions, but the chaos and uncertainty of the informal market remain. The result is a cycle of high attrition, persistent skill gaps, and endless hiring.</p>
                  <p className="text-amber-600 font-black text-lg sm:text-xl md:text-2xl">Shramic is different. We are a curated ecosystem, not a digital crowd.</p>
                  <p className="text-gray-700 font-medium">We believe one great, dependable hire is infinitely more valuable than ten fast, uncertain ones. Our rigorous verification and unwavering commitment to worker well-being create a virtuous cycle: respected workers are motivated, and motivated workers build great companies.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Testimonials */}
        <section id="testimonials" className="py-20 sm:py-28 md:py-36 bg-gradient-accent relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black hero-gradient fade-in mb-4 tracking-tight playfair">
                Trusted by Workers and Employers
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 fade-in font-semibold">
                Real stories from the Shramic community.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <div className="card-elegant p-8 sm:p-10 lg:p-12 rounded-3xl shadow-2xl fade-in hover-lift backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-60" />
                    <img className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover relative z-10 accent-border" src="https://placehold.co/100x100/f59e0b/FFFFFF?text=RK" alt="Worker photo" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white shadow-xl z-20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">Ramesh Kumar</p>
                    <p className="text-amber-600 text-base sm:text-lg font-bold mt-1">Skilled Electrician</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-base sm:text-lg md:text-xl leading-relaxed text-center sm:text-left font-medium">
                  "Before Shramic, finding work was stressful and relied on contractors who took a cut. With Shramic, I found a safe job directly with a good company. For the first time, I have a PF account and feel like I have a real career."
                </p>
              </div>

              <div className="card-elegant p-8 sm:p-10 lg:p-12 rounded-3xl shadow-2xl fade-in hover-lift backdrop-blur-xl" style={{ transitionDelay: '0.15s' }}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-60" />
                    <img className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover relative z-10 accent-border" src="https://placehold.co/100x100/8b5cf6/FFFFFF?text=PS" alt="Employer photo" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-xl z-20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">Priya Sharma</p>
                    <p className="text-purple-600 text-base sm:text-lg font-bold mt-1">HR Manager, ABC Logistics</p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-base sm:text-lg md:text-xl leading-relaxed text-center sm:text-left font-medium">
                  "The quality of candidates from Shramic is unmatched. The verification is thorough, which saves us time and reduces risk. Our attrition in the warehouse department is down by over 40% since we started using the platform exclusively."
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Final CTA */}
        <section id="cta" className="py-20 sm:py-28 md:py-36 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
            <div className="absolute top-40 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black hero-gradient mb-8 sm:mb-10 fade-in tracking-tight playfair">
              Ready to Build a Better Future of Work?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-10 sm:mb-14 max-w-4xl mx-auto fade-in leading-relaxed font-medium">
              Join the ecosystem of trust. Whether you're looking for a dependable job or a reliable team, start your journey with Shramic today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-8 fade-in">
              <a href="#for-workers" className="w-full sm:w-auto btn-elegant text-white px-10 sm:px-14 py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl btn-ripple relative z-10">
                Find Your Next Job
              </a>
              <a href="#for-employers" className="w-full sm:w-auto glass text-gray-800 px-10 sm:px-14 py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl btn-ripple shadow-2xl hover:-translate-y-1 hover:shadow-3xl transition-all duration-300 relative z-10 hover:bg-white">
                Hire Your Next Star
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass border-t-2 border-purple-200">
        <div className="container mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-3xl sm:text-4xl font-black hero-gradient mb-4 playfair">Shramic</h3>
              <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed">Building India's Most Trusted Workforce.</p>
            </div>

            <div>
              <h4 className="font-black text-purple-600 tracking-wider uppercase mb-5 sm:mb-7 text-sm sm:text-base">Platform</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li><a href="#for-workers" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">For Workers</a></li>
                <li><a href="#for-employers" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">For Employers</a></li>
                <li><a href="#why-shramic" className="text-gray-600 hover:text-pink-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">Why Shramic?</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-purple-600 tracking-wider uppercase mb-5 sm:mb-7 text-sm sm:text-base">Company</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-pink-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-purple-600 tracking-wider uppercase mb-5 sm:mb-7 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-300 text-sm sm:text-base font-medium hover:translate-x-1 inline-block transition-transform">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t-2 border-purple-200 text-center">
            <p className="text-gray-600 text-sm sm:text-base font-medium">&copy; 2024 Shramic Networks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default HomePage