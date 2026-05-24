import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, Trophy, Globe, Users, Zap, Star, ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import ScrollReveal from './components/ScrollReveal'
import Reveal from './components/Reveal'
import NavItem from './components/NavItem'

const VIDEO_URL = '/wisa-bag.mp4'
const NAV_LINKS = ['Clubs', 'Matches', 'Players', 'Competitions', 'Academy']

// ─── WISA Logo SVG ──────────────────────────────────────────────────────────
function WISALogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size * 2.8} height={size} viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagon mark */}
      <polygon
        points="14,2 24,2 29,11 24,20 14,20 9,11"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      />
      <polygon
        points="14,6 22,6 26,11 22,16 14,16 10,11"
        fill="white"
        opacity="0.15"
      />
      <line x1="9" y1="11" x2="29" y2="11" stroke="white" strokeWidth="1" opacity="0.4" />
      <line x1="14" y1="2" x2="14" y2="20" stroke="white" strokeWidth="1" opacity="0.4" />
      <line x1="24" y1="2" x2="24" y2="20" stroke="white" strokeWidth="1" opacity="0.4" />
      {/* WISA wordmark */}
      <text x="36" y="16" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="14" fill="white" letterSpacing="3">WISA</text>
      <text x="36" y="27" fontFamily="JetBrains Mono, monospace" fontWeight="400" fontSize="5.5" fill="rgba(255,255,255,0.45)" letterSpacing="2.5">WORLD SOCCER</text>
    </svg>
  )
}

// ─── Globe SVG (animated) ─────────────────────────────────────────────────
function GlobeSVG() {
  return (
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="globeGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
        </radialGradient>
        <clipPath id="globeClip">
          <circle cx="140" cy="140" r="112" />
        </clipPath>
      </defs>

      {/* Outer glow ring */}
      <circle cx="140" cy="140" r="125" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <circle cx="140" cy="140" r="118" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

      {/* Main globe sphere */}
      <circle cx="140" cy="140" r="112" fill="url(#globeGrad)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

      {/* Latitude lines */}
      <g clipPath="url(#globeClip)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6">
        <ellipse cx="140" cy="140" rx="112" ry="22" />
        <ellipse cx="140" cy="140" rx="112" ry="55" />
        <ellipse cx="140" cy="140" rx="112" ry="88" />
        <line x1="28" y1="140" x2="252" y2="140" />
      </g>

      {/* Rotating longitude lines group */}
      <g clipPath="url(#globeClip)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" style={{
        transformOrigin: '140px 140px',
        animation: 'spin 18s linear infinite',
      }}>
        <ellipse cx="140" cy="140" rx="28" ry="112" />
        <ellipse cx="140" cy="140" rx="60" ry="112" />
        <ellipse cx="140" cy="140" rx="95" ry="112" />
        <line x1="140" y1="28" x2="140" y2="252" />
      </g>

      {/* Continent blobs */}
      <g clipPath="url(#globeClip)" fill="rgba(255,255,255,0.06)">
        <ellipse cx="105" cy="118" rx="28" ry="18" transform="rotate(-15 105 118)" />
        <ellipse cx="165" cy="110" rx="22" ry="14" transform="rotate(10 165 110)" />
        <ellipse cx="155" cy="155" rx="18" ry="12" transform="rotate(5 155 155)" />
        <ellipse cx="95" cy="160" rx="14" ry="9" />
        <ellipse cx="200" cy="130" rx="10" ry="7" transform="rotate(-20 200 130)" />
        <ellipse cx="125" cy="170" rx="8" ry="12" />
      </g>

      {/* Pulse dot — match location marker */}
      <circle cx="160" cy="125" r="3" fill="white" opacity="0.9" />
      <circle cx="160" cy="125" r="6" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4">
        <animate attributeName="r" values="4;10;4" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Shine overlay */}
      <ellipse cx="110" cy="100" rx="40" ry="28" fill="rgba(255,255,255,0.03)" transform="rotate(-30 110 100)" />
    </svg>
  )
}

// ─── Stat Counter Item ────────────────────────────────────────────────────
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-3xl font-semibold tracking-tight text-white">{value}</span>
      <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
    </div>
  )
}

// ─── Feature Card ────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  delay?: number
}) {
  return (
    <Reveal delay={delay}>
      <div
        className="group relative p-6 rounded-sm overflow-hidden cursor-default"
        style={{
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
          transition: 'border-color 0.4s ease, background 0.4s ease',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.15)'
          el.style.background = 'rgba(255,255,255,0.05)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.07)'
          el.style.background = 'rgba(255,255,255,0.02)'
        }}
      >
        <div className="mb-4 w-10 h-10 flex items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <Icon size={18} className="text-white" />
        </div>
        <h3 className="text-sm font-semibold tracking-wide mb-2 text-white">{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{description}</p>
        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: 'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.06) 0%, transparent 70%)' }} />
      </div>
    </Reveal>
  )
}

