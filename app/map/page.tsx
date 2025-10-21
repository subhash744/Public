"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { getAllUsers, getCurrentUser, incrementMapClicks } from "@/lib/storage"

// We'll load Leaflet dynamically to avoid SSR issues
let L: any
let MapContainer: any
let TileLayer: any
let Marker: any
let Popup: any
let MarkerClusterGroup: any

export default function MapPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    // Load Leaflet components only on client side
    if (typeof window !== "undefined") {
      import("leaflet").then(leaflet => {
        L = leaflet.default
        // Fix for default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })
      })
      
      import("react-leaflet").then(rl => {
        MapContainer = rl.MapContainer
        TileLayer = rl.TileLayer
        Marker = rl.Marker
        Popup = rl.Popup
      })
      
      import("react-leaflet-cluster").then(rlc => {
        MarkerClusterGroup = rlc.default
      })
      
      setMapLoaded(true)
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

  const getMarkerColor = (rank: number) => {
    if (rank <= 10) return "#FFD700" // Gold
    if (rank <= 50) return "#C0C0C0" // Silver
    return "#CD7F32" // Bronze
  }

  if (!mapLoaded) {
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

  // Fallback UI if Leaflet components aren't loaded yet
  if (!MapContainer || !TileLayer || !Marker || !Popup) {
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
          
          {/* Loading map message */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-[#37322F] mb-2">Loading Interactive Map</h3>
              <p className="text-[#605A57]">Please wait while we load the map components...</p>
            </div>
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
            center={[20, 0]} 
            zoom={2} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {MarkerClusterGroup ? (
              <MarkerClusterGroup>
                {filteredUsers.map((user) => {
                  const isCurrentUser = currentUser && user.id === currentUser.id
                  const markerColor = getMarkerColor(user.rank)
                  
                  // Create custom icon
                  const customIcon = L && L.divIcon({
                    className: "custom-div-icon",
                    html: `
                      <div style="
                        position: relative;
                        width: 25px;
                        height: 41px;
                      ">
                        <svg viewBox="0 0 25 41" width="25" height="41">
                          <path 
                            d="M12.5,0 C12.5,0 25,12.5 25,17.5 C25,24.403 19.403,30 12.5,30 C5.597,30 0,24.403 0,17.5 C0,12.5 12.5,0 12.5,0 Z" 
                            fill="${markerColor}"
                            stroke="${isCurrentUser ? '#37322F' : 'white'}"
                            stroke-width="1"
                          />
                          <text 
                            x="12.5" 
                            y="18" 
                            text-anchor="middle" 
                            fill="${isCurrentUser ? '#37322F' : 'white'}" 
                            font-size="10" 
                            font-weight="bold"
                            font-family="Arial, sans-serif"
                          >
                            ${user.rank <= 99 ? user.rank : '99+'}
                          </text>
                        </svg>
                      </div>
                    `,
                    iconSize: [25, 41],
                    iconAnchor: [12.5, 41],
                  })
                  
                  return (
                    <Marker
                      key={user.id}
                      position={[user.location.lat, user.location.lng]}
                      icon={customIcon}
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
            ) : (
              // Fallback: Render markers without clustering if cluster group isn't loaded
              filteredUsers.map((user) => {
                const isCurrentUser = currentUser && user.id === currentUser.id
                const markerColor = getMarkerColor(user.rank)
                
                // Create custom icon
                const customIcon = L && L.divIcon({
                  className: "custom-div-icon",
                  html: `
                    <div style="
                      position: relative;
                      width: 25px;
                      height: 41px;
                    ">
                      <svg viewBox="0 0 25 41" width="25" height="41">
                        <path 
                          d="M12.5,0 C12.5,0 25,12.5 25,17.5 C25,24.403 19.403,30 12.5,30 C5.597,30 0,24.403 0,17.5 C0,12.5 12.5,0 12.5,0 Z" 
                          fill="${markerColor}"
                          stroke="${isCurrentUser ? '#37322F' : 'white'}"
                          stroke-width="1"
                        />
                        <text 
                          x="12.5" 
                          y="18" 
                          text-anchor="middle" 
                          fill="${isCurrentUser ? '#37322F' : 'white'}" 
                          font-size="10" 
                          font-weight="bold"
                          font-family="Arial, sans-serif"
                        >
                          ${user.rank <= 99 ? user.rank : '99+'}
                        </text>
                        </svg>
                    </div>
                  `,
                  iconSize: [25, 41],
                  iconAnchor: [12.5, 41],
                })
                
                return (
                  <Marker
                    key={user.id}
                    position={[user.location.lat, user.location.lng]}
                    icon={customIcon}
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
              })
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