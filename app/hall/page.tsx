"use client"

import { useEffect, useState } from "react"
import { getAllUsers, getCurrentUser } from "@/lib/storage"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"

export default function HallOfFamePage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [isMoving, setIsMoving] = useState(false)
  const [displayedFrames, setDisplayedFrames] = useState(35)

  useEffect(() => {
    setMounted(true)
    const allUsers = getAllUsers()
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Simulate loading animation
    setTimeout(() => {
      setUsers(allUsers)
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleMyFrame = () => {
    if (!currentUser) return
    
    setIsMoving(true)
    setSelectedProfile(currentUser)
    
    // Simulate progressive loading animation
    setTimeout(() => {
      setIsMoving(false)
    }, 2000)
  }

  const handleLoadMore = () => {
    setDisplayedFrames(prev => prev + 35)
  }

  // Calculate total frames needed (users + 5 extra join frames)
  const totalFrames = users.length + 5
  const framesToShow = Math.min(displayedFrames, totalFrames)
  const hasMoreFrames = displayedFrames < totalFrames

  if (!mounted) return null

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] overflow-hidden">
      <Navigation />

      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <h1 className="text-5xl font-serif text-[#37322F] mb-4">Hall of Fame</h1>
          <p className="text-lg text-[#605A57]">Discover the builders shaping the future</p>
        </div>

        {/* My Frame Button */}
        {currentUser && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleMyFrame}
              disabled={isMoving}
              className={`px-6 py-3 bg-[#37322F] text-white rounded-lg font-medium transition-all ${
                isMoving 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-[#2a2520] hover:scale-105"
              }`}
            >
              {isMoving ? "Moving to your frame..." : "My Frame"}
            </button>
          </div>
        )}

        {/* Hall of Fame Grid */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37322F] mx-auto mb-4"></div>
                <p className="text-[#605A57]">Loading profiles...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 7-Column Grid (responsive) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6 p-4 md:p-6">
                {/* User profiles */}
                {users.slice(0, framesToShow - 5).map((user, index) => (
                  <div
                    key={user.id}
                    onClick={() => router.push(`/profile/${user.id}`)}
                    className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      selectedProfile?.id === user.id ? "ring-4 ring-[#37322F] scale-105" : ""
                    } ${isMoving && selectedProfile?.id === user.id ? "animate-pulse" : ""}`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {/* Frame - Slightly bigger */}
                    <div className="bg-white border-4 border-[#37322F] p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Avatar */}
                      <div className="w-full aspect-square bg-gradient-to-br from-[#E0DEDB] to-[#D0CECC] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        <div className="text-4xl font-semibold text-[#37322F]">{user.displayName.charAt(0)}</div>
                      </div>

                      {/* Info - Always visible and centered */}
                      <div className="text-center">
                        <h3 className="font-semibold text-[#37322F] text-sm mb-2 truncate">{user.displayName}</h3>
                        <p className="text-xs text-[#605A57] mb-3 line-clamp-2">{user.bio}</p>

                        {/* Stats */}
                        <div className="flex gap-2 text-xs text-[#605A57] justify-center">
                          <span>{user.views} 👁️</span>
                          <span>{user.upvotes} ❤️</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Join OG Builders frames (always show 5 at the end) */}
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={`join-${i}`}
                    onClick={() => router.push("/profile-creation")}
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  >
                    <div className="bg-gradient-to-br from-[#E0DEDB] to-[#D0CECC] border-4 border-dashed border-[#37322F] p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Join Icon */}
                      <div className="w-full aspect-square bg-white/50 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-4xl">🏗️</div>
                      </div>

                      {/* Join Text */}
                      <div className="text-center">
                        <h3 className="font-semibold text-[#37322F] text-sm mb-2">Join the OG</h3>
                        <p className="text-xs text-[#605A57] mb-3">Builders</p>
                        <div className="text-xs text-[#37322F] font-medium">Get Your Frame</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreFrames && (
                <div className="text-center py-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#2a2520] transition"
                  >
                    Load More Frames
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}