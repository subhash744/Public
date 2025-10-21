"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Navigation from "@/components/navigation"
import { getAllUsers, getCurrentUser, incrementMapClicks } from "@/lib/storage"

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-cluster"),
  { ssr: false }
)

export default function MapPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [mapCenter] = useState<[number, number]>([20, 0])
  const [mapZoom] = useState(2)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window !== "undefined") {
      setLeafletLoaded(true)
    }
    
    const allUsers = getAllUsers()
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Filter users with valid locations
    const usersWithLocations = allUsers.filter(u => 
      u.location && u.location.lat !== 0 && u.location.lng !== 0
    )
    
    setUsers(usersWithLocations)
    setFilteredUsers(usersWithLocations)
  }, [])

  useEffect(() => {
    let result = [...users]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(user => 
        user.displayName.toLowerCase().includes(query) ||
        (user.location.city && user.location.city.toLowerCase().includes(query)) ||
        (user.location.country && user.location.country.toLowerCase().includes(query))
      )
    }
    
    // Apply category filter
    if (filter === "top") {
      result = result.filter(user => user.rank <= 50)
    } else if (filter === "newcomers") {
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      result = result.filter(user => user.createdAt > oneWeekAgo)
    } else if (filter === "featured") {
      // For now, show top 10 as featured
      result = result.filter(user => user.rank <= 10)
    }
    
    setFilteredUsers(result)
  }, [searchQuery, filter, users])

  const handleViewProfile = (userId: string) => {
    incrementMapClicks(userId)
    router.push(`/profile/${userId}`)
  }

  if (!leafletLoaded) {
    return (
      <div className="w-full min-h-screen bg-[#F7F5F3]">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37322F] mx-auto mb-4"></div>
            <p className="text-[#605A57]">Loading map...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3]">
      <Navigation />
      
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Header with search and filters */}
        <div className="bg-white border-b border-[#E0DEDB] p-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-serif text-[#37322F]">Global Builder Map</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by name, city, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
              />
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
              >
                <option value="all">All Builders</option>
                <option value="top">Top Ranked</option>
                <option value="newcomers">Newcomers</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {typeof window !== "undefined" && MarkerClusterGroup && (
              <MarkerClusterGroup>
                {filteredUsers.map((user) => {
                  const isCurrentUser = currentUser && user.id === currentUser.id
                  return (
                    <Marker
                      key={user.id}
                      position={[user.location.lat, user.location.lng]}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E0DEDB] to-[#D0CECC] flex items-center justify-center text-sm font-semibold text-[#37322F]">
                              {user.displayName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#37322F]">{user.displayName}</h3>
                              <p className="text-xs text-[#605A57]">@{user.username}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                            <div>
                              <span className="text-[#605A57]">Rank:</span>
                              <span className="font-semibold ml-1">#{user.rank}</span>
                            </div>
                            <div>
                              <span className="text-[#605A57]">Upvotes:</span>
                              <span className="font-semibold ml-1">{user.upvotes}</span>
                            </div>
                            <div>
                              <span className="text-[#605A57]">Streak:</span>
                              <span className="font-semibold ml-1">{user.streak} days</span>
                            </div>
                            <div>
                              <span className="text-[#605A57]">Projects:</span>
                              <span className="font-semibold ml-1">{user.projects.length}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {user.badges.slice(0, 3).map((badge: string, index: number) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-[#37322F] text-white text-xs rounded-full"
                              >
                                {badge}
                              </span>
                            ))}
                            {user.badges.length > 3 && (
                              <span className="px-2 py-1 bg-[#605A57] text-white text-xs rounded-full">
                                +{user.badges.length - 3}
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleViewProfile(user.id)}
                            className="w-full px-3 py-1 bg-[#37322F] text-white rounded-lg text-sm font-medium hover:bg-[#2a2520] transition"
                          >
                            View Profile
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MarkerClusterGroup>
            )}
          </MapContainer>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-[#E0DEDB]">
            <h3 className="font-semibold text-[#37322F] mb-2">Rank Legend</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Top 10 (Gold)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <span>Top 50 (Silver)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-800"></div>
                <span>Others (Bronze)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}