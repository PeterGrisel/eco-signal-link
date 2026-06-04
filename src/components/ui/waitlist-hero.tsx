"use client"

import { useEffect, useRef, useState } from "react"
import { BOOKING_URL } from "@/content/copy"
import { supabase } from "@/integrations/supabase/client"
import { faviconFor } from "@/data/groeistack"

interface WaitlistHeroProps {
  logoSrc?: string
  logoAlt?: string
}

interface ClientLogo {
  id: string
  name: string
  domain: string
  logo_url: string | null
  website: string | null
}

const LogoRing = ({
  clients,
  radius,
  size,
  opacity,
}: {
  clients: ClientLogo[]
  radius: number
  size: number
  opacity: number
}) => {
  if (!clients.length) return null
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{ width: radius * 2, height: radius * 2, transform: "translate(-50%, -50%)" }}
    >
      {clients.map((c, i) => {
        const angle = (i / clients.length) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const src = c.logo_url || faviconFor(c.website || c.domain)
        return (
          <div
            key={c.id}
            className="absolute top-1/2 left-1/2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg"
            style={{
              width: size,
              height: size,
              transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
              opacity,
            }}
          >
            {src && (
              <img
                src={src}
                alt={c.name}
                className="object-contain max-h-[72%] max-w-[72%]"
                loading="lazy"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export const WaitlistHero = ({ logoSrc, logoAlt }: WaitlistHeroProps) => {
  const canvasRef = useRef(null)
  const [clients, setClients] = useState<ClientLogo[]>([])

  useEffect(() => {
    supabase
      .from("client_logos")
      .select("id, name, domain, logo_url, website")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => setClients((data as ClientLogo[]) ?? []))
  }, [])

  // Distribute over 3 rings
  const third = Math.ceil(clients.length / 3) || 1
  const inner = clients.slice(0, third)
  const middle = clients.slice(third, third * 2)
  const outer = clients.slice(third * 2)

  const handleClick = () => {
    fireConfetti()
  }

  // --- Confetti Logic ---
  const fireConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const particles = []
    const colors = ["#0079da", "#10b981", "#fbbf24", "#f472b6", "#fff"]

    // Resize canvas to cover the button area mostly
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const createParticle = () => {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12, // Random spread X
        vy: (Math.random() - 2) * 10, // Upward velocity
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      }
    }

    // Create batch of particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.5 // Gravity
        p.life -= 2

        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life / 100)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life <= 0) {
          particles.splice(i, 1)
          i--
        }
      }

      requestAnimationFrame(animate)
    }

    animate()
  }

  // Color tokens
  const colors = {
    textMain: "#ffffff",
    textSecondary: "#94a3b8",
    bluePrimary: "#0079da",
    success: "#10b981", // emerald-500
    inputBg: "#27272a",
    baseBg: "#09090b",
    inputShadow: "rgba(255, 255, 255, 0.1)",
  }

  return (
    <div className="w-full bg-black flex items-center justify-center">
      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}</style>

      {/* Main Container */}
      <div
        className="relative w-full h-[75vh] min-h-[640px] max-h-[820px] overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.baseBg,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Background Decorative Layer */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 1 }}
        >
          {/* Outer ring - spins clockwise */}
          <div className="absolute inset-0 animate-spin-slow">
            <LogoRing clients={outer} radius={440} size={80} opacity={0.85} />
          </div>

          {/* Middle ring - spins counter-clockwise */}
          <div className="absolute inset-0 animate-spin-slow-reverse">
            <LogoRing clients={middle} radius={300} size={72} opacity={0.95} />
          </div>

          {/* Inner ring - spins clockwise */}
          <div className="absolute inset-0 animate-spin-slow">
            <LogoRing clients={inner} radius={180} size={64} opacity={1} />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${colors.baseBg} 10%, rgba(9, 9, 11, 0.8) 40%, transparent 100%)`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-end pb-16 gap-5">
          <div className="w-16 h-16 rounded-2xl shadow-lg overflow-hidden mb-2 ring-1 ring-white/10 bg-white/5">
            <img src={logoSrc || "https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?q=80&w=1696&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={logoAlt || "App Icon"} className="w-full h-full object-cover" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight px-4" style={{ color: colors.textMain }}>
            Deze klanten werken al slimmer
          </h1>

          <p className="text-lg font-medium text-center px-4" style={{ color: colors.textSecondary }}>
            Boek een gratis meeting om je playbook te bespreken
          </p>

          {/* Form / Success Container */}
          <div className="w-full max-w-md px-4 mt-4 h-[60px] relative perspective-1000">
            {/* Confetti Canvas - overlays everything but ignores clicks */}
            <canvas
              ref={canvasRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
            />

            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="relative w-full h-full flex items-center justify-center rounded-full font-medium text-white transition-all active:scale-95 hover:brightness-110 text-lg"
              style={{ backgroundColor: colors.bluePrimary }}
            >
              Plan een meeting
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}