// ─── Footer Link ────────────────────────────────────────────────────────
function FooterLink({ label }: { label: string }) {
  return (
    <li>
      <a
        href="#"
        className="text-sm transition-colors duration-200 hover:text-white"
        style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}
      >
        {label}
      </a>
    </li>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [arrowCycle, setArrowCycle] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const screen3Ref = useRef<HTMLElement>(null)

  const { scrollY } = useScroll()
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150])

  // ── Scroll-driven video with seeking guard ──────────────────────────────
  const handleScroll = useCallback(() => {
    const video = videoRef.current
    const footer = screen3Ref.current
    if (!video || !footer || !video.duration) return
    if (video.seeking) return // Guard: skip if already seeking

    const maxScroll = footer.offsetTop - window.innerHeight * 0.2
    const fraction = Math.max(0, Math.min(1, window.scrollY / maxScroll))
    video.currentTime = fraction * video.duration
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // ── Loader fade ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="bg-black text-white"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.6s ease',
        minHeight: '300vh',
      }}
    >

      {/* ── 1. FIXED VIDEO BACKGROUND ──────────────────────────────────────── */}
      <div
        ref={videoContainerRef}
        className="fixed inset-0 bg-black"
        style={{ zIndex: 0 }}
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.85) 100%)',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* ── 2. FIXED HEADER ────────────────────────────────────────────────── */}
      <motion.header
        style={{ y: headerY, zIndex: 20 }}
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-6"
      >
        {/* Glass backdrop for header */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
          }}
        />

        {/* WISA Logo */}
        <a href="#" style={{ textDecoration: 'none' }}>
          <WISALogo size={32} />
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavItem key={link} label={link} />
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#"
          className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest uppercase"
          style={{
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '10px 20px',
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.85)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(20px)',
            background: 'rgba(255,255,255,0.04)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(255,255,255,0.12)'
            el.style.borderColor = 'rgba(255,255,255,0.4)'
            el.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'rgba(255,255,255,0.04)'
            el.style.borderColor = 'rgba(255,255,255,0.2)'
            el.style.color = 'rgba(255,255,255,0.85)'
          }}
        >
          Buy Match Pass
          <ChevronRight size={12} />
        </a>
      </motion.header>

      {/* ── 3. SCROLLABLE CONTENT LAYER ────────────────────────────────────── */}
      <div className="relative" style={{ zIndex: 10, pointerEvents: 'none' }}>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="h-screen"
          style={{ pointerEvents: 'auto' }}
        >
          {/* 12-column grid layout */}
          <div
            className="h-full grid grid-cols-12 items-end"
            style={{
              width: '90vw',
              margin: '0 auto',
              paddingBottom: '5rem',
            }}
          >
            {/* Heading — bottom-left */}
            <motion.div
              className="col-span-12 md:col-span-7 lg:col-span-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="font-mono text-xs tracking-widest uppercase mb-6"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Season 2025 — 2026
              </div>
              <h1
                className="font-semibold leading-[1.05] tracking-tight"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  color: '#fff',
                }}
              >
                Championing
                <br />
                The Pitch Of
                <br />
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Legends</span>
              </h1>

              {/* Stats row */}
              <motion.div
                className="flex items-center gap-10 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <StatItem value="48" label="Nations" />
                <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.15)' }} />
                <StatItem value="312" label="Clubs" />
                <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.15)' }} />
                <StatItem value="2.4M+" label="Fans" />
              </motion.div>
            </motion.div>

            {/* Description + CTA — center-right */}
            <motion.div
              className="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-6 mt-8 md:mt-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '460px' }}
              >
                WISA elevates the beautiful game — from{' '}
                <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  grassroots to global glory
                </strong>
                . Premium matchday experiences, world-class analytics, and curated fan
                culture — crafted for those who live and breathe the sport.
              </p>

              {/* Two-part CTA button */}
              <div
                className="flex items-stretch overflow-hidden w-fit"
                onMouseEnter={() => setArrowCycle((c) => c + 1)}
                style={{ cursor: 'pointer' }}
              >
                {/* Text part */}
                <button
                  className="flex items-center gap-2 text-sm font-medium tracking-wide group"
                  style={{
                    padding: '14px 24px',
                    backdropFilter: 'blur(80px)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRight: 'none',
                    color: '#fff',
                    transition: 'background 0.3s ease, color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget.parentElement as HTMLElement).querySelectorAll('button').forEach((btn) => {
                      btn.style.background = '#fff'
                      btn.style.color = '#000'
                    })
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget.parentElement as HTMLElement).querySelectorAll('button').forEach((btn) => {
                      btn.style.background = 'rgba(255,255,255,0.08)'
                      btn.style.color = '#fff'
                    })
                  }}
                >
                  Explore The Season
                </button>

                {/* Arrow part */}
                <button
                  className="flex items-center justify-center relative overflow-hidden"
                  style={{
                    padding: '14px 18px',
                    backdropFilter: 'blur(80px)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    transition: 'background 0.3s ease, color 0.3s ease',
                    minWidth: '52px',
                  }}
                  onMouseEnter={(e) => {
                    const parent = e.currentTarget.parentElement as HTMLElement
                    parent.querySelectorAll('button').forEach((btn) => {
                      btn.style.background = '#fff'
                      btn.style.color = '#000'
                    })
                  }}
                  onMouseLeave={(e) => {
                    const parent = e.currentTarget.parentElement as HTMLElement
                    parent.querySelectorAll('button').forEach((btn) => {
                      btn.style.background = 'rgba(255,255,255,0.08)'
                      btn.style.color = '#fff'
                    })
                  }}
                >
                  {/* Arrow with fly animation using cycle key */}
                  <span
                    key={`arrow-out-${arrowCycle}`}
                    style={{
                      display: 'flex',
                      animation:
                        arrowCycle > 0
                          ? 'flyOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                          : 'none',
                      position: arrowCycle > 0 ? 'absolute' : 'relative',
                    }}
                  >
                    <ArrowUpRight size={16} />
                  </span>
                  {arrowCycle > 0 && (
                    <span
                      key={`arrow-in-${arrowCycle}`}
                      style={{
                        display: 'flex',
                        animation: 'flyInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                      }}
                    >
                      <ArrowUpRight size={16} />
                    </span>
                  )}
                </button>
              </div>

              {/* Scroll indicator */}
              <div
                className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase mt-4"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.25)',
                  }}
                />
                Scroll to explore
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2 — FEATURES / PERFORMANCE
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="min-h-screen"
          style={{
            pointerEvents: 'auto',
            paddingTop: '8rem',
            paddingBottom: '8rem',
          }}
        >
          <div style={{ width: '90vw', margin: '0 auto' }}>

            {/* ScrollReveal heading */}
            <ScrollReveal
              text="Excellence forged on the pitch. Defined beyond it."
              className="font-semibold leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.2rem)' } as React.CSSProperties}
              baseRotation={12}
              baseOpacity={0}
              blurStrength="8px"
            />

            <Reveal delay={0.1}>
              <p
                className="font-mono text-xs tracking-widest uppercase mb-20"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                — World-class infrastructure for a world-class game
              </p>
            </Reveal>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">

              {/* COL 1 — Globe + WISA brand */}
              <Reveal className="flex flex-col gap-6">
                {/* Globe */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    height: '280px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ width: '220px', height: '220px' }}>
                    <GlobeSVG />
                  </div>
                  {/* Globe label */}
                  <div
                    className="absolute bottom-4 left-4 font-mono text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    Global Network
                  </div>
                </div>

                {/* WISA brand card */}
                <div
                  className="p-6"
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <WISALogo size={28} />
                  <p
                    className="text-xs leading-relaxed mt-4"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    The World International Soccer Association — governing the
                    beautiful game across 48 nations since 1994.
                  </p>
                  <div
                    className="flex items-center gap-2 mt-4 font-mono text-xs"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    <Trophy size={12} />
                    <span>Est. 1994 · Geneva, Switzerland</span>
                  </div>
                </div>
              </Reveal>

              {/* COL 2 — Performance Analytics / Facilities */}
              <div className="flex flex-col gap-4">
                <FeatureCard
                  icon={Zap}
                  title="Performance Analytics"
                  description="Real-time biometric tracking, AI-powered match analysis, and predictive performance modelling for elite clubs and national squads."
                  delay={0.1}
                />
                <FeatureCard
                  icon={Globe}
                  title="World-Class Facilities"
                  description="Over 180 licensed training centres across 5 continents, each meeting WISA's platinum-tier safety and performance standards."
                  delay={0.15}
                />
                <FeatureCard
                  icon={Users}
                  title="Talent Development"
                  description="Academy pathways from Under-12 through to senior professional, with dedicated scouting networks in every member nation."
                  delay={0.2}
                />
              </div>

              {/* COL 3 — Matchday Premium / Fan Experiences */}
              <div className="flex flex-col gap-4">
                <FeatureCard
                  icon={Star}
                  title="Matchday Premium"
                  description="Elevated hospitality tiers, pitch-side access, exclusive pre-match tunnels, and curated fine-dining experiences on gameday."
                  delay={0.2}
                />
                <FeatureCard
                  icon={Trophy}
                  title="Fan Experiences"
                  description="Immersive AR stadium tours, digital collectibles, meet-the-players events, and season-long loyalty rewards programmes."
                  delay={0.25}
                />

                {/* Inline stat block */}
                <Reveal delay={0.3}>
                  <div
                    className="p-6"
                    style={{
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <StatItem value="98%" label="Satisfaction" />
                      <StatItem value="4.9★" label="Avg Rating" />
                      <StatItem value="180+" label="Venues" />
                      <StatItem value="24/7" label="Support" />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3 — FOOTER (glassmorphism)
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          ref={screen3Ref}
          style={{
            pointerEvents: 'auto',
            padding: '0 5vw 2.5rem',
          }}
        >
          <div
            style={{
              background: 'rgba(26, 26, 26, 0.6)',
              backdropFilter: 'blur(80px)',
              WebkitBackdropFilter: 'blur(80px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >

            {/* ── Top CTA ─────────────────────────────────────── */}
            <div
              className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
              style={{
                padding: '4rem 3.5rem 3.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div>
                <Reveal>
                  <div
                    className="font-mono text-xs tracking-widest uppercase mb-4"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Join the movement
                  </div>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2
                    className="font-semibold leading-tight tracking-tight"
                    style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
                  >
                    Ready To Score
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2
                    className="font-semibold leading-tight tracking-tight"
                    style={{
                      fontSize: 'clamp(2rem, 4.5vw, 4rem)',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    Your Winning Season?
                  </h2>
                </Reveal>
              </div>

              <Reveal delay={0.15}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{
                      padding: '14px 28px',
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                      letterSpacing: '0.02em',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                  >
                    Get Your Match Pass
                    <ArrowUpRight size={16} />
                  </button>
                  <button
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{
                      padding: '14px 28px',
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.65)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease, color 0.2s ease',
                      letterSpacing: '0.02em',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                    }}
                  >
                    View Schedule
                  </button>
                </div>
              </Reveal>
            </div>

            {/* ── 4-column footer grid ────────────────────────── */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              style={{
                padding: '3rem 3.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Brand */}
              <Reveal>
                <div>
                  <div className="mb-4">
                    <WISALogo size={24} />
                  </div>
                  <p
                    className="text-xs leading-relaxed mb-4"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Governing football with integrity, excellence, and passion since 1994.
                  </p>
                  <div
                    className="flex items-center gap-1 font-mono text-xs"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    <MapPin size={11} />
                    <span>Geneva, Switzerland</span>
                  </div>
                </div>
              </Reveal>

              {/* Company */}
              <Reveal delay={0.05}>
                <div>
                  <h4
                    className="font-mono text-xs tracking-widest uppercase mb-5"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Company
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {['About WISA', 'Governance', 'Leadership', 'Careers', 'Press Room'].map((l) => (
                      <FooterLink key={l} label={l} />
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Services */}
              <Reveal delay={0.1}>
                <div>
                  <h4
                    className="font-mono text-xs tracking-widest uppercase mb-5"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Services
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {['Match Passes', 'Club Licensing', 'Player Registry', 'Analytics Suite', 'Fan Rewards'].map((l) => (
                      <FooterLink key={l} label={l} />
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Connect */}
              <Reveal delay={0.15}>
                <div>
                  <h4
                    className="font-mono text-xs tracking-widest uppercase mb-5"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Connect
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {['Instagram', 'X (Twitter)', 'YouTube', 'LinkedIn', 'TikTok'].map((l) => (
                      <FooterLink key={l} label={l} />
                    ))}
                  </ul>
                  <div
                    className="flex items-center gap-2 mt-6 font-mono text-xs"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    <Mail size={11} />
                    <span>hello@wisa.sport</span>
                  </div>
                  <div
                    className="flex items-center gap-2 mt-2 font-mono text-xs"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    <Phone size={11} />
                    <span>+41 22 000 0000</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ── Copyright bar ───────────────────────────────── */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              style={{ padding: '1.75rem 3.5rem' }}
            >
              <span
                className="font-mono text-xs"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                © 2025 World International Soccer Association. All rights reserved.
              </span>
              <div
                className="flex items-center gap-6 font-mono text-xs"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)' }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
