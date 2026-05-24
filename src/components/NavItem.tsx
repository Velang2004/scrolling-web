import { useState } from 'react'

interface NavItemProps {
  label: string
  href?: string
}

export default function NavItem({ label, href = '#' }: NavItemProps) {
  const [cycle, setCycle] = useState(0)

  return (
    <a
      href={href}
      className="relative flex items-center overflow-hidden h-5"
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setCycle((c) => c + 1)}
    >
      {/* Visible text — flies out up on hover cycle */}
      <span
        key={`out-${cycle}`}
        className="text-white/60 text-sm font-medium tracking-wide whitespace-nowrap transition-none hover:text-white"
        style={{
          display: 'block',
          animation:
            cycle > 0
              ? 'flyOutUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              : 'none',
          position: cycle > 0 ? 'absolute' : 'relative',
        }}
      >
        {label}
      </span>

      {/* Ghost text — flies in from below on hover cycle */}
      {cycle > 0 && (
        <span
          key={`in-${cycle}`}
          className="text-white text-sm font-medium tracking-wide whitespace-nowrap"
          style={{
            display: 'block',
            animation: 'flyInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        >
          {label}
        </span>
      )}
    </a>
  )
}
