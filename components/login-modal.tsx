"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAllUsers, saveUserProfile, setCurrentUser, generateUserId } from "@/lib/storage"

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!username || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (isLogin) {
      // Login: find user by username
      const allUsers = getAllUsers()
      const user = allUsers.find((u) => u.username === username)

      if (!user) {
        setError("User not found")
        setIsLoading(false)
        return
      }

      // Simple password check (in real app, would be hashed)
      if (user.username !== username) {
        setError("Invalid credentials")
        setIsLoading(false)
        return
      }

      setCurrentUser(user)
      onClose()
      router.push("/dashboard")
    } else {
      // Signup: create new user
      if (!displayName) {
        setError("Please enter a display name")
        setIsLoading(false)
        return
      }

      const allUsers = getAllUsers()
      const existingUser = allUsers.find((u) => u.username === username)

      if (existingUser) {
        setError("Username already exists")
        setIsLoading(false)
        return
      }

      const newUser = {
        id: generateUserId(),
        username,
        displayName,
        bio: "Welcome to the community!",
        avatar: "",
        quote: "",
        social: { x: "", github: "", website: "", linkedin: "" },
        goal: undefined,
        projects: [],
        links: [],
        interests: [],
        views: 0,
        upvotes: 0,
        rank: 0,
        createdAt: Date.now(),
        badges: [],
        streak: 0,
        lastActiveDate: Date.now(),
        lastSeenDate: new Date().toISOString().split('T')[0],
        dailyViews: [],
        dailyUpvotes: [],
        schemaVersion: 1
      }

      saveUserProfile(newUser)
      setCurrentUser(newUser)
      onClose()
      router.push("/profile-creation")
    }

    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#37322F]">
            {isLogin ? "Welcome Back" : "Join the Community"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#605A57] hover:text-[#37322F] transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#37322F] mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#37322F] mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#37322F] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F] focus:border-transparent"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#37322F] text-white rounded-lg font-medium hover:bg-[#2a2520] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : (isLogin ? "Log In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
              setUsername("")
              setPassword("")
              setDisplayName("")
            }}
            className="text-[#605A57] hover:text-[#37322F] transition text-sm"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Log in"
            }
          </button>
        </div>
      </div>
    </div>
  )
}
