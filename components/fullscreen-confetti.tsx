"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

interface FullscreenConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export default function FullscreenConfetti({ trigger, onComplete }: FullscreenConfettiProps) {
  useEffect(() => {
    if (!trigger) return

    // Simple confetti bursts - center, top, bottom only
    const particleCount = 50
    
    // Center blast
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#37322F', '#605A57', '#E0DEDB']
    })

    // Top blast
    confetti({
      particleCount: 30,
      startVelocity: 25,
      spread: 60,
      origin: { x: 0.5, y: 0.1 },
      colors: ['#37322F', '#605A57', '#E0DEDB']
    })

    // Bottom blast
    confetti({
      particleCount: 30,
      startVelocity: 25,
      spread: 60,
      origin: { x: 0.5, y: 0.9 },
      colors: ['#37322F', '#605A57', '#E0DEDB']
    })

    // Complete after short delay
    setTimeout(() => {
      onComplete?.()
    }, 1000)

  }, [trigger, onComplete])

  return null
}
