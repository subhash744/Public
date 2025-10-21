"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginModal from "@/components/login-modal"
import Navigation from "@/components/navigation"
import { getCurrentUser, getAllUsers } from "@/lib/storage"
import { initializeMockData } from "@/lib/init-mock-data"
import { updateStreaks } from "@/lib/storage"
import FullscreenConfetti from "@/components/fullscreen-confetti"

export default function LandingPage() {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [showWelcomeConfetti, setShowWelcomeConfetti] = useState(false)

  useEffect(() => {
    setMounted(true)
    updateStreaks()
    // Only initialize mock data if no users exist (first time visit)
    const existingUsers = getAllUsers()
    if (existingUsers.length === 0) {
      initializeMockData()
      // Show welcome confetti for first-time visitors
      setShowWelcomeConfetti(true)
    }
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const handleGetStarted = () => {
    if (currentUser) {
      router.push("/leaderboard")
    } else {
      setShowLoginModal(true)
    }
  }

  if (!mounted) return null

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] flex flex-col">
      <FullscreenConfetti 
        trigger={showWelcomeConfetti} 
        onComplete={() => setShowWelcomeConfetti(false)} 
      />
      <Navigation />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-[#37322F] mb-6 leading-tight">Rise to the Top</h1>
        <p className="text-lg md:text-xl text-[#605A57] mb-8 max-w-2xl">
          Build your profile, showcase your talents, and compete on the leaderboard. Connect with creators and climb the
          ranks.
        </p>

        <div className="flex gap-4 mb-16">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#2a2520] transition"
          >
            {currentUser ? "Go to Leaderboard" : "Create Profile"}
          </button>
          <button
            onClick={() => router.push("/leaderboard")}
            className="px-8 py-3 border border-[#E0DEDB] text-[#37322F] rounded-full font-medium hover:bg-white transition"
          >
            View Leaderboard
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mt-12">
          <div className="p-6 bg-white rounded-lg border border-[#E0DEDB]">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold text-[#37322F] mb-2">Compete</h3>
            <p className="text-sm text-[#605A57]">Climb the leaderboard and earn badges</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[#E0DEDB]">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-[#37322F] mb-2">Connect</h3>
            <p className="text-sm text-[#605A57]">Share your profile and build your network</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-[#E0DEDB]">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold text-[#37322F] mb-2">Showcase</h3>
            <p className="text-sm text-[#605A57]">Display your links and interests</p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}
